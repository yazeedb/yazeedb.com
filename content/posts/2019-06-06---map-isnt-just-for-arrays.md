---
title: "Map Isn't Just for Arrays"
date: '2019-06-06'
description: 'Think outside the box.'
draft: false
template: 'post'
slug: '/posts/map-isnt-just-for-arrays'
category: 'Motivational'
tags:
  - 'JavaScript'
  - 'JavaScript In-Depth'
  - 'Functional Programming'
---

![](https://cdn-images-1.medium.com/max/1600/1*nxeVC8ZD5grjCcDEWXyyZA.png)

## Arrays are Mappable

Most of us are familiar with JavaScript's `map` function: it turns an array into a new array by transforming each item according to some function.

### Turn everything into 1s

To create an arrays of `1`s from an old array, just return 1 in your mapping function.

```js
numbers = [1, 2, 3, 4, 5];
doubledNumbers = numbers.map(() => 1);
// [1, 1, 1, 1, 1]
```

Not very useful, though. Since our mapping function has access to the current value being processed, why not use it?

### Double everything

```js
numbers = [1, 2, 3, 4, 5];
doubledNumbers = numbers.map((x) => x * 2));
// [2, 4, 6, 8, 10]
```

### Get everyone's full name

```js
users = [
  {
    firstName: 'Bruce',
    lastName: 'Banner'
  },
  {
    firstName: 'Tony',
    lastName: 'Stark'
  },
  {
    firstName: 'Peter',
    lastName: 'Parker'
  }
];
userFullNames = users.map((u) => `${u.firstName} ${u.lastName}`);
/* [
"Bruce Banner",
"Tony Stark",
"Peter Parker"
]*/
```

### Turn everyone's name into JSX (React)

```js
users = [
  {
    firstName: 'Bruce',
    lastName: 'Banner'
  },
  {
    firstName: 'Tony',
    lastName: 'Stark'
  },
  {
    firstName: 'Peter',
    lastName: 'Parker'
  }
];
usersList = users.map((u) => (
  <li>
    {u.firstName} {u.lastName}
  </li>
));
/* [
"Bruce Banner",
"Tony Stark",
"Peter Parker"
]*/
```

Since most applications deal with lists of things (friends list, contacts, messages, social media feeds, etc), it's great that JavaScript provides first-class mapping support for arrays.

The idea behind map, however, goes much further.

## All Boxes are Mappable

Think of array as simply a box, and `map` lets you transform the inner values without affecting the box itself. If you call `map` on an array of 10 items, you'll always get back a _new_ array of 10 items.

## Objects are Mappable

An object is basically an array, but the indices don't have to be 0, 1, 2, 3, 4, etc. It can be used as a box too!

Here's a simple `mapObject` function.

```js
mapObject = (transformFunction, object) => {
  const newObject = {};
  for (let key in object) {
    const value = object[key];
    const transformedValue = transformFunction(value);
    newObject[key] = transformedValue;
  }
  return newObject;
};
```

I've found this useful when validating form fields. Let's say the four fields, `name`, `age`, `job`, and `email` are all required.

```js
formFields = {
  name: 'Yazeed Bzadough',
  age: undefined,
  job: 'Front-End Developer',
  email: ''
};

mapObject((field) => (field ? 'Looks good' : 'Required!'), formFields);

/* {
"name": "Looks good",
"age": "Required!",
"job": "Looks good",
"email": "Required!"
}*/
```

## Strings are Mappable

Strings are even easier to map, because their indices are zero-based! We can create a `mapString` function using ES6 spread operator.

Using the index, we can alt case a string.

```js
mapString = (transformFunction, string) =>
  [...string].map(transformFunction).join('');

altCase = (char, index) => (index % 2 === 0 ? char.toUpperCase() : char);

mapString(altCase, 'Get in the car!');
// "GeT In tHe cAr!"
```

## Promises are Mappable

We can't loop over a Promise or turn it into an array, but that's not even necessary!

Using its native `.then` method, we can create a new Promise with the transformed inner value. It's still mapping!

Here's a simple example

```js
Promise.resolve(' Hello ')
  .then((s) => s.trim())
  .then((s) => s.concat(', World!'))
  .then((s) => s.toUpperCase())
  .then(console.log);
// HELLO, WORLD!
```

How about we fetch the first 30 GitHub users?

```js
fetch('https://api.github.com/users')
  .then((response) => response.json())
  .then((users) => {
    console.log(users);
  });
// [{..}, {..}, {..}]
```

In that example, we're mapping an HTTP response into a JSON object. You can go even further and get all the logins from the list.

```js
fetch('https://api.github.com/users')
  .then((response) => response.json())
  .then((users) => users.map((u) => u.login))
  .then(console.log);
// ['...', '...', '...']
```

## Functors

All of these data structures can be considered functors or functor-like. This is a data type used in functional programming for transforming all sorts of boxed inner values.

If you'd like a deeper explanation, I briefly introduce functors in [my free RamdaJS course](https://www.educative.io/collection/page/5070627052453888/5738600293466112/5769928858664960), and also refer you to [this great article on the subject](https://medium.com/javascript-scene/functors-categories-61e031bac53f).

Thanks for reading!
