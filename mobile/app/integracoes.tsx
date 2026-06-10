import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function IntegracoesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [integracoes, setIntegracoes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/integracoes');
      setIntegracoes(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const portalCards = [
    { nome: 'eSocial', desc: 'Empregador Web', icon: 'people', color: colors.primary, status: 'CONECTADO' },
    { nome: 'SEFIP', desc: 'FGTS e Contribuicoes', icon: 'document-text', color: colors.info, status: 'CONECTADO' },
    { nome: 'SPED', desc: 'Escrituracao Fiscal', icon: 'folder', color: colors.warning, status: 'PENDENTE' },
    { nome: 'DCTF', desc: 'Declaracao de Tributos', icon: 'receipt', color: colors.danger, status: 'DESCONECTADO' },
    { nome: 'CNIS', desc: 'Cadastro Nacional', icon: 'card', color: colors.success, status: 'CONECTADO' },
    { nome: 'NF-e', desc: 'Nota Fiscal Eletronica', icon: 'paper-plane', color: colors.accent, status: 'CONECTADO' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Integracoes</Text>
      </View>

      {portalCards.map((pc, i) => (
        <View key={i} style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ backgroundColor: `${pc.color}20`, width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={pc.icon as any} size={22} color={pc.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700' }}>{pc.nome}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{pc.desc}</Text>
          </View>
          <View style={{
            backgroundColor: pc.status === 'CONECTADO' ? `${colors.success}20` : pc.status === 'PENDENTE' ? `${colors.warning}20` : `${colors.danger}20`,
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
          }}>
            <Text style={{
              color: pc.status === 'CONECTADO' ? colors.success : pc.status === 'PENDENTE' ? colors.warning : colors.danger,
              fontSize: 11, fontWeight: '600',
            }}>{pc.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
