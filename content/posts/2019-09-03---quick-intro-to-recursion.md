---
title: 'A Quick Intro to Recursion in Javascript'
date: '2019-09-03'
description: 'The function calls itself until someone stops it.'
draft: false
template: 'post'
slug: '/posts/quick-intro-to-recursion'
category: 'JavaScript'
coverImageUrl: '/media/quick-intro-to-recursion/cover-image.jpeg'
tags:
  - 'JavaScript'
  - 'Functional Programming'
---

![cover-image](/media/quick-intro-to-recursion/cover-image.jpeg)

## The function calls itself until someone stops it.

Recursion can feel difficult to new developers. Perhaps that's because many resources teach it using algorithmic examples (Fibonacci, linked-lists). This piece will hopefully introduce things plainly, using one simple example.

## Core Idea

**Recursion** is when a function calls itself until someone stops it. If no one stops it then it'll **recurse** (call itself) forever.

![no-this-is-patrick](/media/quick-intro-to-recursion/no-this-is-patrick.jpeg)

Recursive functions let you perform a unit of work multiple times. This is exactly what `for/while` loops let us accomplish! Sometimes, however, recursive solutions are a more elegant approach to solving a problem.

## Countdown Function

Let's create a function that counts down from a given number. We'll use it like this.

```js
countDownFrom(5);
// 5
// 4
// 3
// 2
// 1
```

And here's our algorithm to solve this problem.

1. Take one parameter called `number`. This is our starting point.
2. Go from `number` down to `0`, logging each one along the way.

We'll start with a `for` loop approach and then compare it to a recursive one.

### Imperative approach (loops)

```js
function countDownFrom(number) {
  for (let i = number; i > 0; i--) {
    console.log(i);
  }
}

countDownFrom(5);
// 5
// 4
// 3
// 2
// 1
```

This one contains both algorithmic steps.

1. ✅ Take one parameter called `number`.
2. ✅ Log everything from `number` to `0`.

### Recursive approach

```js
function countDownFrom(number) {
  if (number === 0) {
    return;
  }

  console.log(number);
  countDownFrom(number - 1);
}

countDownFrom(5);
// 5
// 4
// 3
// 2
// 1
```

This one also passes.

1. ✅ Take one parameter called `number`.
2. ✅ Log everything from `number` to `0`.

So conceptually the two approaches are the same. However, they get the job done in different ways.

### Debugging our imperative solution

For a more visual example, let's put a `debugger` in our loop version and throw it into Chrome Developer Tools.

```js
function countDownFrom(number) {
  for (let i = number; i > 0; i--) {
    console.log(i);
    debugger;
  }
}
```

![countdownFrom-iterative](/media/quick-intro-to-recursion/countdownFrom-iterative.gif)

See how it uses an extra variable, `i`, to track the current number? As you iterate `i` decreases, eventually hitting `0` and terminating.

And in the `for` loop we specified "stop if `i > 0`".

### Debugging our recursive solution

```js
function countDownFrom(number) {
  if (number === 0) {
    return;
  }

  console.log(number);

  debugger;

  countDownFrom(number - 1);
}
```

![countdownFrom-recursive](/media/quick-intro-to-recursion/countdownFrom-recursive.gif)

The recursive version doesn't need extra variables to track its progress. Notice how the pile of functions (_call stack_) grows as we recurse?

That's because each call to `countDownFrom` adds to the stack, feeding it `number - 1`. By doing this we're we're passing along an updated `number` each time. No extra state needed!

That's main difference between the two approaches.

1. Iterative uses internal state (extra variables for counting, etc).
2. Recursive does not, it simply passes updated parameters between each call.

But how does either version know when to stop?

## Infinite Loops

In your travels, you may have been warned about the dreaded infinite loop.

```js
🚨 THIS RUNS FOREVER, BE WARNED 🚨
while (true) { console.log('WHY DID YOU RUN THIS?!' }

🚨 THIS RUNS FOREVER, BE WARNED 🚨
for (i = 0;;) { console.log('WHY DID YOU RUN THIS?!') }
```

Since they'd theoretically run forever, an infinite loop will halt your program and possibly crash your browser. You can prevent them by always coding a _stopping condition_.

```js
✅ This does not run forever
x = 0;
while (x < 3) { console.log(x); x++; }

✅ This does not run forever
for (x = 0; x < 3; x++) { console.log(x); }
```

In both cases we log `x`, increment it, and stop when it becomes `3`. Our `countDownFrom` function had similar logic.

```js
// Stop at 0
for (let i = number; i > 0; i--)
```

Again, loops need extra state to determine when they should stop. That's what `x` and `i` are for.

## Infinite Recursion

Recursion also presents the same danger. It's not hard to write a self-referencing function that'll crash your browser.

```js
🚨THIS RUNS FOREVER, BE WARNED🚨
function run() {
    console.log('running');
    run();
}

run();
// running
// running
// ...
```

![is-this-a-recursive](/media/quick-intro-to-recursion/is-this-a-recursive.jpg)

Without a stopping condition, `run` will forever call itself. You can fix that with an `if` statement.

```js
✅ This does not run forever

function run(x) {
    if (x === 3) return;

    console.log('running');
    run(x + 1);
}

run(0);
// running
// running
// running

// x is 3 now, we're done.
```

### Base case

This is known as the **base case**–our recursive `countDownFrom` had one.

```js
if (number === 0) {
  return;
}
```

It's the same idea as our loop's stopping logic. Whichever approach you pick, always remember that at some point **it needs to be stopped**.

![is-this-you-need-to-be-stopped](/media/quick-intro-to-recursion/is-this-you-need-to-be-stopped-2.png)

## Summary

- Recursion is when a function calls itself until someone stops it.
- It can be used instead of a loop.
- If no one stops it, it'll recurse forever and crash your program.
- A **base case** is a condition that stops the recursion. Don't forget to add them!
- Loops use extra state variables for tracking and counting, while recursion only uses the provided parameters.

![disappearing-loops](/media/quick-intro-to-recursion/disappearing-loops.jpg)

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com</a>. And please let me know what else you'd like to see! [My DMs are open on Twitter.](https://twitter.com/yazeedBee)

Until next time!
