---
title: A “Composable” React/Redux File Structure?
date: '2018-02-11'
description: 'While diving into more functional programming topics, a file structure like this seemed to make sense.'
draft: false
template: 'post'
slug: '/posts/a-composable-react-redux-file-structure'
category: 'Thoughts'
tags:
  - 'React'
  - 'Redux'
  - 'Functional Programming'
  - 'Composition'
---

Even though users don’t care about your file structure and a [correct one doesn’t exist](https://twitter.com/dan_abramov/status/701767939633057793?lang=en), I’ve a habit of experimenting with them in my React/Redux applications.

The two most popular I’ve tried are [by nature](https://github.com/erikras/react-redux-universal-hot-example) and [by domain](https://marmelab.com/blog/2015/12/17/react-directory-structure.html).

#### By nature

```
/src
  /components
  /reducers
  /actions
  /containers
```

#### By domain

```
/src
  /feature1
    component.js
    reducer.js
    actions.js
    container.js

  /feature2
    component.js
    reducer.js
    actions.js
    container.js
```

“By nature” is perfect for smaller apps and beginners learning React/Redux. Everything is self-explanatory and sits with its own kind.

“By domain” makes larger apps easier to think about as everything’s broken up by _what it does_, not _what it is_.

I love them both, but feel something’s missing. Neither lend themselves well to the mantra, “composition over inheritance”. I don’t _feel_ like my features are compositions of many components, reducers, and actions.

So what if we fused these two popular paradigms?

### A Composable, Hybrid Structure

```
/src
  /features
    /feature1
      index.js
      component.js
      duck.js

  /components
  /ducks
```

I believe this hybrid nicely supports apps that emphasize composition.

Key points:

- `/components` contains HoCs ([higher-order components](https://reactjs.org/docs/higher-order-components.html)) and other simple components. These are your building blocks.
- `/ducks` is like `/components`, except with higher-order ducks ([reducers/actions](https://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html)). Implements [Erik Rasmussen](https://medium.com/@erikras)’s [“Ducks” proposal](https://github.com/erikras/ducks-modular-redux).
- `feature/index.js` is the Redux-connected container, composed of building blocks from `/components`.
- `feature/component.js` is the stateless, presentational component also composed from `/components`.
- `feature/duck.js` is composed from `/ducks` and is used in your Redux store.

I purposely excluded the router, store, root reducer and unit tests because that’s all subjective.

The main point is to think about your features as composing a bunch of components, reducers, and actions, which **_are all just functions_**.
