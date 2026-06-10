import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const { colors } = useTheme();

  const variants = {
    primary: { bg: colors.primary, text: '#ffffff' },
    secondary: { bg: colors.bgInput, text: colors.text },
    danger: { bg: colors.danger, text: '#ffffff' },
    success: { bg: colors.success, text: '#ffffff' },
  };

  const v = variants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[{
        backgroundColor: disabled ? colors.textMuted : v.bg,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        opacity: disabled ? 0.6 : 1,
      }, style]}
    >
      {loading && <ActivityIndicator size="small" color={v.text} />}
      <Text style={{ color: v.text, fontSize: 15, fontWeight: '700' }}>
        {loading ? 'Aguarde...' : title}
      </Text>
    </TouchableOpacity>
  );
}
