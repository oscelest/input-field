import Style from "./InputField.module.scss";
import React, {useRef, useCallback, CSSProperties, useState} from "react";
import InputFieldType from "./InputFieldType";

function InputField(props: InputFieldProps) {
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);

  const ref_element = useRef<HTMLLabelElement>(null);
  const type = props.type ?? InputFieldType.TEXT;

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      props.onInputChange?.(input, event);
      props.onIndexChange?.(getIndexFromInput(input));
    },
    [props.input]
  );


  const onMouseEnter = useCallback((event: React.MouseEvent) => setHover(true), []);
  const onMouseLeave = useCallback((event: React.MouseEvent) => setHover(false), []);

  const onDropdownMouseLeave = useCallback((event: React.MouseEvent) => props.onIndexChange?.(-1), [props.index]);
  const onDropdownMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      if (ref_element.current) {
        props.onIndexChange?.(Array.prototype.indexOf.call(ref_element.current.children[ref_element.current.children.length - 1].children, event.currentTarget));
      }
    },
    [props.index]
  );

  const onFocus = useCallback((event: React.FocusEvent) => {
    setFocus(true);
    setDropdown(true);
  }, []);

  const onBlur = useCallback((event: React.FocusEvent) => {
    setFocus(false);
    setDropdown(false);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const element = getInputElement();
    switch(event.code) {
      case "Escape":
        element.blur();
        return;
      case "ArrowUp":
        return;
      case "ArrowDown":
        return;
      case "Enter":
      case "NumpadEnter":
        return;
      case "Tab":
        element.blur();
        return;
    }
  }, []);

  const is_focus = hover || focus || props.input;
  const title_class = [Style.Title];
  const input_class = [Style.Input];
  if (is_focus) {
    title_class.push(Style.Active);
    input_class.push(Style.Active);
  }

  const dropdown_class = [Style.Dropdown];
  if (dropdown) {
    dropdown_class.push(Style.Active);
  }

  return (
    <label ref={ref_element} className={Style.Component} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
      <span className={title_class.join(" ")}>{props.label}</span>
      <input className={input_class.join(" ")} type={type} onKeyDown={onKeyDown} onChange={onChange}/>
      <div className={dropdown_class.join(" ")} onMouseLeave={onDropdownMouseLeave}>
        {React.Children.map(props.children, renderChild)}
      </div>
    </label>
  );

  function getIndexFromInput(input: string) {
    const comparator = props.onCompare ?? compareInputToElement;
    const dropdown_element_list = getDropdownElementList();
    for (let i = 0; i < dropdown_element_list.length; i++) {
      const element = dropdown_element_list.item(i);
      if (element && comparator(input, i, element)) return i;
    }
    return -1;
  }

  function getInputElement() {
    if (!ref_element.current) throw new Error();
    return ref_element.current.children[ref_element.current.children.length - 2] as HTMLInputElement;
  }

  function getDropdownElementList() {
    if (!ref_element.current) throw new Error();
    return ref_element.current.children[ref_element.current.children.length - 1].children;
  }

  function renderChild(child: React.ReactNode, index: number = 0) {
    const classes = [Style.Option];
    if (index === props.index) classes.push(Style.Active)

    return (
      <div className={classes.join(" ")} key={index} onMouseEnter={onDropdownMouseEnter}>
        {child}
      </div>
    );
  }
}

function compareInputToElement(input: string, index: number, element: Element) {
  return input.toLowerCase() === element.textContent?.toLowerCase();
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
  onCompare?(input: string, index: number, element: Element): boolean;
  onIndexChange?(index: number): void;
  onInputChange?(input: string, event: React.ChangeEvent): void;


}

export default InputField;
