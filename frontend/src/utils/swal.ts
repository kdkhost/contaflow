import Swal, { SweetAlertResult } from 'sweetalert2';

const darkMode = document.documentElement.classList.contains('dark');

const baseConfig = {
  customClass: {
    popup: darkMode ? 'swal2-dark' : 'swal2-light',
    title: darkMode ? 'text-white' : 'text-gray-800',
    htmlContainer: darkMode ? 'text-gray-300' : 'text-gray-600',
    confirmButton: 'swal2-confirm-custom',
    cancelButton: 'swal2-cancel-custom',
  },
  buttonsStyling: true,
  confirmButtonColor: '#6366f1',
  cancelButtonColor: '#6b7280',
  background: darkMode ? '#1e1e2e' : '#ffffff',
  color: darkMode ? '#e2e8f0' : '#1f2937',
};

export function SwalConfirm(title: string, text: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });
}

export function SwalSuccess(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true,
  });
}

export function SwalError(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Entendi',
  });
}

export function SwalWarning(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'OK',
  });
}

export function SwalInfo(title: string, text?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'info',
    confirmButtonText: 'OK',
  });
}

export function SwalDeleteConfirm(): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title: 'Excluir registro?',
    text: 'Esta acao nao pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    confirmButtonColor: '#ef4444',
  });
}

export function SwalPasswordInput(title: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    input: 'password',
    inputPlaceholder: 'Digite a senha',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Senha obrigatoria!';
      }
      return null;
    },
  });
}

export function SwalTextInput(title: string, inputLabel: string, placeholder?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    ...baseConfig,
    title,
    input: 'text',
    inputLabel,
    inputPlaceholder: placeholder || '',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Campo obrigatorio!';
      }
      return null;
    },
  });
}

export function SwalLoading(title: string = 'Carregando...'): void {
  Swal.fire({
    ...baseConfig,
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function SwalClose(): void {
  Swal.close();
}
