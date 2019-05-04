---
title: Redux Let’s Code a Higher-Order “Duck”
date: '2018-02-17'
subtitle: 'Spawning actions and reducers'
---

![](https://cdn-images-1.medium.com/max/1600/1*FykzGL-xJGpGG0FrS7nOtw.jpeg)A Duck that creates Ducks **O_O**

**If you enjoy this, check out how we refactor the reducer** [**here**](https://medium.com/p/e44b0110befc?source=linkShare-93124e8e38fc-1519209473)**.**

I love [Erik Rasmussen](https://medium.com/@erikras)’s [Ducks proposal](https://github.com/erikras/ducks-modular-redux) for bundling your reducers and action types/creators. Thinking of reducers/actions as a package has been valuable to me, as they’re often consumed as such. This package is called a **Duck**.

Let’s code a Duck!

We’ll be making a higher-order “list” Duck, one that allows you to perform several operations on a list of items. The items can be anything.

Our Duck must have a way to:

- Add one/many items
- Remove an item
- Update an item
- Set the list
- Empty the list (reset)

As a higher-order Duck, it’s meant to be used to create new Ducks that can maintain lists of anything. See Redux [documentation on higher-order reducers](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic) if you’re unfamiliar.

### Getting Started

You won’t need anything fancy to follow along. Action creators and reducers are **just functions**, after all. I’ll be using a general ES6 + Webpack setup, which you’ll find [everywhere](https://www.google.com/search?q=es6%20webpack%20starter). You might consider [my React/Redux starter](https://github.com/yazeedb/simple-react-webpack-starter). 😁

Pick your favorite and come back here.

#### Action Types

What’s an action without a type, huh? We’ve defined our Duck’s requirements so writing the action types are an easy first step. They’ll help us decide what to name our action creators.

<pre name="73c8" id="73c8" class="graf graf--pre graf-after--p">const actionTypes = {
    reset: 'RESET',
    addOne: 'ADD_ONE',
    addMany: 'ADD_MANY',
    removeOne: 'REMOVE_ONE',
    updateOne: 'UPDATE_ONE',
    set: 'SET'
};</pre>

This’d be fine if we weren’t writing a _higher-order_ Duck, but since it’s meant to create many list Ducks, they can’t share action types. Imagine firing a `RESET` action and resetting every list reducer in your application!

“Named types” to the rescue!

As described in the [Redux docs](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic), named types are a pattern for making truly reusable higher-order reducers. Let’s refactor our action types to get a clearer picture.

<pre name="2f86" id="2f86" class="graf graf--pre graf-after--p">const makeListDuck = (name) => {
    const actionTypes = {
        reset: `${name}RESET`,
        addOne: `${name}ADD_ONE`,
        addMany: `${name}ADD_MANY`,
        removeOne: `${name}REMOVE_ONE`,
        updateOne: `${name}UPDATE_ONE`,
        set: `${name}SET`
    };</pre>

<pre name="4fe9" id="4fe9" class="graf graf--pre graf-after--pre">    return {
        actionTypes
    };
};</pre>

Now each Duck’s guaranteed unique action types. Invoking our current higher-order Duck looks like this:

![](https://cdn-images-1.medium.com/max/1600/1*JDeHYl7PMtxZ6Qm-l4Tn1g.png)

And guess what? We’re doing the same thing for our action creators and reducer.

#### Action Creators

Let’s do the `set` and `reset` action creators first.

<pre name="4ece" id="4ece" class="graf graf--pre graf-after--p">const actionCreators = {
    reset: () => ({
        type: actionTypes.reset
    }),
    set: (items) => ({
        type: actionTypes.set,
        items
    }),
};</pre>

Easy-peasy. Our action types already have parameterized names we can use. Don’t forget to include everything in the `return` statement.

<pre name="f914" id="f914" class="graf graf--pre graf-after--p">makeListDuck = (name) => {
    // ...stuff</pre>

<pre name="45e4" id="45e4" class="graf graf--pre graf-after--pre">    return {
        actionTypes,
        actionCreators
    };
};</pre>

Invoking our Duck now looks like this

![](https://cdn-images-1.medium.com/max/1600/1*cXaTAmSUmjTy6XRrYeqIug.png)

Now we’ll write `addOne` and `addMany`.

<pre name="5039" id="5039" class="graf graf--pre graf-after--p">const actionCreators = {
    reset: () => ({
        type: actionTypes.reset
    }),
    **addOne: (item) => ({
        type: actionTypes.addOne,
        item
    }),
    addMany: (items) => ({
        type: actionTypes.addMany,
        items
    }),**
    set: (items) => ({
        type: actionTypes.set,
        items
    }),
};</pre>

![](https://cdn-images-1.medium.com/max/1600/1*0ZahmWpeIUlM3rjkifg_Jw.png)

Lastly `removeOne` and `updateOne`. We need a way to identify _what_ to update/remove. I originally wanted to put a predicate function in the action object, so our action creators _would have_ looked like this.

<pre name="2be6" id="2be6" class="graf graf--pre graf-after--p">removeOne: (predicate) => ({
   type: actionTypes.removeOne,
   predicate
}),
updateOne: (predicate, newItem) => ({
   type: actionTypes.updateOne,
   predicate,
   newItem
}),</pre>

![](https://cdn-images-1.medium.com/max/1600/1*zstpX55fM9LdhcVsmqtiHA.png)

#### But That Ain’t Serializable

Serializable means your actions are easily converted into a format (like a `string`) and stored in memory or disk for later use. You then “replay” those stored actions to rehydrate the store (after a server render for example) or use [time-travel debugging](https://www.youtube.com/watch?v=xsSnOQynTHs).

As [Luca Matteis](https://medium.com/@lmatteis) kindly commented, functions may leave your actions **unserializable**. Redux docs speaks on this issue [here](https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state).

> If you are okay with things like persistence and time-travel debugging potentially not working as intended, then you are totally welcome to put non-serializable items into your Redux store.

Using a predicate is still enticing because it helps guarantee that we’re updating the correct item. So instead of putting predicates in the actions, let’s define them as helper functions.

<pre name="ab1c" id="ab1c" class="graf graf--pre graf-after--p">findItemById = (id) => (item) => item.id === id;</pre>

`findItemById` takes an `id` and returns a new function that we’ll plug directly into array methods like `.map`, `.find`, and `.filter`. It’ll return the first matching `item.id`. This’ll be our reducer’s secret weapon.

Moving our logic into the reducer simplifies things drastically, as the actions can just broadcast what happened and trust the reducer to respond appropriately. Thanks again, [Luca Matteis](https://medium.com/@lmatteis)!

#### Back to the Action (Creators)!

<pre name="e1a4" id="e1a4" class="graf graf--pre graf-after--h4">removeOne: (oldItem) => ({
  type: actionTypes.removeOne,
  oldItem
}),
updateOne: (oldItem, newItem) => ({
  type: actionTypes.updateOne,
  oldItem,
  newItem
}),</pre>

Both action creators need the `oldItem`, and `updateOne` also needs the `newItem` as the replacement.

#### Reducer

Here’s the `set` and `reset` code

<pre name="a470" id="a470" class="graf graf--pre graf-after--p">const reducer = (state = [], action) => {
    switch (action.type) {
        case actionTypes.reset: {
            return [];
        }</pre>

<pre name="c492" id="c492" class="graf graf--pre graf-after--pre">        case actionTypes.set: {
            return action.items;
        }
    }
};</pre>

Pretty straightforward.

Next, `addOne` and `addMany` switch-cases.

<pre name="1001" id="1001" class="graf graf--pre graf-after--p">case actionTypes.addOne: {
    return [...state, action.item];
}</pre>

<pre name="31c8" id="31c8" class="graf graf--pre graf-after--pre">case actionTypes.addMany: {
    return [...state, ...action.items];
}</pre>

I’m using spread syntax to merge the existing and new item(s). Check out [my article on _spread_](https://medium.com/@yazeedb/how-do-object-assign-and-spread-actually-work-169b53275cb) if it’s new to you.

Here’s `removeOne`.

<pre name="c377" id="c377" class="graf graf--pre graf-after--p">case actionTypes.removeOne: {
  const { oldItem } = action;</pre>

<pre name="56d6" id="56d6" class="graf graf--pre graf-after--pre">  return state.filter((item) => (
      !findItemById(oldItem.id)(item)
  ));
}</pre>

`findItemById` makes its first appearance! We pass it to `state.filter` and _negate_ the result, so we keep whatever doesn’t match `oldItem`.

Now `updateOne`.

<pre name="2be7" id="2be7" class="graf graf--pre graf-after--p">case actionTypes.updateOne: {
  const { oldItem, newItem } = action;</pre>

<pre name="8be1" id="8be1" class="graf graf--pre graf-after--pre">  return state.map((item) => (
    findItemById(oldItem.id)(item) ? newItem : item
  ));
}</pre>

Similar to `removeOne`, we’re using `findItemById`. If it returns `true`, replace `oldItem` with `newItem`, otherwise return `item`.

Here’s what it looks like altogether.

![](https://cdn-images-1.medium.com/max/1600/1*cQhMcYhuXSPMXi7o2iry7A.png)

Don’t forget to return everything in your Duck!

<pre name="6840" id="6840" class="graf graf--pre graf-after--p">makeListDuck = (name) => {
    // ...stuff</pre>

<pre name="8fde" id="8fde" class="graf graf--pre graf-after--pre"> **return {
        actionTypes,
        actionCreators,
        reducer
    };**
};</pre>

### Let’s Try It Out!

![](https://cdn-images-1.medium.com/max/1600/1*rr2Ym7f9lKJ3u_xRslyP3Q.png)

**Initializing it returns an empty array.**

![](https://cdn-images-1.medium.com/max/1600/1*KEfcqcxRGWqB_r1zFuICBg.png)

**Passing state and no action type returns the state.**

![](https://cdn-images-1.medium.com/max/1600/1*Dzu2ff-jrkAGcUOtfBXkEw.png)

**We can add an item**

![](https://cdn-images-1.medium.com/max/1600/1*-0-VSZk_OINI3nbxb8qFgg.png)

**We can add many items**

![](https://cdn-images-1.medium.com/max/1600/1*S3JfSNsTpCFD_79wm1eviA.png)

**We can remove items**

![](https://cdn-images-1.medium.com/max/1600/1*sIL1JuN5xO1pr1VCsrc7Hg.png)

**We can replace mangos with kiwis.**

![](https://cdn-images-1.medium.com/max/1600/1*xN4vusP_cFD7e5aTp3w2kQ.png)

**We can set the list, regardless of the previous state.**

![](https://cdn-images-1.medium.com/max/1600/1*7KwAC8FvDxCwhqksf5T7CA.png)

**We can reset the state.**

![](https://cdn-images-1.medium.com/max/1600/1*_sVPpOkLSFrfyg7aB9nN1A.png)

And we can do it all thousands of times because it’s a _higher-order_ Duck! It’s meant to churn out list Ducks in bunches.

**If you enjoyed this, check out how we refactor the reducer** [**here**](https://medium.com/p/e44b0110befc?source=linkShare-93124e8e38fc-1519209473)**.**

Until next time!

Take care,
Yazeed Bzadough
