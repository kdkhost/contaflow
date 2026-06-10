import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ApuracaoScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [apuracao, setApuracao] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/apuracao-impostos');
      setApuracao(data);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const impostoCard = (nome: string, valor: number, aliquota: number, icon: string, color: string) => (
    <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <View style={{ backgroundColor: `${color}20`, width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', flex: 1 }}>{nome}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{aliquota}%</Text>
      </View>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>R$ {(valor || 0).toFixed(2)}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Apuracao de Impostos</Text>
      </View>

      {impostoCard('ICMS', apuracao?.icms?.valor || 0, apuracao?.icms?.aliquota || 18, 'receipt', colors.info)}
      {impostoCard('PIS', apuracao?.pis?.valor || 0, apuracao?.pis?.aliquota || 1.65, 'document-text', colors.primary)}
      {impostoCard('COFINS', apuracao?.cofins?.valor || 0, apuracao?.cofins?.aliquota || 7.6, 'document-attach', colors.warning)}
      {impostoCard('IRPJ', apuracao?.irpj?.valor || 0, apuracao?.irpj?.aliquota || 15, 'business', colors.danger)}
      {impostoCard('CSLL', apuracao?.csll?.valor || 0, apuracao?.csll?.aliquota || 9, 'shield-checkmark', colors.success)}
      {impostoCard('ISS', apuracao?.iss?.valor || 0, apuracao?.iss?.aliquota || 5, 'globe', colors.accent)}
    </ScrollView>
  );
}
