import { InputNumberPassThroughOptions } from 'primevue/inputnumber';

const InputNumber: InputNumberPassThroughOptions = {
  root: ({ props, parent }) => ({
    class: [
      // Flex
      'inline-flex',
      { 'flex-col': props.showButtons && props.buttonLayout == 'vertical' },
      { 'flex-1 w-[1%]': parent.instance.$name == 'InputGroup' },

      //Sizing
      { '!w-16': props.showButtons && props.buttonLayout == 'vertical' },

      // Shape
      { 'first:rounded-l-xs rounded-none last:rounded-r-xs': parent.instance.$name == 'InputGroup' && !props.showButtons },
      {
        'border-0 border-y border-l last:border-r border-neutral-600': parent.instance.$name == 'InputGroup' && !props.showButtons,
      },

      { 'ring-1 ring-neutral-600 ring-offset-0': parent.instance.$name !== 'InputGroup' },
      'rounded-xs',
    ],
  }),
  input: {
    root: ({ parent }) => ({
      class: [
        // Display
        'flex flex-auto',

        //Text
        'text-body-small',
        { 'text-center': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        // Spacing
        'm-0',
        'py-2.5 px-4',

        // Shape
        'rounded-xs',
        { 'rounded-tr-none rounded-br-none': parent.props.showButtons },
        { 'rounded-tl-none rounded-bl-none': parent.props.showButtons && parent.props.buttonLayout == 'horizontal' },
        { 'rounded-none': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        // Colors
        'text-neutral-700',
        'placeholder:text-neutral-600',
        'bg-neutral-200',
        { 'border-r': parent.props.showButtons && parent.props.buttonLayout == 'stacked' },
        { 'border-x': parent.props.showButtons && parent.props.buttonLayout == 'horizontal' },
        { 'border-y': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        { 'border-neutral-700': !parent.props.invalid },

        // Invalid State
        { 'border border-error': parent.props.invalid },

        // States
        'outline-none focus:ring-neutral-700',
        'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-inset focus:ring-neutral-700',

        //Position
        { 'order-2': parent.props.buttonLayout == 'horizontal' || parent.props.buttonLayout == 'vertical' },
      ],
    }),
  },

  buttonGroup: {
    class: ['flex', 'flex-col'],
  },

  incrementButton: {
    root: ({ parent }) => ({
      class: [
        // Display
        'flex flex-auto',

        // Alignment
        'items-center',
        'justify-center',
        'text-center align-bottom',

        //Position
        'relative',
        { 'order-3': parent.props.showButtons && parent.props.buttonLayout == 'horizontal' },
        { 'order-1': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        //Color
        'text-neutral-700',
        'bg-neutral-200',

        // Sizing
        'w-[3rem]',
        { 'px-2.5 py-1.5': parent.props.showButtons && parent.props.buttonLayout !== 'stacked' },
        { 'p-0': parent.props.showButtons && parent.props.buttonLayout == 'stacked' },
        { 'w-full': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        // Shape
        'rounded-xs',
        { 'rounded-tl-none rounded-br-none rounded-bl-none': parent.props.showButtons && parent.props.buttonLayout == 'stacked' },
        { 'rounded-bl-none rounded-tl-none': parent.props.showButtons && parent.props.buttonLayout == 'horizontal' },
        { 'rounded-bl-none rounded-br-none': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        //States
        'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-inset focus:ring-neutral-700',
        'hover:bg-neutral-300',

        //Misc
        'cursor-pointer overflow-hidden select-none',
      ],
    }),
    label: {
      class: 'h-0 w-0',
    },
  },
  decrementButton: {
    root: ({ parent }) => ({
      class: [
        // Display
        'flex flex-auto',

        // Alignment
        'items-center',
        'justify-center',
        'text-center align-bottom',

        //Position
        'relative',
        { 'order-1': parent.props.showButtons && parent.props.buttonLayout == 'horizontal' },
        { 'order-3': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        //Color
        'text-neutral-700',
        'bg-neutral-200',

        // Sizing
        'w-[3rem]',
        { 'px-2.5 py-1.5': parent.props.showButtons && parent.props.buttonLayout !== 'stacked' },
        { 'p-0': parent.props.showButtons && parent.props.buttonLayout == 'stacked' },
        { 'w-full': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        // Shape
        'rounded-xs',
        { 'rounded-tr-none rounded-tl-none rounded-bl-none': parent.props.showButtons && parent.props.buttonLayout == 'stacked' },
        { 'rounded-tr-none rounded-br-none ': parent.props.showButtons && parent.props.buttonLayout == 'horizontal' },
        { 'rounded-tr-none rounded-tl-none ': parent.props.showButtons && parent.props.buttonLayout == 'vertical' },

        //States
        'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-inset focus:ring-neutral-700',
        'hover:bg-neutral-300',

        //Misc
        'cursor-pointer overflow-hidden select-none',
      ],
    }),
    label: {
      class: 'h-0 w-0',
    },
  },
};

export default InputNumber;
