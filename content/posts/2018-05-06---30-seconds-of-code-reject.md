---
title: '30 Seconds of Code: reject()'
date: '2018-05-06'
template: 'post'
draft: false
slug: '/posts/30-seconds-of-code-reject'
category: 'Code snippets explained'
tags:
  - 'Code snippets'
  - 'Functions'
description: 'The perfect complement to filter(), this function rejects the items that satisfy your predicate.'
---

![](https://cdn-images-1.medium.com/max/1600/1*fS-jTCqIsxtOIw1rWp1PrA.png)

30 Seconds of Code is a brilliant collection of JavaScript snippets, digestible in ≤ 30 seconds. **Anyone looking to master JavaScript should go through the entire thing.**

[My PR to 30secondsofcode](https://github.com/Chalarangelo/30-seconds-of-code/pull/657) added the `reject()` function.

Here’s the code from the official entry:

```js
reject = (pred, array) => array.filter((...args) => !pred(...args));
```

It works on arrays and denies whatever `Array.filter` would’ve kept.

`filter` example using numbers:

```js
nums = [1, 2, 3, 4, 5];
nums.filter((x) => x < 4);
// [1, 2, 3]
```

Copy/pasting that predicate into `reject` does the opposite:

```js
reject((x) => x < 4, nums);
// [4, 5]
```

You’d reject numbers greater than 3 like so:

```js
reject((x) => x > 3, nums);
// [1, 2, 3]
```

### What’s the point?

`filter` can do whatever `reject` does, so why bother?

The whole point of composition–_combining small things into bigger things_– is to more easily express ideas in code.

By simply negating `filter`'s predicate, we’ve invented a repeatable way to tackle the same problem from a different perspective. Isn’t that amazing?

We now have greater opportunity to reason in terms of **what to do** not **how to do** it.

In the real world, humans need to understand the code before the computer tries to. So when talking to another human we can now say “_Filter for everyone whose ages are 18 or older_”, or “_Reject anyone under 18_”.

I like the second one better…

And by making _pure_ functions your atomic building blocks, this type of abstraction’s possible on the micro and macro level.

Pure functions buy you the most flexibility.

- Previous state is not a concern
- No side effects
- Same Inputs => Same Outputs

But whether it’s FP or Object-Oriented Programming, we all compose software. It’s the mentality that’s important. Keep on coding.

Until next time!

Take care, <br />
Yazeed Bzadough
