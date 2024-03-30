import { ToastPassThroughOptions } from 'primevue/toast';

const Toast: ToastPassThroughOptions = {
  root: ({ props }) => ({
    class: [
      //Size and Shape
      'w-96 rounded-xs',

      // Positioning
      { '-translate-x-2/4': props.position == 'top-center' || props.position == 'bottom-center' },
    ],
  }),
  container: ({ props }) => ({
    class: [
      'my-4 rounded-sm w-full',

      'shadow-lg',
      'ring-1',
      // Colors
      {
        'ring-neutral-700 bg-neutral-800': !props.message?.severity,
        'ring-success bg-success-dark': props.message?.severity == 'success',
        'ring-info bg-info-dark': props.message?.severity == 'info',
        'ring-warning bg-warning-dark': props.message?.severity == 'warn',
        'ring-error bg-error-dark': props.message?.severity == 'error',
      },
    ],
  }),
  content: ({ props }) => ({
    class: [
      'flex p-4',
      {
        'items-start': props.message?.summary,
        'items-center': !props.message?.summary,
      },
    ],
  }),
  icon: ({ props }) => ({
    class: [
      {
        info: !props.message?.severity || props.message?.severity == 'info',
        check: props.message?.severity == 'success',
        warning: props.message?.severity == 'warn',
        error: props.message?.severity == 'error',
      },
    ],
  }),
  text: {
    class: [
      // Font and Text
      'ml-2',
      'flex-1',
    ],
  },
  summary: {
    class: 'text-body-small-bold block text-neutral-200',
  },
  detail: ({ props }) => ({
    class: ['block text-body-small', 'text-neutral-300', { 'mt-1.5': props.message?.summary }],
  }),
  closeButton: {
    class: [
      // Flexbox
      'flex items-center justify-center',

      // Size
      'w-7 h-7 -m-1',

      // Spacing and Misc
      'ml-auto relative',

      // Shape
      'rounded-full',

      // Colors
      'bg-transparent',
      'text-neutral-300',

      // Transitions
      'transition-colors',

      // States
      'hover:bg-neutral-700 hover:text-neutral-200',
      'outline-none focus:bg-neutral-700',
      'focus:text-neutral-200',

      // Misc
      'overflow-hidden',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 translate-y-2',
    enterActiveClass: 'transition-[transform,opacity]',
    leaveFromClass: 'max-h-[1000px]',
    leaveActiveClass: '!transition-[max-height_.45s_cubic-bezier(0,1,0,1),opacity_.3s,margin-bottom_.3s] overflow-hidden',
    leaveToClass: 'max-h-0 opacity-0 mb-0 -translate-y-2',
  },
};

export default Toast;
