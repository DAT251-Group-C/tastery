import { BadgePassThroughOptions } from 'primevue/badge';

const Badge: BadgePassThroughOptions = {
  root: ({ props }) => ({
    class: [
      // Font
      {
        'text-caption': props.size == null,
        'text-body-small': props.size == 'large',
        'text-body': props.size == 'xlarge',
      },

      // Alignment
      'text-center inline-block',

      // Size
      'p-0 px-1',
      {
        'min-w-[1rem] h-[1rem]': props.size == null,
        'min-w-[1.25rem] h-[1.25rem]': props.size == 'large',
        'min-w-[1.5rem] h-[1.5rem]': props.size == 'xlarge',
      },

      // Shape
      {
        'rounded-full': props.value?.toString().length == 1,
        'rounded-sm': props.value?.toString().length !== 1,
      },

      // Color
      {
        'bg-primary text-neutral-200': props.severity == null || props.severity == 'primary',
        'bg-secondary text-neutral-200': props.severity == 'secondary',
        'bg-neutral-800 ring-1 ring-neutral-700': props.severity == 'neutral',
        'bg-success text-neutral-900': props.severity == 'success',
        'bg-info text-neutral-900': props.severity == 'info',
        'bg-warning text-neutral-900': props.severity == 'warning',
        'bg-error text-neutral-900': props.severity == 'error',
      },
    ],
  }),
};

export default Badge;
