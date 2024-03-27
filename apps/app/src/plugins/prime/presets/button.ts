import { ButtonPassThroughOptions } from 'primevue/button';

const Button: ButtonPassThroughOptions = {
  root: ({ props, context, parent }) => ({
    class: [
      'relative',

      // Alignments
      'items-center justify-center inline-flex text-center align-bottom',

      // Sizes & Spacing
      {
        'text-button-small': props.size === 'small',
        'text-button': props.size !== 'small',
      },
      {
        'px-2 py-1 min-w-[2rem]': props.size === null,
        'px-2 py-1': props.size === 'small',
        'px-3 py-2': props.size === 'large',
      },
      {
        'h-8 w-8 p-0': props.label == null && props.icon !== null,
      },

      // Shapes
      { 'rounded-xs': !props.rounded, 'rounded-full': props.rounded },
      { 'rounded-none first:rounded-l-md last:rounded-r-md self-center': parent.instance.$name == 'InputGroup' },

      // Link Button
      { '!text-neutral-100 !bg-transparent !ring-transparent hover:!text-neutral-300 focus:!text-info': props.link },

      // Plain Button
      { 'text-neutral-200 bg-neutral-800 ring-1 ring-neutral-700': props.plain && !props.outlined && !props.text },
      // Plain Text Button
      { 'text-neutral-200': props.plain && props.text },
      // Plain Outlined Button
      { 'text-neutral-200 ring-1 ring-neutral-200': props.plain && props.outlined },

      // Text Button
      { 'bg-transparent ring-transparent': props.text && !props.plain },

      // Outlined Button
      { 'bg-transparent': props.outlined && !props.plain },

      // --- Severity Buttons ---

      // Primary Button
      {
        'text-neutral-100': !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
        'bg-primary': !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-primary-light': !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
      },
      // Primary Text Button
      { 'text-primary-light hover:bg-primary-light/25': props.text && props.severity === null && !props.plain },
      // Primary Outlined Button
      { 'text-primary-light ring-1 ring-primary hover:bg-primary-light/25': props.outlined && props.severity === null && !props.plain },

      // Secondary Button
      {
        'text-secondary-light': props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
        'bg-secondary': props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-secondary-light/25': props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
      },
      // Secondary Text Button
      { 'text-secondary-light hover:bg-secondary-light/25': props.text && props.severity === 'secondary' && !props.plain },
      // Secondary Outlined Button
      {
        'text-secondary-light ring-1 ring-secondary-light hover:bg-secondary':
          props.outlined && props.severity === 'secondary' && !props.plain,
      },

      // Success Button
      {
        'text-neutral-100': props.severity === 'success' && !props.text && !props.outlined && !props.plain,
        'bg-success-dark': props.severity === 'success' && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-success': props.severity === 'success' && !props.text && !props.outlined && !props.plain,
      },
      // Success Text Button
      { 'text-success hover:bg-success/25': props.text && props.severity === 'success' && !props.plain },
      // Success Outlined Button
      {
        'text-success ring-1 ring-success hover:bg-success/25': props.outlined && props.severity === 'success' && !props.plain,
      },

      // Info Button
      {
        'text-neutral-900': props.severity === 'info' && !props.text && !props.outlined && !props.plain,
        'bg-info': props.severity === 'info' && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-neutral-100/50': props.severity === 'info' && !props.text && !props.outlined && !props.plain,
      },
      // Info Text Button
      { 'text-info hover:bg-info/25': props.text && props.severity === 'info' && !props.plain },
      // Info Outlined Button
      { 'text-info ring-1 ring-info hover:bg-info/25 ': props.outlined && props.severity === 'info' && !props.plain },

      // Warning Button
      {
        'text-neutral-900': props.severity === 'warning' && !props.text && !props.outlined && !props.plain,
        'bg-warning': props.severity === 'warning' && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-warning-dark': props.severity === 'warning' && !props.text && !props.outlined && !props.plain,
      },
      // Warning Text Button
      { 'text-warning hover:bg-warning/25': props.text && props.severity === 'warning' && !props.plain },
      // Warning Outlined Button
      { 'text-warning ring-1 ring-warning hover:bg-warning/25': props.outlined && props.severity === 'warning' && !props.plain },

      // Contrast Button
      {
        'text-neutral-300': props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
        'bg-neutral-800': props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-neutral-700': props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
      },
      // Contrast Text Button
      { 'text-neutral-300 hover:bg-neutral-700/25': props.text && props.severity === 'contrast' && !props.plain },
      // Contrast Outlined Button
      {
        'text-neutral-300 ring-1 ring-neutral-300 hover:bg-neutral-700/25': props.outlined && props.severity === 'contrast' && !props.plain,
      },

      // Error Button
      {
        'text-neutral-900': props.severity === 'danger' && !props.text && !props.outlined && !props.plain,
        'bg-error': props.severity === 'danger' && !props.text && !props.outlined && !props.plain,
        'ring-1 ring-error-dark': props.severity === 'danger' && !props.text && !props.outlined && !props.plain,
      },
      // Error Text Button
      { 'text-error hover:bg-error/25': props.text && props.severity === 'danger' && !props.plain },
      // Error Outlined Button
      { 'text-error ring-1 ring-error hover:bg-error/25': props.outlined && props.severity === 'danger' && !props.plain },

      // --- Severity Button States ---
      'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-offset-neutral-900',
      { 'focus:ring-offset-2': !props.link && !props.plain && !props.outlined && !props.text },

      // Link
      { 'focus:ring-neutral-200': props.link },

      // Plain
      { 'hover:bg-neutral-700 hover:ring-gray-600': props.plain && !props.outlined && !props.text },
      // Text & Outlined Button
      { 'hover:bg-neutral-800/25': props.plain && (props.text || props.outlined) },

      // Primary
      {
        'hover:bg-primary-light': !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
      },
      { 'focus:ring-primary-light': props.severity === null },
      // Text & Outlined Button
      { 'focus:bg-primary-light/25': (props.text || props.outlined) && props.severity === null && !props.plain },

      // Secondary
      {
        'hover:bg-surface-600 hover:ring-surface-600': props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
      },
      { 'focus:ring-secondary-light/25': props.severity === 'secondary' },
      // Text & Outlined Button
      { 'focus:bg-secondary-light/25': (props.text || props.outlined) && props.severity === 'secondary' && !props.plain },

      // Success
      {
        'hover:bg-success/75 hover:ring-success':
          !props.link && props.severity === 'success' && !props.text && !props.outlined && !props.plain,
      },
      // Text & Outlined Button
      { 'hover:bg-success/25 focus:bg-success/25': (props.text || props.outlined) && props.severity === 'success' && !props.plain },

      // Info
      {
        'hover:bg-info/75 hover:ring-info': !props.link && props.severity === 'info' && !props.text && !props.outlined && !props.plain,
      },
      // Text & Outlined Button
      { 'hover:bg-info/25 focus:bg-info/25': (props.text || props.outlined) && props.severity === 'info' && !props.plain },

      // Warning
      {
        'hover:bg-warning/75 hover:ring-warning':
          !props.link && props.severity === 'warning' && !props.text && !props.outlined && !props.plain,
      },
      // Text & Outlined Button
      { 'hover:bg-warning/25 focus:bg-warning/25': (props.text || props.outlined) && props.severity === 'warning' && !props.plain },

      // Contrast
      {
        'hover:bg-neutral-700 hover:ring-neutral-600':
          !props.link && props.severity === 'contrast' && !props.text && !props.outlined && !props.plain,
      },
      // Text & Outlined Button
      {
        'hover:bg-neutral-700/25 focus:bg-neutral-700/25': (props.text || props.outlined) && props.severity === 'contrast' && !props.plain,
      },

      // Error
      {
        'hover:bg-error/75 hover:ring-error': !props.link && props.severity === 'danger' && !props.text && !props.outlined && !props.plain,
      },
      // Text & Outlined Button
      { 'hover:bg-error/25 focus:bg-error/25': (props.text || props.outlined) && props.severity === 'danger' && !props.plain },

      // Disabled
      { 'opacity-60 pointer-events-none cursor-default': context.disabled },

      // Transitions
      'transition ease-in-out',

      // Misc
      'cursor-pointer overflow-hidden select-none',
    ],
  }),
  label: ({ props, instance }) => ({
    class: [
      {
        underline: props.link,
      },
      { 'flex-1': props.label !== null, 'invisible w-0': props.label == null },
      { 'line-clamp-1 break-all': instance.$attrs.truncate },
    ],
  }),
  icon: ({ props }) => ({
    class: [
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'mb-2': props.iconPos == 'top' && props.label != null,
        'mt-2': props.iconPos == 'bottom' && props.label != null,
      },
    ],
  }),
  loadingIcon: ({ props }) => ({
    class: [
      'h-3 w-3',
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'mb-2': props.iconPos == 'top' && props.label != null,
        'mt-2': props.iconPos == 'bottom' && props.label != null,
      },
      'animate-spin',
    ],
  }),
  badge: ({ props }) => ({
    class: [{ 'ml-2 w-4 h-4 leading-none flex items-center justify-center': props.badge }],
  }),
};

export default Button;