from rest_framework import serializers
from django.db.models import Count, Q
from .models import Student, Section, Subject, Enrollment



class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model"""
    class Meta:
        model = Subject
        fields = ['id', 'code', 'title', 'description', 'units', 'course', 'year_level', 'created_at']
        read_only_fields = ['created_at']


class SectionSerializer(serializers.ModelSerializer):
    """Serializer for Section model with capacity information"""
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.IntegerField(write_only=True)
    current_enrollment = serializers.SerializerMethodField()
    available_capacity = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = [
            'id', 'subject', 'subject_id', 'name', 'schedule', 
            'time_start', 'time_end', 'room', 'max_capacity',
            'current_enrollment', 'available_capacity', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_current_enrollment(self, obj):
        """Get current enrollment count"""
        return obj.get_current_enrollment_count()

    def get_available_capacity(self, obj):
        """Get available capacity"""
        return obj.get_available_capacity()


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Enrollment model with nested details"""

    student_name = serializers.CharField(source='student.name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)

    subject = SubjectSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    # For creation, accept IDs
    student_id_write = serializers.IntegerField(write_only=True, required=False)
    subject_id_write = serializers.IntegerField(write_only=True, required=False)
    # May be omitted/empty for auto-assign
    section_id_write = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student_id', 'student_name', 'student_id_write',
            'subject', 'subject_id_write',
            'section', 'section_id_write',
            'status', 'enrolled_at', 'updated_at'
        ]
        read_only_fields = ['id', 'enrolled_at', 'updated_at']

    def create(self, validated_data):
        """Create enrollment with automatic section assignment."""
        from rest_framework import serializers as drf_serializers

        try:
            student_id = validated_data.pop('student_id_write', None)
            subject_id = validated_data.pop('subject_id_write', None)
            section_id = validated_data.get('section_id_write', None)

            # DRF can pass '' from some clients; treat as empty.
            if section_id == '':
                section_id = None

            if not student_id:
                raise drf_serializers.ValidationError('student_id is required')
            if not subject_id and not section_id:
                # If section_id is provided, subject can be derived from section.
                raise drf_serializers.ValidationError('subject_id is required')

            # Fetch student
            try:
                student = Student.objects.get(id=student_id)
            except Student.DoesNotExist:
                raise drf_serializers.ValidationError('student_id is invalid: Student not found')

            # Prevent duplicates (only for active enrolled)
            # If subject_id is provided (or can be derived), block duplicates.
            if subject_id:
                if Enrollment.objects.filter(student=student, subject_id=subject_id, status='enrolled').exists():
                    raise drf_serializers.ValidationError('Student already enrolled for this subject')

            # Resolve section + subject
            if section_id:
                try:
                    section = Section.objects.select_related('subject').get(id=section_id)
                except Section.DoesNotExist:
                    raise drf_serializers.ValidationError('section_id is invalid: Section not found')

                subject = section.subject

                # Validate that provided subject_id (if any) matches section subject.
                if subject_id and int(subject_id) != int(subject.id):
                    raise drf_serializers.ValidationError('Section does not match the provided subject')

                # Prevent duplicates for derived subject (when section implies subject)
                if Enrollment.objects.filter(student=student, subject=subject, status='enrolled').exists():
                    raise drf_serializers.ValidationError('Student already enrolled for this section/subject')

            else:
                # Auto-assign section based on subject
                try:
                    subject = Subject.objects.get(id=subject_id)
                except Subject.DoesNotExist:
                    raise drf_serializers.ValidationError('subject_id is invalid: Subject not found')

                available_section = next(
                    (s for s in subject.sections.all() if s.has_available_capacity()),
                    None
                )

                if not available_section:
                    raise drf_serializers.ValidationError('No available section for this subject')

                section = available_section

                # Prevent duplicates for derived subject
                if Enrollment.objects.filter(student=student, subject=subject, status='enrolled').exists():
                    raise drf_serializers.ValidationError('Student already enrolled for this subject')


            # Compose model fields
            validated_data['student'] = student
            validated_data['subject'] = subject
            validated_data['section'] = section

            # Remove write-only id field if it still exists
            validated_data.pop('section_id_write', None)

            # Ensure null section never crashes; Enrollment.section is FK non-null in model.
            # Since we always resolve section above, it will be set.
            return super().create(validated_data)

        except Exception as e:
            # Convert any unexpected issues into readable 400 errors.
            # (Prevents 500s from serializer logic.)
            if isinstance(e, serializers.ValidationError):
                raise
            raise drf_serializers.ValidationError(str(e))





class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model with enrollment summary"""
    total_units = serializers.SerializerMethodField()
    total_subjects = serializers.SerializerMethodField()
    enrollments = EnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'student_id', 'name', 'email', 'course', 
            'year_level', 'age', 'total_units', 'total_subjects',
            'enrollments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'enrollments']

    def get_total_units(self, obj):
        """Get total units for this student"""
        return obj.get_total_units()

    def get_total_subjects(self, obj):
        """Get total subjects enrolled"""
        return obj.enrollments.filter(status='enrolled').count()


class EnrollmentSummarySerializer(serializers.Serializer):
    """Serializer for enrollment summary"""
    student = StudentSerializer()
    enrollments = EnrollmentSerializer(many=True)
    total_units = serializers.IntegerField()
    total_subjects = serializers.IntegerField()
