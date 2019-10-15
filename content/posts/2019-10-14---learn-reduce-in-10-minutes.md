---
title: Learn Reduce in 10 Minutes
date: '2019-10-14'
description: 'Hopefully this reduces the confusion.'
draft: false
template: 'post'
slug: '/posts/learn-reduce-in-10-minutes'
category: 'JavaScript'
coverImageUrl: '/media/imgs-learn-reduce-in-10-minutes/cover-image.jpg'
tags:
  - 'JavaScript'
  - 'JavaScript In-depth'
  - 'Functional Programming'
---

## Hopefully this reduces the confusion.

In my experience learning and teaching JavaScript, `reduce` is one of the toughest concepts to crack. In this article I'll try to address one core question...

> What is `reduce` and why is it called that?

## Reduce Has Many Names

Some of them, [according to Wikipedia](<https://en.wikipedia.org/wiki/Fold_(higher-order_function)>), are

- Reduce
- Fold
- Accumulate
- Aggregate
- Compress

They all hint at the core idea. It's all about **breaking a structure down into a single value**.

> Reduce - A function that folds a list into any data type.

It's like folding a box! With `reduce` you can turn an array `[1,2,3,4,5]` into the number `15` by adding them all up.

<img src="/media/imgs-learn-reduce-in-10-minutes/folding-box.gif" alt="folding-box" />

### The Old Fashioned Way

Normally you'd need a loop to "fold" a list into a number.

```js
const add = (x, y) => x + y;
const numbers = [1, 2, 3, 4, 5];
let total = 0;

for (let i = 0; i < numbers.length; i++) {
  total = add(total, numbers[i]);
}

console.log(total); // 15
```

### The Cool Kids Way

But with `reduce` you can plug in your `add` function and the loop is handled for you!

```js
const add = (x, y) => x + y;
const numbers = [1, 2, 3, 4, 5];

numbers.reduce(add);
// 15
```

You're literally folding 1-5 to get 15.

<img src="/media/imgs-learn-reduce-in-10-minutes/folding-box.gif" alt="folding-box" />

## The Big Three

Before diving deeper I think it's important to analyze `reduce` alongside its famous companions–`map` and `filter`. They heavily overshadow `reduce`, making it look like the weirdo of the bunch.

![creepy-reduce](/media/imgs-learn-reduce-in-10-minutes/creepy-reduce.jpeg)

Despite their respective popularities, combining these three titans allows you to manipulate lists however you want!

![the-big-three](/media/imgs-learn-reduce-in-10-minutes/the-big-three.jpeg)

For a moment humor me and pretend JavaScript can't use loops, recursion, or array methods like `forEach`, `some`, `find`, etc. The only three left are `map`, `filter`, and `reduce`.

Our job as programmers hasn't changed, however. We still need three types of functionality in our applications.

1. Transforming lists
2. Filtering lists
3. Turning lists into other data types (number, string, boolean, object, etc).

Let's see how our only tools–`map`, `filter`, `reduce`–handle this challenge.

### ✅ Array.map transforms lists

Turning lists into other lists is Front-End development in a nutshell. Therefore `map` covers much of your list work.

Let's say our application calls an API for the list of users, and we need every user's name displayed on the screen. Simply create a function that returns _one_ user's name.

```js
const getUserName = (user) => user.name;
```

And plug it into `map` to run that against an entire list of users.

```js
users.map(getUserName);
// ['Marie', 'Ken', 'Sara', 'Geoff', ...]
```

### ✅ Array.filter judges lists

What if you want a new list with some items removed, like when the user searches their contact list? Simply create a function that returns `true` or `false` based on its input (a predicate).

```js
const isEven = (x) => x % 2 === 0;
```

And plug it into `filter` to apply that against an entire list.

```js
const numbers = [1, 2, 3, 4, 5];
numbers.filter(isEven);
// [2, 4]
```

### ✅ Array.reduce does all that, and more

When `map` and `filter` aren't enough, you bring in the big guns. The `reduce` method can do what `map`/`filter` do, and anything else that involves looping over an array.

![reduce-will-take-this](/media/imgs-learn-reduce-in-10-minutes/reduce-will-take-this.png)

For example how would you calculate the total age of your users? Our users' ages are 25, 22, 29, and 30.

```js
const users = [
  { name: 'Marie', age: 25 },
  { name: 'Ken', age: 22 },
  { name: 'Sara', age: 29 },
  { name: 'Geoff', age: 30 }
];
```

`map` and `filter` can only return arrays, but we need a `number`!

```js
users.map(?);
users.filter(?);

// Nope! I need a number, not arrays.
```

If we had loops we'd just go through `users` and tally their ages in a counter! Well what if I told you it's even easier with `reduce`?

```js
users.reduce((total, currentUser) => total + currentUser.age, 0);
// 106
```

![fallout-hold-up](/media/imgs-learn-reduce-in-10-minutes/fallout-hold-up.jpeg)

## Log it out

I think the easiest way to digest this is to `console.log` at each step.

```js
const users = [
  { name: 'Marie', age: 25 },
  { name: 'Ken', age: 22 },
  { name: 'Sara', age: 29 },
  { name: 'Geoff', age: 30 }
];

const reducer = (total, currentUser) => {
  console.log('current total:', total);
  console.log('currentUser:', currentUser);

  // just for spacing
  console.log('\n');

  return total + currentUser.age;
};

users.reduce(reducer, 0);
```

Here's a screenshot from Chrome DevTools.

![reduce-screenshot-1](/media/imgs-learn-reduce-in-10-minutes/reduce-screenshot-1.png)

## Break It Down

As you just saw, `Array.reduce` takes two parameters.

1. The reducer
2. An initial value (optional)

The reducer is the function doing all the work. As `reduce` loops over your list, it feeds two parameters to your reducer.

1. An accumulator
2. The current value

The current value is self-explanatory, just like when you use `array[i]` in a regular loop. The accumulator, though, is a scary-sounding computer science term that's actually simple.

### Accumulator is the eventual return value

When you're looping through the `users`, how are you keeping track of their total age? You need some _counter_ variable to hold it. **That's the accumulator.** It's the eventual value `reduce` will spit out when it's done.

At every step in the loop, it feeds the last accumulator and the current item to your reducer. Whatever the reducer returns becomes the next accumulator. The cycle ends when the list is finished and you have a single reduced value.

![reduce-screenshot-1](/media/imgs-learn-reduce-in-10-minutes/reduce-screenshot-1.png)

### Initial value is optional

The second parameter to `reduce` is the initial value. If you don't supply it, `reduce` defaults to the list's first element.

This is fine if you're summing plain numbers.

```js
[1, 2, 3].reduce((total, current) => total + current);
// 6
```

But breaks if you use an object or array because you shouldn't be adding those things up.

```js
[{ age: 1 }, { age: 2 }, { age: 3 }].reduce((total, obj) => total + obj.age);

// [object Object]23
// Broken result, use an initial value.
```

In this case you should give the initial value of `0`.

```js
[{ age: 1 }, { age: 2 }, { age: 3 }].reduce((total, obj) => total + obj.age, 0);

// 6
// Initial value fixes it.
// 0 + 1 + 2 + 3 = 6
```

## Let's Recreate Reduce

> What I cannot create, I do not understand - Richard Feynman

Hopefully I've helped you so far. Now it's time to write your own `reduce` function to really hammer this home.

It'll be a function that takes three parameters.

1. A reducer
2. An initial value
3. An array to operate on

For this demo the initial value is not optional.

```js
const reduce = (reducer, initialValue, array) => {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    accumulator = reducer(accumulator, currentItem);
  }

  return accumulator;
};
```

Amazing just 10 lines of code, 6 key steps. I'll go one by one.

1. Define `reduce` and its three parameters.
2. Initialize the `accumulator` using the provided `initialValue`. This variable will change every loop.
3. Start looping over the array.
4. Capture the array's `currentItem` for that cycle.
5. Call `reducer` with the `accumulator` and `currentItem`, saving it as a new `accumulator`.
6. When the loop's finished and the `accumulator` is done changing, return it.

## Miscellaneous History

I wanted to talk more about the history of `reduce` and reducers, but wasn't quite sure where to fit it. Nonetheless it's very interesting!

### Reducers are ancient

![redux-did-not-invent-reducers](/media/imgs-learn-reduce-in-10-minutes/redux-did-not-invent-reducers.jpeg)

[Redux](https://redux.js.org) made reducers cool to JavaScript developers, but it didn't invent them. It's actually not clear who coined the term, but here's a few references I dug up.

### Recursion Theory (1952)

[This book](https://www.amazon.com/Introduction-Metamathematics-Stephen-Cole-Kleene/dp/0923891579) from 1952 discusses `reduce` from a metamathematical perspective, referring to it as `fold`.

### Lisp Programmer's Manual (1960)

The [Lisp Programmer's Manual](https://kyber.io/rawvids/LISP_I_Programmers_Manual_LISP_I_Programmers_Manual.pdf) from 1960 has a section on the `reduce` function.

### Introduction to Functional Programming (1988)

[This book](https://usi-pl.github.io/lc/sp-2015/doc/Bird_Wadler.%20Introduction%20to%20Functional%20Programming.1ed.pdf) from 1988 talks about using `reduce` to turn lists into other values.

Bottom line–it's an old topic. The more you study computer science the more you realize we're mostly re-wrapping concepts discovered decades ago.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The more you study computer science the more you realize we&#39;re mostly re-wrapping concepts discovered decades ago.</p>&mdash; Yazeed Bzadough (@yazeedBee) <a href="https://twitter.com/yazeedBee/status/1183510524438437890?ref_src=twsrc%5Etfw">October 13, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Exercises For You

For the sake of time, we end here. However I hope I've at least hinted that `reduce` is incredibly powerful and useful way beyond just summing numbers.

If you're interested try these exercises and [message me about them later](https://twitter.com/yazeedBee). I may write a follow up article on them.

1. Reimplement the [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function using `reduce`.
2. Reimplement the [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) function using `reduce`.
3. Reimplement the [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) function using `reduce`.
4. Reimplement the [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) function using `reduce`.
5. Reimplement the [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) function using `reduce`.
6. Reimplement the [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) function using `reduce`.
7. Turn an array into an object using `reduce`.
8. Turn a 2D array into a 1D (flat) array using `reduce`.

## Want Free Coaching?

If you'd like to schedule a free 15-30 minute call to discuss Front-End development questions regarding code, interviews, career, or anything else [follow me on Twitter and DM me](https://twitter.com/yazeedBee).

After that if you enjoy our first meeting, we can discuss an ongoing coaching relationship that'll help you reach your Front-End development goals!

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com!</a>

Until next time!
