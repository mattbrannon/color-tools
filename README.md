# color-tools

A lightweight library for color manipulation, conversion, them and palette generation

## Installation

Color Tools is available on Npm. You can install using the package manager of your choice.

```bash
yarn install color-tools
```

## Usage

This package uses **named exports** and supports both commonjs and esmodules. The following exports are currently available:

- `Color`
- `Theme`
- `convert`

### ES Modules

```js
import { Color, convert } from "color-tools";
```

### Common JS

```js
const { Color, convert } = require("color-tools");
```

With ES Modules you can use `import as` to avoid any naming conflicts.

```js
import { Color as Colour } from "color-tools";
```

The `Color` utility accepts `strings` and `objects` as input

Strings can be any valid (and sometimes invalid) hex, rgb, or hsl css colors. In most cases operators like `deg` and `%` are not necessary. For `hsl` colors, `deg` and `%` will be assumed unless another operator is supplied.

```javascript
// various ways of obtaining the color blue

new Color("blue");
new Color("#0000ff");

new Color("rgb(0 0 255)");
new Color("rgb(0 0 100%)");
new Color({ r: 0, g: 0, b: 255 });

new Color("hsl(240, 100%, 50%)");
new Color({ h: 240, s: 100, l: 50 });
new Color("00f");
new Color("rgb(0 0 255 1)");
```

## API

The api is pretty straightforward. Let's pick a color and see what we can do with it. I like deepskyblue so that's what I'm going with.

Every instance of `Color` or `Theme` has 3 color spaces, `hsl`, `rgb`, and `hex`. Each color space has the methods `array`, `object` and `css`.

```javascript
const color = new Color("deepskyblue");

// get a css string of rgb values
color.rgb.css(); // rgb(0, 191, 255)

// get an object of hsl values
color.hsl.object(); // { h: 195, s: 100, l: 50 }

// get an array of hex values
color.hex.array(); // ['00', 'BF', 'FF']

// get the value based on the current color space
// named colors default to hex
color.value(); // #00BFFF
```

You can set a preferred color space and data type as well

```javascript
const blue = new Color("rgb(0 0 255)");
blue.dataType = [];
blue.colorSpace = "hsl";

blue.value(); // [240, 100, 50]
```

For color modifications, there are several methods available. Color modifiers are chainable methods.

```javascript
const brownish = new Color("#765432");
const color = brownish
  .red(15)
  .green(24)
  .hue(-34)
  .blue(44)
  .saturation(-8)
  .lightness(12);
```

You can use also use the `Color` utility to generate an array of colors using the `shades`, `tints`, `faded`, and `vibrant` methods.

The `shades` method generates an array of colors with decreasing lightness values.
The `tints` method generates an array of colors with increasing lightness values.
The `faded` method generates an array of colors with decreasing saturation values.
The `vibrant` method generates an array of colors with increasing saturation values.

## Reference

- ### `Color`
- methods
  - `value`
  - `contrast`
  - `luminance`
  - `red`
  - `green`
  - `blue`
  - `hue`
  - `saturation`
  - `lightness`
- static methods
  - `random`
  - `contrast`
- properties with methods
  - `hex`
  - `rgb`
  - `hsl`
    - `array`
    - `object`
    - `css`
- config properties

  - `colorSpace`
  - `dataType`

- ### **`Theme`**
- methods
  - `analagous`
  - `tetradic`
  - `triadic`
  - `compound`
  - `gradient`
    - `linear`
    - `radial`
    - `conic`
  - `shades`
  - `fades`
  - `tints`
  - `vibes`
