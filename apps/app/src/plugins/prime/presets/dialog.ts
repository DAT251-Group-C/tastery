import { DialogPassThroughOptions } from 'primevue/dialog';

const Dialog: DialogPassThroughOptions = {
  root: ({ state }) => ({
    class: [
      // Shape
      'rounded-xs',
      'shadow-xl',
      'bg-neutral-800',
      'ring-1 ring-neutral-900',

      // Size
      'max-h-[90vh]',
      { 'sm:w-full sm:max-w-lg': !state.maximized },
      'm-0',

      // Transitions
      'transform',
      'scale-100',

      // Maximized State
      {
        'transition-none': state.maximized,
        'transform-none': state.maximized,
        '!w-screen': state.maximized,
        '!h-screen': state.maximized,
        '!max-h-full !max-w-full': state.maximized,
        '!top-0': state.maximized,
        '!left-0': state.maximized,
      },
    ],
  }),
  header: {
    class: [
      // Flexbox and Alignment
      'flex items-center justify-between',
      'shrink-0',

      // Spacing
      'px-5 py-3',

      // Shape
      'rounded-t-xs',

      // Colors
      'bg-neutral-700/25',
      'text-neutral-200',
    ],
  },
  title: {
    class: ['text-body-small-bold'],
  },
  icons: {
    class: ['flex items-center'],
  },
  closeButton: {
    class: [
      // Flexbox
      'flex items-center justify-center',

      // Size
      'w-7 h-7 -m-1 ml-2',

      // Spacing and Misc
      'relative',

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
  maximizableButton: {
    class: [
      // Flexbox
      'flex items-center justify-center',

      // Size
      'w-7 h-7 -m-1 ml-2 mr-0',

      // Spacing and Misc
      'relative',

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
  content: ({ state, instance }) => ({
    class: [
      // Font
      'text-body-small',
      // Spacing
      'px-5 py-3',

      // Shape
      {
        grow: state.maximized,
        'rounded-b-xs': !instance.$slots.footer,
      },

      // Colors
      'text-neutral-300',

      // Misc
      'overflow-y-auto',
    ],
  }),
  footer: {
    class: [
      // Flexbox and Alignment
      'flex items-center justify-end',
      'shrink-0',
      'text-right',
      'gap-3',

      // Spacing
      'px-6',
      'py-4',

      // Shape
      'border-t border-neutral-700',
      'rounded-b-xs',

      // Colors
      'text-neutral-300',
    ],
  },
  mask: ({ state, props }) => ({
    class: [
      // Transitions
      'transition',
      { 'p-5': !state.maximized },

      // Background and Effects
      {
        'has-[.mask-active]:bg-transparent bg-[black]/40': props.modal,
        // 'has-[.mask-active]:backdrop-blur-none backdrop-blur-sm': props.modal,
      },
    ],
  }),
  transition: ({ props }) => {
    let enterFromClass = 'opacity-0 scale-75 mask-active ';
    const enterActiveClass = 'transition-all ease-out ';
    const leaveActiveClass = 'transition-all ease-out ';
    let leaveToClass = 'opacity-0 scale-75 mask-active ';

    if (!props.position || props.position === 'center') {
      enterFromClass = 'opacity-0 translate-y-2 mask-active';
      leaveToClass = 'opacity-0 scale-75 mask-active';
    } else if (props.position === 'top') {
      enterFromClass += 'translate-x-0 -translate-y-full translate-z-0';
      leaveToClass += 'translate-x-0 -translate-y-full translate-z-0';
    } else if (props.position === 'bottom') {
      (enterFromClass += 'translate-y-full'), (leaveToClass += 'translate-x-0 translate-y-full translate-z-0');
    } else if (props.position === 'left' || props.position === 'topleft' || props.position === 'bottomleft') {
      enterFromClass += '-translate-x-full translate-y-0 translate-z-0';
      leaveToClass += '-translate-x-full translate-y-0 translate-z-0';
    } else if (props.position === 'right' || props.position === 'topright' || props.position === 'bottomright') {
      enterFromClass += 'translate-x-full translate-y-0 translate-z-0';
      leaveToClass += 'translate-x-full translate-y-0 translate-z-0';
    }

    return {
      enterFromClass,
      enterActiveClass,
      leaveActiveClass,
      leaveToClass,
    };
  },
};

export default Dialog;
