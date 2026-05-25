import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';

export type AdminSearchSelectOption = {
  id: number;
  label: string;
  subLabel?: string;
};

type Props = {
  visible: boolean;
  title: string;
  placeholder?: string;
  options: AdminSearchSelectOption[];
  selectedId: number | null;
  onClose: () => void;
  onSelect: (id: number) => void;
  loading?: boolean;
};

const AdminSearchSelectModal: React.FC<Props> = ({
  visible,
  title,
  placeholder = 'Search...',
  options,
  selectedId,
  onClose,
  onSelect,
  loading = false,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const hay = `${o.label} ${o.subLabel ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [options, query]);

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder={placeholder}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />

          {loading ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => `${item.id}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = selectedId === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    style={[styles.row, selected && styles.rowSelected]}
                  >
                    <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>
                      {item.label}
                    </Text>
                    {item.subLabel ? (
                      <Text style={[styles.rowSubLabel, selected && styles.rowLabelSelected]}>
                        {item.subLabel}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={{ paddingVertical: 18 }}>
                  <Text style={styles.emptyText}>No matches.</Text>
                </View>
              }
              style={{ marginTop: 8, maxHeight: 420 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  closeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  closeBtnText: { color: '#0f172a', fontWeight: '700', fontSize: 13 },
  searchInput: {
    backgroundColor: '#f8fafb',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  rowLabel: { color: '#0f172a', fontWeight: '700', fontSize: 14 },
  rowSubLabel: { color: '#64748b', fontSize: 12, marginTop: 3, fontWeight: '600' },
  rowLabelSelected: { color: '#1d4ed8' },
  emptyText: { color: '#64748b', fontWeight: '700', textAlign: 'center' },
});

export default AdminSearchSelectModal;

