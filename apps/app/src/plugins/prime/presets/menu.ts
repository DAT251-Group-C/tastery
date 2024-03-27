import { MenuPassThroughOptions } from 'primevue/menu';

const Menu: MenuPassThroughOptions = {
  root: ({ attrs }) => ({
    class: [
      // Sizing and Shape
      'rounded-xs',
      // Spacing
      'p-2',
      // Colors
      'text-neutral-400',

      {
        'flex flex-col grow': attrs.fillHeight,
      },
    ],
  }),
  menu: ({ attrs }) => ({
    class: [
      // Spacings and Shape
      'list-none',
      'm-0',
      'p-0',
      'outline-none',
      {
        'flex flex-col grow': attrs.fillHeight,
      },
    ],
  }),
  menuitem: {
    class: [
      // Space
      'first:mt-0 mt-1',
      'min-w-10',
    ],
  },
  content: ({ context }) => ({
    class: [
      //Shape
      'rounded-xs',

      // Colors
      {
        'text-neutral-400': !context.focused,
        'bg-neutral-800 text-neutral-300': context.focused,
      },

      // Transitions
      'transition',

      // States
      {
        'hover:text-neutral-300 hover:bg-neutral-700': !context.disabled,
        '!text-neutral-500': context.disabled,
      },
    ],
  }),
  action: {
    class: [
      'relative',

      // Font
      'text-body-small',

      // Flexbox
      'flex',
      'items-center',

      // Spacing
      'p-2',

      // Misc
      'no-underline',
      'overflow-hidden',
      'cursor-pointer',
      'select-none',
    ],
  },
  icon: {
    class: [
      // Spacing
      'mr-2',
    ],
  },
  label: {
    class: ['text-body-small'],
  },
  submenuHeader: {
    class: [
      // Font
      'font-semibold',
      'text-xs leading-6',

      // Spacing
      'm-0 ',
      'py-1',
      'px-3',

      // Shape
      'rounded-tl-none',
      'rounded-tr-none',

      // Colors
      'bg-surface-0 dark:bg-surface-700',
      'text-surface-600 dark:text-surface-0/60',
    ],
  },
  separator: {
    class: [
      // Spacing
      'mt-2 mb-1',
      'h-px',

      // Colors
      'bg-neutral-700',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass: 'transition-[transform,opacity] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity ease-linear',
    leaveToClass: 'opacity-0',
  },
};

export default Menu;
