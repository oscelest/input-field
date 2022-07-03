import type {NextPage} from "next";
import InputField from "../src/InputField";
import Style from "./index.module.scss"
import React, {useState, useCallback} from "react";

const IndexPage: NextPage = () => {

  const [input, setInput] = useState<string>("");
  const [index, setIndex] = useState<number>(-1);

  const onInputChange = useCallback((value: string) => setInput(value), [input]);
  const onIndexChange = useCallback((index: number) => setIndex(index), [index]);

  const onReset = useCallback(
    () => {
      setInput("");
      setIndex(-1);
    },
    []
  );

  const onCommit = useCallback(
    (input: string, index: number) => {
      console.log(input, index);
      setIndex(index);
      setInput(input);
    },
    []
  );

  return (
    <div className={Style.Component}>
      <InputField label={"Hello World"} index={index} input={input} onIndexChange={onIndexChange} onInputChange={onInputChange} onReset={onReset} onCommit={onCommit}>
        <span>Test</span>
        <span>Testeren</span>
        <span>Noxy</span>
        <span>Yes</span>
        <span>Nope</span>
      </InputField>
    </div>
  );
};

export default IndexPage;
