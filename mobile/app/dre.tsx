import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

function formatCurrency(val: number) {
  return `R$ ${val.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export default function DREScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [dre, setDre] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/dre');
      setDre(data);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const row = (label: string, value: number, bold?: boolean) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: bold ? colors.primary : colors.textSecondary, fontSize: bold ? 15 : 13, fontWeight: bold ? '800' : '500', flex: 1 }}>{label}</Text>
      <Text style={{ color: bold ? colors.primary : colors.text, fontSize: bold ? 15 : 13, fontWeight: bold ? '800' : '600' }}>{formatCurrency(value)}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>DRE - Demonstracao do Resultado</Text>
      </View>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 8, textAlign: 'center' }}>Demonstracao do Resultado do Exercicio</Text>
        {row('Receita Bruta', dre?.receitaBruta || 0)}
        {row('( - ) Deducoes', dre?.deducoes || 0)}
        {row('Receita Liquida', dre?.receitaLiquida || 0, true)}
        {row('( - ) Custo dos Servicos', dre?.custoServicos || 0)}
        {row('Lucro Bruto', dre?.lucroBruto || 0, true)}
        {row('( - ) Despesas Operacionais', dre?.despesasOperacionais || 0)}
        {row('EBITDA', dre?.ebitda || 0, true)}
        {row('( - ) Depreciacao/Amortizacao', dre?.depreciacao || 0)}
        {row('Lucro Operacional', dre?.lucroOperacional || 0, true)}
        {row('( + ) Receitas Financeiras', dre?.receitasFinanceiras || 0)}
        {row('( - ) Despesas Financeiras', dre?.despesasFinanceiras || 0)}
        {row('LAIR', dre?.lair || 0, true)}
        {row('( - ) Impostos', dre?.impostos || 0)}
        {row('= Lucro Liquido do Exercicio', dre?.lucroLiquido || 0, true)}
      </View>
    </ScrollView>
  );
}
