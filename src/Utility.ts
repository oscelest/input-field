export function moveIndex(offset: number, current_index: number, length: number) {
  current_index = Math.min(length, Math.max(0, current_index));
  offset %= length;
  return (length + current_index + offset) % length;
}

export function getInputFromIndex(index?: number, list?: HTMLCollection | Array<Element>) {
  if (index === undefined) return "";
  if (list instanceof HTMLCollection) list = [...list];
  return getElementText(list?.at(index));
}

export function getIndexFromInput(input?: string, list?: HTMLCollection | Array<Element>) {
  if (input === undefined) return -1;
  if (list instanceof HTMLCollection) list = [...list];
  for (let i = 0; i < (list?.length ?? 0); i++) {
    const element = list?.at(i);
    if (element && input === getElementText(element).toLowerCase()) return i;
  }
  return -1;
}

export function getElementText(element?: Element | null) {
  return element?.textContent ?? "";
}

export function getIndexOfElement(element: Element) {
  return Array.prototype.indexOf.call(element.parentElement?.children ?? [], element);
}
