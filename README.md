# color-tools

A lightweight library for color manipulation, conversion, theme and palette generation

## Installation

Color Tools is available on Npm. You can install it using the package manager of your choice.

### Npm

```bash
npm install color-tools
```

### Yarn

```bash
yarn add color-tools
```

### Pnpm

```bash
pnpm add color-tools
```

## Usage

This package uses **named exports** and supports both CommonJS and ESModules. The following exports are currently available:

- `Color`
- `Theme`
- `convert`

### ES Modules

```javascript
import { Color, convert } from "color-tools";
```

### Common JS

```javascript
const { Color, convert } = require("color-tools");
```

## Color

The `Color` class accepts `strings`, `objects` and `arrays` as input. An optional configuration object can be supplied as a second argument.

**If using an `array` as input, the configuration object is required.**

### Properties (color spaces)

- rgb
- hsl
- hex

Each color space has the methods

- `array()`
- `object()`
- `css()`

```javascript
const color = new Color("deepskyblue");

// HSL colors
color.hsl.css(); // hsl(195deg, 100%, 50%)
color.hsl.object(); // {h:195, s:100, l:50}
color.hsl.array(); // [195, 100, 50]

// RGB colors
color.rgb.css(); // rgb(0, 191, 255)
color.rgb.object(); // {r:0, g:191, b:255}
color.rgb.array(); // [0, 191, 255]

// HEX colors
color.hex.css(); // '#00bfff'
color.hex.object(); // {r:'00', g:'bf', b:'ff'};
color.hex.array(); // ['00', 'bf', 'ff']
```

### Color Prototype Methods

- `value()` A convenience method that returns the current instance's color value based on the preferred color space and data types
- `contrast()` Returns the contrast ratio between the current color instance and another color. accepts the same input parameters as `Color` minus the config
- `luminance()` Returns a floating point number between 0 and 1 representing the color's luminance value
- `red()` set the red `rgb` channel
- `green()` set the green `rgb` channel
- `blue()` set the blue `rgb` channel
- `hue()` set the `hsl` hue value
- `saturation()` set the `hsl` saturation value
- `lightness()` set the `hsl` lightness value

### Static Methods

- `Color.random()` - returns a random hexadecimal color value
- `Color.contrast()` - Takes 2 colors as input and returns the contrast ratio between them.

## Theme

`Theme` is an extensions of the `Color` class

### Theme Prototype Methods

- `complementary()`
- `splitComplementary()`
- `triadic()`
- `tetradic()`
- `analagous()`
- `square()`
- `rectangle()`

## Configuration

The configuration object allows you to set some default preferences. Currently there are 2 options:

- `colorSpace`: One of `'rgb'` or `'hsl'` or `'hex'`
- `dataType`: One of `'array'` or `'object'` or `'string'`.

You can also supply the literal data type. E.g. `[]`, `{}`, `''`

<!-- ```javascript
const blue = new Color('blue', { colorSpace: 'rgb' });
blue.value(); // 'rgb(0, 0, 255)'
```

If we want an array of values instead of string

```javascript
const blue = new Color('blue', { colorSpace: 'rgb', dataType: [] });
blue.value(); // [0, 0, 255]
```

Or an object of key value pairs

```javascript
const blue = new Color('blue', { colorSpace, 'rgb', dataType: {} });
blue.value(); // { r: 0, g: 0, b: 255 }
```

You're not bound to the initial configuration. You can make changes on the fly by setting the properties directly

```javascript
const blue = new Color('blue' { colorSpace: 'hsl' });
blue.value(); // 'hsl(240deg, 100%, 50%)

blue.dataType = [];
blue.value(); // [240, 100, 50];

blue.colorSpace = 'rgb';
blue.value(); // [0, 0, 255];
``` -->

<!--
## API

Color Tools is a collection of methods for working with colors on the internet. The `Color` class accepts `strings`, `objects` and `arrays` as input. An optional configuration object can be supplied as a second argument. **If using an `array` as input, the configuration object is required.**

Strings can be any valid (and sometimes invalid) hex, rgb, or hsl css colors. In most cases operators like `deg` and `%` are not necessary. For `hsl` colors, `deg` and `%` will be assumed unless another operator is supplied.

Objects should be in the form of `{ r, g, b, a? }` or `{ h, s, l, a? }` with the alpha channel being optional.

Arrays can be any collection of values such as `[145, '10%', 55]`. In order to know which color space the values belong to, you need to supply a configuration object as a second argument.

### Examples

#### Using a named color

```javascript
const blue = new Color('blue');
blue.value(); // '#0000FF'
```

Named colors use the hex color space by default. We can target a different color space in several ways

Remember, the configuration object is optional. You can switch between color spaces and data types in a number of ways. We've been using the `value` method up to this point. The `value` method is a convenience method. We can achieve the same things by targeting the color spaces and data types directly via their methods.

```javascript
const color = new Color('deepskyblue');

// HSL colors
color.hsl.css(); // hsl(195deg, 100%, 50%)
color.hsl.object(); // { h: 195, s: 100, l: 50 }
color.hsl.array(); // [195, 100, 50]

// RGB colors
color.rgb.css(); // rgb(0, 191, 255)
color.rgb.object(); // { r: 0, g: 191, b: 255 }
color.rgb.array(); // [0, 191, 255]

// HEX colors
color.hex.css(); // '#00bfff'
color.hex.object(); // { r: '00', g: 'bf', b: 'ff' };
color.hex.array(); // [ '00', 'bf', 'ff' ]
```

### Modifiers

Each instance of `Color` has the following color modifier methods available

- `red()` set the red `rgb` channel
- `blue()` set the blue `rgb` channel
- `green()` set the green `rgb` channel
- `hue()` set the `hsl` hue value
- `saturation()` set the `hsl` saturation value
- `lightness()` set the `hsl` lightness value

Color modifiers are chainable methods. Each returns a new instance of `Color`

```js
const black = new Color('rgb(0 0 0');
const magenta = black.red(255).blue(255);

magenta.value(); // rgb(255, 0, 255)

const faded = magenta.saturation(-50).lightness(15);
faded.value(); // rgb(210, 121, 210)
```

You can use also use the `Color` utility to generate an array of colors using the `shades`, `tints`, `faded`, and `vibrant` methods.

- The `shades` method generates an array of colors with decreasing lightness values.
- The `tints` method generates an array of colors with increasing lightness values.
- The `faded` method generates an array of colors with decreasing saturation values.
- The `vibrant` method generates an array of colors with increasing saturation values.

## Theme

The `Theme` class is an extension of the `Color` class. The following methods are current available.

- complementary
- splitComplementary
- triadic
- tetradic
- analagous
- square
- rectangle

Each of the methods listed above returns an array of color values.

<!-- ## Reference

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
  - `vibes` -->
