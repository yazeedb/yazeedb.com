* * *

# Implement Array.reduce with Recursion

![](https://cdn-images-1.medium.com/max/1600/1*YMYCdveLRLC9SI3ZYg8dBA.jpeg)

My last two posts covered recursive `[Array.map](https://medium.com/front-end-hacking/implement-array-map-with-recursion-35976d0325b2)` and `[Array.filter](https://medium.com/front-end-hacking/implement-array-filter-with-recursion-5b60a3e58398)` implementations. [I don’t recommend](https://medium.com/@steveb3210/map-recursive-3f7e31e9513) anyone actually use them in their apps due to performance and uncaught edge-cases.

That being said, walking through these alternate solutions helps broaden our perspectives and perhaps apply the concepts in other situations.

You might see this naive `reduce` implementation:

<pre name="2102" id="2102" class="graf graf--pre graf-after--p">reduce = (fn, acc, arr) => {
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i]);
  }</pre>

<pre name="38ba" id="38ba" class="graf graf--pre graf-after--pre">  return acc;
}</pre>

And use it like this:

<pre name="26b7" id="26b7" class="graf graf--pre graf-after--p">add = (x, y) => x + y;</pre>

<pre name="bb50" id="bb50" class="graf graf--pre graf-after--pre">reduce(add, 0, [1, 2, 3]); **// 6**</pre>

You’d get the same result with this recursive implementation:

<pre name="daab" id="daab" class="graf graf--pre graf-after--p">reduce = (fn, acc, [head, ...tail]) => head === undefined ?
  acc : reduce(fn, fn(acc, head), tail);</pre>

I find this one much easier to read than recursive `map` and `filter`. If you understand those, this one’s a piece of 🍰.

Let’s step through this in the browser console. Here’s an expanded version with `debugger` statements:

<pre name="12a0" id="12a0" class="graf graf--pre graf-after--p">reduce = (fn, acc, [head, ...tail]) => {
  if (head === undefined) {
 **debugger;**</pre>

<pre name="78e4" id="78e4" class="graf graf--pre graf-after--pre">    return acc;
  }</pre>

<pre name="7c7f" id="7c7f" class="graf graf--pre graf-after--pre"> **debugger;**</pre>

<pre name="24c7" id="24c7" class="graf graf--pre graf-after--pre">  return reduce(fn, fn(acc, head), tail);
};</pre>

Then we’ll call this in the console:

<pre name="1f6e" id="1f6e" class="graf graf--pre graf-after--p">add = (x, y) => x + y;</pre>

<pre name="05e4" id="05e4" class="graf graf--pre graf-after--pre">reduce(add, 0, [1, 2, 3]);</pre>

![](https://cdn-images-1.medium.com/max/1600/1*2oPtNloFlI-0OZ1B3IZENA.png)

### Round 1

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

### Round 2

![](https://cdn-images-1.medium.com/max/1600/1*jYaNr_L9nJYw7N2uMMFsbQ.png)

Local variables:

`acc`: Now it’s `1`, because we called `reduce` with `fn(acc, head)`, which was `add(0, 1)` at the time.

`fn`: Still `add`!

`head`: Remember how we passed the previous `tail` to `reduce`? Now that’s been destructured, with `head` representing its first element, `2`.

`tail`: There’s only one element left, so `3`’s been packed into an array all by itself.

We know the next `reduce` call will take a function, accumulator, and array. We can evaluate the next set of parameters **using the console**.

![](https://cdn-images-1.medium.com/max/1600/1*TVD3RgN7v4FW_j8mIogckQ.png)

Expect these values on the next breakpoint.

### Round 3

![](https://cdn-images-1.medium.com/max/1600/1*YjHE_30_rjv8s4__FNdy3g.png)

Our local variables are as expected. `head`'s first and only element is `3`.

And our array only has one element left, `tail`'s empty! That means the next breakpoint will be our last.

Let’s quickly evaluate our future local variables:

![](https://cdn-images-1.medium.com/max/1600/1*agbXBbNDXSsqYRd6aYLD7w.png)

Move to the final breakpoint.

### Round 4

![](https://cdn-images-1.medium.com/max/1600/1*E0CAeH84AfH9JBdtposIBA.png)

Check it out, we paused on line 3 instead of line 6 this time! `head` is `undefined` so we’re returning the final, `6`! It’ll pop out if you move to the next breakpoint.

![](https://cdn-images-1.medium.com/max/1600/1*VBzXT1FLhUP0_iRPJ_QTFQ.png)![](https://cdn-images-1.medium.com/max/1600/1*ApR1Nzk791drSLLBzcq2Xw.png)

Looks good to me!

Consider commenting if this helped, any feedback’s positive feedback.

Until next time!

Take care,
Yazeed Bzadough