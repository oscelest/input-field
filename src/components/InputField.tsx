import React, {useRef, useCallback, useState} from "react";
import InputFieldType from "./InputFieldType";
import {getElementText, getIndexFromInput, getInputFromIndex, getIndexOfElement} from "../Utility";
import "./InputField.css";

function InputField(props: InputFieldProps) {
  // States to check how component should be rendered
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);

  // Inputs to keep track of field data
  const [temp_input, setTempInput] = useState<string>("");
  const [internal_index, setInternalIndex] = useState<number>(-1);
  const [internal_input, setInternalInput] = useState<string>("");

  const ref_collapsed = useRef<boolean>();
  ref_collapsed.current = !dropdown;

  const ref_input = useRef<HTMLInputElement>(null);
  const ref_dropdown = useRef<HTMLDivElement>(null);
  const type = props.type ?? InputFieldType.TEXT;

  let {input, onInputChange} = props as InputFieldInputProps;
  if (onInputChange === undefined) onInputChange = setInternalInput;
  if (input === undefined) input = internal_input;

  let {index, onIndexChange} = props as InputFieldIndexProps;
  if (onIndexChange === undefined) onIndexChange = setInternalIndex;
  if (index === undefined) index = internal_index;

  const component_value = temp_input || input;

  const onDropdownMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  const onDropdownMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    const index = getIndexOfElement(event.currentTarget);
    const input = getInputFromIndex(index, ref_dropdown.current?.children);
    props.onCommit(input, index);
    setDropdown(false);
  }

  const onInputMouseUp = (event: React.MouseEvent) => {
    if (event.currentTarget === ref_input.current) setDropdown(true);
  }

  const onInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const index = getIndexFromInput(input, ref_dropdown.current?.children);
    onInputChange(input)
    onIndexChange(index)
    setTempInput("");
  }

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
        setIndex(offsetIndex(-1));
        break;
      case "ArrowDown":
        setIndex(offsetIndex(index < 0 ? 0 : 1));
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
  }

  const is_focus = hover || focus || input;
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
    <label className={classes.join(" ")} onMouseEnter={onComponentMouseTransition} onMouseLeave={onComponentMouseTransition} onFocus={onComponentFocusChange} onBlur={onComponentFocusChange}>
      <span className={title_class.join(" ")}>{props.label}</span>
      <input ref={ref_input} className={value_class.join(" ")} value={component_value} type={type} onMouseUp={onInputMouseUp} onKeyDown={onInputKeyDown} onChange={onInputValueChange}/>
      <div ref={ref_dropdown} className={dropdown_class.join(" ")} onMouseLeave={onDropdownMouseTransition}>
        {React.Children.map(props.children, renderChild)}
      </div>
    </label>
  );

  function renderChild(child: React.ReactNode, key: number = 0) {
    const classes = ["react-input-dropdown-option"];
    if (key === index) classes.push("active");

    return (
      <div className={classes.join(" ")} key={key} onMouseDown={onDropdownMouseDown} onMouseUp={onDropdownMouseUp} onMouseEnter={onDropdownMouseTransition}>
        {child}
      </div>
    );
  }

  function onComponentMouseTransition(event: React.MouseEvent) {
    setHover(event.type === "mouseenter");
  }

  function onComponentFocusChange(event: React.FocusEvent) {
    const value = event.type === "focus";
    setFocus(value);
    setDropdown(value);
  }

  function onDropdownMouseTransition(event: React.MouseEvent) {
    setIndex(event.type === "mouseenter" ? getIndexOfElement(event.currentTarget) : -1);
  }

  function handleKeydownEscape() {
    props.onCommit(input, getIndexFromInput(input, ref_dropdown.current?.children));
    setDropdown(false);
    setTempInput("");
  }

  function handleKeydownEnter() {
    if (!ref_collapsed.current) {
      if (index && index > -1) {
        props.onCommit(getInputFromIndex(index, ref_dropdown.current?.children), index);
      }
      else {
        props.onCommit(input, getIndexFromInput(component_value, ref_dropdown.current?.children));
      }
      setDropdown(false);
    }
    else if (React.Children.count(props.children)) {
      setDropdown(true);
    }
    else {
      props.onCommit(input, getIndexFromInput(input, ref_dropdown.current?.children));
      setDropdown(false);
    }
    setTempInput("");
  }

  function handleKeydownTab() {
    if (dropdown) {
      if (index && index > -1) {
        props.onCommit(getInputFromIndex(index, ref_dropdown.current?.children), index);
      }
      else {
        props.onCommit(input, getIndexFromInput(component_value, ref_dropdown.current?.children));
      }
    }
    else {
      props.onCommit(input, getIndexFromInput(input, ref_dropdown.current?.children));
    }
    setTempInput("");
  }

  function setIndex(index: number) {
    onIndexChange(index);
    setTempInput(getElementText(ref_dropdown.current?.children.item(index)));
    if (index > -1) setDropdown(true);
  }

  function getDropdownLength() {
    return React.Children.toArray(props.children).length;
  }

  function offsetIndex(offset: number) {

    const current_index = Math.min(length, Math.max(0, index));
    offset %= length;
    return (length + current_index + offset) % length;
  }

}


export type InputFieldProps = InputFieldInputProps | InputFieldIndexProps | (InputFieldInputProps & InputFieldIndexProps)

interface InputFieldInputProps extends InputFieldBaseProps {
  input: string;
  onInputChange(input: string): void;
}

interface InputFieldIndexProps extends InputFieldBaseProps {
  index: number;
  onIndexChange(index: number): void;
}

interface InputFieldBaseProps extends React.PropsWithChildren {
  className?: string;
  type?: InputFieldType;
  label?: string;
  onCommit(input: string, index: number): void;
}

export default InputField;
