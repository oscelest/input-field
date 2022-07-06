
export function getInputFromIndex(index?: number, list?: HTMLCollection | Array<Element>) {
  if (index === undefined) return "";
  if (list instanceof HTMLCollection) list = Array.from(list);
  return getElementText(list?.at(index));
}

export function getIndexFromInput(input?: string, list?: HTMLCollection | Array<Element>) {
  if (input === undefined) return -1;
  if (list instanceof HTMLCollection) list = Array.from(list);
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
