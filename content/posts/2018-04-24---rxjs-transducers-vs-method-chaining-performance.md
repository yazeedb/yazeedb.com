---
title: RxJS Transducers vs Method Chaining Performance
date: '2018-04-24'
description: "I'm not usually a fan of profiling code snippets because it's usually impractical, but this is just a fun experiment."
draft: false
template: 'post'
slug: '/posts/rxjs-transducers-vs-method-chaining-performance'
category: 'RxJS'
tags:
  - 'RxJS'
  - 'Method chaining'
  - 'Performance'
---

![](https://cdn-images-1.medium.com/max/1600/1*hOitObdDgpP5r1BxJN7AyA.jpeg)

After reading about transducers and why they’re awesome, I played around with some large arrays and measured their timings.

If you’re new to transducers I’ll quickly explain here, but _highly_ recommend you [read this intro](https://medium.com/@roman01la/understanding-transducers-in-javascript-3500d3bd9624).

### Max 10 Million Salaries

Let’s make an array of 10 million users, each with a six-figure salary:

```js
users = Array(10000000)
  .fill()
  .map((_, index) => ({
    name: `User ${index + 1}`,
    salary: Math.floor(Math.random() * 999999) + 100000
  }));
```

![](https://cdn-images-1.medium.com/max/1600/1*fTn8fCrWdBtClxINRd9byw.png)

Now we want to:

- Get the _even-numbered_ salaries using `filter()`.
- Calculate the weekly paycheck using `map()`.
- Get the highest paycheck using `reduce()`.

We’ll focus on two implementations…

#### Method Chaining

As of this writing, method chaining’s more familiar to me.

`map`, `filter`, and `reduce` are array methods. They also return an array, so we can chain them.

Let’s use `console.time` and `console.timeEnd` to measure how long the operation takes.

```js
getMaxEvenPaycheck = (users) => {
  console.time('Method chaining');

  const max = users
    .filter((user) => user.salary % 2 === 0)
    .map((user) => user.salary / 52)
    .reduce((a, b) => Math.max(a, b));

  console.timeEnd('Method chaining');

  return max;
};
```

Here’s our result:

![](https://cdn-images-1.medium.com/max/1600/1*4mVqHJPxoey8WzoV-Zko6A.png)

This works just fine! The operation took **about 3.56 seconds**.

Our speed, however, can improve.

Since methods like `map`, `reduce`, and `filter` return arrays, chaining them means you’re wasting time by creating intermediate arrays.

#### Transducers

Instead of intermediate arrays, a transducer processes one element at a time, like an assembly line.

We get the same result in less time.

My favorite library for this is RxJS. The concept is similar, but we’re operating on one element at a time.

```js
getMaxEvenPaycheck = (users) => {
  const { filter, map, max } = Rx.operators;

  console.time('Transducer');

  return Rx.Observable.from(users).pipe(
    filter((user) => user.salary % 2 === 0),
    map((user) => user.salary / 52),
    max()
  );
};

getMaxEvenPaycheck(users).subscribe((max) => {
  console.log('max:', max);
  console.timeEnd('Transducer');
});
```

![](https://cdn-images-1.medium.com/max/1600/1*nHozOoqU3LKQ8njswRyudA.png)

By streaming `users` and manipulating elements one-by-one with RxJS operators, our performance increased by about 75%!

Here’s the screenshots side by side, for reference:

![](https://cdn-images-1.medium.com/max/1600/1*yT5zQGBqD97nDxYh2nAKRQ.png)

I’m exploring this topic more, and would love any resources you could throw at me!
