---
title: How JavaScript rest parameters actually work
date: '2017-12-19'
description: 'A deep dive into this infinitely useful functional programming concept.'
draft: false
template: 'post'
slug: '/posts/how-does-javascripts-rest-parameters-actually-work'
category: 'JavaScript In-Depth'
tags:
  - 'JavaScript In-Depth'
---

![](https://cdn-images-1.medium.com/max/1600/1*10krG9dLp-2JAyOo1TNVPQ.jpeg)

[My last article](how-do-object-assign-and-spread-actually-work) covered **spread** syntax and `Object.assign` in detail, but glossed over **rest parameters**in the interest of time. I do, however, feel they deserve a closer look.

Let’s begin at the trusty [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters):

> The **rest parameter** syntax allows us to represent an indefinite number of arguments as an array.

That last part, “as an array”, is interesting, because before ES6 arrow functions, we used the `arguments` **object**. It was array-_like_, but not actually an array.

Example:

```js
function returnArgs() {
  return arguments;
}
```

![](https://cdn-images-1.medium.com/max/1600/1*Xuhn5NvMtl3Mev2FqL-oug.png)

We see `arguments` has indices, so it’s loop-able:

```js
function loopThruArgs() {
  let i = 0;

  for (i; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}
```

![](https://cdn-images-1.medium.com/max/1600/1*jU_wgPi5ILJrOQ7F0J8sUA.png)

But it’s not an array.

![](https://cdn-images-1.medium.com/max/1600/1*KNeT3_DX6pQE3TWkjzJiMg.png)

Let’s contrast that with a function using **rest** parameters:

```js
es6Params = (...params) => {
  console.log('Array?', Array.isArray(params));
  return params;
};
```

![](https://cdn-images-1.medium.com/max/1600/1*cPEtXM-jUWC3oDsCHU2keg.png)

It’s _just an array_, meaning we can use any of the `Array` methods on it!

Let’s write a function that **doubles** and **sums** every parameter you give it.

```js
double = (x) => x * 2;
sum = (x, y) => x + y;

doubleAndSum = (...numbers) => numbers.map(double).reduce(sum, 0);
```

![](https://cdn-images-1.medium.com/max/1600/1*Hdk9NP-ZGteTef7v5RPBEg.png)

And you can name as many parameters as you want in your function before using **rest**.

```js
someFunction = (a, b, c, ...others) => {
  console.log(a, b, c, others);
};
```

![](https://cdn-images-1.medium.com/max/1600/1*NZVvRUAyRffRtcckUIPdLA.png)

But it has to be the last one specified, since it captures the _rest_ of your arguments. 👏

![](https://cdn-images-1.medium.com/max/1600/1*xjYSLt00rbmHdUtBYWUPMg.png)

I think we know what’s happening under the hood, but let’s be thorough. Check out [babeljs.io/repl](https://babeljs.io/repl), where you can write ES6+ code and have it transpiled into ES5 in real-time.

![](https://cdn-images-1.medium.com/max/1600/1*qYBa9yW0izOhXaTfP8IBKw.png)

That’s a neat little function, let’s expand it and add comments.

```js
someFunction = function someFunction() {
  var _len = arguments.length;

  // create an array same length
  // as the arguments object
  var args = Array(_len);
  var i = 0;

  // iterate through arguments
  for (i; i < _len; i++) {
    // assign them to
    // the new array
    args[i] = arguments[i];
  }

  // and return it
  return args;
};
```

Since Babel wrote an old-school function for us, it can access the `arguments` object! `arguments` has indices and a `.length` property, which is all we need to create a perfect clone of it.

This is why we can use Array methods like `map`, `filter`, `reduce` on **rest** parameters, because it creates an Array clone of `arguments`.

Have fun _rest_-ing!
