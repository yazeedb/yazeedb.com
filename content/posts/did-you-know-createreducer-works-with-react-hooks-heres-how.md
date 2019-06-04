---
title: Did you know — createReducer Works with React Hooks. Here’s how.
date: '2018-12-10'
subtitle: 'Don’t Use in Production'
---

* * *

# Did you know — createReducer Works with React Hooks. Here’s how.

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.freecodecamp.org/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.freecodecamp.org/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.freecodecamp.org/did-you-know-createreducer-works-with-react-hooks-heres-how-b324c558e12f" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-12-11T01:11:31.498Z">Dec 10, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="3 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*RNCvaJoz27hcyN3WzHFwNg.jpeg)Photo by [Efe Kurnaz](https://unsplash.com/photos/Rs5BQj5zbf8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/hooks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

#### Don’t Use in Production

At the time of this writing, **Hooks are in alpha. Their API can change at any time.**

I recommend you experiment, have fun, and use Hooks in your side projects, but not in production code until they’re stable.

### Source Code and Demo

Here are the [GitHub](https://github.com/yazeedb/react-createReducer-demo/) and [Codesandbox](https://codesandbox.io/s/github/yazeedb/react-createReducer-demo/tree/master/) links.

### useReducer

The [React docs](https://reactjs.org/docs/hooks-reference.html#usereducer) have a counter app example demonstrating the `useReducer` Hook.

For demo purposes, I styled it just a bit.

![](https://cdn-images-1.medium.com/max/1600/1*pe5b5CE-WaFteXtmzHIyHQ.gif)

#### The component code

![](https://cdn-images-1.medium.com/max/1600/1*vwqAHCV11OFG8lrjjz_05g.png)

The JSX is simple: it displays the current `count` with 3 buttons.

The `Counter` component calls `useReducer` with a reducer and initial state, which gives back an array with the current `state` and a `dispatch` function.

Clicking any of the buttons calls `dispatch` with an action object.

#### The initial state

![](https://cdn-images-1.medium.com/max/1600/1*CzA8Zc-Y2f4ATTQRV03w2w.png)

#### The reducer code

The reducer decides how state should change based on the existing state and action object it receives.

If you’ve worked with Redux, you know this setup.

![](https://cdn-images-1.medium.com/max/1600/1*WDNzQEnj2IqfDxhtmdSgpw.png)

We see it supports three actions: `reset`, `increment`, and `decrement`.

`reset`: Sets the `count` to 0.

`increment`: Increases `count` by 1.

`decrement`: Decreases `count` by 1.

Any other action results in the reducer returning its given `state`.

### createReducer

You may also know about `createReducer`.

<pre name="7377" id="7377" class="graf graf--pre graf-after--p">function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}</pre>

It’s a helper function [from the Redux docs](https://redux.js.org/recipes/reducingboilerplate) that lets you describe reducers as mappings from action types to handlers.

#### No more switch cases

Instead of `switch` cases, we can use functions for every action type.

An added bonus is that if the given action doesn’t match, `createReducer` takes care of the `default` case by returning `state`.

#### Works with useReducer

Since `useReducer`'s based on the same principles, they’re perfectly compatible!

I’ll create a new project file, `createReducer.js`.

![](https://cdn-images-1.medium.com/max/1600/1*F6Mc6LYYEioMih5krutO2g.png)

And export the helper function from it:

![](https://cdn-images-1.medium.com/max/1600/1*VQY7hwr2irQeUtC2v546-g.png)

Then use it like so:

![](https://cdn-images-1.medium.com/max/1600/1*l2XXR2nNj-RHeU5TK8GnqA.png)

#### Cleaner reducers

This, in my opinion, is much nicer.

Just give it the initial state, and an object mapping action types to their corresponding functions.

You can access `state` and `action` in each of those functions, so you have all the info you need!

![](https://cdn-images-1.medium.com/max/1600/1*pe5b5CE-WaFteXtmzHIyHQ.gif)

The functionality hasn’t changed at all.

### Still Just a Reducer

This works because `useReducer` doesn’t care _how_ you create a reducer.

Whether it’s `switch`, `if/else`, or `createReducer`, _just make sure your end result is a reducer_.

I hope you enjoyed this brief piece!

[I’m on Twitter](https://twitter.com/yazeedBee) if you’d like to talk. Until next time!

Take care,
Yazeed Bzadough
[http://yazeedb.com/](http://yazeedb.com/)
  