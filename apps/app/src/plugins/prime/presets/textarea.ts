import { TextareaPassThroughOptions } from 'primevue/textarea';

const Textarea: TextareaPassThroughOptions = {
  root: ({ context, props, instance }) => ({
    class: [
      // Font
      'text-body-small',

      // Spacing
      'm-0',
      {
        'py-2.5 px-4 min-h-[2.5rem]': instance.$attrs.size === 'large',
        'py-1 px-2 min-h-[1.75rem]': instance.$attrs.size === 'small',
        'py-1.5 px-2 min-h-[2rem]': !instance.$attrs.size,
      },

      // Shape
      'rounded-xs',
      'appearance-none',

      // Colors
      'text-neutral-700',
      'placeholder:text-neutral-600',
      'bg-neutral-200',
      'ring-1 ring-inset ring-offset-0',
      { ' ring-neutral-600': !props.invalid },

      // Invalid State
      { 'ring-error': props.invalid },

      // States
      {
        'outline-none focus:ring-neutral-600': !context.disabled,
        'opacity-60 select-none pointer-events-none cursor-default': context.disabled,
      },

      // Misc
      'transition-[background-color,color,box-shadow]',
    ],
  }),
};

export default Textarea;
