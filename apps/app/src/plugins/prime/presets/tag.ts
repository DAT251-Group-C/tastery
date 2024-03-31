import { TagPassThroughOptions } from 'primevue/tag';

const Tag: TagPassThroughOptions = {
  root: ({ props }) => ({
    class: [
      //Font
      'text-caption',

      //Alignments
      'inline-flex items-center justify-center',

      //Spacing
      {
        'px-1 py-0.5': !props.rounded,
        'px-2 py-0.5': props.rounded,
      },

      //Shape
      {
        'rounded-xs': !props.rounded,
        'rounded-full': props.rounded,
      },

      //Colors
      'ring-1',
      {
        'bg-primary-darker ring-primary text-neutral-300': props.severity == null || props.severity == 'primary',
        'bg-success-dark ring-success text-success': props.severity == 'success',
        'bg-info-dark ring-info text-info': props.severity == 'info',
        'bg-warning-dark ring-warning text-warning': props.severity == 'warning',
        'bg-error-dark ring-error text-error': props.severity == 'error',
      },
    ],
  }),
  value: {
    class: 'leading-normal',
  },
  icon: ({ props }) => ({
    class: [`font-symbol mr-1 text-[1rem] leading-[1rem]`],
    'data-icon': props.icon,
  }),
};

export default Tag;
