import React, {HTMLProps} from "react";
import {Utility} from "../modules/Utility";
import Style from "./InputFieldDropdown.module.css";
import {InputFieldDropdownItem} from "./InputFieldDropdownItem";

export const InputFieldDropdown = React.forwardRef((props: InputFieldDropdownProps, ref: React.Ref<HTMLDivElement>) => {
  const {show, index, children, className, ...component_method_props} = props;
  const {onMouseLeave, onChange, onCommit, ...component_props} = component_method_props;
  if (!children) return null;
  
  const active = show && !!children;
  const classes = [Style.Component, "input-field-dropdown"];
  if (className) classes.push(className);
  
  return (
    <div ref={ref} {...component_props} className={classes.join(" ")} data-active={active} onMouseLeave={onComponentMouseLeave}>
      {
        React.Children.count(children)
        ? React.Children.map(children, renderItem)
        : renderEmpty()
      }
    </div>
  );
  
  function renderItem(node: React.ReactNode, key: number = 0) {
    return (
      <InputFieldDropdownItem key={key} index={key} active={index === key} onChange={onChange} onCommit={onCommit}>
        {node}
      </InputFieldDropdownItem>
    );
  }
  
  function renderEmpty() {
    return (
      <span className={"input-dropdown-placeholder"}>
        No options
      </span>
    );
  }
  
  function onComponentMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
    onMouseLeave?.(event);
    if (event.defaultPrevented) return;
    
    onChange?.(Utility.IndexDefault);
  }
});

type BaseProps = Omit<HTMLProps<HTMLDivElement>, keyof BaseOmittedProps>
type BaseOmittedProps = Pick<HTMLProps<HTMLDivElement>, "onChange">

export interface InputFieldDropdownProps extends BaseProps {
  show?: boolean;
  index?: number;
  
  onChange?(index: number, element?: Element): void;
  onCommit?(index: number, element: Element): void;
}
