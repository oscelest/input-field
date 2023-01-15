import React, {useState} from "react";
import {InputField} from "../src";

// const filter = /^\d*$/i;

function IndexPage() {
  const [value, setValue] = useState<string>("Test");
  const [index, setIndex] = useState<number>(-1);
  
  return (
    <>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} error={"test"} value={value} index={index} onValueChange={onInputChange} onIndexChange={onIndexChange}>
          <span>Option 1</span>
          <span>Option 2</span>
          <span>Option 3</span>
          <span>Option 4</span>
        </InputField>
      </div>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} error={"test"} value={value} index={index} onValueChange={onInputChange} onIndexChange={onIndexChange} useCaret={false}>
          <span>Option 1</span>
          <span>Option 2</span>
          <span>Option 3</span>
          <span>Option 4</span>
        </InputField>
      </div>
    </>
  
  );
  
  function onInputChange(value: string) {
    setValue(value);
    return value;
  }
  
  function onIndexChange(value: number) {
    setIndex(value);
    return value;
  }
  
}

export default IndexPage;
