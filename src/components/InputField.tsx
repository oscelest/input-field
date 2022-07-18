import React, {useRef, useState, HTMLProps} from "react";
import InputFieldType from "./InputFieldType";
import {getElementText, getIndexFromInput, getInputFromIndex, getIndexOfElement} from "../Utility";
import "./InputField.css";
import {EllipsisText} from "@noxy/react-ellipsis-text";

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
  const label = props.label?.trim() ? props.label : "\u00A0";
  const error = props.error instanceof Error ? props.error.message : props.error;

  const min_max = {} as Pick<HTMLProps<HTMLInputElement>, "min" | "minLength" | "max" | "maxLength">;
  if (props.min) min_max[type === InputFieldType.NUMBER ? "min" : "minLength"] = props.min;
  if (props.max) min_max[type === InputFieldType.NUMBER ? "max" : "maxLength"] = props.max;

  let input: string = (props as InputFieldInputProps).input?.toString();
  let {onInputChange} = props as InputFieldInputProps;
  if (input === undefined) input = internal_input;
  if (onInputChange === undefined) onInputChange = setInternalInput;

  let {index, onIndexChange} = props as InputFieldIndexProps;
  if (onIndexChange === undefined) onIndexChange = setInternalIndex;
  if (index === undefined) index = internal_index;

  const component_value = temp_input || input;
  const is_focus = hover || focus || input || error;

  const dropdown_class = ["input-field-dropdown"];
  if (dropdown) dropdown_class.push("active");

  const classes = ["input-field"];
  if (props.className) classes.push(props.className);
  if (is_focus) classes.push("active");

  const {autoComplete, autoFocus, name, readonly, disabled} = props;
  const {onMouseOver, onMouseUp, onMouseOut, onMouseDown, onMouseMove, onWheel, onDoubleClick, onMouseEnter, onMouseLeave, onFocus, onBlur, onClick} = props;
  const {onCut, onCopy, onPaste} = props;

  return (
    <label className={classes.join(" ")} onMouseEnter={onComponentMouseEnter} onMouseLeave={onComponentMouseLeave} onFocus={onComponentFocus} onBlur={onComponentBlur}
           onMouseUp={onComponentMouseUp} onMouseDown={onMouseDown} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseMove={onMouseMove} onWheel={onWheel}
           onClick={onClick} onDoubleClick={onDoubleClick}>

      <div className={"input-field-title"}>
        {!!props.required && <span className={"input-field-required"}/>}
        <EllipsisText>{label}</EllipsisText>
      </div>

      <input ref={ref_input} className={"input-field-value"} value={component_value} type={type} {...min_max}
             autoComplete={autoComplete} autoFocus={autoFocus} name={name} readOnly={readonly} disabled={disabled}
             onKeyDown={onInputKeyDown} onChange={onInputValueChange} onCut={onCut} onCopy={onCopy} onPaste={onPaste}/>

      {!!error && <span className="input-field-error">{error}</span>}

      <div ref={ref_dropdown} className={dropdown_class.join(" ")} onMouseLeave={onDropdownMouseTransition}>
        {React.Children.map(props.children, renderChild)}
      </div>

    </label>
  );

  function renderChild(child: React.ReactNode, key: number = 0) {
    const classes = ["input-field-dropdown-option"];
    if (key === index) classes.push("active");

    return (
      <div className={classes.join(" ")} key={key} onMouseDown={onDropdownMouseDown} onMouseUp={onDropdownMouseUp} onMouseEnter={onDropdownMouseTransition}>
        {child}
      </div>
    );
  }

  function onComponentMouseEnter(event: React.MouseEvent<HTMLLabelElement>) {
    setHover(event.type === "mouseenter");
    onMouseEnter?.(event);
  }

  function onComponentMouseLeave(event: React.MouseEvent<HTMLLabelElement>) {
    setHover(event.type === "mouseenter");
    onMouseLeave?.(event);
  }

  function onComponentFocus(event: React.FocusEvent<HTMLLabelElement>) {
    setFocus(true);
    setDropdown(true);
    onFocus?.(event);
  }

  function onComponentBlur(event: React.FocusEvent<HTMLLabelElement>) {
    setFocus(false);
    setDropdown(false);
    onBlur?.(event);
    props.onCommit?.(input, index);
  }

  function onDropdownMouseTransition(event: React.MouseEvent) {
    setIndex(event.type === "mouseenter" ? getIndexOfElement(event.currentTarget) : -1);
  }

  function onDropdownMouseDown(event: React.MouseEvent) {
    event.preventDefault();
  }

  function onDropdownMouseUp(event: React.MouseEvent) {
    if (event.button !== 0) return;
    event.preventDefault();
    const index = getIndexOfElement(event.currentTarget);
    const input = getInputFromIndex(index, ref_dropdown.current?.children);
    props.onCommit?.(input, index);
    setDropdown(false);
  }

  function onComponentMouseUp(event: React.MouseEvent<HTMLLabelElement>) {
    if (ref_collapsed.current) setDropdown(true);
    onMouseUp?.(event);
  }

  function onInputValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (props.filter && !event.target.value.match(props.filter)) return props.onFilter?.(event);

    const input = event.target.value;
    const index = getIndexFromInput(input, ref_dropdown.current?.children);
    onInputChange(input);
    onIndexChange(index);
    setTempInput("");
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
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
        return handleKeydownTab();
      default:
        return;
    }
    event.preventDefault();
  }

  function handleKeydownEscape() {
    props.onCommit?.(input, getIndexFromInput(input, ref_dropdown.current?.children));
    setDropdown(false);
    setTempInput("");
  }

  function handleKeydownEnter() {
    if (!ref_collapsed.current) {
      if (index && index > -1) {
        props.onCommit?.(getInputFromIndex(index, ref_dropdown.current?.children), index);
      }
      else {
        props.onCommit?.(input, getIndexFromInput(component_value, ref_dropdown.current?.children));
      }
      setDropdown(false);
    }
    else if (React.Children.count(props.children)) {
      setDropdown(true);
    }
    else {
      props.onCommit?.(input, getIndexFromInput(input, ref_dropdown.current?.children));
      setDropdown(false);
    }
    setTempInput("");
  }

  function handleKeydownTab() {
    if (dropdown) {
      if (index && index > -1) {
        props.onCommit?.(getInputFromIndex(index, ref_dropdown.current?.children), index);
      }
      else {
        props.onCommit?.(input, getIndexFromInput(component_value, ref_dropdown.current?.children));
      }
    }
    else {
      props.onCommit?.(input, getIndexFromInput(input, ref_dropdown.current?.children));
    }
    setTempInput("");
  }

  function setIndex(index: number) {
    onIndexChange(index);
    setTempInput(getElementText(ref_dropdown.current?.children.item(index)));
    if (index > -1) setDropdown(true);
  }

  function offsetIndex(offset: number) {
    const length = React.Children.toArray(props.children).length;
    const current_index = Math.min(length, Math.max(0, index));
    offset %= length;
    return (length + current_index + offset) % length;
  }
}

