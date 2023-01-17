import {FlexEllipsisText} from "@noxy/react-flex-ellipsis-text";
import React, {HTMLProps, useRef, useState} from "react";
import {InputFieldType} from "../enums";
import {Utility} from "../modules/Utility";
import Style from "./InputField.module.css";
import {InputFieldCaret} from "./InputFieldCaret";
import {InputFieldDropdown} from "./InputFieldDropdown";
import {InputFieldError} from "./InputFieldError";
import {InputFieldRequired} from "./InputFieldRequired";

export function InputField<V extends Utility.ValueType>(props: InputFieldProps<V>) {
  // External properties
  let {type, value, index, label, min, max, error, filter, useCaret, children, className, autoComplete, autoFocus, readonly, required, disabled, name, ...component_method_props} = props;
  let {onValueChange, onIndexChange, onCut, onCopy, onPaste, onFilter, onMouseUp, onMouseEnter, onMouseLeave, onFocus, onBlur, ...component_props} = component_method_props;
  
  // States to check how component should be rendered
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  
  // States to keep track of values hovered in the dropdown
  const [temporary_value, setTemporaryValue] = useState<string>();
  const [temporary_index, setTemporaryIndex] = useState<number>();
  
  // Ref for dropdown element
  const ref_dropdown = useRef<HTMLDivElement>(null);
  
  // Calculate default values
  if (!type || !Utility.InputTypeValueList.includes(type)) type = InputFieldType.TEXT;
  if (!label?.match(/\w+/)) label = "\u00A0";
  
  // Temporary values
  const current_value = temporary_value ?? value ?? Utility.ValueDefault;
  const current_index = temporary_index ?? index ?? Utility.IndexDefault;
  
  // Calculate dynamic properties
  const children_count = React.Children.count(children);
  const error_message = Utility.getErrorMessage(error, disabled);
  const min_max = Utility.parseMinMax(type, min, max);
  const show_caret = Utility.getShowCaret(useCaret, children_count, disabled);
  
  const classes = [Style.Component, "input-field"];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}
         data-hover={hover} data-focus={focus} data-content={!!current_value} data-error={!!error_message} data-readonly={readonly} data-disabled={disabled}
         onMouseEnter={onComponentMouseEnter} onMouseLeave={onComponentMouseLeave} onFocus={onComponentFocus} onBlur={onComponentBlur}>
      <label className={"input-field-container"}>
        <div className={"input-field-content"}>
          <div className={"input-field-title"}>
            <InputFieldRequired>*</InputFieldRequired>
            <FlexEllipsisText>{label}</FlexEllipsisText>
          </div>
          <input {...min_max} className={"input-field-value"} value={current_value} type={type}
                 autoComplete={autoComplete} autoFocus={autoFocus} name={name} readOnly={readonly} disabled={disabled}
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
    
    setFocus(true);
    if (!show_caret) {
      setDropdown(true);
    }
  }
  
  function onComponentBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onBlur)) return;
    
    if (dropdown) {
      commit(current_value, current_index);
    }
    else {
      setDropdown(false);
      setTemporaryIndex(undefined);
      setTemporaryValue(undefined);
    }
    
    setFocus(false);
  }
  
  function onDropdownChange(index: number, element: Element) {
    if (index === Utility.IndexDefault) {
      setTemporaryIndex(undefined);
      setTemporaryValue(undefined);
    }
    else {
      setTemporaryIndex(index);
      setTemporaryValue(Utility.getElementText(element));
    }
  }
  
  function onDropdownCommit(index: number, element: Element) {
    setHover(false);
    commit(Utility.getElementText(element), index);
  }
  
  
  function onInputChange({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) {
    if (filter && !value.match(filter)) return onFilter?.(value);
  
    onValueChange?.(value, false);
    onIndexChange?.(Utility.getIndexFromInput(value, ref_dropdown.current?.children), false);
  
    setDropdown(true);
    setTemporaryValue(undefined);
    setTemporaryIndex(undefined);
  }
  
  function onInputKeyDown(event: React.KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
        handleKeydownArrowKey(Utility.offsetIndex(current_index, Utility.OffsetDirection.UP, children_count));
        break;
      case "ArrowDown":
        handleKeydownArrowKey(Utility.offsetIndex(current_index, Utility.OffsetDirection.DOWN, children_count));
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
    handleKeyCommit(value);
  }
  
  function handleKeydownArrowKey(index: number) {
    setDropdown(true);
    setTemporaryIndex(index);
    setTemporaryValue(Utility.getInputFromIndex(index, ref_dropdown.current?.children));
  }
  
  function handleKeydownEnter() {
    if (dropdown && current_index > Utility.IndexDefault) {
      return commit(Utility.getInputFromIndex(current_index, ref_dropdown.current?.children), current_index);
    }
    if (children_count) {
      return setDropdown(true);
    }
    
    handleKeyCommit(current_value);
  }
  
  function handleKeydownTab() {
    if (dropdown && current_index > Utility.IndexDefault) {
      return commit(Utility.getInputFromIndex(current_index, ref_dropdown.current?.children), current_index);
    }
    
    handleKeyCommit(current_value);
  }
  
  function handleKeyCommit(value: Utility.ValueType) {
    commit(value, Utility.getIndexFromInput(Utility.parseInput(value), ref_dropdown.current?.children));
  }
  
  function commit(value: Utility.ValueType, index: number) {
    value = Utility.parseInput(value);
  
    onIndexChange?.(index, true);
    onValueChange?.(value, true);
  
    setDropdown(false);
    setTemporaryValue(undefined);
    setTemporaryIndex(undefined);
  }
}

type BaseProps = Omit<HTMLProps<HTMLDivElement>, keyof BaseOmittedProps>
type BaseOmittedProps = Pick<HTMLProps<HTMLDivElement>, "minLength" | "maxLength">

export interface InputFieldProps<V extends Utility.ValueType> extends BaseProps {
  min?: number;
  max?: number;
  readonly?: boolean;
  required?: boolean;
  
  index?: number;
  value?: V;
  error?: string | Error;
  type?: InputFieldType;
  label?: string;
  filter?: RegExp;
  useCaret?: boolean;
  
  onValueChange?(input: string, commit: boolean): void;
  onIndexChange?(index: number, commit: boolean): void;
  onFilter?(value: string): void;
  
  onCut?(event: React.ClipboardEvent): void;
  onCopy?(event: React.ClipboardEvent): void;
  onPaste?(event: React.ClipboardEvent): void;
}

