import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  situacao: string;
  email?: string;
}

export default function FuncionariosScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<Funcionario[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/funcionarios');
      setItems(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Funcionarios</Text>
      </View>

      {items.map((item) => (
        <View key={item.id} style={{
          backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
          borderRadius: 12, padding: 14, marginBottom: 8,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{item.nome}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.cargo}</Text>
          </View>
          <View style={{
            backgroundColor: item.situacao === 'ATIVO' ? `${colors.success}20` : `${colors.danger}20`,
            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
          }}>
            <Text style={{ color: item.situacao === 'ATIVO' ? colors.success : colors.danger, fontSize: 11, fontWeight: '600' }}>{item.situacao}</Text>
          </View>
        </View>
      ))}

      {items.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Ionicons name="people-outline" size={48} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, marginTop: 8 }}>Nenhum funcionario encontrado</Text>
        </View>
      )}
    </ScrollView>
  );
}
