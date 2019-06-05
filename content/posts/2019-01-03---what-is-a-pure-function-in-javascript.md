---
title: What Is a Pure Function in JavaScript?
date: '2019-01-03'
description: 'The most fundamental building block of reusable software.'
draft: false
template: 'post'
slug: '/posts/what-is-a-pure-function-in-javascript'
category: 'Functional programming basics'
tags:
  - 'Functional Programming'
  - 'Functions'
---

Pure functions are the atomic building blocks in functional programming. They are adored for their simplicity and testability.

This post covers a quick checklist to tell if a function’s pure or not.

![](https://cdn-images-1.medium.com/max/1600/0*a_yub2gTwY-1eK8j.png)

### The Checklist

A function must pass two tests to be considered “pure”:

1.  Same inputs _always_ return same outputs
2.  No side-effects

Let’s zoom in on each one.

### 1\. Same Input => Same Output

Compare this:

```js
const add = (x, y) => x + y;

add(2, 4); // 6
```

To this:

```js
let x = 2;

const add = (y) => {
  x += y;
};

add(4); // x === 6 (the first time)
```

#### Pure Functions = Consistent Results

The first example returns a value based on the given parameters, regardless of where/when you call it.

If you pass `2` and `4`, you’ll always get `6`.

Nothing else affects the output.

#### Impure Functions = Inconsistent Results

The second example returns nothing. It relies on **shared state** to do its job by incrementing a variable outside of its own scope.

This pattern is a developer’s nightmare fuel.

**Shared state** introduces a time dependency. You get different results depending on when you called the function. The first time results in `6`, next time is `10` and so on.

#### Which Version’s Easier to Reason About?

Which one’s less likely to breed bugs that happen only under certain conditions?

Which one’s more likely to succeed in a multi-threaded environment where time dependencies can break the system?

Definitely the first one.

### 2\. No Side-Effects

![](https://cdn-images-1.medium.com/max/1600/0*4rGYQyYm_m8Byoyj.png)

This test itself is a checklist. A few examples of side-effects are

1.  Mutating your input
2.  `console.log`
3.  HTTP calls (AJAX/fetch)
4.  Changing the filesystem (fs)
5.  Querying the DOM

Basically any work a function performs that isn’t related to calculating the final output.

Here’s an impure function with a side-effect.

#### Not So Bad

```js
const impureDouble = (x) => {
  console.log('doubling', x);

  return x * 2;
};

const result = impureDouble(4);
console.log({ result });
```

`console.log` is the side-effect here but, in all practicality, it won’t harm us. We’ll still get the same outputs, given the same inputs.

_This_, however, may cause a problem.

#### “Impurely” Changing an Object

```js
const impureAssoc = (key, value, object) => {
  object[key] = value;
};

const person = {
  name: 'Bobo'
};

const result = impureAssoc('shoeSize', 400, person);

console.log({
  person,
  result
});
```

The variable, `person`, has been forever changed because our function introduced an assignment statement.

Shared state means `impureAssoc`'s impact isn’t fully obvious anymore. Understanding its effect on a system now involves tracking down every variable it’s ever touched and knowing their histories.

> Shared state = timing dependencies.

We can purify `impureAssoc` by simply returning a new object with our desired properties.

#### Purifying It Up

```js
const pureAssoc = (key, value, object) => ({
  ...object,
  [key]: value
});

const person = {
  name: 'Bobo'
};

const result = pureAssoc('shoeSize', 400, person);

console.log({
  person,
  result
});
```

Now `pureAssoc` returns a testable result and we’ll never worry if it quietly mutated something elsewhere.

You could even do the following and remain pure:

#### Another Pure Way

```js
const pureAssoc = (key, value, object) => {
  const newObject = { ...object };

  newObject[key] = value;

  return newObject;
};

const person = {
  name: 'Bobo'
};

const result = pureAssoc('shoeSize', 400, person);

console.log({
  person,
  result
});
```

Mutating your input can be dangerous, but mutating a copy of it is no problem. Our end result is still a testable, predictable function that works no matter where/when you call it.

The mutation’s limited to that small scope and you’re still returning a value.

### Deep-Cloning Objects

Heads up! Using the spread operator `...` creates a _shallow_ copy of an object. Shallow copies aren’t safe from nested mutations.

Thank you [Rodrigo Fernández Díaz](https://medium.com/@rodrigo_98972) for bringing this to my attention!

#### Unsafe Nested Mutation

```js
const person = {
  name: 'Bobo',
  address: { street: 'Main Street', number: 123 }
};

const shallowPersonClone = { ...person };
shallowPersonClone.address.number = 456;

console.log({ person, shallowPersonClone });
```

![](https://cdn-images-1.medium.com/max/1600/1*SQ9xC_YZWBtp6B0wzNojuA.png)

Both `person` and `shallowPersonClone` were mutated because their children share the same reference!

#### Safe Nested Mutation

To safely mutate nested properties, we need a _deep_ clone.

```js
const person = {
  name: 'Bobo',
  address: { street: 'Main Street', number: 123 }
};

const deepPersonClone = JSON.parse(JSON.stringify(person));
deepPersonClone.address.number = 456;

console.log({ person, deepPersonClone });
```

![](https://cdn-images-1.medium.com/max/1600/1*jHvmu2WnepV_UbhIQw-9vQ.png)

Now you’re guaranteed safety because they’re truly two separate entities!

### Summary

![](https://cdn-images-1.medium.com/max/1600/0*_FwSya9ut_O6gmfe.png)

- A function’s pure if it’s free from side-effects and returns the same output, given the same input.
- Side-effects include: mutating input, HTTP calls, writing to disk, printing to the screen.
- You can safely _clone_, _then_ _mutate_, your input. Just leave the original one untouched.
- Spread syntax (`…` syntax) is the easiest way to _shallowly_ clone objects.
- `JSON.parse(JSON.stringify(object))` is the easiest way to _deeply_ clone objects. Thanks again [Rodrigo Fernández Díaz](https://medium.com/@rodrigo_98972)!

### My Free Course

This tutorial was from **my completely free course** on Educative.io, [Functional Programming Patterns With RamdaJS](https://www.educative.io/collection/5070627052453888/5738600293466112?authorName=Yazeed%20Bzadough)!

Please consider taking/sharing it if you enjoyed this content.

It’s full of lessons, graphics, exercises, and runnable code samples to teach you a basic functional programming style using RamdaJS.

Thanks for reading! Until next time.
