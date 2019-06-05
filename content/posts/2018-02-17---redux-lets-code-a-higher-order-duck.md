---
title: Redux Let’s Code a Higher-Order “Duck”
date: '2018-02-17'
description: 'Code along with me as we learn about the new React Hooks API!'
draft: false
template: 'post'
slug: '/posts/redux-lets-code-a-higher-order-duck'
category: 'Redux'
tags:
  - 'Redux'
  - 'Higher-order functions'
---

![](https://cdn-images-1.medium.com/max/1600/1*FykzGL-xJGpGG0FrS7nOtw.jpeg)

> A Duck that creates Ducks **O_O**

I love Erik Rasmussen’s [Ducks proposal](https://github.com/erikras/ducks-modular-redux) for bundling your reducers and action types/creators. Thinking of reducers/actions as a package has been valuable to me, as they’re often consumed as such. This package is called a **Duck**.

## Let’s code a Duck!

We’ll be making a higher-order “list” Duck, one that allows you to perform several operations on a list of items. The items can be anything.

Our Duck must have a way to:

- Add one/many items
- Remove an item
- Update an item
- Set the list
- Empty the list (reset)

As a higher-order Duck, it’s meant to be used to create new Ducks that can maintain lists of anything. See Redux [documentation on higher-order reducers](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic) if you’re unfamiliar.

## Getting Started

You won’t need anything fancy to follow along. Action creators and reducers are **just functions**, after all. I’ll be using a general ES6 + Webpack setup, which you’ll find everywhere.

Pick your favorite and come back here.

#### Action Types

What’s an action without a type, huh? We’ve defined our Duck’s requirements so writing the action types are an easy first step. They’ll help us decide what to name our action creators.

```js
const actionTypes = {
  reset: 'RESET',
  addOne: 'ADD_ONE',
  addMany: 'ADD_MANY',
  removeOne: 'REMOVE_ONE',
  updateOne: 'UPDATE_ONE',
  set: 'SET'
};
```

This’d be fine if we weren’t writing a _higher-order_ Duck, but since it’s meant to create many list Ducks, they can’t share action types. Imagine firing a `RESET` action and resetting every list reducer in your application!

“Named types” to the rescue!

As described in the [Redux docs](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic), named types are a pattern for making truly reusable higher-order reducers. Let’s refactor our action types to get a clearer picture.

```js
const makeListDuck = (name) => {
  const actionTypes = {
    reset: `${name}RESET`,
    addOne: `${name}ADD_ONE`,
    addMany: `${name}ADD_MANY`,
    removeOne: `${name}REMOVE_ONE`,
    updateOne: `${name}UPDATE_ONE`,
    set: `${name}SET`
  };

  return {
    actionTypes
  };
};
```

Now each Duck’s guaranteed unique action types. Invoking our current higher-order Duck looks like this:

![](https://cdn-images-1.medium.com/max/1600/1*JDeHYl7PMtxZ6Qm-l4Tn1g.png)

And guess what? We’re doing the same thing for our action creators and reducer.

#### Action Creators

Let’s do the `set` and `reset` action creators first.

```js
const actionCreators = {
  reset: () => ({
    type: actionTypes.reset
  }),
  set: (items) => ({
    type: actionTypes.set,
    items
  })
};
```

Easy-peasy. Our action types already have parameterized names we can use. Don’t forget to include everything in the `return` statement.

```js
makeListDuck = (name) => {
  // ...stuff

  return {
    actionTypes,
    actionCreators
  };
};
```

Invoking our Duck now looks like this

![](https://cdn-images-1.medium.com/max/1600/1*cXaTAmSUmjTy6XRrYeqIug.png)

Now we’ll write `addOne` and `addMany`.

```js
const actionCreators = {
  reset: () => ({
    type: actionTypes.reset
  }),
  addOne: (item) => ({
    type: actionTypes.addOne,
    item
  }),
  addMany: (items) => ({
    type: actionTypes.addMany,
    items
  }),
  set: (items) => ({
    type: actionTypes.set,
    items
  })
};
```

![](https://cdn-images-1.medium.com/max/1600/1*0ZahmWpeIUlM3rjkifg_Jw.png)

Lastly `removeOne` and `updateOne`. We need a way to identify _what_ to update/remove. I originally wanted to put a predicate function in the action object, so our action creators _would have_ looked like this.

```js
removeOne: (predicate) => ({
   type: actionTypes.removeOne,
   predicate
}),
updateOne: (predicate, newItem) => ({
   type: actionTypes.updateOne,
   predicate,
   newItem
})
```

![](https://cdn-images-1.medium.com/max/1600/1*zstpX55fM9LdhcVsmqtiHA.png)

#### But That Ain’t Serializable

Serializable means your actions are easily converted into a format (like a `string`) and stored in memory or disk for later use. You then “replay” those stored actions to rehydrate the store (after a server render for example) or use [time-travel debugging](https://www.youtube.com/watch?v=xsSnOQynTHs).

As [Luca Matteis](https://medium.com/@lmatteis) kindly commented, functions may leave your actions **unserializable**. Redux docs speaks on this issue [here](https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state).

> If you are okay with things like persistence and time-travel debugging potentially not working as intended, then you are totally welcome to put non-serializable items into your Redux store.

Using a predicate is still enticing because it helps guarantee that we’re updating the correct item. So instead of putting predicates in the actions, let’s define them as helper functions.

```js
findItemById = (id) => (item) => item.id === id;
```

`findItemById` takes an `id` and returns a new function that we’ll plug directly into array methods like `.map`, `.find`, and `.filter`. It’ll return the first matching `item.id`. This’ll be our reducer’s secret weapon.

Moving our logic into the reducer simplifies things drastically, as the actions can just broadcast what happened and trust the reducer to respond appropriately.

#### Back to the Action (Creators)!

```js
removeOne: (oldItem) => ({
  type: actionTypes.removeOne,
  oldItem
}),
updateOne: (oldItem, newItem) => ({
  type: actionTypes.updateOne,
  oldItem,
  newItem
}),
```

Both action creators need the `oldItem`, and `updateOne` also needs the `newItem` as the replacement.

#### Reducer

Here’s the `set` and `reset` code

```js
const reducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.reset: {
      return [];
    }

    case actionTypes.set: {
      return action.items;
    }
  }
};
```

Pretty straightforward.

Next, `addOne` and `addMany` switch-cases.

```js
case actionTypes.addOne: {
    return [...state, action.item];
}

case actionTypes.addMany: {
    return [...state, ...action.items];
}
```

I’m using spread syntax to merge the existing and new item(s). Check out [my article on _spread_](how-do-object-assign-and-spread-actually-work) if it’s new to you.

Here’s `removeOne`.

```js
case actionTypes.removeOne: {
    const { oldItem } = action;

    return state.filter((item) => (
      !findItemById(oldItem.id)(item)
    ));
}
```

`findItemById` makes its first appearance! We pass it to `state.filter` and _negate_ the result, so we keep whatever doesn’t match `oldItem`.

Now `updateOne`.

```js
case actionTypes.updateOne: {
    const { oldItem, newItem } = action;

    return state.map((item) => (
        findItemById(oldItem.id)(item) ? newItem : item
    ));
}
```

Similar to `removeOne`, we’re using `findItemById`. If it returns `true`, replace `oldItem` with `newItem`, otherwise return `item`.

Here’s what it looks like altogether.

![](https://cdn-images-1.medium.com/max/1600/1*cQhMcYhuXSPMXi7o2iry7A.png)

Don’t forget to return everything in your Duck!

```js
makeListDuck = (name) => {
  // ...stuff

  return {
    actionTypes,
    actionCreators,
    reducer
  };
};
```

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

And we can do it all thousands of times because it’s a _higher-order_ Duck!
