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
      const value = event.target.value
      props.onValueChange?.(value, event);
      if (props.index !== undefined && props.onIndexChange !== undefined) {
        const dropdown_element_list = getDropdownElementList();
        if (props.onCompare !== undefined) {
          for (let i = 0; i < dropdown_element_list.length; i++) {
            const element = dropdown_element_list.item(i);
            if (element && props.onCompare(value, i, element)) return props.onIndexChange(i);
          }
        }
        else {
          for (let i = 0; i < dropdown_element_list.length; i++) {
            const element = dropdown_element_list.item(i);
            if (element && element.textContent?.toLowerCase() === value.toLowerCase()) return props.onIndexChange(i);
          }
        }
        props.onIndexChange(-1);
      }
    },
    [props.value]
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

  const is_focus = hover || focus || props.value;
  const title_style: CSSProperties = {
    fontSize:   is_focus ? "75%" : "100%",
    fontFamily: "inherit",
    transition: "font-size .2s ease-in-out",
    cursor:     "text"
  };

  const input_style: CSSProperties = {
    padding:    "0",
    border:     "none",
    background: "transparent",
    outline:    "none",
    fontSize:   is_focus ? "100%" : "0.1px",
    fontFamily: "inherit",
    transition: "font-size .2s ease-in-out"
  };

  const dropdown_style: CSSProperties = {
    display:  dropdown ? "flex" : "none",
    flexFlow: "column",
    position: "absolute",
    top:      "100%",
    border:   "inherit",
    width:    "100%"
  };

  return (
    <label ref={ref_element} className={Style.Component} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
      <span style={title_style}>{props.label}</span>
      <input type={type} onChange={onChange} style={input_style}/>
      <div style={dropdown_style} onMouseLeave={onDropdownMouseLeave}>
        {React.Children.map(props.children, renderChild)}
      </div>
    </label>
  );

  function getDropdownElementList() {
    if (!ref_element.current) throw new Error();
    return ref_element.current.children[ref_element.current.children.length - 1].children;
  }

  function renderChild(child: React.ReactNode, index: number = 0) {
    const style: CSSProperties = {
      cursor:     "pointer",
      background: index === props.index ? "blue" : "transparent"
    };

    return (
      <div key={index} style={style} onMouseEnter={onDropdownMouseEnter}>
        {child}
      </div>
    );
  }
}

export interface InputFieldProps extends React.PropsWithChildren {
  type?: InputFieldType;
  index?: number;
  value?: string;
  className?: string;
  label?: string;

  onCompare?(input: string, index: number, element: Element ): boolean;
  onIndexChange?(index: number): void;
  onValueChange?(input: string, event: React.ChangeEvent): void;


}

export default InputField;
