import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { icon: 'people', label: 'Funcionarios', route: '/funcionarios', color: '#6366f1' },
  { icon: 'cash', label: 'Folha de Pagamento', route: '/folha', color: '#10b981' },
  { icon: 'document-text', label: 'Lancamentos Contabeis', route: '/lancamentos', color: '#3b82f6' },
  { icon: 'bar-chart', label: 'Balanco Patrimonial', route: '/balanco', color: '#f59e0b' },
  { icon: 'analytics', label: 'DRE', route: '/dre', color: '#06b6d4' },
  { icon: 'calculator', label: 'Apuracao de Impostos', route: '/apuracao', color: '#ef4444' },
  { icon: 'calendar', label: 'Calendario Fiscal', route: '/calendario-fiscal', color: '#8b5cf6' },
  { icon: 'folder', label: 'SPED e Obrigacoes', route: '/sped', color: '#ec4899' },
  { icon: 'git-network', label: 'Graphify', route: '/graphify', color: '#14b8a6' },
  { icon: 'pulse', label: 'Fluxo de Caixa', route: '/fluxo-caixa', color: '#22c55e' },
  { icon: 'checkbox', label: 'Quadro Kanban', route: '/kanban', color: '#a855f7' },
  { icon: 'link', label: 'Integracoes', route: '/integracoes', color: '#0ea5e9' },
  { icon: 'settings', label: 'Configuracoes', route: '/configuracoes', color: '#64748b' },
  { icon: 'person', label: 'Meu Perfil', route: '/perfil', color: '#78716c' },
];

export default function MaisScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      showsVerticalScrollIndicator={false}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>Mais</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{user?.nome || 'Usuario'}</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={{
          backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
          width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {menuItems.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => router.push(item.route as any)}
          style={{
            backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
            borderRadius: 14, padding: 16, marginBottom: 8,
            flexDirection: 'row', alignItems: 'center', gap: 14,
          }}>
          <View style={{ backgroundColor: `${item.color}20`, width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 }}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={async () => { await logout(); router.replace('/login'); }}
        style={{
          backgroundColor: `${colors.danger}15`, borderWidth: 1, borderColor: `${colors.danger}30`,
          borderRadius: 14, padding: 16, marginTop: 8, marginBottom: 40,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={{ color: colors.danger, fontSize: 15, fontWeight: '700' }}>Sair do Sistema</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>Desenvolvido por Marcelo Desenvolvedor | (21) 98132-5441 | mareclobradrj@gmail.com</Text>
      </View>
    </ScrollView>
  );
}
