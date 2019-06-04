---
title: 'A Quick Intro to Higher-Order Functions in Javascript'
date: '2019-03-11'
description: 'Use functions as data, and unlock some powerful patterns.'
draft: false
template: 'post'
slug: '/posts/a-quick-intro-to-higher-order-functions'
category: 'Functional programming basics'
tags:
  - 'Functional Programming'
  - 'Functions'
---

![](https://cdn-images-1.medium.com/max/1600/1*JyhQls2zLuu22yrnsk6mcA.png)

### Higher-Order Functions

A function that accepts and/or returns another function is called a **higher-order function**.

It’s _higher-order_ because instead of strings, numbers, or booleans, it goes _higher_ to operate on functions. Pretty meta.

With functions in JavaScript, you can

- Store them as variables
- Use them in arrays
- Assign them as object properties (methods)
- Pass them as arguments
- Return them from other functions

_Like any other piece of data_. That’s the key here.

### Functions Operate on Data

#### Strings Are Data

```js
sayHi = (name) => `Hi, ${name}!`;
result = sayHi('User');

console.log(result); // 'Hi, User!'
```

#### Numbers Are Data

```js
double = (x) => x * 2;
result = double(4);

console.log(result); // 8
```

#### Booleans Are Data

```js
getClearance = (allowed) => (allowed ? 'Access granted' : 'Access denied');

result1 = getClearance(true);
result2 = getClearance(false);

console.log(result1); // 'Access granted'
console.log(result2); // 'Access denied'
```

#### Objects Are Data

```js
getFirstName = (obj) => obj.firstName;

result = getFirstName({
  firstName: 'Yazeed'
});

console.log(result); // 'Yazeed'
```

#### Arrays Are Data

```js
len = (array) => array.length;
result = len([1, 2, 3]);

console.log(result); // 3
```

These 5 types are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) in every mainstream language.

What makes them first-class? You can pass them around, store them in variables and arrays, use them as inputs for calculations. You can use them like _any piece of data_.

### Functions Can Be Data Too

![](https://cdn-images-1.medium.com/max/1600/0*wy_bAnMM-coF9cep.png)

#### Functions as Arguments

```js
isEven = (num) => num % 2 === 0;
result = [1, 2, 3, 4].filter(isEven);

console.log(result); // [2, 4]
```

See how `filter` uses `isEven` to decide what numbers to keep? `isEven`, _a function_, was a parameter _to another function_.

It’s called by `filter` for each number, and uses the returned value `true` or `false` to determine if a number should be kept or discarded.

#### Returning Functions

```js
add = (x) => (y) => x + y;
```

`add` requires two parameters, but not all at once. It’s a function asking for just `x`, that returns a function asking for just `y`.

Again, this is only possible because JavaScript allows functions to be a return value — just like strings, numbers, booleans, etc.

You can still supply `x` and `y` immediately, if you wish, with a double invocation

```js
result = add(10)(20);
```

```js
console.log(result); // 30
```

Or `x` now and `y` later:

```js
add10 = add(10);
result = add10(20);

console.log(result); // 30
```

Let’s rewind that last example. `add10` is the result of calling `add` with one parameter. Try logging it in the console.

![](https://cdn-images-1.medium.com/max/1600/1*BaPwZXD00kXBtTy7QV_tzA.png)

`add10` is a function that takes a `y` and returns `x + y`. After you supply `y`, it hurries to calculate and return your end result.

![](https://cdn-images-1.medium.com/max/1600/1*kg9Sv6gQExV_llaE3GUI-g.png)

### Greater Reusability

Probably the greatest benefit of HOFs is greater reusability. Without them, JavaScript’s premiere Array methods — `map`, `filter`, and `reduce` — wouldn’t exist!

Here’s a list of users. We’re going to do some calculations with their information.

```js
users = [
  {
    name: 'Yazeed',
    age: 25
  },
  {
    name: 'Sam',
    age: 30
  },
  {
    name: 'Bill',
    age: 20
  }
];
```

#### Map

Without higher-order functions, we’d always need loops to mimic `map`'s functionality.

```js
getName = (user) => user.name;
usernames = [];

for (let i = 0; i < users.length; i++) {
  const name = getName(users[i]);

  usernames.push(name);
}

console.log(usernames);
// ["Yazeed", "Sam", "Bill"]
```

Or we could do this!

```js
usernames = users.map(getName);

console.log(usernames);
// ["Yazeed", "Sam", "Bill"]
```

#### Filter

In a HOF-less world, we’d still need loops to recreate `filter`'s functionality too.

```js
startsWithB = (string) => string.toLowerCase().startsWith('b');

namesStartingWithB = [];

for (let i = 0; i < users.length; i++) {
  if (startsWithB(users[i].name)) {
    namesStartingWithB.push(users[i]);
  }
}

console.log(namesStartingWithB);
// [{ "name": "Bill", "age": 20 }]
```

Or we could do this!

```js
namesStartingWithB = users.filter((user) => startsWithB(user.name));

console.log(namesStartingWithB);
// [{ "name": "Bill", "age": 20 }]
```

#### Reduce

Yup, reduce too… Can’t do much cool stuff without higher-order functions!! 😁

```js
total = 0;

for (let i = 0; i < users.length; i++) {
  total += users[i].age;
}

console.log(total);
// 75
```

How’s this?

```js
totalAge = users.reduce((total, user) => user.age + total, 0);

console.log(totalAge);
// 75
```

### Summary

- Strings, numbers, bools, arrays, and objects can be stored as variables, arrays, and properties or methods.
- JavaScript treats functions the same way.
- This allows for functions that operate on other functions: **higher-order functions**.
- Map, filter, and reduce are prime examples — and make common patterns like transforming, searching, and summing lists much easier!

[I’m on Twitter](https://twitter.com/yazeedBee) if you’d like to talk. Until next time!

Take care, <br />
Yazeed Bzadough <br />
[yazeedb.com](http://yazeedb.com/)
