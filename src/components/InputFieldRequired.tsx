import React, {HTMLProps} from "react";
import Style from "./InputFieldRequired.module.css";

export function InputFieldRequired(props: InputFieldRequiredProps) {
  const {children, className, show, ...component_method_props} = props;
  const {onMouseDown, onClick, onChange, ...component_props} = component_method_props;
  if (!children || !show) return null;
  
  const classes = [Style.Component, "input-field-required"];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>{children}</div>
  );
}

export interface InputFieldRequiredProps extends HTMLProps<HTMLDivElement> {
  show?: boolean;
  children?: string;
}
