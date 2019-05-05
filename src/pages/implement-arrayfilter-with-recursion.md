---
title: Implement Array.filter with Recursion
date: '2018-06-05'
---

![](https://cdn-images-1.medium.com/max/1600/1*vYgbd87IrfDj7n2TwdaxGA.jpeg)[Photo credit](https://unsplash.com/photos/gdQj7naqfg0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

[My last post](https://medium.com/front-end-hacking/implement-array-map-with-recursion-35976d0325b2) covered a recursive `Array.map`. While it’s a good learning resource, [I don’t recommend](https://medium.com/@steveb3210/map-recursive-3f7e31e9513) anyone actually use it in their apps.

Same goes for implementing `Array.filter` recursively.

Instead of this (simplified) traditional version:

<pre name="5e61" id="5e61" class="graf graf--pre graf-after--p">filter = (predicate, arr) => {
    const filteredArray = [];</pre>

<pre name="55ff" id="55ff" class="graf graf--pre graf-after--pre">    for (let i = 0; i < arr.length; i++) {
        let currentItem = arr[i];</pre>

<pre name="5603" id="5603" class="graf graf--pre graf-after--pre">        if (predicate(currentItem)) {
            filteredArray.push(currentItem);
        }
    }</pre>

<pre name="3e81" id="3e81" class="graf graf--pre graf-after--pre">    return filteredArray;
};</pre>

Consider this:

<pre name="fe40" id="fe40" class="graf graf--pre graf-after--p">filter = (pred, [head, ...tail]) => head === undefined ? [] : (
 pred(head) ? [head, ...filter(pred, tail)] : [...filter(pred, tail)]
);</pre>

If you understand the [recursive Array.](https://medium.com/front-end-hacking/implement-array-map-with-recursion-35976d0325b2)`[map](https://medium.com/front-end-hacking/implement-array-map-with-recursion-35976d0325b2)`, this one’s easy 💲.

We’re still capturing the array’s first element in a variable called `head`, and the rest in a separate array called `tail`.

And with the same base case–if `head` is `undefined`, return an empty array and finish iterating.

But we have another conditional statement: only put `head` in the new array if `pred(head)` is `true`, because `filter` works by testing each element against a predicate function. Only when the predicate returns `true`, do we add that element to the new array.

If `pred(head)` doesn’t return `true`, just call `filter(pred, tail)` without `head`.

Let’s quickly expand and step through this in the Chrome console.

<pre name="9392" id="9392" class="graf graf--pre graf-after--p">filter = (pred, [head, ...tail]) => {
    if (head === undefined) return [];</pre>

<pre name="b830" id="b830" class="graf graf--pre graf-after--pre">    if (pred(head)) {
 **debugger;**</pre>

<pre name="84aa" id="84aa" class="graf graf--pre graf-after--pre">        return [head, ...filter(pred, tail)];
    }</pre>

<pre name="4365" id="4365" class="graf graf--pre graf-after--pre"> **debugger;**</pre>

<pre name="9064" id="9064" class="graf graf--pre graf-after--pre">    return [...filter(pred, tail)];
};</pre>

And look for numbers ≤ 10:

<pre name="2060" id="2060" class="graf graf--pre graf-after--p">filter(x => x <= 10, [1, 10, 20]);</pre>

![](https://cdn-images-1.medium.com/max/1600/1*hGkyWV3T_hDb1Hnav_lmAg.png)

Since our array’s `[1, 10, 20]`, `head` is the first element, 1, and `tail` is an array of the rest: `[10, 20]`.

The predicate tests if `x` ≤ 10, so `pred(1)` returns `true`. That’s why we paused on line 4’s `debugger` statement.

Since the current `head` passed the test, he’s allowed entry into our filtered array. But we’re not done, so we call `filter` again with the same predicate, and now `tail`.

Move to the next `debugger`.

![](https://cdn-images-1.medium.com/max/1600/1*WESZIWb_dxhNNO-6-YJGuA.png)

We called `filter` with `[10, 20]` so `head` is now 10, and `tail` is `[20]`. So how `tail` gets smaller with each successive iteration?

We’re on line 4’s `debugger` once again because because 10 ≤ 10\. Move to the next breakpoint.

![](https://cdn-images-1.medium.com/max/1600/1*1U9o0ejjyzTvfjeEypYIFA.png)

`head`'s now 20 and `tail`'s empty.

Since 20 > 10, `pred(head)` returns `false` and our filtered array won’t include it. We’ll call `filter` one more time without `head`.

This next time, however, `filter` will bail on line 2\. [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) an empty array gives you `undefined` variables. Continue past this breakpoint to get your return value.

![](https://cdn-images-1.medium.com/max/1600/1*2BdKSxNZwaGJ9Sc1VAWjXA.png)

That looks correct to me!

Consider commenting if this helped. Recursive `reduce` is likely up next. 😁

Keep coding. Until next time!

Take care,
Yazeed Bzadough
