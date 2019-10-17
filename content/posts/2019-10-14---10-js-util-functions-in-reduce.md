---
title: 10 JavaScript Utility Functions Made with Reduce
date: '2019-10-17'
description: 'The multi-tool strikes again.'
draft: false
template: 'post'
slug: '/posts/10-js-util-functions-in-reduce'
category: 'JavaScript'
coverImageUrl: '/media/imgs-10-reduce-util-functions/cover-image.png'
tags:
  - 'JavaScript'
  - 'JavaScript In-depth'
  - 'Functional Programming'
---

<img src="/media/imgs-10-reduce-util-functions/cover-image.png" />

## The multi-tool strikes again.

In [my last article](/posts/learn-reduce-in-10-minutes/) I offered you a challenge to recreate well-known functions using `reduce`. This article will show you how some of them can be implemented, along with some extras!

In total we're going to look at ten utility functions. They're incredibly handy on your projects, and best of all, they're implemented using `reduce`! I drew lots of inspiration from the [RamdaJS library](https://ramdajs.com/) for this one, so check that out!

## 1. some

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items to test.

### Description

If `predicate` returns `true` for _any_ item, `some` returns `true`. Otherwise it returns `false`.

### Implementation

```js
const some = (predicate, array) =>
  array.reduce((acc, value) => acc || predicate(value), false);
```

### Usage

```js
const equals3 = (x) => x === 3;

some(equals3, [3]); // true
some(equals3, [3, 3, 3]); // true
some(equals3, [1, 2, 3]); // true
some(equals3, [2]); // false
```

## 2. all

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items to test.

### Description

If `predicate` returns `true` for _every_ item, `all` returns `true`. Otherwise it returns `false`.

### Implementation

```js
const all = (predicate, array) =>
  array.reduce((acc, value) => acc && predicate(value), true);
```

### Usage

```js
const equals3 = (x) => x === 3;

all(equals3, [3]); // true
all(equals3, [3, 3, 3]); // true
all(equals3, [1, 2, 3]); // false
all(equals3, [3, 2, 3]; // false
```

## 3. none

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items to test.

### Description

If `predicate` returns `false` for _every_ item, `none` returns `true`. Otherwise it returns `false`.

### Implementation

```js
const none = (predicate, array) =>
  array.reduce((acc, value) => !acc && !predicate(value), false);
```

### Usage

```js
const isEven = (x) => x % 2 === 0;

none(isEven, [1, 3, 5]); // true
none(isEven, [1, 3, 4]); // false
none(equals3, [1, 2, 4]); // true
none(equals3, [1, 2, 3]); // false
```

## 4. map

### Parameters

1. `transformFunction` - Function to run on each element.
2. `array` - List of items to transform.

### Description

Returns a new array of items, each one transformed according to the given `transformFunction`.

### Implementation

```js
const map = (transformFunction, array) =>
  array.reduce((newArray, item) => {
    newArray.push(transformFunction(item));

    return newArray;
  }, []);
```

### Usage

```js
const double = (x) => x * 2;
const reverseString = (string) =>
  string
    .split('')
    .reverse()
    .join('');

map(double, [100, 200, 300]);
// [200, 400, 600]

map(reverseString, ['Hello World', 'I love map']);
// ['dlroW olleH', 'pam evol I']
```

## 5. filter

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items to filter.

### Description

Returns a new array. If `predicate` returns `true`, that item is added to the new array. Otherwise that item is excluded from the new array.

### Implementation

```js
const filter = (predicate, array) =>
  array.reduce((newArray, item) => {
    if (predicate(item) === true) {
      newArray.push(item);
    }

    return newArray;
  }, []);
```

### Usage

```js
const isEven = (x) => x % 2 === 0;

filter(isEven, [1, 2, 3]);
// [2]

filter(equals3, [1, 2, 3, 4, 3]);
// [3, 3]
```

## 6. reject

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items to filter.

### Description

Just like `filter`, but with the opposite behavior.

