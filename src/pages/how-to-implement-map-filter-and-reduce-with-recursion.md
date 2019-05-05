---
title: How to implement map, filter, and reduce with recursion
date: '2018-05-30'
---

![](https://cdn-images-1.medium.com/max/1600/1*YMYCdveLRLC9SI3ZYg8dBA.jpeg)

### Array.map

We all probably know `Array.map`. It transforms an array of elements according to a given function.

<pre name="7d90" id="7d90" class="graf graf--pre graf-after--p">double = (x) => x * 2;</pre>

<pre name="3c38" id="3c38" class="graf graf--pre graf-after--pre">map(double, [1, 2, 3]);
// [2, 4, 6]</pre>

I’ve always seen it implemented along these lines:

<pre name="deed" id="deed" class="graf graf--pre graf-after--p">map = (fn, arr) => {
    const mappedArr = [];</pre>

<pre name="486a" id="486a" class="graf graf--pre graf-after--pre">    for (let i = 0; i < arr.length; i++) {
        let mapped = fn(arr[i]);</pre>

<pre name="a541" id="a541" class="graf graf--pre graf-after--pre">        mappedArr.push(mapped);
    }</pre>

<pre name="0333" id="0333" class="graf graf--pre graf-after--pre">    return mappedArr;
};</pre>

[This video](https://youtu.be/XcS-LdEBUkE?t=4m16s) exposed me to an alternative `Array.map` implementation. It’s from a 2014 JSConf — way before I jumped on the functional programming bandwagon.

**Edit:** [David Cizek](https://medium.com/@dadc) and [Stephen Blackstone](https://medium.com/@steveb3210) kindly pointed out edge-cases and suboptimal performance regarding this `map` implementation. I wouldn’t advise anyone use this in a real app. My intention’s that we appreciate and learn from this thought-provoking, recursive approach. 😁

The original example’s in CoffeeScript, here’s a JavaScript equivalent.

<pre name="1786" id="1786" class="graf graf--pre graf-after--p">map = (fn, [head, ...tail]) => (
 head === undefined ? [] : [fn(head), ...map(fn, tail)]
);</pre>

You might use [David Cizek](https://medium.com/@dadc)’s safer implementation instead.

<pre name="5549" id="5549" class="graf graf--pre graf-after--p">map = (_fn_, [_head_, ..._tail_]) _=>_ (
  head === undefined && tail.length < 1
    ? []
    : [fn(head), ...map(fn, tail)]
);</pre>

Using [ES6's destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), we store the array’s first element into the variable `head`. Then we store _all the other_ array elements into `tail`.

If `head` is `undefined`, that means we have an empty array, so just return an empty array. We’ve _mapped_ nothing.

<pre name="977e" id="977e" class="graf graf--pre graf-after--p">map(double, []);
// []</pre>

If `head` _is not_ `undefined` we return a new array with `fn(head)` as the first element. We’ve now _mapped_ the array’s first element. Alongside it is `map(fn, tail)` which calls `map` again, this time with one less element.

Since `map` returns an array, we use ES6’s [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to concatenate it with `[head]`.

Let’s step through this in the debugger. Paste this into your browser’s JavaScript console.

<pre name="e617" id="e617" class="graf graf--pre graf-after--p">map = (fn, [head, ...tail]) => {
    if (head === undefined) {
        return [];
    }</pre>

<pre name="3849" id="3849" class="graf graf--pre graf-after--pre">    debugger;</pre>

<pre name="a712" id="a712" class="graf graf--pre graf-after--pre">    return [fn(head), ...map(fn, tail)];
};</pre>

Now let’s `map(double, [1, 2, 3])`.

![](https://cdn-images-1.medium.com/max/1600/1*YB8D4_0XaIAGze7CKffX6A.png)

We see our local variables:

`head`: `1`

`tail`: `[2, 3]`

`fn`: `double`

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

<pre name="2c1f" id="2c1f" class="graf graf--pre graf-after--p">isEven = (x) => x % 2 === 0;</pre>

<pre name="b407" id="b407" class="graf graf--pre graf-after--pre">filter(isEven, [1, 2, 3]);
// [2]</pre>

Consider this recursive solution:

<pre name="5b08" id="5b08" class="graf graf--pre graf-after--p">filter = (pred, [head, ...tail]) => head === undefined ? [] : (
 pred(head) ?
   [head, ...filter(pred, tail)] : [...filter(pred, tail)]
);</pre>

If you understand the [recursive Array.](https://medium.com/front-end-hacking/implement-array-map-with-recursion-35976d0325b2)`[map](https://medium.com/front-end-hacking/implement-array-map-with-recursion-35976d0325b2)`, this one’s easy 💲.

We’re still capturing the array’s first element in a variable called `head`, and the rest in a separate array called `tail`.

And with the same base case, if `head` is `undefined`, return an empty array and finish iterating.

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

<pre name="69ef" id="69ef" class="graf graf--pre graf-after--p">reduce = (fn, acc, arr) => {
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i]);
  }</pre>

<pre name="38ba" id="38ba" class="graf graf--pre graf-after--pre">  return acc;
}</pre>

And we can use it like this:

<pre name="26b7" id="26b7" class="graf graf--pre graf-after--p">add = (x, y) => x + y;</pre>

<pre name="bb50" id="bb50" class="graf graf--pre graf-after--pre">reduce(add, 0, [1, 2, 3]); **// 6**</pre>

You’d get the same result with this recursive implementation:

<pre name="daab" id="daab" class="graf graf--pre graf-after--p">reduce = (fn, acc, [head, ...tail]) => head === undefined ?
  acc : reduce(fn, fn(acc, head), tail);</pre>

I find this one much easier to read than recursive `map` and `filter`.

Let’s step through this in the browser console. Here’s an expanded version with `debugger` statements:

<pre name="12a0" id="12a0" class="graf graf--pre graf-after--p">reduce = (fn, acc, [head, ...tail]) => {
  if (head === undefined) {
 **debugger;**</pre>

<pre name="78e4" id="78e4" class="graf graf--pre graf-after--pre">    return acc;
  }</pre>

<pre name="7c7f" id="7c7f" class="graf graf--pre graf-after--pre"> **debugger;**</pre>

<pre name="24c7" id="24c7" class="graf graf--pre graf-after--pre">    return reduce(fn, fn(acc, head), tail);
};</pre>

Then we’ll call this in the console:

<pre name="1f6e" id="1f6e" class="graf graf--pre graf-after--p">add = (x, y) => x + y;</pre>

<pre name="05e4" id="05e4" class="graf graf--pre graf-after--pre">reduce(add, 0, [1, 2, 3]);</pre>

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

Looks good to me!

Thank you so much reading this. [I’m on Twitter](https://twitter.com/yazeedBee) if you’d like to talk.

Until next time!

Take care,
Yazeed Bzadough
[http://yazeedb.com/](http://yazeedb.com/)
