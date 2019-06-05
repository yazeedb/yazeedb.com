---
title: How to implement map, filter, and reduce with recursion
date: '2018-05-30'
description: ''
draft: false
template: 'post'
slug: '/posts/implement-map-filter-reduce-using-recursion'
category: 'React'
tags:
  - 'React'
  - 'React Hooks'
  - 'Wikipedia search'
---

![](https://cdn-images-1.medium.com/max/1600/1*YMYCdveLRLC9SI3ZYg8dBA.jpeg)

### Array.map

We all probably know `Array.map`. It transforms an array of elements according to a given function.

```js
double = (x) => x * 2;
map(double, [1, 2, 3]);
// [2, 4, 6]
```

I’ve always seen it implemented along these lines:

```js
map = (fn, arr) => {
  const mappedArr = [];

  for (let i = 0; i < arr.length; i++) {
    let mapped = fn(arr[i]);

    mappedArr.push(mapped);
  }

  return mappedArr;
};
```

[This video](https://youtu.be/XcS-LdEBUkE?t=4m16s) exposed me to an alternative `Array.map` implementation. It’s from a 2014 JSConf — way before I jumped on the functional programming bandwagon.

**Edit:** [David Cizek](https://medium.com/@dadc) and [Stephen Blackstone](https://medium.com/@steveb3210) kindly pointed out edge-cases and suboptimal performance regarding this `map` implementation. I wouldn’t advise anyone use this in a real app. My intention’s that we appreciate and learn from this thought-provoking, recursive approach. 😁

The original example’s in CoffeeScript, here’s a JavaScript equivalent.

```js
map = (fn, [head, ...tail]) =>
  head === undefined ? [] : [fn(head), ...map(fn, tail)];
```

You might use [David Cizek](https://medium.com/@dadc)’s safer implementation instead.

```js
map = (_fn_, [_head_, ..._tail_]) _=>_ (
  head === undefined && tail.length < 1
    ? []
    : [fn(head), ...map(fn, tail)]
);
```

Using [ES6's destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), we store the array’s first element into the variable `head`. Then we store _all the other_ array elements into `tail`.

If `head` is `undefined`, that means we have an empty array, so just return an empty array. We’ve _mapped_ nothing.

```js
map(double, []);
// []
```

If `head` _is not_ `undefined` we return a new array with `fn(head)` as the first element. We’ve now _mapped_ the array’s first element. Alongside it is `map(fn, tail)` which calls `map` again, this time with one less element.

Since `map` returns an array, we use ES6’s [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to concatenate it with `[head]`.

Let’s step through this in the debugger. Paste this into your browser’s JavaScript console.

```js
map = (fn, [head, ...tail]) => {
  if (head === undefined) {
    return [];
  }

  debugger;

  return [fn(head), ...map(fn, tail)];
};
```

Now let’s `map(double, [1, 2, 3])`.

![](https://cdn-images-1.medium.com/max/1600/1*YB8D4_0XaIAGze7CKffX6A.png)

We see our local variables:

```
head: 1
tail: [2, 3]
fn: double
```

We know `fn(head)` is `2`. That becomes the new array’s first element. Then we call `map` again with `fn` and the rest of the array’s elements: `tail`.

So before the initial `map` call even returns, we’ll keep calling `map` until the array’s been emptied out. Once the array’s empty, `head` will be `undefined`, allowing our base case to run and finish the whole process.

![](https://cdn-images-1.medium.com/max/1600/1*dowa0N9An5o2V0quqD72nA.png)

On the next run, `head` is `2` and `tail` is `[3]`.

Since `tail` isn’t empty yet, hit the next breakpoint to call `map` again.

![](https://cdn-images-1.medium.com/max/1600/1*IMm0-zX10Zs5GGqu9Yl1ow.png)

`head` is `3`, and `tail` is an empty array. The next time this function runs, it’ll bail on line 3 and finally return the mapped array.

And here’s our end result:

![](https://cdn-images-1.medium.com/max/1600/1*m9PXMrrg9x9v013-Rl-UkQ.png)

### Array.filter

`Array.filter` returns a new array based on the elements that satisfy a given predicate function.

```js
isEven = (x) => x % 2 === 0;
filter(isEven, [1, 2, 3]);
// [2]
```

Consider this recursive solution:

```js
filter = (pred, [head, ...tail]) =>
  head === undefined
    ? []
    : pred(head)
    ? [head, ...filter(pred, tail)]
    : [...filter(pred, tail)];
```

If `map` made sense, this'll be easy.

We’re still capturing the array’s first element in a variable called `head`, and the rest in a separate array called `tail`.

And with the same base case, if `head` is `undefined`, return an empty array and finish iterating.

But we have another conditional statement: only put `head` in the new array if `pred(head)` is `true`, because `filter` works by testing each element against a predicate function. Only when the predicate returns `true`, do we add that element to the new array.

If `pred(head)` doesn’t return `true`, just call `filter(pred, tail)` without `head`.

Let’s quickly expand and step through this in the Chrome console.

```js
filter = (pred, [head, ...tail]) => {
  if (head === undefined) return [];

  if (pred(head)) {
    debugger;

    return [head, ...filter(pred, tail)];
  }

  debugger;

  return [...filter(pred, tail)];
};
```

And look for numbers ≤ 10:

<pre name="2060" id="2060" class="graf graf--pre graf-after--p">filter(x => x <= 10, [1, 10, 20]);</pre>

![](https://cdn-images-1.medium.com/max/1600/1*hGkyWV3T_hDb1Hnav_lmAg.png)

Since our array’s `[1, 10, 20]`, `head` is the first element, 1, and `tail` is an array of the rest: `[10, 20]`.

The predicate tests if `x` ≤ 10, so `pred(1)` returns `true`. That’s why we paused on line 4’s `debugger` statement.

Since the current `head` passed the test, it’s allowed entry into our filtered array. But we’re not done, so we call `filter` again with the same predicate, and now `tail`.

Move to the next `debugger`.

![](https://cdn-images-1.medium.com/max/1600/1*WESZIWb_dxhNNO-6-YJGuA.png)

We called `filter` with `[10, 20]` so `head` is now 10, and `tail` is `[20]`. So how does `tail` get smaller with each successive iteration?

We’re on line 4’s `debugger` once again because because 10 ≤ 10\. Move to the next breakpoint.

![](https://cdn-images-1.medium.com/max/1600/1*1U9o0ejjyzTvfjeEypYIFA.png)

`head`'s now 20 and `tail`'s empty.

Since 20 > 10, `pred(head)` returns `false` and our filtered array won’t include it. We’ll call `filter` one more time without `head`.

This next time, however, `filter` will bail on line 2\. [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) an empty array gives you `undefined` variables. Continue past this breakpoint to get your return value.

![](https://cdn-images-1.medium.com/max/1600/1*2BdKSxNZwaGJ9Sc1VAWjXA.png)

That looks correct to me!

### Array.reduce

Last but not least, `Array.reduce` is great for boiling an array down to a single value.

Here’s my naive `reduce` implementation:

```js
reduce = (fn, acc, arr) => {
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i]);
  }

  return acc;
};
```

And we can use it like this:

```js
add = (x, y) => x + y;
reduce(add, 0, [1, 2, 3]); // 6
```

You’d get the same result with this recursive implementation:

```js
reduce = (fn, acc, [head, ...tail]) =>
  head === undefined ? acc : reduce(fn, fn(acc, head), tail);
```

I find this one much easier to read than recursive `map` and `filter`.

Let’s step through this in the browser console. Here’s an expanded version with `debugger` statements:

```js
reduce = (fn, acc, [head, ...tail]) => {
  if (head === undefined) {
    debugger;

    return acc;
  }

  debugger;

  return reduce(fn, fn(acc, head), tail);
};
```

Then we’ll call this in the console:

```js
add = (x, y) => x + y;
reduce(add, 0, [1, 2, 3]);
```

![](https://cdn-images-1.medium.com/max/1600/1*2oPtNloFlI-0OZ1B3IZENA.png)

#### Round 1

We see our local variables:

`acc`: our initial value of `0`

`fn`: our `add` function

`head`: the array’s first element, `1`

`tail`: the array’s other elements packed into a _separate_ array, `[2, 3]`

Since `head` isn’t `undefined` we’re going to recursively call `reduce`, **passing along its required parameters**:

`fn`: Obviously the `add` function again 😁

`acc`: The result of calling `fn(acc, head)`. Since `acc` is `0`, and `head` is `1`, `add(0, 1)` returns `1`.

`tail`: The array’s leftover elements. By always using tail, we keep cutting the array down until nothing’s left!

Move to the next `debugger`.

#### Round 2

![](https://cdn-images-1.medium.com/max/1600/1*jYaNr_L9nJYw7N2uMMFsbQ.png)

Local variables:

`acc`: Now it’s `1`, because we called `reduce` with `fn(acc, head)`, which was `add(0, 1)` at the time.

`fn`: Still `add`!

`head`: Remember how we passed the previous `tail` to `reduce`? Now that’s been destructured, with `head` representing its first element, `2`.

`tail`: There’s only one element left, so `3`’s been packed into an array all by itself.

We know the next `reduce` call will take a function, accumulator, and array. We can evaluate the next set of parameters **using the console**.

![](https://cdn-images-1.medium.com/max/1600/1*TVD3RgN7v4FW_j8mIogckQ.png)

Expect these values on the next breakpoint.

#### Round 3

![](https://cdn-images-1.medium.com/max/1600/1*YjHE_30_rjv8s4__FNdy3g.png)

Our local variables are as expected. `head`'s first and only element is `3`.

And our array only has one element left, `tail`'s empty! That means the next breakpoint will be our last.

Let’s quickly evaluate our future local variables:

![](https://cdn-images-1.medium.com/max/1600/1*agbXBbNDXSsqYRd6aYLD7w.png)

Move to the final breakpoint.

#### Round 4

![](https://cdn-images-1.medium.com/max/1600/1*E0CAeH84AfH9JBdtposIBA.png)

Check it out, we paused on line 3 instead of line 6 this time! `head` is `undefined` so we’re returning the final, `6`! It’ll pop out if you move to the next breakpoint.

![](https://cdn-images-1.medium.com/max/1600/1*VBzXT1FLhUP0_iRPJ_QTFQ.png)![](https://cdn-images-1.medium.com/max/1600/1*ApR1Nzk791drSLLBzcq2Xw.png)

Looks good to me! Thank you so much for reading this.
