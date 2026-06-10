import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function FolhaScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [folha, setFolha] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/folha-pagamento');
      setFolha(data);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const statCard = (label: string, value: string, icon: string, color: string) => (
    <View style={{ flex: 1, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14 }}>
      <View style={{ backgroundColor: `${color}20`, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Folha de Pagamento</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        {statCard('Funcionarios', `${folha?.totalFuncionarios || 0}`, 'people', colors.primary)}
        {statCard('Total Bruto', `R$ ${(folha?.totalBruto || 0).toFixed(0)}`, 'cash', colors.success)}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        {statCard('Descontos', `R$ ${(folha?.totalDescontos || 0).toFixed(0)}`, 'trending-down', colors.danger)}
        {statCard('Liquido', `R$ ${(folha?.totalLiquido || 0).toFixed(0)}`, 'wallet', colors.info)}
      </View>

      {folha?.eventos?.map((ev: any, i: number) => (
        <View key={i} style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>{ev.descricao}</Text>
          <Text style={{ color: ev.tipo === 'PROVENTO' ? colors.success : colors.danger, fontSize: 14, fontWeight: '700' }}>
            {ev.tipo === 'PROVENTO' ? '+' : '-'} R$ {(ev.valor || 0).toFixed(2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
