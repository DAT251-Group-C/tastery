import { ToastMessageOptions } from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

type ToasterAdd = Omit<ToastMessageOptions, 'severity'> & {
  severity?: 'success' | 'info' | 'warn' | 'error';
};

const useToaster = () => {
  const toast = useToast();

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
