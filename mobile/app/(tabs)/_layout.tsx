import { Tabs } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.bgHeader,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    }}>
      <Tabs.Screen name="dashboard" options={{
        title: 'Dashboard',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="contas-pagar" options={{
        title: 'Pagar',
        tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
      }} />
      <Tabs.Screen name="contas-receber" options={{
        title: 'Receber',
        tabBarIcon: ({ color, size }) => <Ionicons name="cash" size={size} color={color} />,
      }} />
      <Tabs.Screen name="notas-fiscais" options={{
        title: 'NF',
        tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
      }} />
      <Tabs.Screen name="mais" options={{
        title: 'Mais',
        tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
