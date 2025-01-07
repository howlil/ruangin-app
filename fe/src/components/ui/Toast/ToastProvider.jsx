import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        className: '',
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
        },
      }}
    />
  );
};

export default ToastProvider;