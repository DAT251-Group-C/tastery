import { ToastMessageOptions } from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

type ToasterAdd = Omit<ToastMessageOptions, 'severity'> & {
  severity?: 'success' | 'info' | 'warn' | 'error';
};

let _toaster: ReturnType<typeof useToast> | null = null;

const getToaster = () => {
  if (!_toaster) {
    _toaster = useToast();
  }

  return _toaster;
};

const useToaster = () => {
  const toast = getToaster();

  const add = (message: ToasterAdd) => {
    toast.add({
      life: 3000,
      ...message,
    });
  };

  const remove = (message: ToasterAdd) => {
    toast.add({
      life: 3000,
      ...message,
    });
  };

  return {
    add,
    remove,
    removeGroup: toast.removeGroup,
    removeAllGroups: toast.removeAllGroups,
  };
};

export { useToaster };
