import React, {useEffect, useState} from "react";
import {InputField, InputFieldChangeEvent} from "../src";

function IndexPage() {
  const [value, setValue] = useState<string>();
  const [index, setIndex] = useState<number>(-1);
  
  useEffect(() => {
    setValue("Test");
  }, []);
  
  return (
    <>
      <div style={{display: "flex"}}>
        <InputField label={"Hello World"} value={value} index={index} onChange={onChange}>
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
    </>
  );
  
  function onChange(event: InputFieldChangeEvent) {
    setValue(event.value);
    setIndex(event.index);
  }
}

export default IndexPage;
