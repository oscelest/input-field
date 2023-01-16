import React, {HTMLProps, useState} from "react";
import {Utility} from "../modules/Utility";
import Style from "./InputFieldCaret.module.css";

export function InputFieldCaret(props: InputFieldCaretProps) {
  const {show, active, className, disabled, ...component_method_props} = props;
  const {onMouseDown, onMouseUp, onChange, ...component_props} = component_method_props;
  if (!show) return null;
  
  const [clicked, setClicked] = useState<boolean>(false);
  const [state, setState] = useState<boolean>(active ?? false);
  
  const classes = [Style.Component, "input-field-caret"];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")} data-active={active} onMouseDown={onComponentMouseDown} onMouseUp={onComponentMouseUp}/>
  );
  
  function onComponentMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onMouseDown)) return;
  
    setClicked(true);
    setState(!active);
  }
  
  function onComponentMouseUp(event: React.MouseEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onMouseUp, !clicked)) return;
  
    setClicked(false);
    onChange?.(state);
  }
}

type BaseProps = Omit<HTMLProps<HTMLDivElement>, keyof BaseOmittedProps>
type BaseOmittedProps = Pick<HTMLProps<HTMLDivElement>, "onChange">

export interface InputFieldCaretProps extends BaseProps {
  show?: boolean;
  active?: boolean;
  children?: never;
  
  onChange?(state: boolean): void;
}
