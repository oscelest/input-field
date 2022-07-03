import Style from "./InputField.module.scss";
import React, {useRef, useCallback, useState} from "react";
import InputFieldType from "./InputFieldType";

function InputField(props: InputFieldProps) {
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [temp_input, setTempInput] = useState<string>("");
  const ref_collapsed = useRef<boolean>();
  ref_collapsed.current = !dropdown;

  const ref_input = useRef<HTMLInputElement>(null);
  const ref_dropdown = useRef<HTMLDivElement>(null);
  const type = props.type ?? InputFieldType.TEXT;
  const input = temp_input || props.input;

  const onComponentBlur = useCallback((event: React.FocusEvent) => setFocusAndDropdown(false), []);
  const onComponentFocus = useCallback((event: React.FocusEvent) => setFocusAndDropdown(true), []);
  const onComponentMouseEnter = useCallback((event: React.MouseEvent) => setHover(true), []);
  const onComponentMouseLeave = useCallback((event: React.MouseEvent) => setHover(false), []);

  const onDropdownMouseEnter = useCallback((event: React.MouseEvent) => changeIndex(getIndexOfElement(event.currentTarget)), [props.index]);
  const onDropdownMouseLeave = useCallback((event: React.MouseEvent) => changeIndex(-1), []);
  const onDropdownMouseDown = useCallback((event: React.MouseEvent) => event.preventDefault(), []);
  const onDropdownMouseUp = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    commitByIndex(getIndexOfElement(event.currentTarget));
  }, [props.index]);

  const onInputMouseUp = useCallback((event: React.MouseEvent) => event.currentTarget === ref_input.current && setDropdown(true), []);

  const onInputKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
        event.preventDefault();
        setDropdown(true);
        return changeIndex(moveIndex(-1, props.index ?? 0, getDropdownLength()));
      case "ArrowDown":
        event.preventDefault();
        setDropdown(true);
        return changeIndex(moveIndex(props.index === undefined || props.index < 0 ? 0 : 1, props.index ?? 0, getDropdownLength()));
      case "Escape":
        event.preventDefault();
        return handleEscape();
      case "Enter":
      case "NumpadEnter":
        return handleEnter();
      case "Tab":
        return handleTab();
    }
  }, [props.index, props.input]);

  function handleEscape() {
    const input = props.input ?? "";
    props.onCommit(input, getIndexFromInput(input, ref_dropdown.current?.children));
    setDropdown(false);
    setTempInput("");
  }

  function handleEnter() {
    console.log(ref_collapsed.current)
    if (!ref_collapsed.current) {
      if (props.index && props.index > -1) {
        props.onCommit(getInputFromIndex(props.index, ref_dropdown.current?.children), props.index);
      }
      else {
        props.onCommit(props.input ?? "", getIndexFromInput(input, ref_dropdown.current?.children));
      }
      setDropdown(false);
    }
    else if (React.Children.count(props.children)) {
      setDropdown(true);
    }
    else {
      props.onCommit(props.input ?? "", getIndexFromInput(props.input, ref_dropdown.current?.children));
      setDropdown(false);
    }
    setTempInput("");
  }

  function handleTab() {
    if (dropdown) {
      if (props.index && props.index > -1) {
        props.onCommit(getInputFromIndex(props.index, ref_dropdown.current?.children), props.index);
      }
      else {
        props.onCommit(props.input ?? "", getIndexFromInput(input, ref_dropdown.current?.children));
      }
    }
    else {
      props.onCommit(props.input ?? "", getIndexFromInput(props.input, ref_dropdown.current?.children));
    }
    setTempInput("");
  }

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      props.onInputChange?.(input);
      props.onIndexChange?.(getIndexFromInput(input, ref_dropdown.current?.children));
      setTempInput("");
    },
    [props.input]
  );

  const is_focus = hover || focus || props.input;
  const title_class = [Style.Title];
  const input_class = [Style.Input];
  if (is_focus) {
    title_class.push(Style.Active);
    input_class.push(Style.Active);
  }

  const dropdown_class = [Style.Dropdown];
  if (dropdown) {
    dropdown_class.push(Style.Active);
  }

  return (
    <label className={Style.Component} onMouseEnter={onComponentMouseEnter} onMouseLeave={onComponentMouseLeave} onFocus={onComponentFocus} onBlur={onComponentBlur}>
      <span className={title_class.join(" ")}>{props.label}</span>
      <input ref={ref_input} className={input_class.join(" ")} value={input} type={type} onMouseUp={onInputMouseUp} onKeyDown={onInputKeyDown} onChange={onInputChange}/>
      <div ref={ref_dropdown} className={dropdown_class.join(" ")} onMouseLeave={onDropdownMouseLeave}>
        {React.Children.map(props.children, renderChild)}
      </div>
    </label>
  );

  function renderChild(child: React.ReactNode, index: number = 0) {
    const classes = [Style.Option];
    if (index === props.index) classes.push(Style.Active);

    return (
      <div className={classes.join(" ")} key={index} onMouseDown={onDropdownMouseDown} onMouseUp={onDropdownMouseUp} onMouseEnter={onDropdownMouseEnter}>
        {child}
      </div>
    );
  }

  function commitByIndex(index: number) {
    const input = getInputFromIndex(index, ref_dropdown.current?.children);
    props.onCommit(input, index);
    setDropdown(false);
  }

  function commit(input?: string) {
    if (props.index && props.index > -1) {
      props.onCommit(temp_input ?? getInputFromIndex(props.index, ref_dropdown.current?.children), props.index);
    }
    else if (input) {
      props.onCommit(input, getIndexFromInput(input, ref_dropdown.current?.children));
    }
    setDropdown(false);
  }

  function changeIndex(index: number) {
    props.onIndexChange?.(index);
    setTempInput(getElementText(ref_dropdown.current?.children.item(index)));
  }

  function getDropdownLength() {
    return React.Children.toArray(props.children).length;
  }

  function setFocusAndDropdown(value: boolean) {
    setFocus(value);
    setDropdown(value);
  }
}

function moveIndex(offset: number, current_index: number, length: number) {
  current_index = Math.min(length, Math.max(0, current_index));
  offset %= length;
  return (length + current_index + offset) % length;
}

function getInputFromIndex(index?: number, list?: HTMLCollection | Array<Element>) {
  if (index === undefined) return "";
  if (list instanceof HTMLCollection) list = [...list];
  return getElementText(list?.at(index));
}

function getIndexFromInput(input?: string, list?: HTMLCollection | Array<Element>) {
  if (input === undefined) return -1;
  if (list instanceof HTMLCollection) list = [...list];
  for (let i = 0; i < (list?.length ?? 0); i++) {
    const element = list?.at(i);
    if (element && input === getElementText(element).toLowerCase()) return i;
  }
  return -1;
}

function getElementText(element?: Element | null) {
  return element?.textContent ?? "";
}

function getIndexOfElement(element: Element) {
  return Array.prototype.indexOf.call(element.parentElement?.children ?? [], element);
}

export interface InputFieldProps extends React.PropsWithChildren {
  type?: InputFieldType;
  index?: number;
  input?: string;
  className?: string;
  label?: string;
  strict?: boolean;

  onReset?(): void;
  onCommit(input: string, index: number): void;
  onIndexChange?(index: number): void;
  onInputChange?(input: string): void;
}

export default InputField;
