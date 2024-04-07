import { AvatarPassThroughOptions } from 'primevue/avatar';

const Avatar: AvatarPassThroughOptions = {
  root: ({ props, parent }) => ({
    class: [
      // Font
      {
        'text-body-small-bold': props.size === null || props.size === undefined || props.size === 'normal',
        'text-body-bold': props.size === 'large',
        'text-body-large-bold': props.size === 'xlarge',
      },

      // Alignments
      'inline-flex items-center justify-center',
      'shrink-0',
      'relative',

      // Sizes
      {
        'h-6 w-6': props.size === null || props.size === undefined || props.size === 'normal',
        'w-8 h-8': props.size === 'large',
        'w-10 h-10': props.size === 'xlarge',
      },
      { '-ml-4': parent.instance.$style?.name === 'avatargroup' },

      // Shapes
      {
        'rounded-sm': props.shape === 'square',
        'rounded-full': props.shape === 'circle',
      },
      { 'border-2': parent.instance.$style?.name === 'avatargroup' },

      // Colors
      'bg-primary-dark text-neutral-100',
      { 'border-neutral-300': parent.instance.$style?.name === 'avatargroup' },

      'uppercase',
    ],
  }),
  image: ({ props }) => ({
    class: [
      'h-full w-full',
      {
        'rounded-sm': props.shape === 'square',
        'rounded-full': props.shape === 'circle',
      },
    ],
  }),
};

export default Avatar;
