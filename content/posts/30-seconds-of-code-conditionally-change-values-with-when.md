---
title: '30 Seconds of Code: Conditionally Change Values with when()'
date: '2018-04-21'
description: 'Works great with functional pipelines!'
template: 'post'
draft: false
slug: '/posts/30-seconds-of-code-when'
category: 'Code snippets explained'
tags:
  - 'Code snippets'
  - 'Functions'
---

![](https://cdn-images-1.medium.com/max/1600/1*Ye9GrpJqOsiaZPbMeZkpGQ.png)

30 Seconds of Code is a brilliant collection of JavaScript snippets, digestible in ≤ 30 seconds. **Anyone looking to master JavaScript should go through the entire thing.**

Inspired by [Ramda](http://ramdajs.com/docs/#when), I contributed `when()` to 30secondsofcode’s [official GitHub repo](https://github.com/Chalarangelo/30-seconds-of-code/pull/652). This is one my favorite functions.

`when()` takes 3 parameters:

1.  `pred`: A predicate function (must return `true` or `false`)
2.  `whenTrue`: A function to run if `pred` returns `true`.
3.  A value: `x`.

Here’s the most basic implementation:

```js
when = (pred, whenTrue, x) => {
  if (pred(x)) {
    return whenTrue(x);
  } else {
    return x;
  }
};
```

Which you can shorten to:

```js
when = (pred, whenTrue, x) => (pred(x) ? whenTrue(x) : x);
```

Let’s say we want to triple even numbers

```js
when((x) => x % 2 === 0, (x) => x * 3, 2);
// 6
```

We got `6` because `2` is an even number. What if we pass `11`?

```js
when((x) => x % 2 === 0, (x) => x * 3, 11);
// 11
```

### A Step Further

`when` currently needs all 3 parameters at once–what if we could supply just the first 2, and give `x` later on?

```js
when = (pred, whenTrue) => (x) => (pred(x) ? whenTrue(x) : x);
```

This version’s what I submitted to [30secondsofcode.org](https://30secondsofcode.org/function#when). Now our code’s more flexible.

```js
tripleEvenNums = when((x) => x % 2 === 0, (x) => x * 3);

tripleEvenNums(20); // 60
tripleEvenNums(21); // 21
tripleEvenNums(22); // 66
```

### Even Further Beyond

We can pass `x` later because `when(pred, whenTrue)` returns a function expecting `x`. What if we curry `when()`?

If you’re new to currying see [my article](https://medium.com/front-end-hacking/how-does-javascripts-curry-actually-work-8d5a6f891499) on it.

A curried function doesn’t need all its parameters at once. You can supply some and get a function that takes the rest, allowing for powerful patterns.

#### A Silly Example

Imagine we have two lists of people, both contain a guy named `Bobo`.

`Bobo` wants a nickname for each list.

- If we find `Bobo` in list 1, change his name to `B Money`.
- If we find `Bobo` in list 2, change his name to `Bo-bob`.

Currying `when` allows us to easily write a function for each concern.

If you’re following along, here’s a `curry` function from [30secondsofcode.org](https://30secondsofcode.org/function#curry).

```js
curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
```

We’ll need a predicate to find `Bobo`.

```js
isBobo = (person) => person.name === 'Bobo';
```

To keep our functions pure, we’ll need a way to _immutably_ change a person’s name.

```js
changeName = (newName, obj) => ({
  ...obj,
  name: newName
});
```

Let’s also curry it so we can supply just `newName`.

```js
changeName = curry((newName, obj) => ({
  ...obj,
  name: newName
}));
```

Here’s our lists.

```js
list1 = [
  {
    name: 'Bobo',
    id: 1,
    iq: 9001
  },
  {
    name: 'Jaime',
    id: 2,
    iq: 9000
  },
  {
    name: 'Derek',
    id: 3,
    iq: 8999
  }
];

list2 = [
  {
    name: 'Sam',
    id: 1,
    iq: 600
  },
  {
    name: 'Bobo',
    id: 2,
    iq: 9001
  },
  {
    name: 'Peter',
    id: 3,
    iq: 8
  }
];
```

Let’s map over `list1`.

```js
doIfBobo = when(isBobo);
renameToBMoney = changeName('B Money');

list1.map(doIfBobo(renameToBMoney));
```

Our result:

```js
[
  {
    name: 'B Money',
    id: 1,
    iq: 9001
  },
  {
    name: 'Jaime',
    id: 2,
    iq: 9000
  },
  {
    name: 'Derek',
    id: 3,
    iq: 8999
  }
];
```

Because of `when`, we only changed `Bobo` and ignored everyone else!

Now map over `list2`.

```js
renameToBoBob = changeName('Bo-bob');

list2.map(doIfBobo(renameToBoBob));
```

```js
Our result:

[{
  "name": "Sam",
  "id": 1,
  "iq": 600
},
 {
 "name": "Bo-bob",
   "id": 2,
   "iq": 9001**
 },
 {
   "name": "Peter",
   "id": 3,
   "iq": 8
 }
];
```

Looks good to me! We gave `Bobo` his nicknames without affecting anyone else.

If you’re further interested, consider these links:

- [30secondsofcode.org’s collection](https://30secondsofcode.org/array)
- [My article on currying](https://medium.com/front-end-hacking/how-does-javascripts-curry-actually-work-8d5a6f891499)
- [Ramda](http://ramdajs.com/docs/)
