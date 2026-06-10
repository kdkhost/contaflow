import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Credenciais invalidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            backgroundColor: colors.primary,
            width: 72, height: 72, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center', marginBottom: 20,
          }}>
            <Ionicons name="calculator" size={36} color="#ffffff" />
          </View>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: '900' }}>ContaFlow</Text>
          <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>Sistema Contabil Inteligente</Text>
        </View>

        <View style={{
          backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
          borderRadius: 20, padding: 24,
        }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>
            Entrar no Sistema
          </Text>
          <Input label="Email" icon="mail-outline" value={email} onChangeText={setEmail}
            placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Input label="Senha" icon="lock-closed-outline" value={senha} onChangeText={setSenha}
            placeholder="Sua senha" secureTextEntry />
          <Button title="Entrar" onPress={handleLogin} loading={loading} />
          <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleTheme}
          style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={16} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>{isDark ? 'Modo Claro' : 'Modo Escuro'}</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 30 }}>
          Desenvolvido por Marcelo Desenvolvedor{'\n'}(21) 98132-5441 | mareclobradrj@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
}