export type InputFieldProps = InputFieldBaseProps | InputFieldInputProps | InputFieldIndexProps | (InputFieldInputProps & InputFieldIndexProps)

interface InputFieldInputProps extends InputFieldBaseProps {
  input: string | number;
  onInputChange(input: string): void;
}

interface InputFieldIndexProps extends InputFieldBaseProps {
  index: number;
  onIndexChange(index: number): void;
}

interface InputFieldBaseProps extends React.PropsWithChildren {
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  name?: string;
  readonly?: boolean;
  required?: boolean;

  error?: string | Error;
  type?: InputFieldType;
  label?: string;
  filter?: RegExp;

  onCommit?(input: string, index: number): void;
  onBlur?(event: React.FocusEvent<HTMLLabelElement>): void;
  onFocus?(event: React.FocusEvent<HTMLLabelElement>): void;
  onMouseEnter?(event: React.MouseEvent<HTMLLabelElement>): void;
  onMouseLeave?(event: React.MouseEvent<HTMLLabelElement>): void;
  onMouseDown?(event: React.MouseEvent<HTMLLabelElement>): void;
  onMouseUp?(event: React.MouseEvent<HTMLLabelElement>): void;
  onFilter?(event: React.ChangeEvent<HTMLInputElement>): void;

  onCut?(event: React.ClipboardEvent): void;
  onCopy?(event: React.ClipboardEvent): void;
  onPaste?(event: React.ClipboardEvent): void;

  onMouseOver?(event: React.MouseEvent<HTMLLabelElement>): void;
  onMouseMove?(event: React.MouseEvent<HTMLLabelElement>): void;
  onMouseOut?(event: React.MouseEvent<HTMLLabelElement>): void;

  onWheel?(event: React.WheelEvent<HTMLLabelElement>): void;

  onClick?(event: React.MouseEvent<HTMLLabelElement>): void;
  onDoubleClick?(event: React.MouseEvent<HTMLLabelElement>): void;
}

export default InputField;
