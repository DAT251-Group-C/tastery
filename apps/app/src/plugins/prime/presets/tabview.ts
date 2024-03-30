import { TabPanelPassThroughMethodOptions } from 'primevue/tabpanel';
import { TabViewPassThroughOptions } from 'primevue/tabview';

const TabView: TabViewPassThroughOptions = {
  navContainer: ({ props }) => ({
    class: [
      // Position
      'relative',

      // Misc
      { 'overflow-hidden': props.scrollable },
    ],
  }),
  navContent: {
    class: [
      // Overflow and Scrolling
      'overflow-y-hidden overscroll-contain',
      'overscroll-auto',
      'scroll-smooth',
      '[&::-webkit-scrollbar]:hidden',
    ],
  },
  previousButton: {
    class: [
      // Flexbox and Alignment
      'flex items-center justify-center',

      // Position
      '!absolute',
      'top-0 left-0',
      'z-20',

      // Size and Shape
      'h-full w-12',
      'rounded-none',

      // Colors
      'bg-primary',
      'text-primary-500',
      'shadow-md',
    ],
  },
  nextButton: {
    class: [
      // Flexbox and Alignment
      'flex items-center justify-center',

      // Position
      '!absolute',
      'top-0 right-0',
      'z-20',

      // Size and Shape
      'h-full w-12',
      'rounded-none',

      // Colors
      'bg-surface-0',
      'text-primary-500',
      'shadow-md',
    ],
  },
  nav: {
    class: [
      // Flexbox
      'flex flex-1',

      // Spacing
      'list-none',
      'p-0 m-0',

      // Colors
      'bg-transparent',
      'border-b border-neutral-700',
      'text-neutral-300',
    ],
  },
  tabpanel: {
    header: ({ props }: TabPanelPassThroughMethodOptions) => ({
      class: [
        // Spacing
        'mr-0',

        // Misc
        {
          'opacity-60 cursor-default user-select-none select-none pointer-events-none': props?.disabled,
        },
      ],
    }),
    headerAction: ({ parent, context }: TabPanelPassThroughMethodOptions) => ({
      class: [
        'relative',

        // Font
        'text-body-small',

        // Flexbox and Alignment
        'flex items-center',

        // Spacing
        'py-2 px-3',
        'border-b-2',
        // Shape
        // Colors and Conditions
        {
          'border-transparent': parent.state.d_activeIndex !== context.index,
          'text-neutral-400': parent.state.d_activeIndex !== context.index,
          'border-neutral-200': parent.state.d_activeIndex === context.index,
          'text-neutral-200': parent.state.d_activeIndex === context.index,
        },

        // States
        'outline-none',
        'focus-visible:text-neutral-200 focus-visible:bg-neutral-800',
        {
          'hover:text-neutral-200': parent.state.d_activeIndex !== context.index,
        },

        // Transitions
        'transition-all',

        // Misc
        'cursor-pointer select-none text-decoration-none',
        'overflow-hidden',
        'user-select-none',
        'whitespace-nowrap',
      ],
    }),
    headerTitle: {
      class: [
        // Text
        'leading-[1rem]',
        'whitespace-nowrap',
      ],
    },
  },
};

export default TabView;
