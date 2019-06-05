---
title: ES6 Didn’t Introduce Default Parameters (Attention to Detail)
date: '2018-07-04'
description: 'Nitpicking at an overlooked JavaScript quirk.'
draft: false
template: 'post'
slug: '/posts/es6-didnt-introduce-default-parameters'
category: 'JavaScript In-Depth'
tags:
  - 'JavaScript In-Depth'
  - 'JavaScript Gotchas'
---

![](https://cdn-images-1.medium.com/max/1600/1*r6RChRNt3ampPhEPoTgfPQ.jpeg)

> [Background vector created by Freepik](https://www.freepik.com/free-vector/hand-holding-magnifying-glass-in-flat-style_2034694.htm)

ES6 didn’t invent default function parameters, it just let us change what the default would be.

Let’s say you have a function, `add`, and use it like so:

```js
add = (x, y) => x + y;
add(10, 20); // 30
```

What happens if you do this?

```js
add(10); // NaN
```

### JavaScript Defaulted the Second Parameter

When your function doesn’t receive an expected parameter, it isn’t just left hanging. JavaScript defaults missing parameters to `undefined`.

We can prove this with two `console.log`s inside of `add`.

```js
add = (x, y) => {
  console.log({ x });
  console.log({ y });

  return x + y;
};

add(10);
// { x: 10 }
// { y: undefined }
// NaN
```

### This Behavior isn’t New

[Section 4.3.9](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%201st%20edition,%20June%201997.pdf#sec-4.3.9) of the **1997** ECMAScript spec gave meaning to `undefined`. So around my 4th birthday, the ECMA guys wrote:

> **Undefined** is a primitive value used when a variable has not been assigned a value.

That includes function parameters.

### ES6 Default Parameters

Here’s how we presently do things:

```js
add = (x = 0, y = 0) => x + y;

add(10); // 10
add(10, undefined); // 10
```

But certain [falsy](https://developer.mozilla.org/en-US/docs/Glossary/falsy) values can cause problems:

```js
add(10, ''); // "10"
add(10, NaN); // NaN
add(10, document.all); // "10[object HTMLAllCollection]"
```

Why?

Because according to that spec, variables are defaulted when they _aren’t assigned a value_. A `null`, `false,` or `''` variable has technically been assigned a value.

This has been the case since the language’s birth, and it isn’t changing.

ES6 introduced a way to _change the default value_, not change the defaulting rules.

### Pre-ES6 Defaulting

In the old days, we defaulted parameters like this:

```js
add = function(x, y) {
  x = x || 0;
  y = y || 0;

  return x + y;
};

add(10); // 10
add(10, undefined); // 10
```

Unlike ES6 default parameters, this protected against [falsy](https://developer.mozilla.org/en-US/docs/Glossary/falsy) values:

```js
add(10, ''); // 10
add(10, NaN); // 10
add(10, document.all); // 10, lolwut?
```

### So ES6 screwed up, right? Wrong.

I remember feeling disappointed when first learning of these subtle, yet important distinctions.

Familiarity bias made me yearn for ES6 to mimic our familiar hack. I didn’t want to be careful when migrating my [logical OR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators)s to default parameters.

But that’s because I misunderstood the problem being solved.

**Problem**: A variable without a value gets `undefined` by default, how can a JavaScript developer change that default within a function?

**Solution**: ES6 Default Parameters.

By all means, if your problem is falsy values in general, keep using logical OR. Just know what knife you’re bringing to the fight.

It’s all in the details.
