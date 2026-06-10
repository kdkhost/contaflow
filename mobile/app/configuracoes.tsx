import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracoesScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [biometria, setBiometria] = useState(false);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({ icon, label, value, onPress }: { icon: string; label: string; value?: string; onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} style={{
      backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
      borderRadius: 12, padding: 14, marginBottom: 8,
      flexDirection: 'row', alignItems: 'center', gap: 12,
    }}>
      <View style={{ backgroundColor: `${colors.primary}20`, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
      </View>
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500', flex: 1 }}>{label}</Text>
      {value && <Text style={{ color: colors.textMuted, fontSize: 13 }}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Configuracoes</Text>
      </View>

      <Section title="Aparência">
        <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ backgroundColor: `${colors.primary}20`, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Tema {isDark ? 'Escuro' : 'Claro'}</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: colors.primary }} />
        </View>
      </Section>

      <Section title="Seguranca">
        <SettingRow icon="key" label="Alterar Senha" />
        <SettingRow icon="finger-print" label="Biometria" value={biometria ? 'Ativada' : 'Desativada'} onPress={() => setBiometria(!biometria)} />
        <SettingRow icon="shield-checkmark" label="Autenticacao em 2 Fatores" />
      </Section>

      <Section title="Sistema">
        <SettingRow icon="notifications" label="Notificacoes" value={notifEnabled ? 'Ativadas' : 'Desativadas'} onPress={() => setNotifEnabled(!notifEnabled)} />
        <SettingRow icon="business" label="Tenant" value={user?.tenantId || 'contaflow-default'} />
        <SettingRow icon="person" label="Minha Conta" onPress={() => router.push('/perfil' as any)} />
      </Section>

      <Section title="Integracoes">
        <SettingRow icon="link" label="Portais Governamentais" onPress={() => router.push('/integracoes' as any)} />
        <SettingRow icon="git-network" label="Graphify" onPress={() => router.push('/graphify' as any)} />
      </Section>

      <Section title="Sobre">
        <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 4 }}>ContaFlow</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Versao 1.0.0</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>Desenvolvido por Marcelo Desenvolvedor</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Tel: (21) 98132-5441</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Email: mareclobradrj@gmail.com</Text>
        </View>
      </Section>
    </ScrollView>
  );
}
