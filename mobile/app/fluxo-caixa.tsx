import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function FluxoCaixaScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [fluxo, setFluxo] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/fluxo-caixa');
      setFluxo(data);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Fluxo de Caixa</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>Saldo Inicial</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 4 }}>R$ {(fluxo?.saldoInicial || 0).toFixed(0)}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>Saldo Final</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 4 }}>R$ {(fluxo?.saldoFinal || 0).toFixed(0)}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Ionicons name="trending-up" size={18} color={colors.success} />
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Entradas</Text>
        </View>
        {fluxo?.entradas?.map((ev: any, i: number) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i < (fluxo?.entradas?.length || 0) - 1 ? 1 : 0, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{ev.descricao}</Text>
            <Text style={{ color: colors.success, fontSize: 13, fontWeight: '600' }}>+ R$ {(ev.valor || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Ionicons name="trending-down" size={18} color={colors.danger} />
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Saidas</Text>
        </View>
        {fluxo?.saidas?.map((ev: any, i: number) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i < (fluxo?.saidas?.length || 0) - 1 ? 1 : 0, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{ev.descricao}</Text>
            <Text style={{ color: colors.danger, fontSize: 13, fontWeight: '600' }}>- R$ {(ev.valor || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
