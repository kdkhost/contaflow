import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  title?: string;
  value?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export default function Card({ title, value, subtitle, icon, color }: CardProps) {
  const { colors } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    }}>
      {icon && (
        <View style={{
          backgroundColor: `${color || colors.primary}20`,
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}>
          <Ionicons name={icon} size={22} color={color || colors.primary} />
        </View>
      )}
      {title && (
        <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
          {title}
        </Text>
      )}
      {value && (
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 4 }}>
          {value}
        </Text>
      )}
      {subtitle && (
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
