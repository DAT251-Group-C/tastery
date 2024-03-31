import { IconFieldPassThroughOptions } from 'primevue/iconfield';

const IconField: IconFieldPassThroughOptions = {
  root: ({ props }) => ({
    class: [
      'relative',
      '[&>input]:w-full',

      '[&>*:first-child]:absolute',
      '[&>*:first-child]:top-1/2',
      '[&>*:first-child]:-mt-2.5',
      {
        '[&>*:first-child]:right-2': props.iconPosition === 'right',
        '[&>*:first-child]:left-2': props.iconPosition === 'left',
      },
      {
        '[&>*:last-child]:pr-8': props.iconPosition === 'right',
        '[&>*:last-child]:pl-8': props.iconPosition === 'left',
      },
    ],
  }),
};

export default IconField;
