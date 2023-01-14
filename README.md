# color-tools

A lightweight library for color validation, manipulation, conversion, theme and palette generation

## Installation

Color Tools is available on Npm. You can install it using the package manager of your choice.

```bash
# NPM
npm install @mattbrannon/color-tools

# Yarn
yarn add @mattbrannon/color-tools

# Pnpm
pnpm add @mattbrannon/color-tools
```

## Usage

This package uses **named exports** and supports both CommonJS and ESModules.

### ES Modules

```javascript
import { Color, Theme, convert } from "@mattbrannon/color-tools";
```

### Common JS

```javascript
const { Color, Theme, convert } = require("@mattbrannon/color-tools");
```

## Color

The `Color` class utility is versatile. It is able to convert between hexadecimal, rgb, and hsl color spaces. Alpha channels are supported as well. It accepts any valid (and quite a few invalid) css color strings. In most cases operators like `deg` and `%` are not necessary. For `hsl` colors, `deg` and `%` will be assumed unless another operator is supplied.

```js
const deepSkyBlue = new Color("deepskyblue");
const blue = new Color("rgb(0 0 255)");
const magenta = new Color("hsl(300 100 50 1)"); // look ma! no commas
const brown = new Color("654321"); // look ma! no # sign
```

Objects are also acceptable input. Objects should be in the form of

```js
// the alpha `a` channel is optional
new Color({ r, g, b, a });
new Color({ h, s, l, a });
```

The values for each color channel can be raw numbers or percentage strings

```js
new Color({ r: "25%", g: 200, b: 100, a: "90%" });
new Color({ h: 270, s: 100, l: "50%", a: 0.75 });
```

You can use an array for input as well with one caveat. When supplying an array of values as input, you must also supply a configuration object as a second argument. Otherwise, it's impossible to know which color space the values belong to.

### Config

```js
// using an array we need to specify the initial color space
// we can still set the preferred data type to whatever we choose
const green = new Color([0, 128, 0], {
  colorSpace: "rgb",
  dataType: {},
});

green.value(); // { r:0, g:128, b:0 }

// here we don't need to set a color space to be able to parse the input
// instead we're setting a color space to use as the default for this color
const deepPink = new Color("deeppink", {
  colorSpace: "hsl",
  dataType: [],
});

deepPink.value(); // [328, 100, 54]
```

### Color Spaces

The available color spaces currently include `rgb`, `hsl`, `hex`

Each color space has the following methods for specifying the output datatype

- `array()`
- `object()`
- `css()`

The syntax for each color space method is

```js
color.<color-space>.<method>
```

For example:

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

### Color Methods

The methods listed below are globally available per instance of `Color`. There's no need to target a specific color space.