If `predicate` returns `false`, that item is added to the new array. Otherwise that item is excluded from the new array.

### Implementation

```js
const reject = (predicate, array) =>
  array.reduce((newArray, item) => {
    if (predicate(item) === false) {
      newArray.push(item);
    }

    return newArray;
  }, []);
```

### Usage

```js
const isEven = (x) => x % 2 === 0;

reject(isEven, [1, 2, 3]);
// [1, 3]

reject(equals3, [1, 2, 3, 4, 3]);
// [1, 2, 4]
```

## 7. find

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items to search.

### Description

Returns the first element that matches the given `predicate`. If no element matches then `undefined` is returned.

### Implementation

```js
const find = (predicate, array) =>
  array.reduce((result, item) => {
    if (result !== undefined) {
      return result;
    }

    if (predicate(item) === true) {
      return item;
    }

    return undefined;
  }, undefined);
```

### Usage

```js
const isEven = (x) => x % 2 === 0;

find(isEven, []); // undefined
find(isEven, [1, 2, 3]); // 2
find(isEven, [1, 3, 5]); // undefined
find(equals3, [1, 2, 3, 4, 3]); // 3
find(equals3, [1, 2, 4]); // undefined
```

## 8. partition

### Parameters

1. `predicate` - Function that returns `true` or `false`.
2. `array` - List of items.

### Description

"Partitions" or splits an array into two based on the `predicate`. If `predicate` returns `true`, the item goes into list 1. Otherwise the item goes into list 2.

### Implementation

```js
const partition = (predicate, array) =>
  array.reduce(
    (result, item) => {
      const [list1, list2] = result;

      if (predicate(item) === true) {
        list1.push(item);
      } else {
        list2.push(item);
      }

      return result;
    },
    [[], []]
  );
```

### Usage

```js
const isEven = (x) => x % 2 === 0;

partition(isEven, [1, 2, 3]);
// [[2], [1, 3]]

partition(isEven, [1, 3, 5]);
// [[], [1, 3, 5]]

partition(equals3, [1, 2, 3, 4, 3]);
// [[3, 3], [1, 2, 4]]

partition(equals3, [1, 2, 4]);
// [[], [1, 2, 4]]
```

## 9. pluck

### Parameters

1. `key` - Key name to pluck from the object
2. `array` - List of items.

### Description

Plucks the given `key` off of each item in the array. Returns a new array of these values.

### Implementation

```js
const pluck = (key, array) =>
  array.reduce((values, current) => {
    values.push(current[key]);

    return values;
  }, []);
```

### Usage

```js
pluck('name', [{ name: 'Batman' }, { name: 'Robin' }, { name: 'Joker' }]);
// ['Batman', 'Robin', 'Joker']

pluck(0, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
// [1, 4, 7]
```

## 10. scan

### Parameters

1. `reducer` - Standard reducer function that receives two parameters - the accumulator and current element from the array.
2. `initialValue` - The initial value for the accumulator.
3. `array` - List of items.

### Description

Works just like `reduce` but instead just the single result, it returns a list of every reduced value on the way to the single result.

### Implementation

````js
const scan = (reducer, initialValue, array) => {
  const reducedValues = [];

  array.reduce((acc, current) => {
    const newAcc = reducer(acc, current);

    reducedValues.push(newAcc);

    return newAcc;
  }, initialValue);

  return reducedValues;
};```

### Usage
```js
const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

scan(add, 0, [1, 2, 3, 4, 5, 6]);
// [1, 3, 6, 10, 15, 21] - Every number added from 1-6

scan(multiply, 1, [1, 2, 3, 4, 5, 6]);
// [1, 2, 6, 24, 120, 720] - Every number multiplied from 1-6
````

## Want Free Coaching?

If you'd like to schedule a free call to discuss Front-End development questions regarding code, interviews, career, or anything else [follow me on Twitter and DM me](https://twitter.com/yazeedBee).

After that if you enjoy our first meeting, we can discuss an ongoing coaching to help you reach your Front-End development goals!

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com!</a>

Until next time!
