import {FlexEllipsisText} from "@noxy/react-flex-ellipsis-text";
import React, {DetailedHTMLProps, HTMLAttributes, useRef, useState} from "react";
import {InputFieldEventType, InputFieldType, OffsetDirectionType} from "../enums";
import {Utility} from "../modules";
import Style from "./InputField.module.css";
import {InputFieldCaret} from "./InputFieldCaret";
import {InputFieldDropdown} from "./InputFieldDropdown";
import {InputFieldError} from "./InputFieldError";
import {InputFieldRequired} from "./InputFieldRequired";

export function InputField(props: InputFieldProps) {
  // External properties
  let {type, value, index, label, min, max, error, filter, strict, useCaret, children, className, autoComplete, autoFocus, readonly, required, disabled, name, ...component_method_props} = props;
  let {onFilter, onChange, onCut, onCopy, onPaste, onMouseUp, onMouseEnter, onMouseLeave, onFocus, onBlur, ...component_props} = component_method_props;
  
  // States to check how component should be rendered
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  
  // States to keep track of values that either temporary or needs to be reverted to
  const [committedValue, setCommitValue] = useState<string>(Utility.parseValue(value));
  const [committedIndex, setCommitIndex] = useState<number>(Utility.parseIndex(index));
  const [temporaryValue, setTemporaryValue] = useState<string>();
  const [temporaryIndex, setTemporaryIndex] = useState<number>();
  
  // Ref for dropdown element
  const ref_dropdown = useRef<HTMLDivElement>(null);
  
  // Calculate default values
  if (!type || !Utility.InputTypeValueList.includes(type)) type = InputFieldType.TEXT;
  if (!label?.match(/\w+/)) label = "\u00A0";
  
  // Temporary values
  const current_value = Utility.parseValue(temporaryValue ?? value);
  const current_index = Utility.parseIndex(temporaryIndex ?? index);
  
  // Calculate dynamic properties
  const children_count = React.Children.count(children);
  const error_message = Utility.getErrorMessage(error, disabled);
  const min_max = Utility.parseMinMax(type, min, max);
  const show_caret = Utility.getShowCaret(useCaret, children, disabled);
  
  const classes = [Style.Component, "input-field"];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}
         data-hover={hover} data-focus={focus} data-content={!!current_value} data-error={!!error_message} data-readonly={readonly} data-disabled={disabled}
         onMouseEnter={onComponentMouseEnter} onMouseLeave={onComponentMouseLeave} onFocus={onComponentFocus} onBlur={onComponentBlur}>
      <label className={"input-field-container"}>
        <div className={"input-field-content"}>
          <div className={"input-field-label"}>
            <InputFieldRequired show={required}>*</InputFieldRequired>
            <FlexEllipsisText>{label}</FlexEllipsisText>
          </div>
          <input {...min_max} className={"input-field-value"} value={current_value} type={type}
                 autoComplete={autoComplete} autoFocus={autoFocus} name={name} readOnly={readonly} disabled={disabled} required={required}
                 onKeyDown={onInputKeyDown} onChange={onInputChange} onCut={onCut} onCopy={onCopy} onPaste={onPaste}/>
        </div>
        <InputFieldCaret show={show_caret} active={dropdown} onChange={setDropdown}/>
      </label>
      
      <InputFieldError>{error_message}</InputFieldError>
      <InputFieldDropdown ref={ref_dropdown} show={dropdown} index={current_index} onChange={onDropdownChange} onCommit={onDropdownCommit}>{children}</InputFieldDropdown>
    </div>
  );
  
  function onComponentMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    onMouseEnter?.(event);
    if (event.defaultPrevented) return;
  
    setHover(true);
  }
  
  function onComponentMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
    onMouseLeave?.(event);
    if (event.defaultPrevented) return;
  
    setHover(false);
  }
  
  function onComponentFocus(event: React.FocusEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onFocus)) return;
  
    // If we're not using the caret but have children, we should show the dropdown on focus.
    if (!show_caret) {
      setDropdown(true);
    }
  
    setFocus(true);
  }
  
  function onComponentBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onBlur)) return;
  
    // During a "Tab" event "dropdown" is already false and so it will go to the else case.
    if (dropdown) {
      // If we have a value or is not in strict mode, we commit the value
      if (current_index > Utility.IndexDefault || !strict) {
        commit(current_value, current_index);
      }
      else {
        reset();
      }
    }
    else {
      closeDropdown();
    }
    
    setFocus(false);
  }
  
  function onDropdownChange(index: number, element: Element) {
    // If we have an index from the dropdown, update temp index and value.
    if (index > Utility.IndexDefault) {
      setTemporaryIndex(index);
      setTemporaryValue(Utility.getElementText(element));
    }
    else {
      resetTempValue();
    }
  }
  
  function onDropdownCommit(index: number, element: Element) {
    // If a dropdown item is clicked we commit it.
    commit(Utility.getElementText(element), index);
    setHover(false);
  }
  
  function onInputChange({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) {
    // If input value doesn't pass the filter, exit here and do onFilter callback with the filtered value
    if (filter && !value.match(filter)) return onFilter?.(value);
  
    onChange?.(createEvent(value, Utility.getIndexFromInput(value, ref_dropdown.current?.children), InputFieldEventType.CHANGE));
    setDropdown(true);
    resetTempValue();
  }
  
  function onInputKeyDown(event: React.KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
        handleKeydownArrowKey(Utility.offsetIndex(current_index, OffsetDirectionType.UP, children_count));
        break;
      case "ArrowDown":
        handleKeydownArrowKey(Utility.offsetIndex(current_index, OffsetDirectionType.DOWN, children_count));
        break;
      case "Escape":
        reset();
        break;
      case "Enter":
      case "NumpadEnter":
        handleKeydownEnter();
        break;
      case "Tab":
        return handleKeydown();
      default:
        return;
    }
    event.preventDefault();
  }
  
  function handleKeydownArrowKey(index: number) {
    setDropdown(true);
    setTemporaryIndex(index);
    setTemporaryValue(Utility.getInputFromIndex(index, ref_dropdown.current?.children));
  }
  
  function handleKeydownEnter() {
    // If we have a children object
    if (children !== undefined && !dropdown) {
      return setDropdown(true);
    }
    
    return handleKeydown();
  }
  
  function handleKeydown() {
    if (children !== undefined) {
      if (current_index > Utility.IndexDefault) {
        return commit(Utility.getInputFromIndex(current_index, ref_dropdown.current?.children), current_index);
      }
      if (strict) {
        return reset();
      }
    }
    
    return commit(current_value, current_index);
  }
  
  function reset() {
    onChange?.(createEvent(committedValue, committedIndex, InputFieldEventType.RESET));
    closeDropdown();
  }
  
  function commit(value: Utility.ValueType, index: number) {
    value = Utility.parseValue(value);
    index = Utility.parseIndex(index);
    
    onChange?.(createEvent(value, index, InputFieldEventType.COMMIT));
    closeDropdown();
    setCommitIndex(index);
    setCommitValue(value);
  }
  
  function closeDropdown() {
    setDropdown(false);
    resetTempValue();
  }
  
  function resetTempValue() {
    setTemporaryValue(undefined);
    setTemporaryIndex(undefined);
  }
  
  function createEvent(value: string, index: number, type: InputFieldEventType): InputFieldChangeEvent {
    return {value, index, type};
  }
}

export interface InputFieldChangeEvent {
  type: InputFieldEventType;
  index: number;
  value: string;
}

type HTMLComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export interface InputFieldProps extends Omit<HTMLComponentProps, "minLength" | "maxLength" | "onChange"> {
  min?: number;
  max?: number;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  
  
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  index?: number;
  value?: Utility.ValueType;
  error?: string | Error;
  type?: InputFieldType;
  label?: string;
  filter?: RegExp;
  strict?: boolean;
  useCaret?: boolean;
  
  onChange?(event: InputFieldChangeEvent): void;
  onFilter?(value: string): void;
  
  onCut?(event: React.ClipboardEvent): void;
  onCopy?(event: React.ClipboardEvent): void;
  onPaste?(event: React.ClipboardEvent): void;
}

