import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import List from '../components/List';
import Card from '../components/Card';

export default function ContasPagarScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <List endpoint="/contas-pagar" title="Contas a Pagar" />
    </View>
  );
}
