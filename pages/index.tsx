import React, {useEffect, useState} from "react";
import {InputField} from "../src";

function IndexPage() {
  const [value, setValue] = useState<string>();
  const [index, setIndex] = useState<number>(-1);
  
  useEffect(() => {
    setValue("Test");
  }, []);
  
  return (
    <>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} value={value} index={index} onValueChange={onInputChange} onIndexChange={onIndexChange}>
          <span>Option 1</span>
          <span>Option 2</span>
          <span>Option 3</span>
          <span>Option 4</span>
        </InputField>
      </div>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} error={"Some error here"} value={value} index={index} onValueChange={onInputChange} onIndexChange={onIndexChange} useCaret={false}>
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
