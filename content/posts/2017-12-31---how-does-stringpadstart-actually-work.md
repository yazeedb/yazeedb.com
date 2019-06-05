---
title: How does String.padStart actually work?
date: '2017-12-31'
description: 'A deep dive into this magical method.'
draft: false
template: 'post'
slug: '/posts/how-does-string-padstart-actually-work'
category: 'Code Snippets Explained'
tags:
  - 'String.padStart'
  - 'Vanilla JavaScript'
  - 'Deep dive'
  - 'Code Snippets Explained'
---

[Previously](youtube-durations-in-4-lines-of-javascript), I shared my usage of `padStart` to elegantly replace what would’ve been loads of `if` statements. This magical method threw me off my rocker. I simply couldn’t believe it existed.

### What it does

[Mozilla Developer Network (MDN) Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart):

> The `padStart()` method pads the current string with another string (repeated, if needed) so that the resulting string reaches the given length. The padding is applied from the start (left) of the current string.

Keep **prepending a string** to **another string** until the **target length** is met.

![](https://cdn-images-1.medium.com/max/1600/1*XgjBHs6faLKurpx6WOxmaQ.png)![](https://cdn-images-1.medium.com/max/1600/1*kvWWV9-Le3akATlMGLFIUA.png)

If the length is already less than the original string’s length, nothing happens.

![](https://cdn-images-1.medium.com/max/1600/1*tmVv1tdy9Ye099ca2YBD4w.png)

And since `padStart` returns a string, we can chain its methods.

![](https://cdn-images-1.medium.com/max/1600/1*LhQzpSiSSlvTDkcHyL8HtA.png)

See? 1, 2, 3, 4, and 5 are all less than or equal to `world`'s length of 5, so `padStart` doesn’t do anything.

### Browser support

Unfortunately, support’s currently “meh”

![](https://cdn-images-1.medium.com/max/1600/1*OsJkuMt7gxC407zlxv1Imw.png)Desktop support![](https://cdn-images-1.medium.com/max/1600/1*dtwqtBR1j9vDDi2AkpP61Q.png)Mobile support

You can either use [babel-polyfill](http://babeljs.io/#polyfill) or [the polyfill by MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart#Polyfill).

Here’s MDN’s polyfill.

![](https://cdn-images-1.medium.com/max/1600/1*Zf4kxLLpi3CsYN94Nl4axQ.png)

### Some points of interest:

- **Prototypes** (lines 1 and 2)
- **Bitwise operators** (line 4)
- `padString.repeat` (line 14)
- `padString.slice` (line 17)

I’m down to step through them if you are 😁

Lines 1 and 2 aren’t that bad: “If `padStart` isn’t supported by the browser, let’s create our own `padStart` and add it” (that’s polyfill-ing in a nutshell).

A common way to check a method’s browser support is to inspect its object’s prototype. Since `padStart` is a string method, it should exist on `String.prototype`.

My old version of Safari doesn’t support `padStart`.

![](https://cdn-images-1.medium.com/max/1600/1*8zmT7mTVUn2Q4MqunHXicg.png)My Safari’s padStart support

But my Chrome and Firefox do.

![](https://cdn-images-1.medium.com/max/1600/1*paNRJ_6YQ9ThHHxkwEpZwA.png)Chrome padStart support![](https://cdn-images-1.medium.com/max/1600/1*jn3Exskqn_8EAQORGs_FKg.png)Firefox padStart support

Consider this safety check on line 1

```js
if (!String.prototype.padStart) {
}
```

That `if` statement would only return `true` in my old Safari. It returns `false` in Chrome/Firefox, so no polyfill-ing happens.

![](https://cdn-images-1.medium.com/max/1600/1*Zf4kxLLpi3CsYN94Nl4axQ.png)

Moving on, line 2 creates a new function called `padStart` and assigns it to `String.prototype.padStart`. Because of JavaScript’s inheritance model, any string created afterwards can use `padStart`.

This function takes two parameters

1\. `targetLength`: How long should the resulting string be?

2\. `padString`: What are we padding it with?

Let’s shower this code with `debugger` statements.

![](https://cdn-images-1.medium.com/max/1600/1*ttFL0luCSlQzdyOh-lpzOA.png)

I also removed that `if` statement from line 1, so even the native `String.prototype.padStart` will be overridden by this function–makes it useful if you want to debug in Chrome.

**_Don’t override prototypes in production, kids!_**

![](https://cdn-images-1.medium.com/max/1600/1*srYXzRnU1Qt46J3x91vKjQ.png)

Using our initial example

```js
'world'.padStart(11, 'hello ');
```

![](https://cdn-images-1.medium.com/max/1600/1*lFrlt-xxEwyByiesDNqHpw.png)

Check out line 2\. We see that `targetLength` and `padString` made their way into our function. No craziness yet, but it’s coming. I’ve been avoiding line 5 long enough.

### Bitwise operators

The comment above line 5 briefly describes its purpose: “If `targetLength` is a number, round it down. If it’s not a number, make it 0”.

**Bitwise operators** make this possible.

`targetLength >> 0;`

This operator `>>` is known as a [sign-propagating right shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Right_shift) (LOLWUT?).
You use it with two numbers

`a >> b`

**What this does:**

1.  `a` is converted into binary ([details here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers)).
2.  Binary `a` gets _right-shifted_ `b` times.

Our `targetLength` is 11–that’s 1011 in binary (here’s a [converter](https://www.binaryhexconverter.com/binary-to-decimal-converter) if you don’t believe me 😉).

A side effect of converting to binary is that numbers get rounded down and _most_ non-numbers become 0.

Try the following examples

![](https://cdn-images-1.medium.com/max/1600/1*G9R342JuTLzAhZ3zXB5qYw.png)

See? Fractions become whole numbers. Non-numbers become 0, with one notable exception…

![](https://cdn-images-1.medium.com/max/1600/1*S5QRnVnjsJaP6LSR-f1yVg.png)

Binary is just 1’s and 0’s, right? Those 1’s and 0’s represent “on” and “off” switches–`true` and `false`. `true`'s binary form is 1, and `false`'s binary form is 0\. Just keep that in mind.

So now that we’ve “sanitized” `targetLength`, we begin the right-shifting.

Right-shift means you move each bit to the right `n` times. That’s it.

Here’s a PowerPoint visualization of `11 >> 1` (I forgot how great PowerPoint actually is).

![](https://cdn-images-1.medium.com/max/1600/1*jANUTARhf9DaSPo_FdobsQ.gif)

Turn 11 into 1011 and right-shift it 1 time. Your end result is 101, which is 5 in binary.

![](https://cdn-images-1.medium.com/max/1600/1*hWhIMjgIzV8HsBHsoqaXkw.png)

But our code says `targetLength >> 0`.

### So we’re right-shifting 0 times…

The whole point of right-shifting 0 times is to abuse that side effect of converting `targetLength` into binary. We don’t actually want to shift anything because that’ll change the value.

### Moving on

![](https://cdn-images-1.medium.com/max/1600/1*9fp5LQLp8M02XXNypggPAw.png)

Jump to line 7’s `debugger` now. `targetLength` has been sanitized. **Next!**

![](https://cdn-images-1.medium.com/max/1600/1*5olkuOlk90Alu9tVfbjS9Q.png)

**Line 11.**

```js
padString = String(padString || ' ');
```

If we don’t provide a `padString` argument, it defaults to an empty space. I actually never noticed until now.

![](https://cdn-images-1.medium.com/max/1600/1*esccGoVlxpemIBmMunjmXA.png)

**Line 17.**

Notice how line 13 had another safety check, “If the original string’s length is greater than `targetLength`, don’t do anything. Just return the original string”

That makes sense because if our `targetLength` is 1, but the string is already 10 characters, what’s the point? We demonstrated that earlier with

```js
// just returns 'world'
'world'.padStart(0, 'hello ');
```

Line 18 determines how many _more_ characters we need by subtracting `targetLength` from the original string’s length. We need 6, in this case.

![](https://cdn-images-1.medium.com/max/1600/1*fNa4w2qk360VICQLqvp6jQ.png)

**Line 27.**

We skipped that `if` statement on line 20 because `targetLength` and `padString.length` just happened to be the same, but we’ll revisit that soon.

For now, we’re stopped right before line 29\. Let’s break it up.

```js
padString.slice(0, targetLength);
```

The good old `String.prototype.slice` method.

[**MDN Docs**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice):

> The `slice()` method extracts a section of a string and returns it as a new string.

It’s index-based, so we’re starting at index 0 of `padString`, and grabbing the amount of characters equal to `targetLength`. It’s kind of like

![](https://cdn-images-1.medium.com/max/1600/1*5fgldncMrn1M42TDNexc5w.png)

Return that sliced `padString` combined with the original string, and you’re done!

![](https://cdn-images-1.medium.com/max/1600/1*dPcP4geY5bM3H_Qu53rF3Q.png)

### _Almost_ done

I’d normally conclude here, but we haven’t explored that `if` statement on line 20\. To make sure we hit it this time, let’s try another earlier example

```js
'yo'.padStart(20, 'yo');
```

![](https://cdn-images-1.medium.com/max/1600/1*xMe4-5cz9E4TcaxRV-OpCw.png)

I skipped to line 20 because we already know what happens up to this point.

`if (targetLength > padString.length)`

`targetLength` is 18, and `padString` is `'yo'`, with 2 as its length.
18 > 2, so what next?

```js
padString += padString.repeat(targetLength / padString.length);
```

Remember, `padStart` returns a _sliced_ `padString` + original string. If you want to pad `'yo'` with `'yo'` until it’s 20 characters long, you’ll have to repeat many times. This is where that logic happens, using `padString.repeat`.

[**MDN Docs**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat):

> The `repeat()` method constructs and returns a new string which contains the specified number of copies of the string on which it was called, concatenated together.

So it copy/pastes the string `n` times.

In order to find out how many repeats we need, divide `targetLength` by `padString.length`.

![](https://cdn-images-1.medium.com/max/1600/1*8uNfkR56h7AhooHJILFSJQ.png)

Repeat `'yo'` 9 times and get a string of `'yo'`s that is 18 characters long. Add that to your original `'yo'`, and your final count is 20 characters.

![](https://cdn-images-1.medium.com/max/1600/1*0A9siQbKWnKn6cFuidfNMQ.png)

Mission accomplished. Until next time!
