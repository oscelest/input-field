import {InputField} from "../src";
import {useState} from "react";

const filter = /\d\w/;

function IndexPage() {
  const [input, setInput] = useState<string>("Test");
  const [index, setIndex] = useState<number>(-1);
  console.log("Index from page", index);

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
    console.log(value);
    if (value === "Hello") {
      setInput("World");
    }
    else {
      setInput(value);
    }
  }

  function onCommit(value: string, index: number) {
    console.log("Commiting in index", value, index);
    setInput(value);
    setIndex(index);
  }
}

export default IndexPage;
