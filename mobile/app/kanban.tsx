import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import api from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
  prioridade?: string;
}

export default function KanbanScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/kanban/tarefas');
      setTarefas(Array.isArray(data) ? data : data.items || data.data || []);
    } catch {} finally { setRefreshing(false); }
  }, []);

  useState(() => { load(); });

  const colunas = ['PENDENTE', 'EM ANDAMENTO', 'CONCLUIDA'];
  const colunaColor: Record<string, string> = {
    'PENDENTE': colors.warning,
    'EM ANDAMENTO': colors.info,
    'CONCLUIDA': colors.success,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Quadro Kanban</Text>
      </View>

      {colunas.map((col) => {
        const tarefasCol = tarefas.filter(t => t.status === col);
        return (
          <View key={col} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colunaColor[col] }} />
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{col}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>({tarefasCol.length})</Text>
            </View>
            {tarefasCol.map((t) => (
              <View key={t.id} style={{
                backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
                borderRadius: 12, padding: 14, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: colunaColor[col],
              }}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>{t.titulo}</Text>
                {t.descricao && <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }} numberOfLines={2}>{t.descricao}</Text>}
                {t.prioridade && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <Ionicons name="flag" size={12} color={colors.warning} />
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{t.prioridade}</Text>
                  </View>
                )}
              </View>
            ))}
            {tarefasCol.length === 0 && (
              <View style={{ backgroundColor: `${colors.bgCard}80`, borderRadius: 10, padding: 12, alignItems: 'center' }}>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Nenhuma tarefa</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
