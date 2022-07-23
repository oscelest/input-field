import React, {useRef, useState, HTMLProps, useEffect} from "react";
import InputFieldType from "./InputFieldType";
import {getElementText, getIndexFromInput, getInputFromIndex, getIndexOfElement} from "../Utility";
import {EllipsisText} from "@noxy/react-ellipsis-text";
import Style from "./InputField.module.css";

function InputField(props: InputFieldProps) {
  // States to check how component should be rendered
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);

  // Inputs to keep track of field data
  const [dropdown_input, setDropdownInput] = useState("");
  const [internal_index, setInternalIndex] = useState<number>(-1);
  const [internal_input, setInternalInput] = useState<string>("");

  const ref_input = useRef<HTMLInputElement>(null);
  const ref_dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => { props.input !== undefined && setInternalInput(String(props.input)); }, [props.input]);
  useEffect(() => { props.index !== undefined && setInternalIndex(props.index);}, [props.index]);

  const current_input = dropdown_input || internal_input;
  const type = props.type ?? InputFieldType.TEXT;
  const label = props.label?.trim() ? props.label : "\u00A0";

  const is_focus = hover || focus || current_input || props.error;

  const min_max = {} as Pick<HTMLProps<HTMLInputElement>, "min" | "minLength" | "max" | "maxLength">;
  if (props.min) min_max[type === InputFieldType.NUMBER ? "min" : "minLength"] = props.min;
  if (props.max) min_max[type === InputFieldType.NUMBER ? "max" : "maxLength"] = props.max;


  const classes = [Style.Component, "input-field"];
  if (props.className) classes.push(props.className);
  if (is_focus) classes.push("active");

  const {autoComplete, autoFocus, name, readonly, disabled} = props;
  const {onMouseOver, onMouseUp, onMouseOut, onMouseDown, onMouseMove, onWheel, onDoubleClick, onMouseEnter, onMouseLeave, onFocus, onBlur, onClick} = props;
  const {onCut, onCopy, onPaste} = props;

  return (
    <label className={classes.join(" ")} data-caret={props.caret}
           onMouseEnter={onComponentMouseEnter} onMouseLeave={onComponentMouseLeave} onFocus={onComponentFocus} onBlur={onComponentBlur} onMouseUp={onComponentMouseUp} onMouseDown={onMouseDown}
           onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseMove={onMouseMove} onWheel={onWheel} onClick={onClick} onDoubleClick={onDoubleClick}>

      <div className={"input-field-title"}>
        {!!props.required && <span className={"input-field-required"}/>}
        <EllipsisText>{label}</EllipsisText>
      </div>

      <input ref={ref_input} className={"input-field-value"} value={current_input} type={type} {...min_max}
             autoComplete={autoComplete} autoFocus={autoFocus} name={name} readOnly={readonly} disabled={disabled}
             onKeyDown={onInputKeyDown} onChange={onInputValueChange} onCut={onCut} onCopy={onCopy} onPaste={onPaste}/>

      {renderError()}
      {renderDropDown()}

    </label>
  );

  function renderError() {
    if (!props.error) return null;

    const error = props.error instanceof Error ? props.error.message : props.error;

    return (
      <span className="input-field-error">{error}</span>
    );
  }

  function renderDropDown() {
    if (!React.Children.count(props.children)) return null;

    const classes = ["input-field-dropdown"];
    if (dropdown) classes.push("active");

    return (
      <div ref={ref_dropdown} className={classes.join(" ")} onMouseLeave={onDropdownMouseLeave}>
        {React.Children.map(props.children, renderChild)}
      </div>
    );
  }

  function renderChild(child: React.ReactNode, key: number = 0) {
    const classes = ["input-field-dropdown-option"];
    if (key === internal_index) classes.push("active");

    return (
      <div className={classes.join(" ")} key={key} onMouseDown={onDropdownMouseDown} onMouseUp={onDropdownMouseUp} onMouseEnter={onDropdownMouseEnter}>
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
    setDropdownInput("");
    onBlur?.(event);
    if (dropdown) commit(internal_input, internal_index);
  }

  function onDropdownMouseEnter(event: React.MouseEvent) {
    setIndex(getIndexOfElement(event.currentTarget));
  }

  function onDropdownMouseLeave(event: React.MouseEvent) {
    if (dropdown) setIndex(-1);
  }

  function onDropdownMouseDown(event: React.MouseEvent) {
    event.preventDefault();
  }

  function onDropdownMouseUp(event: React.MouseEvent) {
    if (event.button !== 0) return;
    event.preventDefault();
    setDropdown(false);
    const index = getIndexOfElement(event.currentTarget);
    const input = getInputFromIndex(index, ref_dropdown.current?.children);
    props.onCommit?.(input, index);
  }

  function onComponentMouseUp(event: React.MouseEvent<HTMLLabelElement>) {
    if (!dropdown) setDropdown(true);
    onMouseUp?.(event);
  }

  function onInputValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (props.filter && !event.target.value.match(props.filter)) return props.onFilter?.(event);

    setDropdownInput("");
    const input = setInput(event.target.value);
    setIndex(getIndexFromInput(input, ref_dropdown.current?.children));
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
        setIndex(offsetIndex(-1));
        break;
      case "ArrowDown":
        setIndex(offsetIndex(internal_index < 0 ? 0 : 1));
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
    commit(internal_input, getIndexFromInput(internal_input, ref_dropdown.current?.children));
  }

  function handleKeydownEnter() {
    if (dropdown) {
      if (internal_index && internal_index > -1) {
        commit(getInputFromIndex(internal_index, ref_dropdown.current?.children), internal_index);
      }
      else {
        commit(internal_input, getIndexFromInput(internal_input, ref_dropdown.current?.children));
      }
    }
    else if (React.Children.count(props.children)) {
      setDropdown(true);
    }
    else {
      commit(internal_input, getIndexFromInput(internal_input, ref_dropdown.current?.children));
    }
  }

  function handleKeydownTab() {
    if (dropdown) {
      if (internal_index && internal_index > -1) {
        commit(getInputFromIndex(internal_index, ref_dropdown.current?.children), internal_index);
      }
      else {
        commit(internal_input, getIndexFromInput(internal_input, ref_dropdown.current?.children));
      }
    }
    else {
      commit(internal_input, getIndexFromInput(internal_input, ref_dropdown.current?.children));
    }
  }

  function commit(input: string, index: number) {
    if (props.onCommit) {
      const result = props.onCommit?.(internal_input, internal_index);
      if (result?.input !== undefined) input = String(result.input);
      if (result?.index !== undefined) index = result.index;
    }
    setDropdown(false);
    setDropdownInput("");
    setInternalInput(input);
    setInternalIndex(index);
  }

  function setInput(input: string) {
    if (props.onInputChange) {
      const result = props.onInputChange(input);
      if (result !== undefined) input = String(result);
    }

    setDropdown(true);
    setInternalInput(input);
    return input;
  }

  function setIndex(index: number) {
    if (props.onIndexChange) {
      const result = props.onIndexChange(index);
      if (result !== undefined) index = result;
    }

    setInternalIndex(index);
    setDropdownInput(getElementText(ref_dropdown.current?.children.item(index)));
    if (index > -1) setDropdown(true);
    return index;
  }

  function offsetIndex(offset: number) {
    const length = React.Children.toArray(props.children).length;
    const current_index = Math.min(length, Math.max(0, internal_index));
    offset %= length;
    return (length + current_index + offset) % length;
  }
}

export interface InputFieldProps extends React.PropsWithChildren {
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
  input?: string | number;
  index?: number;
  caret?: boolean;

  onInputChange?(input: string): void | string | number;
  onIndexChange?(index: number): void | number;
  onCommit?(input: string, index: number): void | {input?: string | number, index?: number};
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
