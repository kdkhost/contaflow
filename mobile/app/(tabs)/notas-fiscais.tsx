import { View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import List from '../../src/components/List';

export default function NotasFiscaisScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <List endpoint="/notas-fiscais" title="Notas Fiscais" />
    </View>
  );
}
