---
title: 10 More Utility Functions Made with Reduce
date: '2019-11-04'
description: 'This time, with a test suite!'
draft: false
template: 'post'
slug: '/posts/10-more-js-utils-using-reduce'
category: 'JavaScript'
coverImageUrl: '/media/imgs-10-more-js-utils-using-reduce/cover-image.png'
tags:
  - 'JavaScript'
  - 'JavaScript In-depth'
  - 'Functional Programming'
---

<img src="/media/imgs-10-more-js-utils-using-reduce/cover-image.png" />

## This time, with a test suite!

[Previously](/posts/10-js-util-functions-in-reduce/) I wrote about 10 utility functions implemented with JavaScript's [reduce function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce). It was well-received, and I walked away with an even deeper appreciation for this magnificent multi-tool. Why not try 10 more?

Many of these were inspired by the awesome libraries [Lodash](https://lodash.com/) and [Ramda](https://ramdajs.com/)! I also wrote unit tests to ensure correct behavior. You can see everything on the [Github repo here](https://github.com/yazeedb/js-utils-using-reduce).

## 1. pipe

### Parameters

1. `...functions` - Any number of functions.

### Description

Performs _left-to-right_ function composition. The first argument to a pipeline acts as the initial value, and is transformed as it passes through each function.

### Implementation

```js
const pipe = (...functions) => (initialValue) =>
  functions.reduce((value, fn) => fn(value), initialValue);
```

### Usage

```js
const mathSequence = pipe(
  (x) => x * 2,
  (x) => x - 1,
  (x) => x * 3
);

mathSequence(1); // 3
mathSequence(2); // 9
mathSequence(3); // 15
```

For more detail, I wrote an [article on pipe here](https://www.yazeedb.com/posts/a-quick-intro-to-pipe-and-compose).

## 2. compose

### Parameters

1. `...functions` - Any number of functions.

### Description

Performs _right-to-left_ function composition. The first argument to a pipeline acts as the initial value, and is transformed as it passes through each function.

Works like `pipe`, but in the opposite direction.

### Implementation

```js
const compose = (...functions) => (initialValue) =>
  functions.reduceRight((value, fn) => fn(value), initialValue);
```

### Usage

```js
const mathSequence = compose(
  (x) => x * 2,
  (x) => x - 1,
  (x) => x * 3
);

mathSequence(1); // 4
mathSequence(2); // 10
mathSequence(3); // 16
```

For more detail, I wrote an [article on compose here](/posts/a-quick-intro-to-pipe-and-compose).

## 3. zip

### Parameters

1. `list1` - List of items.
2. `list2` - List of items.

### Description

Pairs items from two lists via index. If list lengths are not equal, the shorter list's length is used.

### Implementation

```js
const zip = (list1, list2) => {
  const sourceList = list1.length > list2.length ? list2 : list1;

  return sourceList.reduce((acc, _, index) => {
    const value1 = list1[index];
    const value2 = list2[index];

    acc.push([value1, value2]);

    return acc;
  }, []);
};
```

### Usage

```js
zip([1, 3], [2, 4]); // [[1, 2], [3, 4]]

zip([1, 3, 5], [2, 4]); // [[1, 2], [3, 4]]

zip([1, 3], [2, 4, 5]); // [[1, 2], [3, 4]]

zip(['Decode', 'secret'], ['this', 'message!']);
// [['Decode', 'this'], ['secret', 'message!']]
```

## 4. intersperse

### Parameters

1. `separator` - Item to insert.
2. `list` - List of items.

### Description

Inserts a separator between each element of a list.

### Implementation

```js
const intersperse = (separator, list) =>
  list.reduce((acc, value, index) => {
    if (index === list.length - 1) {
      acc.push(value);
    } else {
      acc.push(value, separator);
    }

    return acc;
  }, []);
```

### Usage

```js
intersperse('Batman', [1, 2, 3, 4, 5, 6]);
// [1, 'Batman', 2, 'Batman', 3, 'Batman', 4, 'Batman', 5, 'Batman', 6]

intersperse('Batman', []);
// []
```

## 5. insert

### Parameters

1. `index` - Index to insert element at.
2. `newItem` - Element to insert.
3. `list` - List of items.

### Description

Inserts an element at the given index. If the index is too large, element is inserted at the end of the list.

### Implementation

```js
const insert = (index, newItem, list) => {
  if (index > list.length - 1) {
    return [...list, newItem];
  }

  return list.reduce((acc, value, sourceArrayIndex) => {
    if (index === sourceArrayIndex) {
      acc.push(newItem, value);
    } else {
      acc.push(value);
    }

    return acc;
  }, []);
};
```

### Usage

```js
insert(0, 'Batman', [1, 2, 3]);
// ['Batman', 1, 2, 3]

insert(1, 'Batman', [1, 2, 3]);
// [1, 'Batman', 2, 3]

insert(2, ['Batman'], [1, 2, 3]);
// [1, 2, ['Batman'], 3]

insert(10, ['Batman'], [1, 2, 3]);
// [1, 2, 3, ['Batman']]
```

## 6. flatten

### Parameters

1. `list` - List of items.

### Description

Flattens a list of items by one level.

### Implementation

```js
const flatten = (list) => list.reduce((acc, value) => acc.concat(value), []);
```

### Usage

```js
flatten([[1, 2], [3, 4]]);
// [1, 2, 3, 4]

flatten([[1, 2], [[3, 4]]]);
// [1, 2, [3, 4]]

flatten([[[1, 2]], [3, 4]]);
// [[1, 2], 3, 4]

flatten([[[1, 2], [3, 4]]]);
// [[1, 2], [3, 4]]
```

## 7. flatMap

### Parameters

1. `mappingFunction` - Function to run on each list item.
2. `list` - List of items.

### Description

Maps each list item according to the given function, then flattens the result.

### Implementation

```js
// Kind of cheating, because we already implemented flatten 😉
const flatMap = (mappingFunction, list) => flatten(list.map(mappingFunction));
```

### Usage

```js
flatMap((n) => [n * 2], [1, 2, 3, 4]);
// [2, 4, 6, 8]

flatMap((n) => [n, n], [1, 2, 3, 4]);
// [1, 1, 2, 2, 3, 3, 4, 4]

flatMap((s) => s.split(' '), ['flatMap', 'should be', 'mapFlat']);
// ['flatMap', 'should', 'be', 'mapFlat']
```

## 8. includes

### Parameters

1. `item` - Item to check the list for.
2. `list` - List of items.

### Description

Checks a list for a given element. If the element is found, returns `true`. Otherwise returns `false`.

### Implementation

```js
const includes = (item, list) =>
  list.reduce((isIncluded, value) => isIncluded || item === value, false);
```

### Usage

```js
includes(3, [1, 2, 3]); // true
includes(3, [1, 2]); // false
includes(0, []); // false
```

## 9. compact

### Parameters

1. `list` - List of items.

### Description

Removes "falsey" values from a list.

### Implementation

```js
const compact = (list) =>
  list.reduce((acc, value) => {
    if (value) {
      acc.push(value);
    }

    return acc;
  }, []);
```

### Usage

```js
compact([0, null, 1, undefined, 2, '', 3, false, 4, NaN]);
// [1, 2, 3, 4]
```

## 10. arrayIntoObject

### Parameters

1. `key` - String to use as the new object key.
2. `list` - List of items.

### Description

Converts an array into an object, using the given key as the new object's key.

### Implementation

```js
const arrayIntoObject = (key, list) =>
  list.reduce((acc, obj) => {
    const value = obj[key];

    acc[value] = obj;

    return acc;
  }, {});
```

### Usage

```js
const users = [
  { username: 'JX01', status: 'offline' },
  { username: 'yazeedBee', status: 'online' }
];

arrayIntoObject('username', users);
/*
{
  JX01: {
    username: 'JX01',
    status: 'offline'
  },
  yazeedBee: { username: 'yazeedBee', status: 'online' }
}
*/

arrayIntoObject('status', users);
/*
{
  offline: {
    username: 'JX01',
    status: 'offline'
  },
  online: { username: 'yazeedBee', status: 'online' }
}
*/
```

## Want Free Coaching?

If you'd like to schedule a free call to discuss Front-End development questions regarding code, interviews, career, or anything else [follow me on Twitter and DM me](https://twitter.com/yazeedBee).

After that if you enjoy our first meeting, we can discuss an ongoing coaching to help you reach your Front-End development goals!

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com!</a>

Until next time!
