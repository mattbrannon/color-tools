# color-tools

### A set of utility functions for manipulating and converting colors from one color space to another

The idea here is to simplify working with different color spaces.

### Examples

The `Color` class utility is versatile. It is able to convert between hexadecimal, rgb, and hsl color spaces. Alpha channels are supported as well. It also accepts any of the 140 color names recognized by modern browsers.

```javascript
const purple = new Color("purple");

const orange = new Color("#ff8000");

const green = new Color("hsl(120 100% 25% / 0.8)");

const yellow = new Color("rgb(255, 255, 0)");
```

You can then target one of the underlying color spaces.
Each color space (hsl, rgb, hex) is a property on the `color` object.

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
const color = new Color("#0f0");

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
const forestGreen = lime.adjust.saturation(-39).lightness(-16);

console.log(forestGreen.hsl.css());
//  output: hsl(120deg, 61%, 34%)
```

Or if you prefer working with rgb colors

```javascript
const lime = new Color("lime");

const forestGreen = lime.adjust.red(34).green(-116).blue(34);

console.log(forestGreen.rgb.css());
//  output: rgb(34, 139, 34)
```

The `adjust` property signals that we want to create new instance of the `Color` class.
In the code above we are first creating a new color and assigning it the label `forestGreen`.
We then make our modifications on this new instance while leaving the `lime` instance unchanged.

We can also modify values directly on the instance by removing the `adjust` property.

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
- `Color.random()`
