import React, {useRef, useCallback, useState} from "react";
import InputFieldType from "./InputFieldType";
import {getElementText, getIndexFromInput, getInputFromIndex, moveIndex, getIndexOfElement} from "../Utility";

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
  const current_input = props.input ?? "";
  const current_index = props.index ?? -1;

  const onComponentBlur = useCallback(() => setFocusAndDropdown(false), []);
  const onComponentFocus = useCallback(() => setFocusAndDropdown(true), []);
  const onComponentMouseEnter = useCallback(() => setHover(true), []);
  const onComponentMouseLeave = useCallback(() => setHover(false), []);

  const onDropdownMouseEnter = useCallback((event: React.MouseEvent) => setIndex(getIndexOfElement(event.currentTarget)), [props.index]);
  const onDropdownMouseLeave = useCallback(() => setIndex(-1), []);
  const onDropdownMouseDown = useCallback((event: React.MouseEvent) => event.preventDefault(), []);
  const onDropdownMouseUp = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const index = getIndexOfElement(event.currentTarget);
    const input = getInputFromIndex(index, ref_dropdown.current?.children);
    props.onCommit(input, index);
    setDropdown(false);
  }, [props.index]);

  const onInputMouseUp = useCallback((event: React.MouseEvent) => event.currentTarget === ref_input.current && setDropdown(true), []);
  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    props.onInputChange?.(input);
    props.onIndexChange?.(getIndexFromInput(input, ref_dropdown.current?.children));
    setTempInput("");
  }, [props.input]);
  const onInputKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
        setIndex(moveIndex(-1, current_index, getDropdownLength()));
        break;
      case "ArrowDown":
        setIndex(moveIndex(current_index < 0 ? 0 : 1, current_index, getDropdownLength()));
        break;
      case "Escape":
        handleKeydownEscape();
        break;
      case "Enter":
      case "NumpadEnter":
        handleKeydownEnter();
        break;
      case "Tab":
        handleKeydownTab();
        break;
      default:
        return;
    }
    event.preventDefault();
  }, [props.index, props.input]);

  const is_focus = hover || focus || props.input;
  const title_class = ["input-field-title"];
  const value_class = ["input-field-value"];
  if (is_focus) {
    title_class.push("active");
    value_class.push("active");
  }

  const dropdown_class = ["input-field-dropdown"];
  if (dropdown) {
    dropdown_class.push("active");
  }

  const classes = ["input-field"];
  if (props.className) classes.push(props.className);

  return (
    <label className={classes.join(" ")} onMouseEnter={onComponentMouseEnter} onMouseLeave={onComponentMouseLeave} onFocus={onComponentFocus} onBlur={onComponentBlur}>
      <span className={title_class.join(" ")}>{props.label}</span>
      <input ref={ref_input} className={value_class.join(" ")} value={input} type={type} onMouseUp={onInputMouseUp} onKeyDown={onInputKeyDown} onChange={onInputChange}/>
      <div ref={ref_dropdown} className={dropdown_class.join(" ")} onMouseLeave={onDropdownMouseLeave}>
        {React.Children.map(props.children, renderChild)}
      </div>
    </label>
  );

  function renderChild(child: React.ReactNode, index: number = 0) {
    const classes = ["react-input-dropdown-option"];
    if (index === props.index) classes.push("active");

    return (
      <div className={classes.join(" ")} key={index} onMouseDown={onDropdownMouseDown} onMouseUp={onDropdownMouseUp} onMouseEnter={onDropdownMouseEnter}>
        {child}
      </div>
    );
  }

  function handleKeydownEscape() {
    props.onCommit(current_input, getIndexFromInput(current_input, ref_dropdown.current?.children));
    setDropdown(false);
    setTempInput("");
  }

  function handleKeydownEnter() {
    if (!ref_collapsed.current) {
      if (props.index && props.index > -1) {
        props.onCommit(getInputFromIndex(props.index, ref_dropdown.current?.children), props.index);
      }
      else {
        props.onCommit(current_input, getIndexFromInput(input, ref_dropdown.current?.children));
      }
      setDropdown(false);
    }
    else if (React.Children.count(props.children)) {
      setDropdown(true);
    }
    else {
      props.onCommit(current_input, getIndexFromInput(current_input, ref_dropdown.current?.children));
      setDropdown(false);
    }
    setTempInput("");
  }

  function handleKeydownTab() {
    if (dropdown) {
      if (props.index && props.index > -1) {
        props.onCommit(getInputFromIndex(props.index, ref_dropdown.current?.children), props.index);
      }
      else {
        props.onCommit(current_input, getIndexFromInput(input, ref_dropdown.current?.children));
      }
    }
    else {
      props.onCommit(current_input, getIndexFromInput(props.input, ref_dropdown.current?.children));
    }
    setTempInput("");
  }

  function setIndex(index: number) {
    props.onIndexChange?.(index);
    setTempInput(getElementText(ref_dropdown.current?.children.item(index)));
    if (index > -1) setDropdown(true);
  }

  function setFocusAndDropdown(value: boolean) {
    setFocus(value);
    setDropdown(value);
  }

  function getDropdownLength() {
    return React.Children.toArray(props.children).length;
  }
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
