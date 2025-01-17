// utils/showToast.js
import toast from 'react-hot-toast';

const toastConfig = {
  duration: 3000,
  style: { 
    minWidth: '250px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  position: 'top-center'
};

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: '📢'
};


export const showToast = (message, type = 'info') => {
  if (!message) return;

  const config = {
    ...toastConfig,
    icon: icons[type]
  };

  switch (type) {
    case 'success':
      return toast.success(message, config);
    
    case 'error':
      return toast.error(message, config);
    
    case 'warning':
      return toast(message, {
        ...config,
        style: {
          ...config.style,
          backgroundColor: '#FEF3C7',
          color: '#92400E'
        }
      });
    
    case 'info':
    default:
      return toast(message, {
        ...config,
        style: {
          ...config.style,
          backgroundColor: '#EFF6FF',
          color: '#1E40AF'
        }
      });
  }
};


export const showPromiseToast = (promise, messages = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Berhasil!',
      error: messages.error || 'Terjadi kesalahan'
    },
    {
      ...toastConfig,
      loading: {
        ...toastConfig,
        icon: '⏳'
      }
    }
  );
};


export const showActionToast = (message, actions = []) => {
  return toast(
    (t) => (
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                toast.dismiss(t.id);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium ${action.className}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    ),
    {
      ...toastConfig,
      duration: 5000
    }
  );
};

