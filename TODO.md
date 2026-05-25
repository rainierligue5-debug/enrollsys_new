# TODO - Fix Admin Panel Enrollment (Expo + Django)

## Backend (Django)
- [x] Ensure EnrollmentSerializer accepts `student_id_write`/`subject_id_write`/`section_id_write` consistently and never throws unhandled exceptions.
- [x] Add explicit validation for student/subject/section IDs (404-like 400 messages) and subject/section mismatch.
- [x] Enforce duplicate prevention for active `enrolled` rows.
- [x] Auto-assign section when section is not provided (`section_id_write` empty/null).
- [x] Ensure EnrollmentViewSet.create converts all validation failures to 400 with readable `error`/`detail` payload.
- [ ] Ensure bulk enroll uses serializer path for each item to avoid server 500.

## Frontend (Expo React Native)
- [ ] Replace fragile inline searchable lists in EnrollmentsScreen with reusable searchable select modal components.
- [ ] Add 3 searchable selects: Student, Subject, Section (+ default option “Auto-assign Section”).
- [ ] Mobile-friendly card UI, FlatList optimization, smooth scrolling.
- [ ] Prevent duplicate submits using `saving`/`isSubmitting` guard.
- [ ] Validate IDs client-side before POST.
- [ ] Show proper API error messages (never raw 500) using consistent interceptor error parsing.
- [ ] Keep navigation and existing API structure unchanged.

## Testing / Verification
- [ ] Run backend tests (bulk/enroll/create) and confirm no 500.
- [ ] Manual verify: create enrollment with no section -> auto assignment.
- [ ] Manual verify: duplicates -> readable error.
- [ ] Manual verify: invalid IDs -> readable error.
- [ ] Manual verify: bulk enroll partial failures -> user sees meaningful messages.

