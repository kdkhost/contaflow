import toast from 'react-hot-toast';

const defaultStyle = {
  borderRadius: '10px',
  background: '#1e1e2e',
  color: '#e2e8f0',
  fontSize: '14px',
  padding: '12px 16px',
};

const lightStyle = {
  borderRadius: '10px',
  background: '#ffffff',
  color: '#1f2937',
  fontSize: '14px',
  padding: '12px 16px',
  border: '1px solid #e5e7eb',
};

function getStyle() {
  return document.documentElement.classList.contains('dark') ? defaultStyle : lightStyle;
}

export function notifySuccess(message: string) {
  toast.success(message, {
    style: getStyle(),
    duration: 3000,
  });
}

export function notifyError(message: string) {
  toast.error(message, {
    style: getStyle(),
    duration: 4000,
  });
}

export function notifyInfo(message: string) {
  toast(message, {
    icon: 'ℹ️',
    style: getStyle(),
    duration: 3000,
  });
}

export function notifyWarning(message: string) {
  toast(message, {
    icon: '⚠️',
    style: getStyle(),
    duration: 4000,
  });
}

export function notifyLoading(message: string) {
  return toast.loading(message, {
    style: getStyle(),
  });
}

export function notifyDismiss(toastId: string) {
  toast.dismiss(toastId);
}

export function notifyPromise<T>(
  promise: Promise<T>,
  msgs: { loading: string; success: string; error: string }
) {
  return toast.promise(promise, msgs, {
    style: getStyle(),
    success: {
      duration: 3000,
    },
    error: {
      duration: 4000,
    },
  });
}
