import type {NextPage} from "next";
import InputField from "../src/InputField";
import Style from "./index.module.scss"
import React, {useState, useCallback} from "react";

const IndexPage: NextPage = () => {

  const [value, setValue] = useState("");
  const [index, setIndex] = useState(-1);

  const onValueChange = useCallback(
    (value: string, event: React.ChangeEvent) => {
      setValue(value);
    },
    [value]
  );

  const onIndexChange = useCallback(
    (index: number) => {
      console.log(index);
      setIndex(index);
    },
    [index]
  );

  return (
    <div className={Style.Component}>
      <InputField label={"Hello World"} index={index} value={value} onIndexChange={onIndexChange} onValueChange={onValueChange}>
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
