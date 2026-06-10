import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export default function Input({ label, icon, error, secureTextEntry, ...props }: InputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgInput,
        borderWidth: 1,
        borderColor: error ? colors.danger : colors.borderInput,
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
      }}>
        {icon && (
          <Ionicons name={icon} size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
        )}
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry && !showPassword}
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 15,
          }}
          placeholderTextColor={colors.textMuted}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
}
