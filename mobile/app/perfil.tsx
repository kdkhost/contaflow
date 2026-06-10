import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    contador_chefe: 'Contador Chefe',
    contador_analista: 'Contador Analista',
    auxiliar: 'Auxiliar',
    cliente_visualizacao: 'Cliente',
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', flex: 1 }}>Meu Perfil</Text>
      </View>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center' }}>
        <View style={{ backgroundColor: `${colors.primary}20`, width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Ionicons name="person" size={36} color={colors.primary} />
        </View>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{user?.nome || 'Usuario'}</Text>
        <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600', marginTop: 4 }}>{roleLabels[user?.role || ''] || user?.role}</Text>
      </View>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Ionicons name="mail" size={18} color={colors.textMuted} />
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Email</Text>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>{user?.email || '-'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
          <Ionicons name="business" size={18} color={colors.textMuted} />
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Tenant</Text>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>{user?.tenantId || '-'}</Text>
          </View>
        </View>
      </View>

      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Alterar Senha</Text>
      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 }}>
        <Input label="Senha Atual" icon="lock-closed-outline" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
        <Input label="Nova Senha" icon="key-outline" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
        <Input label="Confirmar Nova Senha" icon="key-outline" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
        <Button title="Salvar Senha" onPress={() => {}} style={{ marginTop: 4 }} />
      </View>

      <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginTop: 20, marginBottom: 40, alignItems: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>Desenvolvido por Marcelo Desenvolvedor | (21) 98132-5441 | mareclobradrj@gmail.com</Text>
      </View>
    </ScrollView>
  );
}
