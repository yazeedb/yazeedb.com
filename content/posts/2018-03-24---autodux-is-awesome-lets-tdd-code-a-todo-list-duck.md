---
title: Autodux Is Awesome Let’s TDD Code a Todo List Duck
date: '2018-03-24'
description: 'This library by Eric Elliott cuts through much of the Redux boilerplate, and encourages keeping your different pieces colocated in a single file.'
draft: false
template: 'post'
slug: '/posts/lets-tdd-code-a-todo-list-duck-with-autodux'
category: 'Redux'
tags:
  - 'Redux'
  - 'TDD'
  - 'Autodux'
  - 'Code with me'
---

![](https://cdn-images-1.medium.com/max/1600/1*7Q-RAovohomeitfI2zlzKg.jpeg)

My last couple of posts were all about reducing the Redux boilerplate needed to create List ducks.

[Eric Elliott](https://medium.com/@_ericelliott)’s [Autodux library](https://github.com/ericelliott/autodux) 10xed the idea and automated the entire process.

#### **This**

```js
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const actionTypes = {};
const actions = {};
```

#### **Is now this**

```js
const counter = autodux({
  slice: 'counter',
  initial: 0,
  actions: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1
  }
});
```

That’s it. Everything is here. `counter` is an object containing your reducer and action creators.

![](https://cdn-images-1.medium.com/max/1600/1*_zPOYkop_G1PAJulgYfcag.png)

### Let’s Build a Todo List Duck!

In case the terminology’s new, a Duck is an actions/reducer bundle. See [Erik Rasmussen](https://medium.com/@erikras)’s proposal [here](https://github.com/erikras/ducks-modular-redux).

Our Duck will **add**, **remove**, and **update** todos. We’ll do this TDD ([Test-Driven Development](https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3)) style, so the unit tests come first.

#### Setup

All you need is [autodux](https://github.com/ericelliott/autodux) and a testing library. Even though it’s overkill, I’ll use my own React/Redux starter, which uses Jest for testing. Feel free to clone it [here](https://github.com/yazeedb/simple-react-webpack-starter).

After you’ve initialized the project, do `npm install autodux` and `npm install shortid`. `shortid` will generate unique ids when creating todos.

#### Initial test

![](https://cdn-images-1.medium.com/max/1600/1*IkPAUbopMMCXUcPmpQTt2g.png)

Since I’m using Jest, `describe` will contain a particular feature, in this case todos duck. Up top, I’ve imported `todosDuck` from my duck file.

Before writing the assertion, let’s discuss how todos will be added. You should be able to provide some text as your todo, and it’ll be properly turned into an object with `id` and `completed` properties.

`todosDuck.actions.addTodo('Buy groceries')`

returns…

```js
{
    id: '123',
    text: 'Buy groceries',
    complete: false
}
```

`id` will be generated using `shortid.generate()` and `complete` will default to `false`.

So the test might look like

![](https://cdn-images-1.medium.com/max/1600/1*2nh_hO2IMxxKY5NQ2nQ8zg.png)

But the test fails

![](https://cdn-images-1.medium.com/max/1600/1*jzgl5kfXdyE22q_Z0Qlc9w.png)

The issue is `Cannot read property ‘addTodo’ of undefined`.

That’s because we imported `todosDuck` and its `.actions` property does not exist, so calling `todosDuck.actions.addTodo` results in that error.

Let’s go define it!

![](https://cdn-images-1.medium.com/max/1600/1*g74hzbWlVPlAnqTJfB_xXw.png)

We’ll import and invoke the `autodux` function. It takes an object describing your duck, including initial state, action creators, and reducer.

![](https://cdn-images-1.medium.com/max/1600/1*JRL_3H1S0aS1wwbSy5BnHw.png)

- `initial` represents the reducer’s initial state: an empty array.
- `actions` will contain functions describing how your reducer should respond to incoming actions. The syntax closely mirrors `createReducer`'s syntax. More info [here](https://redux.js.org/recipes/reducing-boilerplate#generating-reducers).
- `slice` is what `autodux` uses to generate your action types

Now let’s add our first action: `addTodo`.

![](https://cdn-images-1.medium.com/max/1600/1*XnBlPgaxUMnrUO70e2GX8w.png)

- `autodux` feeds `state` and `payload` to `addTodo`, just like a reducer.
- Using the _spread_ operator, `addTodo` merges the current `state` (list) with a new object containing properties `id`, `text`, and `complete`.
- `shortid` will provide unique `id`s using its `generate` function.
- `payload` is the todo text, which gets assigned to the `text` property.
- `complete` defaults to false, as previously mentioned.

Let’s export the entire duck.

![](https://cdn-images-1.medium.com/max/1600/1*dQHLvr5XAa7DEbMYdbyjZw.png)

We’ll `console.log` it in the test file.

![](https://cdn-images-1.medium.com/max/1600/1*sRK-UiINln7JuJ7fgZufmQ.png)

Here’s what it looks like.

![](https://cdn-images-1.medium.com/max/1600/1*Mo1Gfo8t9jwd7PKC5ItZNQ.png)

We can see the initial state, reducer, and actions all set up for us.

And guess what? Our test passes!

![](https://cdn-images-1.medium.com/max/1600/1*7eZQNzhb4CamtumfV6hoGw.png)

This process in TDD, by the way, is called [red-green-refactor](http://www.jamesshore.com/Blog/Red-Green-Refactor.html). We write the test _first_, watch it fail, fix and repeat.

#### The next test

Our duck’s next piece of functionality is removing todos. It should find and remove using a unique `id`.

`todosDuck.actions.removeTodo('123')`

should remove…

```js
{
    id: '123',
    text: 'Buy groceries',
    complete: false
}
```

Here’s the test.

![](https://cdn-images-1.medium.com/max/1600/1*nUxTIlkgdRH3tzbkTzrT1g.png)

If our array has a todo with `id: '123'`, then passing `removeTodo('123')` to our reducer should find and remove that todo.

Here’s our result.

![](https://cdn-images-1.medium.com/max/1600/1*oXe2lihCdYkoIFe8zMeuaw.png)

`todosDuck.actions.removeTodo` is `undefined`, so you can’t use it as a function. That’s our _red_, now let’s fix it and go _green_!

![](https://cdn-images-1.medium.com/max/1600/1*Fp15TKkMpVJTaS_sxJ15pg.png)

`removeTodo` takes an id (`payload`) and uses `filter` to keep whatever doesn’t match that id.

![](https://cdn-images-1.medium.com/max/1600/1*Mkb2ggymwNuQ4AY2Lfm1BA.png)

And our tests are now a beautiful shade of green.

#### The final test

Our last piece of functionality is updating a given todo. Just like `removeTodo`, we’ll use `id` to locate it, and it’ll be merged with whatever the new todo is.

So an action like this

```js
todosDuck.actions.removeTodo({
  id: '123',
  complete: true
});
```

should find and update the `.complete` of…

```js
{
  complete: false,
  id: '123',
  text: 'Buy groceries'
}
```

to

```js
{
  complete: true,
  id: '123',
  text: 'Buy groceries'
}
```

Here’s the test

![](https://cdn-images-1.medium.com/max/1600/1*hOn-EOCMxa43UEqoYCSZ_Q.png)

And the failing result

![](https://cdn-images-1.medium.com/max/1600/1*g_KDbXgRFKT2onmrcyVoyg.png)

Nothing new here, `updateTodo` hasn’t been defined yet. Fixing time!

![](https://cdn-images-1.medium.com/max/1600/1*EcLVMF-rGBlcrdW_iPeGyA.png)

We’re locating the old todo by `id`, just like `removeTodo`. This time, however, if `todo.id` matches the given `id`, we’ll merge it with `newTodo`. This lets us update and/or replace a todo. Since `newTodo` is the second one being merged, its properties will override `todo`’s.

Let’s re-check our test.

![](https://cdn-images-1.medium.com/max/1600/1*v0ouWzWruDs0XdZPqlGTmA.png)

3 out of 3 passing. We now have a fully functioning duck. Let’s look at our implementation code one more time.

![](https://cdn-images-1.medium.com/max/1600/1*thVzRhnYfFwR0sBErjJCXg.png)

Autodux has made the process so much easier. I’m excited to use it in future projects, and even current ones. It’s so easy to slip it into an existing project, because the end result is just actions/reducers. The export remains the same.
