---
title: JavaScript Is Ramda’s flip() Useful?
date: '2018-01-22'
description: 'Spoiler alert: yes!'
draft: false
template: 'post'
slug: '/posts/is-ramdas-flip-useful'
category: 'Ramda'
tags:
  - 'Ramda'
  - 'Functional Programming'
---

![](https://cdn-images-1.medium.com/max/1600/1*KSt_vJte9Wn-4FJxXs8P3w.jpeg)

> A ram… duh

[Ramda](http://ramdajs.com) has > 200 utility functions designed to make functional programming easier. From those 200, however, I didn’t expect to ever need `flip`. Here’s some [official docs](http://ramdajs.com/docs/#flip):

> Returns a new function much like the supplied one, except that the first two arguments’ order is reversed.

It `flip`s your function’s first two params. Let’s make a `greet` function.

```js
greet = (name, greeting) => `${greeting}, ${name}!`;
```

![](https://cdn-images-1.medium.com/max/1600/1*tIDJYlA37_IZ9_FLJp48yg.png)

Here’s `flip(greet)`

![](https://cdn-images-1.medium.com/max/1600/1*oZ_eZFursGTDi_l5n31ZSw.png)

### Why Is This Useful…?

It’s a valid question! Would you ever write a function expecting to need its parameters flipped? **What if you didn’t write that function?**

Let’s imagine `greet` is from a 3rd party library. We’re using it within an enterprise app and fetching names from a database. When a name comes back, we want to `greet` it with “Hey there”.

Let’s also imagine that `greet` is curried. If you’re not familiar with currying in JavaScript, see [my post on it](https://medium.com/@yazeedb/how-does-javascripts-curry-actually-work-8d5a6f891499). Currying `greet` allows us to pass one argument instead of two. You can _partially apply_ `greet` and reuse it. Quick example:

![](https://cdn-images-1.medium.com/max/1600/1*L3oSxvEkTSMlC-YcK00oZA.png)

So we want to say “Hey there” to all users. Since `greet` is curried, we _could_ write a function that partially applies a greeting, but there’s one problem…

Since `greet` expects the name first, we can’t partially apply a greeting and reuse it!

### flip() to the Rescue!

What if we `flip(greet)`? Now we can supply the greeting first!

![](https://cdn-images-1.medium.com/max/1600/1*DqdSzp62X9EUN-w5EBiLqg.png)

And by the way, most of Ramda’s functions curry by default, so we didn’t even have to curry `greet` ourselves. `flip` did that for us!

I hope this little post shed some light on how `flip` can be useful. You never know–you might have a function’s second piece of data available before the first, and `flip`ping would do the trick!