- [`value()`](#value) A convenience method that returns the current instance's color value based on the preferred color space and data types
- [`contrast()`](#contrast) Returns the contrast ratio between the current color instance and another color. accepts the same input parameters as `Color` minus the config
- [`luminance()`](#luminance) Returns a floating point number between 0 and 1 representing the color's luminance value
- [`red()`](#rgb-methods) set the red `rgb` channel
- [`green()`](#rgb-methods) set the green `rgb` channel
- [`blue()`](#rgb-methods) set the blue `rgb` channel
- [`hue()`](#hsl-methods) set the `hsl` hue value
- [`saturation()`](#hsl-methods) set the `hsl` saturation value
- [`lightness()`](#hsl-methods) set the `hsl` lightness value

<h4 id="value">Value</h4>

The simplest way to obtain the color output is with the `value` method. The output of this method will vary depending on the input and configuration provided.

For named colors, without a configuration, the default output will be in hexadecimal format. For all other inputs without a config, the output of `value` will directly match the input.

```js
// named colors default to hex format
const blue = new Color("blue");
blue.value(); // '#0000FF'

const red = new Color("rgb(255 0 0)");
red.value(); // 'rgb(255, 0, 0)'

const green = new Color({ h: 120, s: 100, l: 25 });
green.value(); // {h:120, s:100, l:25}
```

<h4 id="contrast">Contrast</h4>

Get the contrast ratio between the current color and another. Accepts the same input formats as `Color`

```js
const orange = new Color("orange");
const ratio = orange.contrast("red"); // 2.02
```

<h4 id="luminance">Luminance</h4>

Get the relative luminance value of the current color Returns a value between 0 - 1 with 0 being total darkness and 1 being all white

```js
new Color("#8faba2").luminance(); // 0.3757409455965292
```

<h4 id="rgb-methods" >RGB Methods</h4>

Set the value for red, green or blue channels. Values will be converted to `rgb` to make the adjustment and then converted back to the current color space (if necessary).

```js
const black = new Color("#000");
const pureRed = black.red(255);
const magenta = pureRed.blue(255);
const purple = magenta.red(-127).blue(-127);
const grey = magenta.red(-127).blue(-127).green(127);
```

<h4 id="hsl-methods">HSL Methods</h4>

Set the value for hue, saturation or lightness. Values will be converted to `hsl` to make the adjustment and then converted back to the current color space (if necessary).

```js
const black = new Color("#000");
const maroon = black.saturation(100).lightness(25);
const purple = maroon.hue(300);
```

### Static Methods

- [`Color.random()`](#random) - returns a random hexadecimal color value
- [`Color.contrast()`](#static-contrast) - Takes 2 colors as input and returns the contrast ratio between them.

<h4 id="random">Color.random</h4>

`Color.random` is a static method that generates a random color in hexadecimal format.

```js
const randomColor = Color.random(); // #0d7ae8
```

<h4 id="static-contrast">Color.contrast</h4>

Same functionality as the instance method without needing to create a new instance

```js
const ratio = Color.contrast("orange", "red"); // 2.02
```

## Theme

`Theme` is an extension of `Color` and has some useful methods for generating color palettes.

The output will be an array of strings based on the input color space.

The color palettes provided will be uniform in their levels of `saturation` and `lightness`. More than likely you'll want to tweak these a bit when deciding which colors to use.

### Theme Methods

- [`complementary()`](#complementary)
- [`compound()`](#compound)
- [`triadic()`](#triadic)
- [`analagous()`](#analagous)
- [`rectangle()`](#rectangle)
- [`square()`](#square)

<h4 id="complementary">Complementary</h4>

A complementary color palette is one which consists of two colors opposite each other on the color wheel.

```js
const [red, complement] = new Theme("hsl(0 100 50)").complementary();
/*[
  'hsl(0deg, 100%, 50%)', 
  'hsl(180deg, 100%, 50%)'
] */
```

<h4 id="compound">Compound</h4>

Similar to complementary but generates 3 colors. The base color provided as input and then the 2 colors on either side of the base complementary color.
This is also known as **split complementary**

```js
const base = new Theme("rgb(255 0 0)");
const theme = base.compound();
/*[
  'rgb(0, 127, 255)', 
  'rgb(255, 0, 0)', 
  'rgb(0, 255, 128)'
]*/
```

<h4 id="triadic">Triadic</h4>

A triadic color palette is one which consists of three colors evenly spaced on the color wheel.

```js
new Theme("rgb(255 0 0)").triadic();
/*
[
  'rgb(0, 0, 255)', 
  'rgb(255, 0, 0)', 
  'rgb(0, 255, 0)'
]
*/
```

<h4 id="analagous">Analagous</h4>

An analagous color palette is one in which three colors are positioned next to each other on the color wheel.

```js
new Theme("hsl(240 100 50)").analagous();
/*
[
  'hsl(210deg, 100%, 50%)', 
  'hsl(240deg, 100%, 50%)', 
  'hsl(270deg, 100%, 50%)'
]
*/
```

<h4 id="rectangle">Rectangle</h4>

A rectangle color palette is one which consists of four colors grouped in pairs of complementary colors. Drawing a line through to each color on the color wheel forms the shape of a rectangle. This is also known as a **tetradic** color palette

```js
new Theme("rgb(255 0 0)").rectangle();
/*
[
  'rgb(255, 0, 0)', 
  'rgb(0, 255, 0)', 
  'rgb(0, 255, 255)', 
  'rgb(255, 0, 255)'
]
*/
```

<h4 id="square">Square</h4>

A square color palette is one in which all four colors are at an equal distance on the color wheel

```js
new Theme("hsl(0 100 50)").square();
/*
[
  'hsl(0deg, 100%, 50%)', 
  'hsl(90deg, 100%, 50%)', 
  'hsl(180deg, 100%, 50%)', 
  'hsl(270deg, 100%, 50%)'
]
*/
```
