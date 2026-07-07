export function debounce<T extends (...args: never[]) => void>(callback: T, delayMs: number): T {
  let timeoutId: number | undefined;

  return ((...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => callback(...args), delayMs);
  }) as T;
}

export function uniqueElements(elements: HTMLElement[]): HTMLElement[] {
  return Array.from(new Set(elements));
}

export function getVisibleText(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".log-badge, .log-panel").forEach((node) => node.remove());
  return clone.innerText.trim();
}

export function insertAfter(target: HTMLElement, node: HTMLElement): void {
  target.insertAdjacentElement("afterend", node);
}
