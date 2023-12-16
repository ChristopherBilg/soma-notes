// Copyright 2023-Present Soma Notes
export const getTextBoundingRect = (
  input: HTMLTextAreaElement,
  selectionStart: number,
  selectionEnd: number,
  debug: boolean,
) => {
  // Basic parameter validation
  if (!input || !("value" in input)) return input;

  if (typeof selectionStart === "string") {
    selectionStart = parseFloat(selectionStart);
  } else if (typeof selectionStart != "number" || isNaN(selectionStart)) {
    selectionStart = 0;
  }

  if (selectionStart < 0) selectionStart = 0;
  else selectionStart = Math.min(input.value.length, selectionStart);

  if (typeof selectionEnd === "string") {
    selectionEnd = parseFloat(selectionEnd);
  } else if (
    typeof selectionEnd != "number" || isNaN(selectionEnd) ||
    selectionEnd < selectionStart
  ) {
    selectionEnd = selectionStart;
  }

  if (selectionEnd < 0) selectionEnd = 0;
  else selectionEnd = Math.min(input.value.length, selectionEnd);

  // If available (thus IE), use the createTextRange method
  // @ts-ignore Property createTextRange does indeed exist on type 'HTMLTextAreaElement'
  if (typeof input?.createTextRange === "function") {
    // @ts-ignore Property createTextRange does indeed exist on type 'HTMLTextAreaElement'
    const range = input.createTextRange();
    range.collapse(true);
    range.moveStart("character", selectionStart);
    range.moveEnd("character", selectionEnd - selectionStart);
    return range.getBoundingClientRect();
  }

  // createTextRange is not supported, create a fake text range
  const offset = getInputOffset();
  const width = getInputCSS("width", true);
  const height = getInputCSS("height", true);
  let topPos = offset.top;
  let leftPos = offset.left;

  // Styles to simulate a node in an input field
  const listOfModifiers = [
    "direction",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-variant",
    "font-weight",
    "font-style",
    "letter-spacing",
    "line-height",
    "text-align",
    "text-indent",
    "text-transform",
    "word-wrap",
    "word-spacing",
  ];
  let cssDefaultStyles = "white-space: pre; padding: 0; margin: 0;";

  topPos += getInputCSS("padding-top", true) as number;
  topPos += getInputCSS("border-top-width", true) as number;
  leftPos += getInputCSS("padding-left", true) as number;
  leftPos += getInputCSS("border-left-width", true) as number;
  leftPos += 1; // Seems to be necessary

  for (let i = 0; i < listOfModifiers.length; i++) {
    const property = listOfModifiers[i];
    cssDefaultStyles += property + ":" + getInputCSS(property) + ";";
  }

  const text = input.value;
  const textLen = text.length;
  const fakeClone = document.createElement("div");
  const fakeRange = appendPart(selectionStart, selectionEnd);

  if (selectionStart > 0) appendPart(0, selectionStart);
  if (textLen > selectionEnd) appendPart(selectionEnd, textLen);

  // Styles to inherit the font styles of the element
  fakeClone.style.cssText = cssDefaultStyles;

  // Styles to position the text node at the desired position
  fakeClone.style.position = "absolute";
  fakeClone.style.top = topPos + "px";
  fakeClone.style.left = leftPos + "px";
  fakeClone.style.width = width + "px";
  fakeClone.style.height = height + "px";
  document.body.appendChild(fakeClone);
  const returnValue = fakeRange.getBoundingClientRect(); // Get rect

  if (!debug) fakeClone?.parentNode?.removeChild(fakeClone); // Remove temp
  return returnValue;

  // Local functions for readability of the following code
  function appendPart(start: number, end: number) {
    const span = document.createElement("span");

    span.style.cssText = cssDefaultStyles; // Force styles to prevent unexpected results
    span.textContent = text.substring(start, end);

    fakeClone.appendChild(span);
    return span;
  }

  // Computing offset position
  function getInputOffset() {
    const body = document.body;
    const win = document.defaultView;
    const docElem = document.documentElement;
    let box: HTMLDivElement | DOMRect = document.createElement("div");

    box.style.paddingLeft = box.style.width = "1px";
    body.appendChild(box);
    const isBoxModel = box.offsetWidth === 2;
    body.removeChild(box);
    box = input.getBoundingClientRect();

    const clientTop = docElem.clientTop || body.clientTop || 0;
    const clientLeft = docElem.clientLeft || body.clientLeft || 0;
    const scrollTop = win?.pageYOffset || isBoxModel && docElem.scrollTop ||
      body.scrollTop;
    const scrollLeft = win?.pageXOffset || isBoxModel && docElem.scrollLeft ||
      body.scrollLeft;

    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft,
    };
  }

  function getInputCSS(prop: string, isnumber?: boolean) {
    const val = document.defaultView?.getComputedStyle(input, null)
      .getPropertyValue(prop);

    return isnumber ? parseFloat(val || "") : val;
  }
};

export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
