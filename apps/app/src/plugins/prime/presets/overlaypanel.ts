import { OverlayPanelPassThroughOptions } from 'primevue/overlaypanel';

const OverlayPanel: OverlayPanelPassThroughOptions = {
  root: {
    class: [
      // Shape
      'rounded-xs',
      'shadow-md',
      'border-0',

      // Position
      'absolute left-0 top-0 mt-2',
      'z-40 transform origin-center',

      // Color
      'bg-neutral-900',
      'text-neutral-300',
      'ring-1 ring-neutral-700',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 -translate-y-2',
    enterActiveClass: 'transition-[transform,opacity]',
    leaveActiveClass: 'transition-[transform,opacity]',
    leaveToClass: 'opacity-0 -translate-y-2',
  },
};

export default OverlayPanel;
