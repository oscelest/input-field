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

The `InputField` component inherits all HTMLDivElement properties and applies them directly to the outermost element.
This includes the className property for those using CSS modules.

### label: string

The label text that will displayed at the top of the component. If left empty, it will be replaced by a non-breaking space to ensure the component is rendered properly.

**Default value**: `undefined`

## Styling

```css
.input-field {
  
}
```

## Notice

This is currently not in a v1.0.0 release. Undocumented breaking changes might happen between versions.
