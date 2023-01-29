import React, {HTMLProps, useState} from "react";
import {Utility} from "../modules";
import Style from "./InputFieldDropdownItem.module.css";

export function InputFieldDropdownItem(props: InputFieldDropdownItemProps) {
  const {index, active, children, className, ...component_method_props} = props;
  const {onCommit, onChange, onMouseDown, onMouseUp, onMouseEnter, ...component_props} = component_method_props;
  
  const [clicked, setClicked] = useState<boolean>(false);
  
  const classes = [Style.Component, "input-field-dropdown-item"];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")} data-active={active} onMouseUp={onComponentMouseUp} onMouseEnter={onComponentMouseEnter} onMouseDown={onComponentMouseDown}>
      {children}
    </div>
  );
  
  function onComponentMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    onMouseEnter?.(event);
    if (event.defaultPrevented) return;
  
    onChange?.(index, event.currentTarget);
  }
  
  function onComponentMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onMouseDown, event.button !== 0)) return;
  
    setClicked(true);
  }
  
  function onComponentMouseUp(event: React.MouseEvent<HTMLDivElement>) {
    if (!Utility.handleEventDefault(event, onMouseUp, event.button !== 0 || !clicked)) return;
  
    setClicked(false);
    onCommit?.(index, event.currentTarget);
  }
}

type BaseProps = Omit<HTMLProps<HTMLDivElement>, keyof BaseOmittedProps>
type BaseOmittedProps = Pick<HTMLProps<HTMLDivElement>, "onChange">

export interface InputFieldDropdownItemProps extends BaseProps {
  index: number;
  active?: boolean;
  
  onChange?(index: number, element: Element): void;
  onCommit?(index: number, element: Element): void;
}
