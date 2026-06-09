export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 14);
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskCEP(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 8);
  return numbers.replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskCurrency(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  const amount = (parseInt(numbers, 10) / 100).toFixed(2);
  return amount.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function maskDate(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 8);
  return numbers
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

export function maskDateTime(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 12);
  return numbers
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1 $2')
    .replace(/(\d{2})(\d)/, '$1:$2');
}

export function maskTime(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 4);
  return numbers
    .replace(/(\d{2})(\d)/, '$1:$2');
}

export function maskPercent(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 5);
  if (!numbers) return '';
  const percent = (parseInt(numbers, 10) / 100).toFixed(2);
  return percent.replace('.', ',') + '%';
}

export function maskCard(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 16);
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function maskNSU(value: string): string {
  return value.replace(/\D/g, '').slice(0, 15);
}

export function removeMask(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCurrencyFromNumber(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseCurrencyToNumber(value: string): number {
  const clean = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(clean) || 0;
}
