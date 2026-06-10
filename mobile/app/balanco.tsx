import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

function formatCurrency(val: number) {
  return `R$ ${val.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export default function BalancoScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [balanco, setBalanco] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/balanco-patrimonial');
      setBalanco(data);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const section = (title: string, items: any[]) => (
    <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginBottom: 16 }}>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>{title}</Text>
      {items?.map((item: any, i: number) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.textSecondary, fontSize: 13, flex: 1 }}>{item.conta || item.descricao}</Text>
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>{formatCurrency(item.valor || 0)}</Text>
        </View>
      ))}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 4 }}>
        <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800' }}>Total</Text>
        <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800' }}>
          {formatCurrency(items?.reduce((acc: number, item: any) => acc + (item.valor || 0), 0) || 0)}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Balanco Patrimonial</Text>
      </View>

      {section('ATIVO', balanco?.ativo)}
      {section('PASSIVO', balanco?.passivo)}
      {section('PL', balanco?.patrimonioLiquido)}
    </ScrollView>
  );
}
