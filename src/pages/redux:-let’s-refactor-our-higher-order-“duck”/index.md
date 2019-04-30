* * *

# Redux: Let’s Refactor Our Higher-Order “Duck”

![](https://cdn-images-1.medium.com/max/1600/1*dejlV_1P5rnC7MWMuAMZCg.png)Let’s refactor a birdbath.

[My last article](https://medium.com/p/a045415bef0f?source=linkShare-93124e8e38fc-1519129006) described how a higher-order List “Duck” might be written. Here’s the code in 4 screenshots.

![](https://cdn-images-1.medium.com/max/1600/1*-YWuR4qMhHGdgulL44It5w.png)

Remember we prefixed our actions with the `name` parameter. This helps prevent collision among other List Ducks.

**Action Types**

![](https://cdn-images-1.medium.com/max/1600/1*rFwrpi_e7eB_-QNIRZjTrg.png)

**Action Creators**

![](https://cdn-images-1.medium.com/max/1600/1*opwz3NU8UibamwLBNyU8Ag.png)

**Reducer**

![](https://cdn-images-1.medium.com/max/1600/1*OquJ--y0sPxhi9dlyc5gtw.png)

Our higher-order Duck does its job well, but the reducer’s verbose! It could use some refactoring.

### createReducer

`createReducer` is a helper function from [the Redux Docs](https://redux.js.org/recipes/reducing-boilerplate#generating-reducers). It lets you easily spawn reducers by passing initial state and an object describing how the reducer responds to a given action.

It looks like this:

![](https://cdn-images-1.medium.com/max/1600/1*JjlD6WQ5-zrnQUneETEFzw.png)

It takes two parameters: `initialState` and `handlers`.

`initialState`’s obvious, I hope — it’s our reducer’s initial state. 😏

`handlers` is more interesting — it represents your reducer’s response to a given action.

This might look scary but let’s break it down.

Line 2 _returns a new reducer_. That’s right, it spits out a reducer, preloading its `state` with your supplied `initialState`.

![](https://cdn-images-1.medium.com/max/1600/1*_WFBi0uv8Pc9t3-YUew5vg.png)

Line 3 uses an `if/else` to replace whatever `switch` cases your reducer _would’ve_ had. It checks if your `handlers` object has the action’s type as a property.

If it does, invoke that property with `state` and `action`.
Else, just return `state`.

Imagine we needed a `counter` reducer. Most of us would write this:

![](https://cdn-images-1.medium.com/max/1600/1*MDbz0zupPArz_Wxyaf8-BQ.png)

This is perfectly fine. But what if we plug it into `createReducer`?

![](https://cdn-images-1.medium.com/max/1600/1*11DwUM-dRpY4CyZ1s9dwjA.png)

Oh that is awesome! Concise, yet expressive. And it behaves the same way.

![](https://cdn-images-1.medium.com/max/1600/1*M2ok3DLAtYnFIxu2E9z8RA.png)

Refactoring our reducer from [the last article](https://medium.com/p/a045415bef0f?source=linkShare-93124e8e38fc-1519129006) may help us appreciate this even more.

Here’s the original reducer code, to recap:

![](https://cdn-images-1.medium.com/max/1600/1*OquJ--y0sPxhi9dlyc5gtw.png)

The `actionTypes.reset` case is the easiest to refactor, so let’s begin with that.

![](https://cdn-images-1.medium.com/max/1600/1*geYXrE3Rc7AQqRDD-okIaA.png)

Recall that `createReducer` passes the `state` and `action` to each of `handlers` functions. We don’t care, though. If someone fires the reset action return an empty array. The previous state and action details don’t matter.

![](https://cdn-images-1.medium.com/max/1600/1*Gnxcyp58-1fbX3KO17AqcQ.png)

Let’s cut those out.

![](https://cdn-images-1.medium.com/max/1600/1*eXtpoOeFrikOQhaSHJnv4Q.png)

I’m using _computed property names_ to dynamically set `actionTypes.reset` as a key in our `handlers` object. I wrote a post covering them [here](https://medium.com/front-end-hacking/immutably-rename-object-keys-in-javascript-5f6353c7b6dd). Basically it evaluates `actionTypes.reset` as `‘myListRESET’` because we originally created our Duck like so: `makeListDuck('myList')`.

`‘myListRESET’` then becomes a key on our `handlers` object and we set its value to a function that returns `initialState`. In the end, it looks like this:

<pre name="5bda" id="5bda" class="graf graf--pre graf-after--p">{ myListRESET: () => initialState }</pre>

Up next, `actionTypes.addOne`.

![](https://cdn-images-1.medium.com/max/1600/1*ulsJxARQjbnwQn1dtGksjQ.png)

If someone fires the `addOne` action, we expect an `item` attached to it. We can also destructure the action to target its `item`.

![](https://cdn-images-1.medium.com/max/1600/1*C59YIU-pJikqJb6o56RgFw.png)

I personally prefer this but either syntax works.

Now we’ll write `actionTypes.addMany`–same idea as `addOne`.

![](https://cdn-images-1.medium.com/max/1600/1*_UOudkm6VU_ORIaveXo-ZA.png)

We’re on a roll, let’s do `removeOne`.

![](https://cdn-images-1.medium.com/max/1600/1*kAHo4cpfQqtMw7Hvu5fCoQ.png)

Remember from [the last article](https://medium.com/p/a045415bef0f?source=linkShare-93124e8e38fc-1519129006), `findItemById` takes an `id` and returns a predicate comparing `id` to `item.id`.

For `removeOne`, when this predicate returns `true` (there’s a match), remove that item from the list.

In a similar spirit, here’s `updateOne`.

![](https://cdn-images-1.medium.com/max/1600/1*gI5MRa5hxvkH5hPJbbT71w.png)

When the predicate returns `true`, return `newItem`. Else, return the normal `item`.

Last but not least, here’s `set`.

![](https://cdn-images-1.medium.com/max/1600/1*vzYVbbsMGxtkDCiJOPiFqw.png)

Return whatever `action.items` is. Easy-peasy!

I don’t know about you, but I think this reducer looks **_clean_**. And the functionality’s identical.

![](https://cdn-images-1.medium.com/max/1600/1*2rCEN64sVfkv-Y7nDD167w.png)

Stay tuned for the next post, we’re refactoring this Duck once again with [Ramda](http://ramdajs.com).

Until next time!

Take care,
Yazeed Bzadough