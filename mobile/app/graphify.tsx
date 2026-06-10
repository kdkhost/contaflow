import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function GraphifyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [mapas, setMapas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/graphify/mapas');
      setMapas(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const mapaCards = [
    { tipo: 'CONTABIL', label: 'Mapa Contabil', icon: 'document-text', color: colors.info },
    { tipo: 'FISCAL', label: 'Mapa Fiscal', icon: 'receipt', color: colors.warning },
    { tipo: 'TRABALHISTA', label: 'Mapa Trabalhista', icon: 'people', color: colors.primary },
    { tipo: 'FINANCEIRO', label: 'Mapa Financeiro', icon: 'trending-up', color: colors.success },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Graphify</Text>
      </View>

      <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 16 }}>Mapas de conhecimento interativos do seu escritorio contabil.</Text>

      {mapaCards.map((mc, i) => (
        <View key={i} style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ backgroundColor: `${mc.color}20`, width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={mc.icon as any} size={24} color={mc.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{mc.label}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>Visualizacao em grafo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      ))}

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Ionicons name="link" size={20} color={colors.accent} />
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Integracoes</Text>
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Conecte com portais governamentais: eSocial, SEFIP, SPED, DCTF, CNIS e mais.</Text>
      </View>
    </ScrollView>
  );
}
