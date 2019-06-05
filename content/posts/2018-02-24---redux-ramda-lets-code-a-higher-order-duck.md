---
title: Redux + Ramda Let’s Code a Higher-Order “Duck”
date: '2018-02-24'
description: 'The third and final in my higher-order duck series.'
draft: false
template: 'post'
slug: '/posts/redux-ramda-lets-code-a-higher-order-duck'
category: 'Redux'
tags:
  - 'Redux'
  - 'Ramda'
  - 'Higher-order functions'
---

![](https://cdn-images-1.medium.com/max/1600/1*AvhLF3EobvdMRIeW31_K2g.png)

My last two posts were on Higher-Order Ducks. We built one then refactored it with the `createReducer` helper.

Now it’s Ramda time. If you spot a better way to implement something please let me know! ❤️

### What Is It?

[**Official site**](http://ramdajs.com)

Ramda’s a library that makes functional programming in JavaScript easier. Many of our hand-written Redux patterns are easily expressed in one or two of Ramda’s functions.

I’m going to purposely overuse Ramda to show off its power. I wouldn’t necessarily do _everything_ in this post, but developing an eye for these patterns never hurts.

### Show Me the Code

If you read [the previous article](redux-lets-refactor-our-higher-order-duck), you remember us refactoring the reducer to this:

![](https://cdn-images-1.medium.com/max/1600/1*-abhyPqZJiP3JZW6GOU9lQ.png)

While I’m _much happier_ with the code after putting it through `createReducer`, Ramda will provide an extra kick. Let’s start from the `reset` case and work our way down.

#### actionTypes.reset

```js
() => initialState;
```

All `reset` does is return the initial state. How can Ramda help?

```js
R.always(initialState);
```

![](https://cdn-images-1.medium.com/max/1600/1*T32OLQ_g4cGoiA6Y5LTQ5A.png)

We take `initialState` and stuff it into `R.always`.

From the [Ramda docs](http://ramdajs.com/docs/#always):

> Returns a function that always returns the given value.

Instead of an arrow function, we have a nice `R.always` function. It might be overkill but I’m purposely exaggerating to demo some of Ramda’s arsenal.

#### actionTypes.addOne

```js
(state, { item }) => [...state, item];
```

Merge `state` (a list) with a given `item`.

```js
(state, { item }) => R.append(item, state)

// or

(state, { item }) => R.concat(state, [item])

```

[R.append docs:](http://ramdajs.com/docs/#append)

> Returns a new list containing the contents of the given list, followed by the given element.

[R.concat docs:](http://ramdajs.com/docs/#concat)

> Returns the result of concatenating the given lists or strings.

Use `R.append` to create a new list with `item` at the end, or turn `item` into an array and concatenate it to `state` with `R.concat`.

#### actionTypes.addMany

```js
(state, { items }) => [...state, ...items];
```

This time, `items` is already a list and we want to merge it with `state`.

We already know `R.concat` does the trick.

```js
(state, { items }) => R.concat(state, items);
```

Here’s the code so far.

![](https://cdn-images-1.medium.com/max/1600/1*mthn1Las07A2N8cGrOqJ9w.png)

#### actionTypes.removeOne

```js
(state, { oldItem }) => state.filter((item) => (
   !findItemById(oldItem.id)(item)
)),
```

Recall that we defined `findItemById` as:

```js
findItemById = (id) => (item) => item.id === id;
```

If `findItemById(id)(item)` returns `false`, keep the item, otherwise remove it. Let’s use it to recap:

![](https://cdn-images-1.medium.com/max/1600/1*NfrUhR8En3gfqvTb-hrGdA.png)

See? We passed `foods` to the reducer and `removeOne` with `id: 1`. `findItemById` returned `true` for our `mango` so it was removed.

This has many translations in Ramda.

You can replace `state.filter` with `R.filter`:

![](https://cdn-images-1.medium.com/max/1600/1*WXH4HkJqvScV-AIm7OVwgw.png)

Instead of the _logical not operator_, `!`, we can use `R.not`.

![](https://cdn-images-1.medium.com/max/1600/1*fCTvdjTV-oXMdgapftdmeA.png)

We can hide the `item` parameter with `R.complement`.

![](https://cdn-images-1.medium.com/max/1600/1*tXyIr3HWU4D257gen38ArA.png)

Now we’re getting saucy. `R.complement` will pass `item` to `findItemById(oldItem.id)` and return the opposite of whatever it returns. If `findItemById(1)(item)` returns `true`, `R.complement` will return `false`.

It’d be nice, however, to avoid negating `findItemById` altogether. Ever heard of `R.reject`?

![](https://cdn-images-1.medium.com/max/1600/1*3OuGWNVyhfB9ZV78qFGBNw.png)

Instead of `findItemById`’s complement, we can use `filter`'s complement–`R.reject`!

**Boom!**

This means when `findItemById(id)(item)` returns `true`, `R.reject` will _exclude_ `item` instead of including it like `filter` would. The hard work’s done for us, making our code much simpler.

#### actionTypes.updateOne

Ramda has `R.map`. Let’s start with that.

![](https://cdn-images-1.medium.com/max/1600/1*yKLTk8cjnLYMHRfKnrsPWw.png)

But that’s not even `updateOne`'s final form: introducing `R.when`.

![](https://cdn-images-1.medium.com/max/1600/1*8LW9Q2bvfGGodIglXw8y3Q.png)

Summarizing [the docs](http://ramdajs.com/docs/#when), `R.when` takes three parameters: `predicate`, `whenTrueFn`, and your test object, `x`.

If `predicate` returns `true`, you get back `whenTrueFn(x)`.
Else, you get back just `x`.

Simple example, let’s increment a number _only_ if it’s 1.

![](https://cdn-images-1.medium.com/max/1600/1*C8eWUtUCm-vad_Nv9OuGVw.png)![](https://cdn-images-1.medium.com/max/1600/1*eqLG9a-Uu2U9YkD9j8eIyA.png)

In `updateOne`’s case, we used `R.when` to encapsulate our previous ternary logic. If `findItemById(id)(item)` finds a match and returns `true`, then we’ll return `newItem`. Otherwise we’ll just return the `item` we’ve been given.

![](https://cdn-images-1.medium.com/max/1600/1*8LW9Q2bvfGGodIglXw8y3Q.png)

#### actionTypes.set

```js
[actionTypes.set]: (_, { items }) => items
```

This is so basic, I have no good ideas. So here’s a bad one.

```js
[actionTypes.set]: R.pipe(
   R.nthArg(1),
   R.prop('items')
)
```

As my old boss would say: **Lol**.

Through the power of `R.pipe`, we return the second argument’s `items` property. That’s all I got for ya…

If you’re interested in how pipe/compose work, see [my article on it](a-quick-intro-to-pipe-and-compose). Until next time!
