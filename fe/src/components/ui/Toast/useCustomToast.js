import toast from 'react-hot-toast';

const useCustomToast = () => {
  const showToast = (message, type = 'default') => {
    const toastOptions = {
      duration: 4000,
      position: 'top-right',
      style: {
        padding: '16px',
        borderRadius: '8px',
        background: '#fff',
        color: '#333',
      },
    };

    switch (type) {
      case 'success':
        toast.success(message, {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            background: '#10B981',
            color: '#fff',
          },
          icon: '✅',
        });
        break;

      case 'error':
        toast.error(message, {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            background: '#EF4444',
            color: '#fff',
          },
          icon: '❌',
        });
        break;

      case 'warning':
        toast(message, {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            background: '#F59E0B',
            color: '#fff',
          },
          icon: '⚠️',
        });
        break;

      case 'info':
        toast(message, {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            background: '#3B82F6',
            color: '#fff',
          },
          icon: 'ℹ️',
        });
        break;

      default:
        toast(message, toastOptions);
        break;
    }
  };

  return { showToast };
};

export default useCustomToast;