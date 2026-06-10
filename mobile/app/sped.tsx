import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function SPEDScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [obrigacoes, setObrigacoes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/sped-obrigacoes');
      setObrigacoes(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'ENVIADO': case 'ACEITO': return { icon: 'checkmark-circle', color: colors.success };
      case 'PENDENTE': return { icon: 'time', color: colors.warning };
      case 'REJEITADO': return { icon: 'close-circle', color: colors.danger };
      default: return { icon: 'help-circle', color: colors.textMuted };
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>SPED e Obrigacoes</Text>
      </View>

      {obrigacoes.map((obrig, i) => {
        const s = statusIcon(obrig.status);
        return (
          <View key={obrig.id || i} style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name={s.icon as any} size={24} color={s.color} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>{obrig.titulo || obrig.descricao}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{obrig.competencia} | Venc: {obrig.dataVencimento}</Text>
            </View>
            <Text style={{ color: s.color, fontSize: 12, fontWeight: '600' }}>{obrig.status}</Text>
          </View>
        );
      })}

      {obrigacoes.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Ionicons name="folder-outline" size={48} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, marginTop: 8 }}>Nenhuma obrigacao encontrada</Text>
        </View>
      )}
    </ScrollView>
  );
}
