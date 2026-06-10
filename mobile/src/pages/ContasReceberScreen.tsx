import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import List from '../components/List';

export default function ContasReceberScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <List endpoint="/contas-receber" title="Contas a Receber" />
    </View>
  );
}
