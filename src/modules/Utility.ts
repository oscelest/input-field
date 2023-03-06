import React, {EventHandler, HTMLProps} from "react";
import {InputFieldType, OffsetDirectionType} from "../enums";

export module Utility {
  
  export const InputTypeValueList = Object.values(InputFieldType);
  export const IndexDefault = -1;
  export const ValueDefault = "";
  
  export function handleEventDefault<E extends React.SyntheticEvent>(event: E, event_handler?: EventHandler<E>, exit_condition?: boolean): boolean {
    event_handler?.(event);
    if (event.defaultPrevented || exit_condition) return false;
  
    event.preventDefault();
    return true;
  }
  
  export function getErrorMessage(error?: string | Error, disabled?: boolean): string {
    if (!error || disabled) return "";
    if (error instanceof Error) return error.message;
    return String(error);
  }
  
  export function getShowCaret(use_caret?: boolean, children?: React.ReactNode, disabled?: boolean): boolean {
    return use_caret !== false && !!children && !disabled;
  }
  
  export function parseValue(value: any, default_value: string = ValueDefault): string {
    if (typeof value === "string") return value;
    if (typeof value === "number") return isNaN(value) ? ValueDefault : String(value);
    if (Array.isArray(value)) return value.join(",");
    return default_value;
  }
  
  export function parseIndex(value: any, default_value: number = IndexDefault): number {
    if (isNaN(value)) return IndexDefault;
    if (typeof value === "number") return Math.max(IndexDefault, value);
    return default_value;
  }
  
  export function parseMinMax(type?: InputFieldType, min?: number, max?: number): Pick<HTMLProps<HTMLInputElement>, "min" | "minLength" | "max" | "maxLength"> {
    const result = {} as Pick<HTMLProps<HTMLInputElement>, "min" | "minLength" | "max" | "maxLength">;
    if (min !== undefined) result[type === InputFieldType.NUMBER ? "min" : "minLength"] = min;
    if (max !== undefined) result[type === InputFieldType.NUMBER ? "max" : "maxLength"] = max;
    return result;
  }
  
  export function offsetIndex(current: number, offset: OffsetDirectionType, max: number) {
    if (offset === OffsetDirectionType.UP && current <= 0) {
      return max - 1;
    }
    if (offset === OffsetDirectionType.DOWN && current >= max - 1) {
      return 0;
    }
    return current + offset;
  }
  
  export function getInputFromIndex(index?: number, list?: HTMLCollection | Array<Element>) {
    if (index === undefined) return ValueDefault;
    if (list instanceof HTMLCollection) list = Array.from(list);
    
    return getElementText(list?.at(index));
  }
  
  export function getIndexFromInput(input: string, list?: HTMLCollection | Element[]) {
    if (!list) return IndexDefault;
    if (list instanceof HTMLCollection) list = Array.from(list);
    
    for (let i = 0; i < list.length; i++) {
      if (input.toLowerCase() === getElementText(list[i]).toLowerCase()) {
        return i;
      }
    }
    
    return IndexDefault;
  }
  
  export function getElementText(element?: Element | null) {
    return element?.textContent ?? "";
  }
}
