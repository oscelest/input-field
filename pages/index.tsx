import React, {useState} from "react";
import InputField from "../src/components/InputField";

const filter = /^\d*$/i;

function IndexPage() {
  const [input, setInput] = useState<string>("Test");
  const [index, setIndex] = useState<number>(-1);

  return (
    <div style={{display: "flex"}}>
      <InputField input={input} index={index} caret={true} label={"Hello World"} filter={filter} error={"test"} onInputChange={onChange} onCommit={onCommit}>
        <span>Option 1</span>
        <span>Option 2</span>
        <span>Option 3</span>
        <span>Option 4</span>
      </InputField>
    </div>
  );

  function onChange(value: string) {
    value = value !== "" ? String(Math.min(Math.max(+value || 0, 0), 10)) : "";
    setInput(value);
    return value;
  }

  function onCommit(value: string, index: number) {
    setInput(value);
    setIndex(index);
  }
}

export default IndexPage;
