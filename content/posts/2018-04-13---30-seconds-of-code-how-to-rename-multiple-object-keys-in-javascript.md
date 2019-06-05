---
title: '30 Seconds of Code: How to rename multiple object keys in JavaScript'
date: '2018-04-13'
description: 'A response to my article on renaming a single object key in JavaScript.'
draft: false
template: 'post'
slug: '/posts/30-seconds-of-code-rename-multiple-object-keys'
category: 'Code snippets explained'
tags:
  - 'Code snippets'
  - 'Functions'
  - 'Immutability'
---

![](https://cdn-images-1.medium.com/max/1600/1*qlRItHMmEVJGSEDRYJbGLA.png)

30 Seconds of Code is a brilliant collection of JavaScript snippets, digestible in ≤ 30 seconds. **Anyone looking to master JavaScript should go through the entire thing.**

The list didn’t contain a function to rename multiple object keys, however, so I created a [pull request](https://github.com/Chalarangelo/30-seconds-of-code/pull/646) that thankfully got merged!

Here’s the official entry: [https://30secondsofcode.org/object#renamekeys](https://30secondsofcode.org/object#renamekeys)

I’ve previously written on [renaming object keys](https://medium.com/front-end-hacking/immutably-rename-object-keys-in-javascript-5f6353c7b6dd), but we only changed one key at a time.

Then [Adam Rowe](https://medium.com/@adaminsley) kindly commented, asking how we might rename _multiple_ object keys. I replied with this code sample after some thought and research.

```js
renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );
```

This was inspired by [Ramda Adjunct](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.renameKeys)’s `renameKeys` function.

- `keysMap` contains key/value pairs of your old/new object keys.
- `obj` is the object to be changed.

You might use it like this:

```js
keysMap = {
  name: 'firstName',
  job: 'passion'
};

obj = {
  name: 'Bobo',
  job: 'Front-End Master'
};

renameKeys(keysMap, obj);
// { firstName: 'Bobo', passion: 'Front-End Master' }
```

Let’s step through it! We can write an expanded, `debugger`-friendly version of this function:

```js
renameKeys = (keysMap, obj) => {
  debugger;

  return Object.keys(obj).reduce((acc, key) => {
    debugger;

    const renamedObject = {
      [keysMap[key] || key]: obj[key]
    };

    debugger;

    return {
      ...acc,
      ...renamedObject
    };
  }, {});
};
```

And we’ll use it like this:

```js
renameKeys(
  {
    name: 'firstName',
    job: 'passion'
  },
  {
    name: 'Bobo',
    job: 'Front-End Master'
  }
);
```

![](https://cdn-images-1.medium.com/max/1600/1*C9BI6jfACst-UcchX6wyyA.png)

Pausing on line 2, we see that `keysMap` and `obj` have been properly assigned.

Here’s where the fun begins. Move to the next `debugger`.

![](https://cdn-images-1.medium.com/max/1600/1*3HKJjlIj8tChHNlre9WV9Q.png)

Inspect our local variables on line 7:

- `acc: {}` because that’s `Array.reduce()`’s initial value (line 19).
- `key: “name”` because it’s the first key from `Object.keys(obj)`.
- `renamedObject: undefined`

Also notice that we can access `keysMap` and `obj` from the parent function’s scope.

Guess what `renamedObject` will be. Like in my [aforementioned post](https://medium.com/front-end-hacking/immutably-rename-object-keys-in-javascript-5f6353c7b6dd), we’re using [_computed property names_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) to dynamically assign `renamedObject`'s key.

If `keysMap[key]` exists, use it. Otherwise, use the original object key. In this case, `keysMap[key]` is `“firstName”`.

![](https://cdn-images-1.medium.com/max/1600/1*aYI7ss4IOWIipNsC40r9rg.png)

That’s `renamedObject`'s key, what about its corresponding value?

![](https://cdn-images-1.medium.com/max/1600/1*GEBIVtNMWIuosMVq4FLMQw.png)

It’s `obj[key]`: `"Bobo"`. Hit the next `debugger` and check it out.

![](https://cdn-images-1.medium.com/max/1600/1*XMGM2FxuNscmq_imZf8Nmw.png)

`renamedObject` is now `{ firstName: “Bobo” }`.

![](https://cdn-images-1.medium.com/max/1600/1*z8HEVhgr8-e5HFrtAK5lzg.png)

Now using the _spread_ operator, we’ll merge `acc` and `renamedObject`. Remember that `acc` is currently `.reduce`'s initial value: an empty object.

So merging `acc` and `renamedObject` just results in a clone of `renamedObject`.

![](https://cdn-images-1.medium.com/max/1600/1*Fw0QyV7VsU2UH-GtD-74WQ.png)

Since we’re returning this object, however, it becomes `acc` in `.reduce`’s next iteration. Move to the next `debugger` to see this.

![](https://cdn-images-1.medium.com/max/1600/1*h0Lxhtw1trErPruUBKamfA.png)

We’re inside `.reduce`'s again, because there’s one more `key` to process. We see that `acc` is now `{ firstName: "Bobo" }`.

The same process runs again, and `renamedObject` is properly created.

![](https://cdn-images-1.medium.com/max/1600/1*OfKamMrGJLBIvY2WgQrlaA.png)

This time, merging `acc` and `renamedObject` actually makes a difference.

![](https://cdn-images-1.medium.com/max/1600/1*uMdN7mSsIhgvzJCceftUOw.png)

Run past this `debugger` to return that object, and you’re done!

Here’s the final output:

![](https://cdn-images-1.medium.com/max/1600/1*TpcJHEG6MUxazCkNnCg6AQ.png)

Have fun renaming **all the keys**, until next time!
