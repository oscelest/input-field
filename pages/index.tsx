import React, {useState} from "react";
import {InputField, InputFieldChangeEvent} from "../src";

function IndexPage() {
  const [value, setValue] = useState<string>("Option 1");
  const [index, setIndex] = useState<number>(0);
  
  return (
    <>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} value={value} index={index} strict={true} required={true} onChange={onChange}>
          <span>Option 1</span>
          <span>Option 2</span>
          <span>Option 3</span>
          <span>Option 4</span>
        </InputField>
      </div>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} error={"Some error here"} value={value} index={index} onChange={onChange} useCaret={false}>
          <span>Option 1</span>
          <span>Option 2</span>
          <span>Option 3</span>
          <span>Option 4</span>
        </InputField>
      </div>
      <div style={{display: "flex"}}>
        <InputField label={"No options"} value={value} index={index} onChange={onChange} useCaret={true}>
          {[]}
        </InputField>
      </div>
    </>
  );
  
  function onChange(event: InputFieldChangeEvent) {
    setValue(event.value);
    setIndex(event.index);
  }
}

export default IndexPage;
