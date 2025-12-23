import { type Directive } from 'vue';
import { useTextareaAutoResize } from './useTextareaAuto';

// Define an interface to extend HTMLTextAreaElement with _destroyAutoResize
interface AutoResizeTextAreaElement extends HTMLTextAreaElement {
  _destroyAutoResize?: () => void; // Optional property to store the cleanup function
}

// Define the auto-resize directive
const autoResizeDirective: Directive<HTMLTextAreaElement> = {
  mounted(el: HTMLTextAreaElement) {
    // Cast the element to AutoResizeTextAreaElement to add the _destroyAutoResize property
    const autoResizeEl = el as AutoResizeTextAreaElement;

    const { destroy } = useTextareaAutoResize(autoResizeEl);

    // Attach the cleanup function to the custom property
    autoResizeEl._destroyAutoResize = destroy;
  },
  unmounted(el: HTMLTextAreaElement) {
    // Cast the element to AutoResizeTextAreaElement to access the _destroyAutoResize property
    const autoResizeEl = el as AutoResizeTextAreaElement;

    // Call the cleanup function if it exists
    if (autoResizeEl._destroyAutoResize) {
      autoResizeEl._destroyAutoResize();
    }
  }
};

// Function to register the directive globally
export function registerGlobalDirectives(app: any) {
  app.directive('auto-resize', autoResizeDirective); // Register the directive globally
}