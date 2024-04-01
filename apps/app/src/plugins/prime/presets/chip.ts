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
      'text-neutral-300',
      'bg-neutral-700',
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
      'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800 focus:text-neutral-200',
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
