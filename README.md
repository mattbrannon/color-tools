# color-tools

A lightweight library for color validation, manipulation, conversion, theme and palette generation

## Installation

Color Tools is available on Npm. You can install it using the package manager of your choice.

```bash
# NPM
npm install color-tools

# Yarn
yarn add color-tools

# Pnpm
pnpm add color-tools
```

## Usage

This package uses **named exports** and supports both CommonJS and ESModules.

### ES Modules

```javascript
import { Color, Theme, convert } from "color-tools";
```

### Common JS

```javascript
const { Color, Theme, convert } = require("color-tools");
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

### Color Prototype Methods

The methods listed below are globally available per instance of `Color`. There's no need to target a specific color space.

- [`value()`](#color-prototype-value) A convenience method that returns the current instance's color value based on the preferred color space and data types
- [`contrast()`](#color-prototype-contrast) Returns the contrast ratio between the current color instance and another color. accepts the same input parameters as `Color` minus the config
- [`luminance()`](#color-prototype-luminance) Returns a floating point number between 0 and 1 representing the color's luminance value
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

## Examples

Let's look at some examples of the methods available and what you can do with them.

### Color prototype value

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

### Color prototype contrast

Get the contrast ratio between the current color and another. Accepts the same input formats as `Color`

```js
const orange = new Color("orange");
const contrastRatio = orange.contrast("red"); // 2.02
```

### Color prototype luminance

Get the relative luminance value of the current color Returns a value between 0 - 1 with 0 being total darkness and 1 being all white

```js
new Color("#8faba2").luminance(); // 0.3757409455965292
```

### Using a config object

By passing in a configuration object as the second argument, we can define the color space and data type of the output provided by the `value` method.

```js
// define the output as an array of RGB values
const blue = new Color("blue", {
  colorSpace: "rgb",
  dataType: [],
});

blue.value(); // [0, 0, 255];

// define the output as a css HSL color
const red = new Color("rgb(255 0 0)", {
  colorSpace: "hsl",
  dataType: "",
});

red.value(); // hsl(0deg, 100%, 50%);

// define the output as a css Hex color
const green = new Color(
  { h: 120, s: 100, l: 25 },
  {
    colorSpace: "hex",
    dataType: "",
  }
);

green.value(); // #008000
```

<!--
```javascript
const purple = new Color('purple');
const orange = new Color('#ff8000');
const green = new Color('hsl(120 100% 25% / 0.8)');
const yellow = new Color('rgb(255, 255, 0)');
const red = new Color([255, 0, 0], { colorSpace: 'rgb' });
const blue = new Color([240, 100, 50], { colorSpace: 'hsl' });
```

You can then target one of the underlying color spaces.
Each color space (hsl, rgb, hex) is a property on the `color` object.

```javascript
const purple = new Color('purple');
const hsl = purple.hsl.css();
console.log(hsl);
//  output: hsl(300deg, 100%, 25%)

const rgb = purple.rgb.css();
console.log(rgb);
//  output: rgb(128, 0, 128)

const hex = purple.hex.css();
console.log(hex);
//  output: #800080
```

Each color space has several methods.
In the examples above we're using the `.css()` function.
We can also get access to the raw values by using the `.object()` or `.array()` methods.

The currently available methods for each color space are as follows:

- `css()`
- `array()`
- `object()`
- `tints()`
- `shades()`
- `faded()`
- `vibrant()`

```javascript
// short and long hex codes are supported.
// The leading # is optional as well
const color = new Color('#0f0');
const object = color.rgb.object();
console.log(object);
//  output: { r: 0, g: 255, b: 0 }

const array = color.hsl.array();
console.log(array);
//  output: [ 120, 100, 50 ]

const string = color.hex;
console.log(string);
//  output: '#00ff00'
```

We can also use some of the built in `Color` methods to make it a little cleaner.

```javascript
const lime = new Color('lime');
const forestGreen = lime.saturation(-39).lightness(-16);
console.log(forestGreen.hsl.css());
//  output: hsl(120deg, 61%, 34%)
```

Or if you prefer working with rgb colors

```javascript
const lime = new Color('lime');
const forestGreen = lime.adjust.red(34).green(-116).blue(34);
console.log(forestGreen.rgb.css());
//  output: rgb(34, 139, 34)
```

Color modifiers are chainable methods.

```javascript
const brownish = new Color('#765432');
const color = brownish.adjust
  .red(15)
  .green(24)
  .hue(-34)
  .blue(44)
  .saturation(-8)
  .lightness(12);
```

It is important to note that the values passed in using `adjust` will modify the values relative to their current value.
If you want to set an absolute value, use the `set` property instead.
Note that any chained modifers wihtout `set` attached will modify values relative to their current state.

```javascript
const brownish = new Color('#765432');
const color = brownish.set
  .red(15) // red channel set to absolute value of 15
  .green(24) // green channel increased 24 from its current value
  .hue(-34) // hue shifted -34deg from its current position
  .set.blue(44) // blue channel set to absolute value of 44
  .set.saturation(38) // saturation set to absolute value of 38%
  .lightness(12); // lightness increased 12 from its current value
``` -->

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
