# react-input-field

## Introduction

`react-input-field` is a minimalist [React](https://reactjs.org/) functional component which renders an extended HTML Input Element.
The input field comes with a label, input, error message, and dropdown selection capabilities out the box.
All of these contained inside one container with a label that moves out of the way as the input gets selected.
It's minimalist in the sense that it contains only a few classes without being deeply nested elements nor containing many predefined and mandatory CSS properties.

## Installation

To install run the following command:

```shell
npm install @noxy/react-input-field@latest
```

Typescript types are already available in the library so no need to get external types.

## Usage

The following is an example of how to use the component:

```typescript jsx
import React, {HTMLProps, useState} from "react";
import {InputField} from "@noxy/react-input-field";

function TestComponent(props: HTMLProps<HTMLDivElement>) {
  const [error, setError] = useState<Error>();
  const [value, setValue] = useState<string>();
  const [index, setIndex] = useState<number>();
  
  return (
    <InputField label={"Hello World"} value={vaue} index={index} error={error}
                onValueChange={onValueChange} onIndexChange={onIndexChange}>
      <div {...props}>
        Hello World
      </div>
    </InputField>
  );
  
  function onValueChange(index: number, commit: boolean) {
    setValue(value);
  }
  
  function onIndexChange(index: number, commit: boolean) {
    setIndex(index);
  }
}
```

## Properties

The `InputField` component inherits a combination of HTMLDivElement attributes and HTMLInputElement attributes, adding most to the outermost Div Element and the rest to the Input element.
This includes the className property for those using CSS modules.

### label: string

The label text that will be displayed at the top of the component. If left empty, it will be replaced by a non-breaking space to ensure the component is rendered properly.

**Default value**: `<empty string>`

### error: string

The error text that will be displayed at the bottom of the component. If left empty the error part of the component will not be shown.

**Default value**: `<empty string>`

### type: InputFieldType

The type of input field to be used with the following available values:

- InputFieldType.TEXT   ("text")
- InputFieldType.NUMBER ("number")
- InputFieldType.TEL    ("tel")
- InputFieldType.EMAIL  ("email")
- InputFieldType.SEARCH ("search")
- InputFieldType.URL    ("url")

**Default value**: `InputFieldType.TEXT`

### value: string | number | readonly string[]

The value contained inside the input and shown to the user. This value should be updated whenever onValueChange is called.

**Default value**: `<empty string>`

### index: number

The index value which will be used for the dropdown if any children are present inside the InputField element.
An index value of `-1` is regarded as the position for when no dropdown item is selected.
This value should be updated whenever onIndexChange is called.

**Default value**: `-1`

### min: number

The minimum length of the input field. If using `InputFieldType.NUMBER`, this will instead refer to the minimum integer value for the input field.

**Default value**: `-Math.INFINITE`

### max: number

The maximum length of the input field. If using `InputFieldType.NUMBER`, this will instead refer to the maximum integer value for the input field.

**Default value**: `Math.INFINITE`

### readonly: boolean

Determines if the Input should be readonly and only be able to be interacted with through the dropdown menu.

**Default value**: `false`

### disabled: boolean

Determines if the Input should be disabled and impossible to interact with.

**Default value**: `false`

### required: boolean

Determines if a small required star should be rendered next to the label, if a label has been provided.
Also marks the input field as being required for validation.

**Default value**: `false`

### filter: RegExp

A filter to be applied to the input field as input is changed through user input.
Anything not matching the RegExp while not trigger an onInputChange event.
Instead, an onFilter event will be fired.

**Default value**: `undefined`

### useCaret: boolean

Determines if the caret for the dropdown should be shown.
If the caret is present, a user will have to click on the caret, change input, press enter, or interact with the arrow keys to show the dropdown options.
If the caret is not present, the dropdown options will also be shown when the input gains focus.

onFilter?(value: string): void;

## Event handlers

### onFilter(value: string): void

A callback that will be called whenever an input gets filtered away through the `filter` property.

### onValueChange(value: string, commit: boolean): void

A callback that will be called whenever user input changes the value of the Input element.
Whenever the user performs an action that will "commit" the value, like pressing enter, pressing tab, selecting a dropdown item, the `commit` value inside the callback will be true.

### onIndexChange(value: number, commit: boolean): void

A callback that will be called whenever user input changes the value of the Input element.
Whenever the user performs an action that will "commit" the value, like pressing enter, pressing tab, selecting a dropdown item, the `commit` value inside the callback will be true.

## Styling

```css
.input-field {

}
```

## Notice

This is currently not in a v1.0.0 release. Undocumented breaking changes might happen between versions.
