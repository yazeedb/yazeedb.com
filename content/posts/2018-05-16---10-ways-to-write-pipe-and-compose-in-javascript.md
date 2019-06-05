---
title: 10 Ways to Write pipe and compose in JavaScript
date: '2018-05-16'
description: 'All 10 roads lead to pipe and compose.'
draft: false
template: 'post'
slug: '/posts/10-ways-to-write-pipe-and-compose-in-javascript'
category: 'Functional Programming Basics'
tags:
  - 'Functional Programming'
  - 'Functions'
  - 'Pipe'
  - 'Compose'
---

![](https://cdn-images-1.medium.com/max/1600/1*I2oy7YWlgX6Ej9uGSOGD7Q.jpeg)

`compose`, and especially `pipe`, are easily among my favorite functions.

This article’s just to have fun and explore different implementations of these two gems. I recommend you understand what they do before reading this; perhaps check out [my deep-dive here](https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937).

```js
pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
```

Classic.

Starting with the leftmost function, reduce an array of functions to a single value by calling the next function with the previous one’s output.

```js
double = (x) => x * 2;
add1 = (x) => x + 1;

pipe(
  double,
  add1
)(100); // 201
```

I discovered this implementation through [Eric Elliott](https://medium.com/@_ericelliott), and wrote a deep-dive on it [here](https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937).

Use `reduceRight` to implement `compose`. Now your functions are called from right, to left.

```js
compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

compose(
  double,
  add1
)(100);
// 202
```

You could also reverse `fns` and keep using `reduce` (less performant).

```js
compose = (...fns) => (x) => fns.reverse().reduce((v, f) => f(v), x);

compose(
  double,
  add1
)(100); // 202
```

`reverse` mutates the array, though, so you might copy it first (even less performant).

```js
compose = (...fns) => (x) => [...fns].reverse().reduce((v, f) => f(v), x);

compose(
  double,
  add1
)(100); // 202
```

Use `reduceRight` to go back to `pipe`.

```js
pipe = (...fns) => (x) => [...fns].reverse().reduceRight((v, f) => f(v), x);

pipe(
  double,
  add1
)(100); // 201
```

### But They’re All Unary

All the above snippets, by the way, are _unary_. Each function may only accept _a single argument_.

If your pipeline’s first function must be _nAry_ (accepting `n` arguments), try this implementation:

```js
multiply = (x, y) => x * y;
pipe = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

pipe(
  multiply,
  add1
)(10, 10); // 101
// Takes multiple args now
```

This snippet’s from [30secondsofcode.org](https://30secondsofcode.org/adapter#pipefunctions). Your first (leftmost) function may accept `n` arguments–all others must be unary.

Again, `reduceRight` gives us `compose`. Now your rightmost function may accept `n` arguments. Let’s move `multiply` to the end of the chain.

```js
compose = (...fns) => fns.reduceRight((f, g) => (...args) => g(f(...args)));

compose(
  add1,
  multiply
)(10, 10); // 101
// Takes multiple args now
// Put multiply first
```

Like before, you could reverse the `fns` array and keep using `reduce`:

```js
compose = (...fns) =>
  [...fns].reverse().reduce((f, g) => (...args) => g(f(...args)));

compose(
  add1,
  multiply
)(10, 10); // 101
```

If you want to keep `reduce` without the slight performance hit, just switch `g` and `f`:

```js
compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

compose(
  add1,
  multiply
)(10, 10); // 101
```

And use `reduceRight` to switch back to `pipe`.

```js
pipe = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));

pipe(
  multiply,
  add1
)(10, 10); // 101
// put multiply first now
```

### Conclusion

Phew! That’s a lot of ways to pipe and compose!

It just proves that, no matter what, you _must loop over an array of functions, calling the next one with the previous one’s result_.

Doesn’t matter if you use `reduce`, `reduceRight`, switch the invocation order, or whatever else.

> If you want `pipe()`, go left-to-right. Want compose()? Go right-to-left.

Plain and simple. Until next time!
