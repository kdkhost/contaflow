import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function LancamentosScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/lancamentos-contabeis');
      setItems(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Lancamentos Contabeis</Text>
      </View>

      {items.map((item, i) => (
        <View key={item.id || i} style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>{item.descricao || item.historico}</Text>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>R$ {(item.valor || 0).toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{item.data}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{item.contaDebito} / {item.contaCredito}</Text>
          </View>
        </View>
      ))}

      {items.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, marginTop: 8 }}>Nenhum lancamento encontrado</Text>
        </View>
      )}
    </ScrollView>
  );
}
