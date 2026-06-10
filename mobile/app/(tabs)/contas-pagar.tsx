import { View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import List from '../../src/components/List';

export default function ContasPagarScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <List endpoint="/contas-pagar" title="Contas a Pagar" />
    </View>
  );
}
