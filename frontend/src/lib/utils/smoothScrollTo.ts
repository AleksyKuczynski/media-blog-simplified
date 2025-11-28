// src/main/lib/utils/smoothScrollTo.ts
export function smoothScrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }