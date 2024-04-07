import { ChipPassThroughOptions } from 'primevue/chip';

const Chip: ChipPassThroughOptions = {
  root: {
    class: [
      // Flexbox
      'inline-flex items-center',

      // Spacing
      'px-2.5 py-1',

      // Shape
      'rounded-full',

      // Colors
      'text-neutral-900',
      'bg-neutral-300',
    ],
  },
  label: {
    class: 'text-caption mx-0',
  },
  icon: ({ props }) => ({
    class: [
      // Shape
      'font-symbol mr-2',
      'text-[1rem] w-4 h-4',
    ],
    'data-icon': props.icon,
  }),
  image: {
    class: ['w-6 h-6 mr-2', 'rounded-full'],
  },
  removeIcon: ({ props }) => ({
    class: [
      // Shape
      'rounded-full',
      'text-neutral-700 hover:text-neutral-800 hover:bg-neutral-300 focus:bg-neutral-300 focus:text-neutral-800',
      'font-symbol ml-1 -mr-1.5',
      'text-[1rem] w-4 h-4',
      'cursor-pointer',

      // Transition
      'transition',
      'outline-none',
    ],
    'data-icon': props.removeIcon,
  }),
};

export default Chip;
