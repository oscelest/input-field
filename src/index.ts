import {DetailedHTMLProps, HTMLAttributes, HTMLProps} from "react";
import {InputFieldEventType} from "./enums";

export {InputField, type InputFieldProps} from "./components";
export {InputFieldType, InputFieldEventType} from "./enums";

export type InputFieldValue = HTMLProps<HTMLInputElement>["value"];
export type HTMLComponentProps<E = HTMLDivElement> = DetailedHTMLProps<HTMLAttributes<E>, E>

export interface InputFieldChangeEvent {
  type: InputFieldEventType;
  index: number;
  value: string;
}
