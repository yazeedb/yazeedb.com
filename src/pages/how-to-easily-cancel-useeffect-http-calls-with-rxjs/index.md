* * *

# How to easily ignore useEffect HTTP calls with RxJS

![](https://cdn-images-1.medium.com/max/1600/1*0P3r47A-UCKu5JgYjANzcA.png)

Now that [React Hooks](https://reactjs.org/docs/hooks-overview.html) have been officially released, even more patterns are emerging across the Internet.

### useEffect

The `useEffect` hook’s among the most popular, as it can replace `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

Most of the initialization, updates, and cleanup logic a component may need can be put inside of `useEffect`.

### An Ugly User Experience

On a recent project, I encountered a scenario where `useEffect` acted on HTTP requests I was no longer interested in.

Conceptually, the UI was like this:

![](https://cdn-images-1.medium.com/max/1600/1*0P3r47A-UCKu5JgYjANzcA.png)

*   On first load, fetch the list of fruits and render a `<button>` for each one.
*   Click a `<button>` to fetch that fruit’s details.

But watch what happens when I click multiple fruits in a row

![](https://cdn-images-1.medium.com/max/1600/1*GFxf5hJp35gNFE_D_EuRAA.gif)

Way after I stopped clicking, the fruit detail section kept changing!

### The Code

Let’s see my custom hook that leverages `useEffect`.

Here’s the [Codesandbox](https://codesandbox.io/s/l5l746yll7) and [GitHub](https://github.com/yazeedb/useEffect-rxjs-cancel-fetch/) links if you wish to follow along. The file is `useFruitDetail.js`.

<pre name="d808" id="d808" class="graf graf--pre graf-after--p">import { useEffect, useState } from 'react';
import { getFruit } from './api';</pre>

<pre name="be8b" id="be8b" class="graf graf--pre graf-after--pre">export const useFruitDetail = fruitName => {
  const [fruitDetail, setFruitDetail] = useState(null);</pre>

<pre name="6be0" id="6be0" class="graf graf--pre graf-after--pre">  useEffect(
    () => {
      if (!fruitName) {
        return;
      }</pre>

<pre name="ddd5" id="ddd5" class="graf graf--pre graf-after--pre">      getFruit(fruitName).then(setFruitDetail);
    },
    [fruitName]
  );</pre>

<pre name="0a46" id="0a46" class="graf graf--pre graf-after--pre">  return fruitDetail;
};</pre>

Whenever `fruitName` changes, we’ll request its details. And we have no way of cancelling a request! So quickly re-running this results in many state changes that we’re no longer interested in.

If you render this to the UI, you get a messy user experience where the detail section keeps flickering until the final request is resolved.

### Enter RxJS

Ignoring old requests is trivial with RxJS.

It can do so much more than what I’ll demo here, so I highly recommend you [dive into it](https://www.learnrxjs.io/)!

This portion of our code, the _effect_ code, needs to change.

<pre name="7f33" id="7f33" class="graf graf--pre graf-after--p">() => {
  if (!fruitName) {
    return;
  }</pre>

<pre name="b204" id="b204" class="graf graf--pre graf-after--pre">  getFruit(fruitName).then(setFruitDetail);
}</pre>

Instead of a Promise, let’s convert `getFruit` into an Observable using the RxJS `defer` function. And instead of `.then`, we’ll call `.subscribe`.

<pre name="e2a8" id="e2a8" class="graf graf--pre graf-after--p">import { defer } from 'rxjs';</pre>

<pre name="7075" id="7075" class="graf graf--pre graf-after--pre">...</pre>

<pre name="a6b2" id="a6b2" class="graf graf--pre graf-after--pre">() => {
  if (!fruitName) {
    return;
  }</pre>

<pre name="c59b" id="c59b" class="graf graf--pre graf-after--pre">  defer(() => getFruit(fruitName))
    .subscribe(setFruitDetail);
}</pre>

This doesn’t fix the issue yet. We still need to _unsubscribe_ if `fruitName` changes.

According to [React’s docs](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect), we can return a function that’ll be executed at the end of our effect. This acts as the cleanup logic.

So something like this:

<pre name="12e6" id="12e6" class="graf graf--pre graf-after--p">() => {
  if (!fruitName) {
    return;
  }</pre>

<pre name="c7ff" id="c7ff" class="graf graf--pre graf-after--pre">  const subscription = defer(() => getFruit(fruitName))
    .subscribe(setFruitDetail);</pre>

<pre name="a16b" id="a16b" class="graf graf--pre graf-after--pre">  return () => {
    subscription.unsubscribe();
  };
}</pre>

### It Works!

![](https://cdn-images-1.medium.com/max/1600/1*DUS5ubg4kUxCbPk5nHRxvQ.gif)

This experience is much cleaner!

By clicking another fruit, `useEffect` sees `fruitName` change and runs the previous effect’s cleanup logic. As a result, we unsubscribe from the previous fetch call and focus on the current one.

Now our UI patiently waits until the user’s done clicking and the latest fruit’s details return.

Thanks for following this tutorial to the end! [I’m on Twitter](https://twitter.com/yazeedBee) if you’d like to talk!

Take care,
[Yazeed Bzadough](http://yazeedb.com)
[http://yazeedb.com/](http://yazeedb.com/)