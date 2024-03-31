import { CheckboxPassThroughMethodOptions, CheckboxPassThroughOptions } from 'primevue/checkbox';
import { ColumnContext, ColumnPassThroughMethodOptions, ColumnPassThroughOptions, ColumnState } from 'primevue/column';
import { DataTableContext, DataTablePassThroughOptions } from 'primevue/datatable';
import { DropdownPassThroughOptions } from 'primevue/dropdown';
import { RadioButtonPassThroughOptions } from 'primevue/radiobutton';

const DataTable: DataTablePassThroughOptions = {
  root: ({ props }) => ({
    class: [
      'relative',

      // Flex & Alignment
      { 'flex flex-col': props.scrollable && props.scrollHeight === 'flex' },

      // Size
      { 'h-full': props.scrollable && props.scrollHeight === 'flex' },

      // Shape
      'border-spacing-0 border-separate',
    ],
  }),
  loadingOverlay: {
    class: [
      // Position
      'absolute',
      'top-0 left-0',
      'z-20',

      // Flex & Alignment
      'flex items-center justify-center',

      // Size
      'w-full h-full',

      // Color
      'bg-neutral-900/50',

      // Transition
      'transition',
    ],
  },
  loadingIcon: ({ props }) => ({
    class: ['font-symbol', 'animate-spin', 'text-[1.5rem] leading-1 w-6 h-6'],
    'data-icon': props.loadingIcon,
  }),
  wrapper: ({ props }) => ({
    class: [
      { relative: props.scrollable, 'flex flex-col grow': props.scrollable && props.scrollHeight === 'flex' },

      // Size
      { 'h-full': props.scrollable && props.scrollHeight === 'flex' },
    ],
  }),
  header: ({ props }) => ({
    class: [
      'text-body-small',

      // Shape
      props.showGridlines ? 'border-b' : 'border-b border-x-0',

      // Spacing
      'py-3 px-4',

      // Color
      'bg-neutral-800',
      'border-neutral-700',
      'text-neutral-400',
    ],
  }),
  table: {
    class: 'w-full border-spacing-0 border-separate',
  },
  thead: ({ context }: { context: DataTableContext & { scrollable?: boolean } }) => ({
    class: [
      'bg-neutral-800',
      {
        'top-0 z-40 sticky': context.scrollable,
      },
    ],
  }),
  // eslint-disable-next-line
  tbody: ({ instance, context }: { instance: any; context: DataTableContext & { scrollable?: boolean } }) => ({
    class: [
      'border-t border-neutral-700 bg-neutral-800',
      {
        'sticky z-20 text-body-small': instance.frozenRow && context.scrollable,
      },
    ],
  }),
  tfoot: ({ context }: { context: DataTableContext & { scrollable?: boolean } }) => ({
    class: [
      {
        'bottom-0 z-0': context.scrollable,
      },
    ],
  }),
  footer: {
    class: [
      'text-body-small',

      // Shape
      'border-t-0 border-t border-x-0',

      // Spacing
      'px-6 py-3',

      // Color
      'bg-neutral-800',
      'border-neutral-700',
      'text-neutral-400',
    ],
  },
  column: (): ColumnPassThroughOptions => ({
    headerCell: ({ context, props }) => ({
      class: [
        'text-body-small',

        // Position
        { 'sticky z-20 border-b': props.frozen },
        { relative: context.resizable },

        // Alignment
        'text-left',

        // Shape
        { 'border-r last:border-r-0': context?.showGridlines },
        'border-0 border-b border-solid',

        // Spacing
        context?.size === 'small' ? 'py-2.5 px-3' : context?.size === 'large' ? 'py-3 px-6' : 'py-3 px-4',
        // Color
        props.sortable && context.sorted ? 'text-neutral-200' : 'bg-neutral-700/30 text-neutral-400',
        'border-neutral-700',

        // States
        'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',

        // Transition
        { transition: props.sortable },

        // Misc
        { 'cursor-pointer': props.sortable },
        {
          'overflow-hidden space-nowrap bg-clip-padding': context.resizable,
        },
      ],
    }),
    headerContent: {
      class: 'flex items-center',
    },
    sort: ({ context }) => ({
      class: [context.sorted ? 'text-primary-500' : 'text-surface-700'],
    }),
    bodyCell: ({ props, context, state, parent }: ColumnPassThroughMethodOptions & { state: ColumnState }) => ({
      class: [
        //Position
        { 'sticky box-border border-b': parent.instance.frozenRow },
        { 'sticky box-border border-b': props.frozen || props.frozen },
        'text-body-small',

        // Alignment
        'text-left',

        'border-0 border-b border-solid',
        { 'last:border-r-0 border-r border-b': context?.showGridlines },
        { 'bg-neutral-900': parent.instance.frozenRow || props.frozen || props.frozen },

        // Spacing
        { 'py-2.5 px-3': context?.size === 'small' && !state['d_editing'] },
        { 'py-3 px-6': context?.size === 'large' && !state['d_editing'] },
        { 'py-3 px-4': context?.size !== 'large' && context?.size !== 'small' && !state['d_editing'] },
        { 'py-[0.6rem] px-2': state['d_editing'] },

        // Color
        'border-neutral-700',

        // Misc
        'space-nowrap',
      ],
    }),
    footerCell: ({ context }) => ({
      class: [
        // Font
        'font-bold',

        // Alignment
        'text-left',

        // Shape
        { 'border-r last:border-r-0': context?.showGridlines },
        'border-0 border-t border-solid',

        // Spacing
        context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4',

        // Color
        'border-neutral-700',
        'text-surface-700',
        'bg-surface-0',
      ],
    }),
    sortIcon: {
      class: 'ml-2',
    },
    sortBadge: {
      class: [
        // Flex & Alignment
        'flex items-center justify-center align-middle',

        // Shape
        'rounded-full',

        // Size
        'w-[1.143rem] leading-[1.143rem]',

        // Spacing
        'ml-2',

        // Color
        'text-primary-700',
        'bg-primary-50',
      ],
    },
    columnFilter: {
      class: 'inline-flex items-center ml-auto',
    },
    filterOverlay: {
      class: [
        // Position
        'absolute top-0 left-0',
        'mt-2',

        // Shape
        'border-0',
        'rounded-md',
        'shadow-md',

        // Size
        'min-w-[12.5rem]',

        // Color
        'bg-surface-0',
        'text-surface-800',
        'ring-1 ring-inset ring-surface-300',
      ],
    },
    filterMatchModeDropdown: (): DropdownPassThroughOptions => ({
      root: ({ state }) => ({
        class: [
          // Display and Position
          'flex',
          'relative',

          // Spacing
          'mb-2',

          // Shape
          'w-full',
          'rounded-md',
          'shadow-sm',

          // Color and Background
          'bg-surface-0',
          { 'ring-1 ring-inset ring-surface-300': !state.focused },

          // Transitions
          'transition-all',

          // States
          { 'outline-none outline-offset-0 ring-2 ring-primary-500': state.focused },

          // Misc
          'cursor-default',
          'select-none',
        ],
      }),
      input: ({ props }) => ({
        class: [
          //Font
          'font-sans',
          'leading-6',
          'sm:text-sm',

          // Display
          'block',
          'flex-auto',

          // Color and Background
          'bg-transparent',
          'border-0',
          { 'text-surface-800': props.modelValue, 'text-surface-400': !props.modelValue },
          'placeholder:text-surface-400',

          'py-1.5 px-3',

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
    }),
    filterRowItems: {
      class: 'py-1 list-none m-0',
    },
    filterRowItem: ({ context }) => ({
      class: [
        // Font
        'sm:text-sm',
        'leading-none',
        { 'font-normal': !context?.highlighted, 'font-bold': context?.highlighted },

        // Position
        'relative',

        // Shape
        'border-0',
        'rounded-none',

        // Spacing
        'm-0',
        'py-2 px-4',

        // Color
        { 'text-surface-700': !context?.highlighted },
        { 'bg-surface-0 text-surface-700': !context?.highlighted },
        { 'bg-primary-500 text-white': context?.highlighted },

        //States
        'hover:bg-primary-500 hover:text-white',
        'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',

        // Transitions
        'transition-shadow',

        // Misc
        'cursor-pointer',
        'overflow-hidden',
        'whitespace-nowrap',
      ],
    }),
    filterOperator: {
      class: [
        // Spacing
        'p-4',

        // Shape
        'border-b border-solid',
        'rounded-t-md',

        // Color
        'text-surface-700',
        'border-neutral-700',
      ],
    },
    filterOperatorDropdown: (): DropdownPassThroughOptions => ({
      root: ({ state }) => ({
        class: [
          // Display and Position
          'flex',
          'relative',

          // Shape
          'w-full',
          'rounded-md',
          'shadow-sm',

          // Color and Background
          'text-surface-800',
          'placeholder:text-surface-400',
          'bg-surface-0',
          { 'ring-1 ring-inset ring-surface-300': !state.focused },

          // Transitions
          'transition-all',

          // States
          { 'outline-none outline-offset-0 ring-2 ring-primary-500': state.focused },

          // Misc
          'cursor-default',
          'select-none',
        ],
      }),
      input: {
        class: [
          //Font
          'font-sans',
          'leading-6',
          'sm:text-sm',

          // Display
          'block',
          'flex-auto',

          // Color and Background
          'bg-transparent',
          'border-0',
          'text-surface-800',
          'placeholder:text-surface-400',

          'py-1.5 px-3',

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
      },
      trigger: {
        class: [
          // Flexbox
          'flex items-center justify-center',
          'shrink-0',

          // Color and Background
          'bg-transparent',
          'text-surface-500',

          // Size
          'w-12',

          // Shape
          'rounded-tr-md',
          'rounded-br-md',
        ],
      },
      panel: {
        class: [
          // Position
          'absolute top-0 left-0',
          'mt-2',

          // Shape
          'border-0',
          'rounded-md',
          'shadow-md',

          // Size
          'min-w-[12.5rem]',

          // Color
          'bg-surface-0',
          'text-surface-800',
          'ring-1 ring-inset ring-surface-300',
        ],
      },
      list: {
        class: 'py-1 list-none m-0',
      },
      item: ({ context }: { context: ColumnContext }) => ({
        class: [
          // Font
          'sm:text-sm',
          'leading-none',
          { 'font-normal': !context?.highlighted, 'font-bold': context?.highlighted },

          // Position
          'relative',

          // Shape
          'border-0',
          'rounded-none',

          // Spacing
          'm-0',
          'py-2 px-4',

          // Color
          { 'text-surface-700': !context?.highlighted },
          { 'bg-surface-0 text-surface-700': !context?.highlighted },
          { 'bg-primary-500 text-white': context?.highlighted },

          //States
          'hover:bg-primary-500 hover:text-white',

          // Transitions
          'transition-shadow',

          // Misc
          'cursor-pointer',
          'overflow-hidden',
          'whitespace-nowrap',
        ],
      }),
    }),
    filterConstraint: {
      class: [
        // Spacing
        'p-4',

        // Shape
        'border-b border-solid',

        // Color
        'border-neutral-700',
      ],
    },
    filterAddRule: {
      class: 'pt-4 pb-2 px-4',
    },
    filterAddRuleButton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-sm px-2.5 py-1.5 min-w-[2rem] w-full',

          // Shape
          'rounded-md',

          'bg-transparent border-transparent',
          'text-primary-500',
          'hover:bg-primary-300/20',
          'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current',
          'focus:ring-primary-500',

          // Transitions
          'transition ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
      label: {
        class: 'flex-auto grow-0',
      },
      icon: {
        class: 'mr-2',
      },
    },
    filterRemoveButton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-sm px-2.5 py-1.5 min-w-[2rem] w-full mt-2',

          // Shape
          'rounded-md',

          'bg-transparent border-transparent',
          'text-red-500',
          'hover:bg-red-300/20',
          'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current',
          'focus:ring-red-500',

          // Transitions
          'transition ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
      label: {
        class: 'flex-auto grow-0',
      },
      icon: {
        class: 'mr-2',
      },
    },
    filterButtonbar: {
      class: [
        // Flex & Alignment
        'flex items-center justify-between',

        // Space
        'py-4 px-4',
      ],
    },
    filterClearButton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-sm px-2.5 py-1.5 min-w-[2rem]',

          // Shape
          'rounded-md shadow-sm border-0',

          'text-primary-500 ring-1 ring-primary-500 hover:bg-primary-300/20',
          'hover:bg-primary-300/20',
          'focus:ring-primary-500',

          // Transitions
          'transition ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
    },
    filterApplyButton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-sm px-2.5 py-1.5 min-w-[2rem]',

          // Shape
          'rounded-md border-0',

          'text-white',
          'bg-primary-500',
          'ring-1 ring-primary-500',
          'hover:bg-primary-600 hover:ring-primary-600',
          'focus:ring-primary-500',

          // Transitions
          'transition ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
    },
    filterMenuButton: ({ context }) => ({
      class: [
        'relative',
        // Flex & Alignment
        'inline-flex items-center justify-center',

        // Size
        'w-8 h-8',

        // Spacing
        'ml-2',

        // Shape
        'rounded-full',

        // Color
        { 'bg-primary-50 text-primary-700': context.active },

        // States
        'hover:text-surface-700 hover:bg-surface-300/20',
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500',

        // Transition
        'transition',

        // Misc
        'cursor-pointer no-underline overflow-hidden',
      ],
    }),
    headerFilterClearButton: ({ context }) => ({
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Shape
        'border-none',

        // Spacing
        'm-0 p-0 ml-2',

        // Color
        'bg-transparent',

        // Misc
        'cursor-pointer no-underline overflow-hidden select-none',
        {
          invisible: !context.hidden,
        },
      ],
    }),
    rowToggler: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Spacing
        'm-0 p-0',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-500',
        'bg-transparent',
        'focus-visible:outline-none focus-visible:outline-offset-0',
        'focus-visible:ring-2 focus-visible:ring-primary-500',

        // Transition
        'transition',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    columnResizer: {
      class: [
        'block',

        // Position
        'absolute top-0 right-0',

        // Sizing
        'w-2 h-full',

        // Spacing
        'm-0 p-0',

        // Color
        'border border-transparent',

        // Misc
        'cursor-col-resize',
      ],
    },
    rowEditorInitButton: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-700',
        'border-transparent',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500',
        'hover:text-surface-700 hover:bg-surface-300/20',

        // Transition
        'transition',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    rowEditorSaveButton: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-700',
        'border-transparent',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500',
        'hover:text-surface-700 hover:bg-surface-300/20',

        // Transition
        'transition',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    rowEditorCancelButton: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-700',
        'border-transparent',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500',
        'hover:text-surface-700 hover:bg-surface-300/20',

        // Transition
        'transition',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    rowRadioButton: (): RadioButtonPassThroughOptions => ({
      root: {
        class: [
          'relative',

          // Flexbox & Alignment
          'inline-flex',
          'align-bottom',

          // Size
          'w-4 h-4',

          // Misc
          'cursor-default',
          'select-none',
        ],
      },
      box: ({ props }) => ({
        class: [
          // Flexbox
          'flex justify-center items-center',

          // Size
          'w-4 h-4',
          'text-sm',
          'font-medium',

          // Shape
          'border-2',
          'rounded-full',

          // Transition
          'transition ease-in-out',

          // Colors
          {
            'text-surface-700': !props.modelValue,
            'bg-surface-0': !props.modelValue,
            'border-neutral-700': !props.modelValue,
            'border-primary-500': props.modelValue,
          },

          // States
          {
            'outline-none outline-offset-0': !props.disabled,
            'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-0 peer-focus-visible:ring-primary-500':
              !props.disabled,
            'opacity-60 cursor-default': props.disabled,
          },
        ],
      }),
      input: {
        class: [
          'peer',

          // Size
          'w-full ',
          'h-full',

          // Position
          'absolute',
          'top-0 left-0',
          'z-10',

          // Spacing
          'p-0',
          'm-0',

          // Shape
          'opacity-0',
          'rounded-md',
          'outline-none',
          'border-2 border-neutral-700',

          // Misc
          'appearance-none',
          'cursor-default',
        ],
      },
      icon: {
        class: 'hidden',
      },
    }),
    headerCheckbox: (): CheckboxPassThroughOptions => ({
      root: {
        class: [
          'relative',

          // Alignment
          'inline-flex',
          'align-bottom',

          // Size
          'w-4',
          'h-4',

          // Misc
          'cursor-default',
          'select-none',
        ],
      },
      box: ({ props, context }: CheckboxPassThroughMethodOptions & { context: ColumnContext }) => ({
        class: [
          // Alignment
          'flex',
          'items-center',
          'justify-center',

          // Size
          'w-4',
          'h-4',

          // Shape
          'rounded',
          'border',

          // Colors
          'text-surface-600',
          {
            'border-neutral-700 bg-surface-0': !context.checked,
            'border-primary-500 bg-primary-500': context.checked,
          },

          {
            'ring-2 ring-primary-500': !props.disabled && context.focused,
            'cursor-default opacity-60': props.disabled,
          },

          // States
          {
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500': !props.disabled,
            'cursor-default opacity-60': props.disabled,
          },

          // Transitions
          'transition-colors',
        ],
      }),
      input: {
        class: [
          'peer',

          // Size
          'w-full ',
          'h-full',

          // Position
          'absolute',
          'top-0 left-0',
          'z-10',

          // Spacing
          'p-0',
          'm-0',

          // Shape
          'rounded',
          'border',

          // Shape
          'opacity-0',
          'rounded-md',
          'outline-none',
          'border-2 border-neutral-700',

          // Misc
          'appearance-none',
        ],
      },
      icon: {
        class: [
          // Font
          'text-normal',

          // Size
          'w-3',
          'h-3',

          // Colors
          'text-white',

          // Transitions
          'transition-all',
        ],
      },
    }),
    rowCheckbox: (): CheckboxPassThroughOptions => ({
      root: {
        class: [
          'relative',

          // Alignment
          'inline-flex',
          'align-bottom',

          // Size
          'w-4',
          'h-4',

          // Misc
          'cursor-default',
          'select-none',
        ],
      },
      box: ({ props, context }: CheckboxPassThroughMethodOptions & { context: ColumnContext }) => ({
        class: [
          // Alignment
          'flex',
          'items-center',
          'justify-center',

          // Size
          'w-4',
          'h-4',

          // Shape
          'rounded',
          'border',

          // Colors
          'text-surface-600',
          {
            'border-neutral-700 bg-surface-0': !context.checked,
            'border-primary-500 bg-primary-500': context.checked,
          },

          {
            'ring-2 ring-primary-500': !props.disabled && context.focused,
            'cursor-default opacity-60': props.disabled,
          },

          // States
          {
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500': !props.disabled,
            'cursor-default opacity-60': props.disabled,
          },

          // Transitions
          'transition-colors',
        ],
      }),
      input: {
        class: [
          'peer',

          // Size
          'w-full ',
          'h-full',

          // Position
          'absolute',
          'top-0 left-0',
          'z-10',

          // Spacing
          'p-0',
          'm-0',

          // Shape
          'rounded',
          'border',

          // Shape
          'opacity-0',
          'rounded-md',
          'outline-none',
          'border-2 border-neutral-700',

          // Misc
          'appearance-none',
        ],
      },
      icon: {
        class: [
          // Font
          'text-normal',

          // Size
          'w-3',
          'h-3',

          // Colors
          'text-white',

          // Transitions
          'transition-all',
        ],
      },
    }),
  }),
  bodyRow: ({ context, props }) => ({
    class: [
      // Color
      { 'bg-neutral-700': context.selected },
      { 'bg-neutral-800 text-neutral-200': !context.selected },
      {
        'odd:bg-surface-0 odd:text-surface-600 even:bg-surface-50 even:text-surface-600': context.stripedRows && !context.selected,
      },

      // State
      {
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-primary-500 ring-inset': props.selectionMode,
      },
      { 'hover:bg-surface-300/20 hover:text-surface-600': props.selectionMode && !context.selected },

      // Transition
      { transition: (props.selectionMode && !context.selected) || props.rowHover },

      // Misc
      { 'cursor-pointer': props.selectionMode },
    ],
  }),
  rowExpansion: {
    class: 'bg-surface-0 text-surface-600',
  },
  rowGroupHeader: {
    class: ['sticky z-20', 'bg-surface-0 text-surface-600'],
  },
  rowGroupFooter: {
    class: ['sticky z-20', 'bg-surface-0 text-surface-600'],
  },
  resizeHelper: {
    class: 'absolute hidden w-[2px] z-20 bg-primary-500',
  },
  emptyMessageCell: ({ parent }: ColumnPassThroughMethodOptions & { state: ColumnState }) => ({
    class: [
      //Position
      'text-body-small',
      'text-neutral-400',

      // Alignment
      'text-left',

      // Spacing
      { 'py-2.5 px-3': parent.props.size === 'small' },
      { 'py-3 px-6': parent.props.size === 'large' },
      { 'py-3 px-4': parent.props.size !== 'large' && parent.props.size !== 'small' },

      // Border
      'border-0 border-b border-solid',
      'border-neutral-700',

      // Misc
      'space-nowrap',
    ],
  }),
};

export default DataTable;
