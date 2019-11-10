---
title: Yet Another 10 Utility Functions Made with Reduce
date: '2019-11-10'
description: 'Thirty functions total!'
draft: false
template: 'post'
slug: '/posts/yet-another-10-utils-using-reduce'
category: 'JavaScript'
coverImageUrl: '/media/imgs-yet-another-10-utils-using-reduce/cover-image.png'
tags:
  - 'JavaScript'
  - 'JavaScript In-depth'
  - 'Functional Programming'
---

<img src="/media/imgs-yet-another-10-utils-using-reduce/cover-image.png" />

## Thirty functions total!

This is my third article on Utility Functions Made with Reduce.

- [Part one](/posts/10-js-util-functions-in-reduce/) (10 functions)
- [Part two](/posts/10-more-js-utils-using-reduce/) (10 functions)

Altogether we now have _thirty_ helper functions made using JavaScript's `reduce`. For more detail on `reduce` itself, consider reading my [tutorial on it](https://www.yazeedb.com/posts/learn-reduce-in-10-minutes).

The functions listed below were inspired by the amazing [RamdaJS](https://ramdajs.com/) library. I also wrote unit tests to ensure correct behavior, which you can find on [my GitHub](https://github.com/yazeedb/js-utils-using-reduce).

## 1. adjust

### Parameters

1. `index` - Index of source array
2. `fn` - Function to apply at that `index`
3. `list` - List of items.

### Description

Applies a function to the value at the given index. Returns the original array if provided index is out of bounds.

### Usage

```js
const double = (x) => x * 2;

adjust(1, double, [1, 2, 3]);
// [1, 4, 3]

adjust(4, double, [1, 2, 3]);
// [1, 2, 3]
```

### Implementation

```js
const adjust = (index, fn, list) =>
  list.reduce((acc, value, sourceArrayIndex) => {
    const valueToUse = sourceArrayIndex === index ? fn(value) : value;

    acc.push(valueToUse);

    return acc;
  }, []);
```

## 2. fromPairs

### Parameters

1. `pairs` - A list of key-value pairs.

### Description

Creates an object from a list of key-value pairs.

### Usage

```js
fromPairs([['a', 1], ['b', 2], ['c', 3]]);
// { a: 1, b: 2, c: 3 }
```

### Implementation

```js
const fromPairs = (pairs) =>
  pairs.reduce((acc, currentPair) => {
    const [key, value] = currentPair;

    acc[key] = value;

    return acc;
  }, {});
```

## 3. range

### Parameters

1. `from` - Starting number.
2. `to` - Ending number.

### Description

Returns a list of numbers from a given range.

### Usage

```js
range(1, 5);
// [1, 2, 3, 4, 5]
```

### Implementation

```js
const range = (from, to) =>
  Array.from({ length: to - from + 1 }).reduce((acc, _, index) => {
    acc.push(from + index);

    return acc;
  }, []);
```

## 4. repeat

### Parameters

1. `item` - Item to repeat.
2. `times` - Number of times to repeat.

### Description

Returns a list of a given value N times.

### Usage

```js
repeat({ favoriteLanguage: 'JavaScript' }, 2);

/*
[{
    favoriteLanguage: 'JavaScript'
}, {
    favoriteLanguage: 'JavaScript'
}],
*/
```

### Implementation

```js
const repeat = (item, times) =>
  Array.from({ length: times }).reduce((acc) => {
    acc.push(item);

    return acc;
  }, []);
```

## 5. times

### Parameters

1. `fn` - Function to call.
2. `numTimes` - Number of times to call that function.

### Description

Calls a given function N times. The `fn` provided receives the current index as a parameter.

### Usage

```js
times((x) => x * 2, 3);
// [0, 2, 4]
```

### Implementation

```js
const times = (fn, numTimes) =>
  Array.from({ length: numTimes }).reduce((acc, _, index) => {
    acc.push(fn(index));

    return acc;
  }, []);
```

## 6. deduplicate

### Parameters

1. `items` - List of items.

### Description

Deduplicates the items in a list.

### Usage

```js
deduplicate([[1], [1], { hello: 'world' }, { hello: 'world' }]);
// [[1], { hello: 'world' }]
```

### Implementation

```js
const deduplicate = (items) => {
  const cache = {};

  return items.reduce((acc, item) => {
    const alreadyIncluded = cache[item] === true;

    if (!alreadyIncluded) {
      cache[item] = true;
      acc.push(item);
    }

    return acc;
  }, []);
};
```

## 7. reverse

### Parameters

1. `list` - List of items.

### Description

Reverses a list _without_ mutating it by returning a new list, unlike the native `Array.reverse` method.

### Usage

```js
reverse([1, 2, 3]);
// [3, 2, 1]
```

### Implementation

```js
const reverse = (list) =>
  list.reduce((acc, _, index) => {
    const reverseIndex = list.length - index - 1;
    const reverseValue = list[reverseIndex];

    acc.push(reverseValue);

    return acc;
  }, []);
```

## 8. insertAll

### Parameters

1. `index` - Index to insert at.
2. `subList` - List to insert.
3. `sourceList` - Source list.

### Description

Inserts a sub-list into a list at the given index. Appends to the end of the list if index is too large.

### Usage

```js
insertAll(1, [2, 3, 4], [1, 5]);
// [1, 2, 3, 4, 5]

insertAll(10, [2, 3, 4], [1, 5]);
// [1, 5, 2, 3, 4]
```

### Implementation

```js
const insertAll = (index, subList, sourceList) => {
  if (index > sourceList.length - 1) {
    return sourceList.concat(subList);
  }

  return sourceList.reduce((acc, value, sourceArrayIndex) => {
    if (index === sourceArrayIndex) {
      acc.push(...subList, value);
    } else {
      acc.push(value);
    }

    return acc;
  }, []);
};
```

## 9. mergeAll

### Parameters

1. `objectList` - List of objects to merge.

### Description

Merges a list of objects into one.

### Usage

```js
mergeAll([
  { js: 'reduce' },
  { elm: 'fold' },
  { java: 'collect' },
  { js: 'reduce' }
]);

/*
{
    js: 'reduce',
    elm: 'fold',
    java: 'collect'
}
*/
```

### Implementation

```js
const mergeAll = (objectList) =>
  objectList.reduce((acc, obj) => {
    Object.keys(obj).forEach((key) => {
      acc[key] = obj[key];
    });

    return acc;
  }, {});
```

## 10. xprod

### Parameters

1. `list1` - List of items.
2. `list2` - List of items.

### Description

Given a list, returns a new list of all possible pairs.

### Usage

```js
xprod(['Hello', 'World'], ['JavaScript', 'Reduce']);
/*
[
  ['Hello', 'JavaScript'],
  ['Hello', 'Reduce'],
  ['World', 'JavaScript'],
  ['World', 'Reduce']
]
*/
```

### Implementation

```js
const xprod = (list1, list2) =>
  list1.reduce((acc, list1Item) => {
    list2.forEach((list2Item) => {
      acc.push([list1Item, list2Item]);
    });

    return acc;
  }, []);
```

## Want Free Coaching?

If you'd like to schedule a free call to discuss Front-End development questions regarding code, interviews, career, or anything else [follow me on Twitter and DM me](https://twitter.com/yazeedBee).

After that if you enjoy our first meeting, we can discuss an ongoing coaching to help you reach your Front-End development goals!

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com!</a>

Until next time!
