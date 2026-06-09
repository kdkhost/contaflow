import { useState, InputHTMLAttributes, ChangeEvent } from 'react';
import {
  maskCPF, maskCNPJ, maskPhone, maskCEP, maskCurrency,
  maskDate, maskDateTime, maskTime, maskPercent, maskCard
} from '../../utils/masks';

interface MaskedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mask: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'currency' | 'date' | 'datetime' | 'time' | 'percent' | 'card';
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
}

const maskFunctions = {
  cpf: maskCPF, cnpj: maskCNPJ, phone: maskPhone, cep: maskCEP,
  currency: maskCurrency, date: maskDate, datetime: maskDateTime,
  time: maskTime, percent: maskPercent, card: maskCard,
};

export default function MaskedInput({ mask, value = '', onChange, label, error, className = '', ...props }: MaskedInputProps) {
  const [displayValue, setDisplayValue] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const masked = maskFunctions[mask](e.target.value);
    setDisplayValue(masked);
    onChange?.(masked);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={`input-premium ${error ? '!border-red-500/50 focus:!ring-red-500/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
