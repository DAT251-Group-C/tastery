import { InputTextPassThroughOptions } from 'primevue/inputtext';

const InputText: InputTextPassThroughOptions = {
  root: ({ props, context, parent }) => ({
    class: [
      // Flex
      { 'flex-1 w-[1%]': parent.instance.$name == 'InputGroup' },

      // Spacing
      'm-0 transition-[box-shadow]',

      'text-body-small',
      {
        'py-2.5 px-3': props.size == 'large',
        'py-1 px-2': props.size == 'small',
        'py-1.5 px-2': props.size == null,
      },

      // Colors
      'text-neutral-300',
      'placeholder:text-neutral-500',
      'bg-neutral-800',
      { 'ring-1 ring-inset ring-offset-0': parent.instance.$name !== 'InputGroup' },

      { 'ring-neutral-700': !props.invalid },

      // Invalid State
      { 'ring-error': props.invalid },

      // Shape
      { 'rounded-xs': parent.instance.$name !== 'InputGroup' },
      { 'first:rounded-l-xs rounded-none last:rounded-r-xs': parent.instance.$name == 'InputGroup' },
      { 'border-0 border-y border-l last:border-r border-neutral-700': parent.instance.$name == 'InputGroup' },
      { 'first:ml-0 -ml-px': parent.instance.$name == 'InputGroup' },
      'appearance-none',

      // Interactions
      {
        'outline-none focus:ring-neutral-500': !context.disabled,
        'opacity-60 bg-neutral-900 select-none pointer-events-none cursor-default': context.disabled,
      },

      // Filled State *for FloatLabel
      { filled: parent.instance?.$name == 'FloatLabel' && context.filled },
    ],
  }),
};

export default InputText;
