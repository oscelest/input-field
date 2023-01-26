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

- `InputFieldType.TEXT` or `"text"`
- `InputFieldType.NUMBER` or `"number"`
- `InputFieldType.TEL` or `"tel"`
- `InputFieldType.EMAIL` or `"email"`
- `InputFieldType.SEARCH` or `"search"`
- `InputFieldType.URL` or `"url"`

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

### onChange(event: InputFieldChangeEvent): void

A callback that will be called whenever the value of the input is changed, reset, or committed.

- `change` - Whenever a user writes anything into the input field.
- `commit` - Whenever a user presses enter, tab, or selects an item from the dropdown.
- `reset` - Whenever a user presses escape with the input field in focus.

####  

```ts
interface InputFieldChangeEvent {
  type: InputFieldEventType;
  index: number;
  value: string;
}

enum InputFieldEventType {
  CHANGE = "change",
  COMMIT = "commit",
  RESET  = "reset",
}
```

### onIndexChange(value: number, commit: boolean): void

A callback that will be called whenever user input changes the value of the Input element.
Whenever the user performs an action that will "commit" the value, like pressing enter, pressing tab, selecting a dropdown item, the `commit` value inside the callback will be true.

## Styling

While the styling of this component is minimalist, the following section documents editable variables and properties which should not be edited.

### CSS Variables

The following variables are used to control the font sizes of the label and input elements, depending on active and inactive states.

```css
:root .input-field {
  --input-field-input-font-size:        16px; /* The font-size of the input element */
  --input-field-label-font-size:        16px; /* The font-size of the label element when the input field is inactive */
  --input-field-label-active-font-size: 12px; /* The font-size of the label element when the input field is active */
  --input-field-caret-size:             6px; /* The size of the caret when it's being shown */
}
```

### Important CSS Properties

The following are a list of properties which are designated as important.
To preserve component functionality, these should not be changed.
If you do need to change them however, please be advised that the component might stop working as intended.

```css
.input-field {
  display:   flex !important;
  flex-flow: column !important;
  position:  relative !important;
}

.input-field-container {
  display: flex !important;
}

.input-field-content {
  display:         flex !important;
  flex-flow:       column !important;
  justify-content: center !important;
}

.input-field-label {
  display:   flex !important;
  flex-flow: row !important;
}

.input-field-label {
  transition: font-size 0ms ease-in-out !important;
}

.input-field-value {
  width:  100% !important;
  height: 0 !important;
}

.input-field[data-content="true"] .input-field-value,
.input-field[data-focus="true"] .input-field-value,
.input-field[data-hover="true"] .input-field-value {
  height: 100% !important;
}

.input-field-caret {
  display:         flex !important;
  align-items:     center !important;
  justify-content: center !important;
}

.input-field-caret::before {
  content:            " " !important;
  border-style:       solid !important;
  border-left-color:  transparent !important;
  border-right-color: transparent !important;
  border-bottom:      none !important;
}

.input-field-dropdown {
  display:   none !important;
  flex-flow: column !important;
  position:  absolute !important;
  top:       100% !important;
  left:      -1px !important;
  right:     -1px !important;
}

.input-field-dropdown[data-active="true"] {
  display: flex !important;
}
```

## Notice

This is currently not in a v1.0.0 release. Undocumented breaking changes might happen between versions.
