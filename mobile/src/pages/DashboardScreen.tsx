import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    totalReceber: 0,
    totalPagar: 0,
    nfEmitidas: 0,
    lancamentos: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard');
      setStats(data);
    } catch {} finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 20 }}>
        Dashboard
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Card icon="trending-up" title="A Receber" value={`R$ ${(stats.totalReceber || 0).toFixed(0)}`} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Card icon="trending-down" title="A Pagar" value={`R$ ${(stats.totalPagar || 0).toFixed(0)}`} color={colors.danger} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Card icon="document-text" title="NF Emitidas" value={`${stats.nfEmitidas || 0}`} color={colors.info} />
        </View>
        <View style={{ flex: 1 }}>
          <Card icon="swap-horizontal" title="Lancamentos" value={`${stats.lancamentos || 0}`} color={colors.primary} />
        </View>
      </View>

      <View style={{
        backgroundColor: colors.bgCard,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
      }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
          Acesso Rapido
        </Text>
        {[
          { icon: 'document-text', label: 'Notas Fiscais', color: colors.info },
          { icon: 'wallet', label: 'Contas a Pagar', color: colors.danger },
          { icon: 'cash', label: 'Contas a Receber', color: colors.success },
          { icon: 'people', label: 'Funcionarios', color: colors.primary },
          { icon: 'bar-chart', label: 'Relatorios', color: colors.warning },
        ].map((item, i) => (
          <View key={i} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: i < 4 ? 1 : 0,
            borderBottomColor: colors.border,
            gap: 12,
          }}>
            <View style={{ backgroundColor: `${item.color}20`, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500', flex: 1 }}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
