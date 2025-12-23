export function useTextareaAutoResize(el: HTMLTextAreaElement) {
    function resize() {
      el.style.height = 'auto'; // Reset the height
      el.style.height = `${el.scrollHeight}px`; // Set new height based on scroll height
    }
  
    el.addEventListener('input', resize); // Attach resize on input event
  
    // Initial resize to fit content
    resize();
  
    return {
      destroy() {
        el.removeEventListener('input', resize);
      }
    };
  }
  