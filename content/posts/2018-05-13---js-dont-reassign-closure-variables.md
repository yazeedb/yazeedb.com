---
title: 'JS: Don’t Reassign Closure Variables!'
date: '2018-05-13'
description: 'Yet another JavaScript gotcha!'
draft: false
template: 'post'
slug: '/posts/js-dont-reassign-closure-variables'
category: 'JavaScript Gotchas'
tags:
  - 'JavaScript Gotchas'
---

I had a serious “gotcha” moment while writing a GraphQL article and felt completely lost.

![](https://cdn-images-1.medium.com/max/1600/1*ziaoudVG48VIFLJJasu6XA.jpeg)

Consider this code:

```js
always = (value) => () => value;
give10 = always(10);

give10(); // 10
```

`always` takes a `value` and returns a function that _always_ returns `value`. Simple, right?

This is only possible because JavaScript allows functions to share their variable scope with any functions they return. So even though `always` executed, `value` isn’t garbage-collected because the returned function, `give10`, is referencing it as a closure variable.

This works with objects/arrays too:

```js
nums = [1, 2, 3];
giveNums = always(nums);

giveNums(); // [1, 2, 3]
```

You can even mutate `nums` down the road and be just fine:

```js
nums.pop();
giveNums(); // [1, 2]
```

#### But things get weird when you reassign it…

```js
nums = [4, 5, 6];
giveNums(); // [1, 2]
```

> Reassigning a variable doesn’t change it across closures.

> (╯°□°）╯︵ ┻━┻

You might reassign a variable being used in hundreds of closure scopes and get tons of errors (silent ones, if you’re unlucky), and you’ll have no idea why.

We all knew this applies to primitives (numbers, strings, booleans), because they are passed _by value_. They’re copied and stored in a new memory address.

```js
myNum = 10;
getMyNum = always(myNum);

++myNum; // 11
getMyNum(); // 10
```

Arrays and objects aren’t copied, however, they’re passed _by reference_. So the function’s just told, “Hey, `myNum` is at this address, go get it.”

**But reassigning a variable _creates a new reference, no matter what_**.

Consider this code:

```js
bobo = { name: 'Bobo' };
getBobo = always(bobo);

bobo === getBobo(); // true
```

That returns `true` because `getBobo` references `bobo`'s address.

Mutating `bobo` doesn’t affect that relationship:

```js
bobo.name = 'Mutant-Bobo';
bobo === getBobo(); // true
```

But reassigning `bobo` stores him somewhere else, leaving our closures hanging.

```js
bobo = { name: 'New-Bobo' };
getBobo(); // { name: 'Mutant-Bobo' }
```

Old `bobo`'s still in memory, but he’s only accessible through `getBobo`’s closure, because no one else is referencing him.

This is all based on my own testing, and I’m further researching this enlightening “gotcha”. If anything’s missing/incorrect, please leave a comment! ❤️

Be careful, my friends. Until next time!
