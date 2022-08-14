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

The `Color` utility accepts `strings` and `objects` as input. Objects are expected to be shaped in the following ways.

- For `rgb` colors, the keys `r`, `g`, `b` must be present.
- For `hsl` colors, the keys `h`, `s`, `l` must be present.

In both cases an optional `a` key can be used for alpha transparency.

Strings can be any valid (and sometimes even invalid) hex, rgb, or hsl css colors. In most cases operators like `deg` and `%` are not necessary. For `hsl` colors, `deg` and `%` will be assumed unless another operator is supplied.

All of the following examples are acceptable and can be parsed without issue.

- `f0f`, `#f0f`, `#f0f8`, `#ff00ff`, `#ff00ff88`
- `rgb(128, 0, 255)`, `rgb(128, 0, 255, 0.5)`, `rgb(50%, 0, 100%)`, `rgb(50%, 0, 100%, 50%)`
- `hsl(300deg, 100%, 25%)`

The `Color` class accepts several different types of input. You can use any valid css color as a string. It also accepts strings that the browser won't parse. Some examples of both

- `#ff00ff` or `#f0f` or `f0f`
- `rgb(128, 210, 30)` or `rgb(50%, 25%, 87%, 0.5)`
- `hsl(300, 35%, 65%)` or `hsl(300deg, 100%, 50%)`

It also accepts an objects in the shape of

- `{ h, s, l }` or `{ h, s, l, a }`
- `{ r, g, b }` or `{ r, g, b, a }`

## API

The api is pretty straightforward. Let's pick a color and see what we can do with it. I like deepskyblue so that's what I'm going with.

```javascript
const color = new Color("deepskyblue");
```

I like the color but I can never remember it's hex, rgb, or hsl values. Which means if I want to use anything other than the named color in my code, I typically have to google it. But now I can just do this.

```javascript
new Color("deepskyblue").value(); // #00BFFF
```

If you just want the hexadecimal version of the color, you can always use the `value` method to obtain it. We can also just as quickly get the `rgb` or `hsl` values.

Each instance of `Color` has the properties `rgb`, `hsl` and `hex`. We'll refer to these as **color spaces**. Each color space has the methods `array`, `object` and `css`. So if we want the `rgb` version of `deepskyblue` in `array` format, we'd simply do

```javascript
new Color("deepskyblue").rgb.array();
```

If we change our mind and want the object format, we just change method to match our desired output

<!--
```javascript
const rgbArray = new Color('deepskyblue').rgb.array();
//  output: [ 0, 191, 255 ]

const hslObject = new Color('deepskyblue').hsl.object();
//  output: { h: 195, s: 100, l: 50 }
``` -->

```javascript
// strings
new Color("blue");
new Color("rgb(0, 0, 255)");
new Color("rgb(0, 0, 100%)");
new Color("hsl(240, 100%, 50%)");

// objects
new Color({ h: 240, s: 100, l: 50 });
new Color({ h: 240, s: 100, l: 50, a: 0.8 });
new Color({ r: 0, g: 0, b: 255 });
new Color({ r: 0, g: 0, b: 255, a: 0.8 });
```

```javascript
const purple = new Color("purple");

const orange = new Color("#ff8000");

const green = new Color("hsl(120 100% 25% / 0.8)");

const yellow = new Color("rgb(255, 255, 0)");
```

You can then target one of the underlying color spaces.
Each color space (hsl, rgb, hex) is a property on the `Color` instance.

```javascript
const purple = new Color("purple");

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

Every color space has three utility methods for shaping the color data to your preference

```javascript
const color = new Color("blue");

const rgbArray = color.rgb.array(); // [0, 0, 255]
const rgbObject = color.rgb.object(); // { r:0, g:0, b:255 }
const rgbCss = color.rgb.css(); // 'rgb(0, 0, 255)'

const hslArray = color.hsl.array(); // [240, 100, 50]
const hslObject = color.hsl.object(); // { h:240, s:100, l:50 }
const hslCss = color.hsl.css(); // 'hsl(240deg, 100%, 50%)'

