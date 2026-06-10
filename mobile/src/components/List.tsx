import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

interface Item {
  id: string;
  descricao: string;
  valor: number;
  status: string;
  data?: string;
}

interface ListProps {
  endpoint: string;
  title: string;
  renderItem?: (item: Item) => React.ReactNode;
}

export default function List({ endpoint, title, renderItem }: ListProps) {
  const { colors } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(endpoint);
      setItems(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally {
      setRefreshing(false);
    }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
        {title}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: colors.bgCard,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 14,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                {item.descricao}
              </Text>
              {item.data && (
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.data}</Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700' }}>
                R$ {item.valor?.toFixed(2) || '0,00'}
              </Text>
              <View style={{
                backgroundColor: item.status === 'PAGO' ? `${colors.success}20` : `${colors.warning}20`,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
                marginTop: 4,
              }}>
                <Text style={{
                  color: item.status === 'PAGO' ? colors.success : colors.warning,
                  fontSize: 11,
                  fontWeight: '600',
                }}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 8 }}>Nenhum registro encontrado</Text>
          </View>
        }
      />
    </View>
  );
}
