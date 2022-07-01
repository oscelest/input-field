import Style from "./InputField.module.scss";
import React, {useRef, useCallback, CSSProperties, useState} from "react";
import InputFieldType from "./InputFieldType";

function InputField(props: InputFieldProps) {
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [temp_input, setTempInput] = useState<string>("");

  const ref_input = useRef<HTMLInputElement>(null);
  const ref_dropdown = useRef<HTMLDivElement>(null);
  const type = props.type ?? InputFieldType.TEXT;
  const input = temp_input || props.input;

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      props.onInputChange?.(input);
      props.onIndexChange?.(getIndexFromInput(input, ref_dropdown.current?.children));
      setTempInput("");
    },
    [props.input]
  );

  const onMouseEnter = useCallback((event: React.MouseEvent) => setHover(true), []);
  const onMouseLeave = useCallback((event: React.MouseEvent) => setHover(false), []);

  const onDropdownMouseEnter = useCallback((event: React.MouseEvent) => {
    changeIndex(getIndexOfElement(event.currentTarget));
  },
    [props.index]
  );
  const onDropdownMouseLeave = useCallback((event: React.MouseEvent) => {
    props.onIndexChange?.(-1)
    setTempInput("");
  }, [props.index]);
  const onDropdownMouseDown = useCallback((event: React.MouseEvent) => {
    
  }, [props.index]);

  const onFocus = useCallback((event: React.FocusEvent) => {
    setFocusAndDropdown(true);
  }, []);

  const onBlur = useCallback((event: React.FocusEvent) => {
    setFocusAndDropdown(false);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.code) {
      case "Escape":
        ref_input.current?.blur();
        return;
      case "ArrowUp":
        event.preventDefault();
        return changeIndex(moveIndex(-1, props.index ?? 0, getDropdownLength()));
      case "ArrowDown":
        event.preventDefault();
        return changeIndex(moveIndex(props.index === undefined || props.index < 0 ? 0 : 1, props.index ?? 0, getDropdownLength()));
      case "Enter":
      case "NumpadEnter":
        return;
      case "Tab":
        return commit();
      case "Space":
        return;
    }
  }, [props.index, props.input]);

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
    <label className={Style.Component} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
      <span className={title_class.join(" ")}>{props.label}</span>
      <input ref={ref_input} className={input_class.join(" ")} value={input} type={type} onKeyDown={onKeyDown} onChange={onChange} />
      <div ref={ref_dropdown} className={dropdown_class.join(" ")} onMouseLeave={onDropdownMouseLeave}>
        {React.Children.map(props.children, renderChild)}
      </div>
    </label>
  );

  function renderChild(child: React.ReactNode, index: number = 0) {
    const classes = [Style.Option];
    if (index === props.index) classes.push(Style.Active)

    return (
      <div className={classes.join(" ")} key={index} onMouseDown={onDropdownMouseDown} onMouseEnter={onDropdownMouseEnter}>
        {child}
      </div>
    );
  }

  function commit(value: string) {
    props.onCommit(value, getIndexFromInput(value, ref_dropdown.current?.children));
  }

  function changeIndex(index: number) {
    props.onIndexChange?.(index);
    setTempInput(getElementText(ref_dropdown.current?.children.item(index)));
  }

  function getDropdownLength() {
    return React.Children.toArray(props.children).length
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

function getIndexFromInput(input: string, list: HTMLCollection | Array<Element> = []) {
  if (list instanceof HTMLCollection) list = [...list];
  for (let i = 0; i < list.length; i++) {
    const element = list.at(i);
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