const hexArray = color.hex.array(); // ['00', '00', 'ff'];
const hexObject = color.hex.object(); // { r:'00', g:'00', b:'ff'}
const hexCss = color.hex.css(); // '#0000ff'
```

Using object and array destructuring, we can easily access individual values.
This makes it super easy to quickly adjust and fine tune some values.

```javascript
const lime = new Color("lime");
const { h } = lime.hsl.object();

const forestGreen = new Color({ h, s: 61, l: 34 });

console.log(forestGreen.hsl.css());
//  output: hsl(120deg, 61%, 34%)
```

We can also use some of the built in `Color` methods to make it a little cleaner.

```javascript
const lime = new Color("lime");
const forestGreen = lime.saturation(-39).lightness(-16);

console.log(forestGreen.hsl.css());
//  output: hsl(120deg, 61%, 34%)
```

Or if you prefer working with rgb colors

```javascript
const lime = new Color("lime");

const forestGreen = lime.red(34).green(-116).blue(34);

console.log(forestGreen.rgb.css());
//  output: rgb(34, 139, 34)
```

```javascript
const red = new Color("red");

console.log(red.hsl.css());
//  output: hsl(0deg, 100%, 50%);

red.hue(240);

console.log(red.hsl.css());
//  output: hsl(240deg, 100%, 50%);
```

Color modifiers are chainable methods.

```javascript
const brownish = new Color("#765432");

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
const brownish = new Color("#765432");

const color = brownish.set
  .red(15) // red channel set to absolute value of 15
  .green(24) // green channel increased 24 from its current value
  .hue(-34) // hue shifted -34deg from its current position
  .set.blue(44) // blue channel set to absolute value of 44
  .set.saturation(38) // saturation set to absolute value of 38%
  .lightness(12); // lightness increased 12 from its current value
```

You can use also use the `Color` utility to generate an array of colors using the `shades`, `tints`, `faded`, and `vibrant` methods.

The `shades` method generates an array of colors with decreasing lightness values.
The `tints` method generates an array of colors with increasing lightness values.
The `faded` method generates an array of colors with decreasing saturation values.
The `vibrant` method generates an array of colors with increasing saturation values.

Each method takes up to 2 arguments.

- `amount` the amount to decrease or increase on each interation.
- `limit` only generate up to this many colors.

### Examples:

```javascript
const raspberry = new Color("rgb(128, 45, 90)");

// generates an array containing 3 colors with each color being 10% darker than the previous
const shades = raspberry.hsl.shades(10, 3);

// generates an array containing 4 color with each color being 15% lighter than the previous
const tints = raspberry.rgb.tints(15, 4);

// generates an array containing 6 colors with each color being 5% less saturated than the previous
const fades = raspberry.hex.faded(5, 6);

// generates an array containing 4 colors with each color being 12% more saturated than the previous
const colorful = raspberry.hsl.vibrant(12, 4);

console.log(shades);
/*
[
  'hsl(327deg, 48%, 24%)',
  'hsl(327deg, 48%, 14%)',
  'hsl(327deg, 48%, 4%)'
]
*/

console.log(tints);
/*
[
  'rgb(185, 65, 131)',
  'rgb(207, 119, 168)',
  'rgb(227, 176, 204)',
  'rgb(247, 232, 240)'
]
*/

console.log(fades);
// [ '#7c315a', '#78365a', '#733a5a', '#6f3e59', '#6b4359', '#664758' ]

console.log(colorful);
/*
[
  'hsl(327deg, 60%, 34%)',
  'hsl(327deg, 72%, 34%)',
  'hsl(327deg, 84%, 34%)',
  'hsl(327deg, 96%, 34%)'
]
*/
```

## Reference

- ### **`Color`**
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

<!--
## Methods available on the `Color` utility

#### Color modifications

- `hue`
- `saturation`
- `lightness`
- `red`
- `green`
- `blue`

#### Color information

- `luminance`
- `contrast`

#### Static methods

- `Color.contrast(color1, color2)`
- `Color.random()` -->
