import { DropdownPassThroughOptions } from 'primevue/dropdown';

const Dropdown: DropdownPassThroughOptions = {
  root: ({ props, state, parent }) => ({
    class: [
      // Display and Position
      'inline-flex',
      'relative',

      // Flex
      { 'flex-1 w-[1%]': parent.instance.$name === 'InputGroup' },

      // Shape
      { 'rounded-xs': parent.instance.$name !== 'InputGroup' },
      { 'first:rounded-l-xs rounded-none last:rounded-r-xs': parent.instance.$name === 'InputGroup' },
      { 'border-0 border-y border-l last:border-r border-neutral-700': parent.instance.$name === 'InputGroup' },
      { 'first:ml-0 ml-[-1px]': parent.instance.$name === 'InputGroup' },

      // Color and Background
      'bg-neutral-800 transition-[box-shadow]',

      // States
      'ring-1 ring-inset',
      {
        'ring-neutral-500': state.focused,
      },

      { 'ring-neutral-700': !props.invalid && !state.focused },

      // Invalid State
      { 'ring-error': props.invalid && !state.focused },

      // Misc
      'cursor-default',
      'select-none',
      { 'opacity-60': props.disabled, 'pointer-events-none': props.disabled },
    ],
  }),
  input: ({ props, instance }) => ({
    class: [
      //Font
      'text-body-small',

      // Display
      'block',
      'flex-auto',

      // Color and Background
      'bg-transparent',
      'border-0',
      {
        'text-neutral-300': props.modelValue !== undefined,
        'text-neutral-500': props.modelValue === undefined,
      },
      'placeholder:text-neutral-500',

      // Sizing and Spacing
      'w-[1%]',
      {
        'py-2.5 px-4': instance.$attrs.size === 'large',
        'py-1 px-2': instance.$attrs.size === 'small',
        'py-1.5 px-2': !instance.$attrs.size,
      },
      { 'pr-7': props.showClear },

      //Shape
      'rounded-none',

      // Transitions
      'transition',

      // States
      'focus:outline-none focus:shadow-none',

      // Misc
      'relative',
      'cursor-pointer',
      'overflow-hidden overflow-ellipsis',
      'whitespace-nowrap',
      'appearance-none',
    ],
  }),
  trigger: {
    class: [
      // Flexbox
      'flex items-center justify-center',
      'shrink-0',

      // Color and Background
      'bg-transparent',
      'text-neutral-300',

      // Size
      'w-8',

      // Shape
      'cursor-pointer',
      'rounded-tr-xs',
      'rounded-br-xs',
    ],
  },
  panel: {
    class: [
      // Position
      'absolute top-0 left-0',
      'mt-1',

      // Shape
      'border-0',
      'rounded-xs',

      // Color
      'bg-neutral-800',
      'text-neutral-300',
      'ring-1 ring-inset ring-neutral-700',
    ],
  },
  wrapper: {
    class: [
      // Sizing
      'max-h-[15rem]',

      // Misc
      'overflow-auto',
    ],
  },
  list: {
    class: 'py-1 list-none m-0',
  },
  item: ({ context }) => ({
    class: [
      // Font
      'text-body-small',
      'leading-none',

      // Position
      'relative',

      // Shape
      'border-0',
      'rounded-none',
      'transition',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      { 'text-neutral-400': !context.focused && !context.selected && !context.disabled },
      { 'text-neutral-500': !context.focused && !context.selected && context.disabled },
      { 'bg-neutral-700 text-neutral-300': context.focused && !context.selected },
      { 'bg-neutral-700 text-neutral-200': context.focused && context.selected },
      { 'bg-neutral-700 text-neutral-300': !context.focused && context.selected },

      //States
      'hover:bg-neutral-700/50 hover:text-neutral-300',
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info',

      // Misc
      { 'pointer-events-none cursor-default': context.disabled },
      { 'cursor-pointer': !context.disabled },
      'overflow-hidden',
      'whitespace-nowrap',
    ],
  }),
  itemGroup: {
    class: [
      //Font
      'text-body-small',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      'text-neutral-300',
      'bg-neutral-800',

      // Misc
      'cursor-auto',
    ],
  },
  emptyMessage: {
    class: [
      // Font
      'text-caption',

      // Spacing
      'py-2 px-4',

      // Color
      'text-neutral-500',
      'bg-transparent',
    ],
  },
  header: {
    class: [
      // Spacing
      'p-0',
      'm-0',

      //Shape
      'rounded-tl-xs',
      'rounded-tr-xs',

      // Color
      'text-neutral-400',
      'bg-neutral-800',
    ],
  },
  filterContainer: {
    class: 'relative',
  },
  filterInput: {
    class: [
      // Font
      'text-body-small',

      // Sizing
      'py-1.5 px-3',
      'pr-7',
      '-mr-7',
      'w-full',

      //Color
      'text-neutral-300',
      'bg-neutral-800',
      'placeholder:text-neutral-500',
      'ring-1 ring-inset ring-neutral-700',

      // Shape
      'border-0',
      'rounded-tl-xs',
      'rounded-tr-xs',
      'appearance-none',

      // States
      'focus:ring-2 focus:ring-inset focus:outline-none focus:outline-offset-0',
      'focus:ring-primary-600',

      // Misc
      'appearance-none',
    ],
  },
  filterIcon: {
    class: ['absolute', 'top-1/2 right-3', '-mt-2'],
  },
  clearIcon: {
    class: [
      // Color
      'text-neutral-400',

      // Position
      'absolute',
      'top-1/2',
      'right-12',

      // Spacing
      '-mt-2',

      // Misc
      'cursor-pointer',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass: 'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
  loadingIcon: ({ props }) => ({
    class: ['font-symbol mx-0', 'animate-spin', 'text-[1rem] leading-1'],
    'data-icon': props.loadingIcon,
  }),
};

export default Dropdown;
