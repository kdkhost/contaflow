import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarioFiscalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [eventos, setEventos] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/calendario-fiscal');
      setEventos(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const statusColor = (status: string) => {
    switch (status) {
      case 'PAGO': case 'QUITADO': return colors.success;
      case 'PENDENTE': return colors.warning;
      case 'ATRASADO': return colors.danger;
      default: return colors.textMuted;
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Calendario Fiscal</Text>
      </View>

      {eventos.map((ev, i) => (
        <View key={ev.id || i} style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', flex: 1 }}>{ev.descricao || ev.titulo}</Text>
            <View style={{ backgroundColor: `${statusColor(ev.status)}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: statusColor(ev.status), fontSize: 11, fontWeight: '600' }}>{ev.status}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{ev.competencia}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Venc: {ev.dataVencimento}</Text>
          </View>
          {ev.valor && <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 4 }}>R$ {ev.valor.toFixed(2)}</Text>}
        </View>
      ))}

      {eventos.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, marginTop: 8 }}>Nenhum evento fiscal</Text>
        </View>
      )}
    </ScrollView>
  );
}
