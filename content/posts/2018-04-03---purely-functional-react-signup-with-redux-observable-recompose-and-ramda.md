---
title: Purely Functional React Signup with Redux-Observable, Recompose, and Ramda
date: '2018-04-03'
description: 'A full tutorial using a bunch of the latest React ecosystem tools.'
draft: false
template: 'post'
slug: '/posts/purely-functional-react-signup-app'
category: 'React'
tags:
  - 'React'
  - 'Recompose'
  - 'Ramda'
  - 'RxJS'
  - 'Redux-Observable'
---

![](https://cdn-images-1.medium.com/max/1600/1*PukMaZu65fHngoD-2AF0Hw.png)

In this tutorial, we’ll build a signup UI using React/Redux and three of my favorite libraries: Ramda, Recompose, and Redux-Observable. Going in that order:

#### Ramda

A JavaScript functional programming utility belt. Its > 200 functions help enforce a purely FP style. I’ve truly grasped concepts like [higher-order functions](https://medium.com/javascript-scene/higher-order-functions-composing-software-5365cf2cbe99), [currying](https://medium.com/javascript-scene/curry-or-partial-application-8150044c78b8), and [point-free programming](https://en.wikipedia.org/wiki/Tacit_programming) through this library.

We’ll sparingly use it, so I have multiple articles on it if you’re further interested. [Official docs here](http://ramdajs.com/docs/).

#### Recompose

Ramda–but for React components. If you want React, using _only_ functions + several useful helpers, this library’s for you. Our container (Redux-connected) component will just be pure functions, with the help of Recompose. [Official API docs here](https://github.com/acdlite/recompose/blob/master/docs/API.md).

#### Redux-Observable

If your app’s entirely pure functions, how do you perform useful side effects like HTTP calls and UI changes? You need some “process manager” **listening to your actions**, waiting to perform a side effect and fire **another action** in response. These are called [Epics](https://redux-observable.js.org/docs/basics/Epics.html). We’ll use Redux-Observable and cover the details later. [Official docs here](https://redux-observable.js.org/).

This requires some RxJS knowledge, but fear not if you’re unfamiliar with it–we’ll go step by step. [Official RxJS docs here](http://reactivex.io/rxjs/).

#### Bonus: Autodux

I don’t mean to complicate this tutorial, but I’m using [Eric Elliott](https://medium.com/@_ericelliott)’s Autodux library to create our actions/reducer. It’s completely optional, but I love it for reducing so much Redux boilerplate. [Official docs here](https://github.com/ericelliott/autodux).

### Setup

[Find and clone](https://www.google.com/search?q=react%20redux%20webpack%20starter) a React/Redux starter kit. I’ll be using [my React/Redux starter](https://github.com/yazeedb/simple-react-webpack-starter) with its peculiar file structure.

You may also clone [this tutorial’s GitHub repo](https://github.com/yazeedb/Redux-Observable-Signup) and code on the `master` branch. If you’d like to reference the final code, do `git checkout done` and see the `done` branch.

Either way, make sure you have the aforementioned libraries

`npm i redux-observable rxjs recompose ramda -S`

Optionally install autodux

`npm i autodux -S`

### Signup/index.js

Once your React/Redux setup’s complete, create a `Signup` folder and add an `index.js` file in it. I’m putting in `src/features`, but it doesn’t matter in the end.

![](https://cdn-images-1.medium.com/max/1600/1*NKoyAu8fL4yAbYhgc1p0yQ.png)

We’ll add and export our initial JSX.

We need a `form`, two `input`s, and a `button`.

![](https://cdn-images-1.medium.com/max/1600/1*cMpiTA4kXZbGB09nvzbMQw.png)

Our resulting UI’s pretty gruesome.

![](https://cdn-images-1.medium.com/max/1600/1*PNHOK7lCi8DRpPA2S4ug7g.png)

I normally wouldn’t care for a proof-of-concept app such as this, but I can’t be unprofessional here. 😏

If you like, include [Bootstrap’s CSS via CDN](https://getbootstrap.com/docs/3.3/getting-started/#download-cdn) in your `index.html`. If not, feel free to skip the styling part.

![](https://cdn-images-1.medium.com/max/1600/1*cCew4TkXY2WpqbX9EhKHcQ.png)

And add the `.form-control` class to your `input`s, and `btn btn-primary` to your `button`.

![](https://cdn-images-1.medium.com/max/1600/1*WyqTN13k3ddWhLiLevBv3w.png)

Our UI’s cleaner, but…large.

![](https://cdn-images-1.medium.com/max/1600/1*d5Cr_rm0YUP9_cDwgzik6A.png)

Again, if you like, add/import the following styles

![](https://cdn-images-1.medium.com/max/1600/1*DcIPNx5b-NjkTxcPRJppog.png)

I’m putting these in `Signup.scss` and importing it.

![](https://cdn-images-1.medium.com/max/1600/1*OQxZ_QcxYVgMq3k-LRIjFA.png)

Much better!

![](https://cdn-images-1.medium.com/max/1600/1*DKO-3QzT2NwLeqxT6vMkcg.png)

### Signup/Signup.duck.js

Let’s think about our state next. We wish to manage:

- Username
- Password
- Loading indicator
- Success indicator
- Signup response body (new user’s `id`)

Our initial state might look like this

```js
initial: {
    username: '',
    password: '',
    loading: false,
    success: false,
    id: null
}
```

And we’d want the following actions to update that state

- `setUsername`
- `setPassword`
- `sendSignupInfo`
- `signupSuccess`

I’ll use autodux because it makes the setup trivial. First the file:

![](https://cdn-images-1.medium.com/max/1600/1*awNpAGsOOHra0qE6h6kylg.png)

Now import autodux and give it our `slice` and `initial` state.

![](https://cdn-images-1.medium.com/max/1600/1*GzlHi76th-CtBvVnPUsA8Q.png)

`slice` prepends your auto-generated action types, helping guarantee their uniqueness. It’s not that different from the [createReducer](https://redux.js.org/recipes/reducing-boilerplate#generating-reducers) I’ve previously mentioned.

`initial` is our initial state. Now let’s add the `actions`.

![](https://cdn-images-1.medium.com/max/1600/1*ImCzNRvAJIJGLUeuZkEKJQ.png)

I’m only defining these two actions. Autodux automatically creates common getters/setters for your state pieces.

Just by providing a `username` and `password` in the initial state, I got `setUsername` and `setPassword` actions for free!

Export `signupDuck`, then import and `console.log` it in your root reducer.

![](https://cdn-images-1.medium.com/max/1600/1*_Kav6NXUAqOzjFgyqsaYtA.png)![](https://cdn-images-1.medium.com/max/1600/1*6H8Xuxjsf2OXN3nK619MYA.png)

Here’s our result

![](https://cdn-images-1.medium.com/max/1600/1*t9Vuu1SAjJ3Uz4ld78fl5g.png)

Pretty cool stuff. Moving on.

Add our new reducer to the root.

![](https://cdn-images-1.medium.com/max/1600/1*uSIb17TWiHmdMCv4oW5vRg.png)

#### connect() time

Now that we have some state, let’s connect to it! Grab the `connect` higher-order component from `react-redux` and decorate `Signup` with it.

![](https://cdn-images-1.medium.com/max/1600/1*BdGM9gyOMv6m33-mdDIe5Q.png)

As promised, we’re using Ramda. So we can grab `signupReducer` using Ramda’s `prop` function.

Import it

![](https://cdn-images-1.medium.com/max/1600/1*YaTbCKcaLFAW5hmpUwmRkQ.png)

And use it

![](https://cdn-images-1.medium.com/max/1600/1*Raf_M_cH1HgqjSZzAC5nqQ.png)

As you see, `prop`'s first argument is the property name to grab, `signupReducer`, but shouldn’t the second argument be the actual object?

It _is_, `prop`'s just curried.

Currying a function means you don’t need to provide all the parameters at once. You can supply some params, and a new function expecting the others is returned. I wrote an [in-depth article on currying](https://medium.com/@yazeedb/how-does-javascripts-curry-actually-work-8d5a6f891499) if you’re interested.

This technique allows [point-free programming](https://en.wikipedia.org/wiki/Tacit_programming), or calling functions without mentioning the data they’re operating on. We just call `prop(‘signupReducer’)` and a new function expecting the object gets fed to `connect`.

For fun, you can `console.log(props)` and see what `connect()` gave us.

![](https://cdn-images-1.medium.com/max/1600/1*ZG2MZkchcY70unO_Op2RuQ.png)

Looks like our reducer’s state made it!

![](https://cdn-images-1.medium.com/max/1600/1*otxs_CK1OO7VSsc9tXFW4Q.png)

A natural next step would be creating _handlers_. I believe we’ll need three:

1.  An update username handler
2.  An update password handler
3.  A form submit handler

Here comes our first Recompose helper function: `withHandlers`.

It’s aptly named too! `withHandlers` is a higher-order component that takes an object of _handler creators_, passing them to a “Base component” as props.

Import it

![](https://cdn-images-1.medium.com/max/1600/1*4wd7iss2a8I6-N3bBXEJIQ.png)

And use it downstairs. We’ll write a test function to demo `withHandlers`.

![](https://cdn-images-1.medium.com/max/1600/1*ubd6BQJdFqzuTHV6nxW3_Q.png)

As previously mentioned, you give `withHandlers` an object of _handler creators_, which are higher-order functions that receive the component’s `props` and return a new function. In `handleSubmit`'s example, the function is an event handler.

I love it because normally, you’d need to extend `React.Component` to create handlers, but Recompose abstracts that away, letting you write plain ol’ functions.

It’s actually on my list of [favorite Recompose functions](my-favorite-recompose-functions).

#### Before you add this to your JSX!

Remember `withHandlers` returns a higher-order component, meaning it’s a function expecting a base component, _only then_ will you get back JSX.

So we must feed `Signup` to `addHandlers`.

![](https://cdn-images-1.medium.com/max/1600/1*vUPdIhFU0MWYStSHScDqfA.png)

But wait, wait, wait… I’m personally not a fan of nesting functions like this. There must be a better way to _compose_ them. 😏

Luckily Recompose also carries that little helper.

![](https://cdn-images-1.medium.com/max/1600/1*EopTn5vMfV1JBF-AJnOZOw.png)

`compose` is just like `compose` in any other functional programming library–it lets you combine `n` functions, each passing its output to the next.

Let’s refactor our `enhanceComponent` variable. It only connects you to Redux right now.

![](https://cdn-images-1.medium.com/max/1600/1*L41jXF_rK0Iz-PY2tDJEvQ.png)

We can fuse `connect` and `withHandlers` using `compose`!

![](https://cdn-images-1.medium.com/max/1600/1*ZXQ2bKOYLfubppiPO3PEfg.png)

This is possible because both `connect` and `withHandlers` return higher-order components when you invoke them! Composing these two returns you a function that expects a base component.

Which means we can return our export to its original form.

![](https://cdn-images-1.medium.com/max/1600/1*m0lP2KHYB8gOiRsSTUbFVw.png)

See? `enhanceComponent` needs to be invoked with `Signup` to do its magic.

Refresh the page and see your `console.log(props)`. `handleSubmit` is now a prop!

![](https://cdn-images-1.medium.com/max/1600/1*aF3-xCGxN_bGaePVUeyGsg.png)

Let’s wire it up in the JSX.

![](https://cdn-images-1.medium.com/max/1600/1*pE1UxwW-tiP-cAgPtsyJGA.png)

Refresh and click your button.

![](https://cdn-images-1.medium.com/max/1600/1*UxcCRhzrqY59bQU2rmlHSA.png)

Now that we’ve demoed `withHandlers`, we can write the actual `handleSubmit` functionality.

![](https://cdn-images-1.medium.com/max/1600/1*zgtLKOFBUO-eBeBmLCuNlw.png)

Since `withHandlers` provides `handleSubmit` our `props`, we’ll grab `username`, `password`, and `sendSignupInfo` from them.

Our handler calls `event.preventDefault()` to prevent page reload, and the `sendSignupInfo` action gets fired with our form data.

If you have something like [redux-logger](https://github.com/evgenyrodionov/redux-logger), your browser console will be notified.

![](https://cdn-images-1.medium.com/max/1600/1*78vOTjlZOHBQjgvDudcJrQ.png)

Because remember we defined this action in `Signup.duck.js`.

![](https://cdn-images-1.medium.com/max/1600/1*fbd5MPnqKTQxcXhBJR3iiQ.png)

But we have no username or password! Let’s add their _handler creators_.

![](https://cdn-images-1.medium.com/max/1600/1*IUnzDJxHajWMdlwrJHwl0g.png)

For both username and password, we’ll take their relevant `set` action, and pass `event.target.value` to them.

If you’re feeling adventurous, we could inject some Ramda into this. The `path` function lets you extract nested object properties.

So instead of `event.target.value`

We could do `path([‘target’, ‘value’])(event)`

Import `path` (if you want).

![](https://cdn-images-1.medium.com/max/1600/1*GC6kwYbA3e2M7ofeKdZIXA.png)

Define `getTargetValue`.

![](https://cdn-images-1.medium.com/max/1600/1*EzT6GxXgfLUvb_a5o2fOpw.png)

Again, this is a curried function expecting the `event` object. We can use it like so.

![](https://cdn-images-1.medium.com/max/1600/1*rdih5Lu_v_QKdu9wwTw0GQ.png)

Bleh, nested functions! `compose` to the rescue!

![](https://cdn-images-1.medium.com/max/1600/1*iMk_S3dlOE_u-LTKnqKgWQ.png)

Much better. Let’s wire up our JSX again.

![](https://cdn-images-1.medium.com/max/1600/1*Jlcoc9GLzlf1Bqb-vOINKA.png)

Refresh and see the magic.

![](https://cdn-images-1.medium.com/max/1600/1*a65eonq3oADR64Tu5GVcgg.png)

And you’ll see it within `handleSubmit`.

![](https://cdn-images-1.medium.com/max/1600/1*BgGIOnhGmh5oo3AboLkrmQ.png)

I almost forgot, `handleSubmit` fires our `sendSignupInfo` action, so our state’s `loading` property becomes `true`.

![](https://cdn-images-1.medium.com/max/1600/1*zpvkzNdwvypUWezVvk5o6Q.png)

We can conditionally change our button’s text with a ternary.

![](https://cdn-images-1.medium.com/max/1600/1*NeDKlX8EybQFtta9z80bpw.png)![](https://cdn-images-1.medium.com/max/1600/1*QkH31jxNJAuwj8ElFDghAQ.png)

### Side effects

Our app, thus far, is 100% pure functions (except for `console.log(props)` 😆). They’re just inputs/outputs, and harbor _no side effects_.

But one small problem: **How do you show the user anything?**

We change the button’s text if `loading: true`, but how do we make API calls or further update the UI? You need side effects somewhere!

#### Enter Redux-Observable

Using the Epic pattern, Redux-Observable will be our side effect machine.

An _epic_ is a function that receives/returns action streams.

Once we configure Redux-Observable, it’ll listen to incoming actions and respond if we tell it to.

Like I mentioned this uses RxJS, which’d be good to know from here on out. If you’re not familiar with it, maybe [do some research](http://reactivex.io/rxjs/). If not, just keep reading 😁.

#### Epic setup

We’ll add a folder: `/src/epics`.

![](https://cdn-images-1.medium.com/max/1600/1*hG9tmAFZ_gcatZMa1VL1VA.png)

And create a `root.js` file. This is our _root epic_. It’s like a root reducer, housing the app’s epics in a single location. Our app only has one epic, but it’s good practice.

First we’ll import `createEpicMiddleware` and `combineEpics`.

![](https://cdn-images-1.medium.com/max/1600/1*SieAGIJbcjZOv6OeLcWi1A.png)

`combineEpics` is like Redux’s `combineReducers` function, and it’s similarly used.

![](https://cdn-images-1.medium.com/max/1600/1*LMqQfS0Xc5POq3JZtbZPQg.png)

Once you’ve included your epics in `rootEpic`, export it in `createEpicMiddleware`.

![](https://cdn-images-1.medium.com/max/1600/1*xUBswBj_TfE7a3xNDbpEGw.png)

Then use it like any other middleware in your Redux store.

![](https://cdn-images-1.medium.com/max/1600/1*K6jDiXHy-9vEkeTVTAa_0g.png)

Now we write our epic. Create a new file: `/Signup/Signup.epics.js`.

![](https://cdn-images-1.medium.com/max/1600/1*M86le-dL-C3TMBci3hmsNg.png)

#### Epic code

An _epic_ _receives and returns_ a stream of actions–**actions in**, **actions out**. A stream is a continuous flow, meaning actions can arrive at any time. Our epics are listening, waiting to act.

Here’s our epic’s initial code: `sendSignupInfoEpic`.

![](https://cdn-images-1.medium.com/max/1600/1*N0tqb6sSbu7LwheIMSn2ww.png)

It’s just a function expecting an action stream: `action$`. Appending `$` is common practice, as it lets other developers know that this variable’s a stream (Observable).

It returns `action$.pipe()`. Now we’re getting into RxJS territory.

RxJS version 5.5 shipped [pipeable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md). You pipe your operators instead of dot-chaining them.

**This**

![](https://cdn-images-1.medium.com/max/1600/1*NarC_UeP1yuaw3j0YBiVQg.png)

**Is now this**

![](https://cdn-images-1.medium.com/max/1600/1*3NuKmzT6H6Ov6z954_tWMw.png)

#### Listen to an action type

Much like a reducer’s `switch` cases, an epic usually listens for one action. `sendSignupInfoEpic`, for example, only cares about the `sendSignupInfo` action, which is fired during form submission.

Let’s import `signupDuck` and extract its `sendSignupInfo` action.

![](https://cdn-images-1.medium.com/max/1600/1*Svi0_6f50XHPqD2d5D7oRA.png)

Since I’m using autodux, `sendSignupInfo.type` tells me the action type. Now we must tell `sendSignupInfoEpic` to look for it.

But how?

A classic RxJS solution would be the `filter` operator.

![](https://cdn-images-1.medium.com/max/1600/1*7M75FIB6Ox8sa_OJ-fCgcQ.png)

Just to test if this works, we’ll import the `mapTo` operator to directly map `sendSignupInfo.type` to another action.

![](https://cdn-images-1.medium.com/max/1600/1*R_Kx0YAO6fxoHDn6CSgNRA.png)

Include `sendSignupInfoEpic` in your root epic.

![](https://cdn-images-1.medium.com/max/1600/1*ymEE0sfLC_xyT-dsg7ANMg.png)

And submit the form to see our epic chase `sendSignupInfo`.

![](https://cdn-images-1.medium.com/max/1600/1*0ZDjQdzJFT-ISaulj1RVFA.png)

Our epic immediately fires `TEST_SUCCESS` after seeing the `signup/sendSignupInfo` action type.

I’d say it’s good, but remember how we used `filter` to determine the proper action type?

![](https://cdn-images-1.medium.com/max/1600/1*7M75FIB6Ox8sa_OJ-fCgcQ.png)

The creators of Redux-Observable recognized that `filter`ing for a given action type’s such a common use case, that they created an operator called `ofType`.

Replace your `filter` import with `ofType` from redux-observable.

![](https://cdn-images-1.medium.com/max/1600/1*KIY3q6YxdjIcRe-8x5uEBg.png)

And use it like so

![](https://cdn-images-1.medium.com/max/1600/1*zCVLPinKnlpd9mYN_o1C_A.png)

The resulting code’s a bit cleaner! 😃

Moving on, we want our epic to grab the `username` and `password` from the action’s payload and send them to an API for signup.

With a quick Google search, I found [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/), a REST API to easily test your HTTP calls. We’ll send our `username`/`password` there.

Use the url [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users).

![](https://cdn-images-1.medium.com/max/1600/1*gGrZSXahdR_u2OepOElb0Q.png)

To make the API call, we can use RxJS’s `ajax` function. This wraps an AJAX call in an Observable, allowing easy integration with our epic.

![](https://cdn-images-1.medium.com/max/1600/1*4yQMe0zdtXWybLariXnjGQ.png)

Now for the epic’s real functionality. We’re already filtering for the correct action type, now we need to make the API call.

The [Redux-Observable docs](https://redux-observable.js.org/docs/basics/Epics.html) use the `mergeMap` operator to make an API call in an epic. Here’s the code.

Replace `mapTo` with the `mergeMap` operator.

![](https://cdn-images-1.medium.com/max/1600/1*c3TgvbH_SWK49yYuPSb23Q.png)

And use it in the `pipe`. Its first parameter is our targeted `action`.

![](https://cdn-images-1.medium.com/max/1600/1*-bJXpDYoeF9-3IcfXZJEsA.png)

We’ll put the AJAX call inside `mergeMap`.

![](https://cdn-images-1.medium.com/max/1600/1*5-mIwPjrkJhzCRUJRgjg9g.png)

`mergeMap` allows us to nest Observables and switch from one to the other. In this case, we’re done listening to the `action$` Observable and wish to create a new Observable: `ajax()`.

This new Observable will emit a value upon receiving an HTTP response. Let’s `console.warn` it using the `tap` operator.

Import `tap`.

![](https://cdn-images-1.medium.com/max/1600/1*jss2hR9l9MFBrxo7KtVHyQ.png)

And use it within `ajax.pipe()`.

![](https://cdn-images-1.medium.com/max/1600/1*qmtUNlLCSNMpHaiIKR6XIg.png)

Refresh, submit your form, and find the warning.

![](https://cdn-images-1.medium.com/max/1600/1*NfhzsjE98MDZ4aS5xj4sCw.png)

Looks like our epic’s sending the HTTP request and receiving a good response! We’re only interested in the `response: { id: 11 }`, piece, though.

Luckily, RxJS provides the `pluck` operator, which lets you extract an object’s properties.

Replace `tap` with `pluck` in your import statement.

![](https://cdn-images-1.medium.com/max/1600/1*i6BV_E6AzpWbsf_KSaDWdw.png)

And use it downstairs.

![](https://cdn-images-1.medium.com/max/1600/1*LrPeVcN81ype_h0R5kf6gw.png)

This will grab `responseObject.response.id` for us. If you supply multiple property names, `pluck` acts like Ramda’s `path` function that we used to grab `event.target.value`.

Remember `path([‘target’, ‘value’])`?
We can do `pluck('response', 'id')`.

Now we must complete the _epic_ contract–**actions in, actions out**. We had an action come in, but we’ve yet to return one.

Here’s our last operator: `map`.

Probably self-explanatory–`map` lets you somehow change emitted values. We’ll use it to create our output action.

Grab `signupSuccess` from `signupDuck.actions`.

![](https://cdn-images-1.medium.com/max/1600/1*L63JkbCqc_O1vMq5485_qw.png)

Import `map`.

![](https://cdn-images-1.medium.com/max/1600/1*7Zdi9CFeKIfMeFp0o3CR1A.png)

And use it after `mergeMap` to fire `signupSuccess`.

![](https://cdn-images-1.medium.com/max/1600/1*xmcWchI36p7-hZBRxWhkBQ.png)

Refresh and watch.

![](https://cdn-images-1.medium.com/max/1600/1*XekctgHy6lILGsuGZkBCug.png)

If you’ve been paying attention, you know that `signupSuccess` sets `loading` back to `false`. That means our UI’s button should go from “Sign up” to “Loading…” and back to “Sign up”.

If you like, import the `delay` operator and let it go for 3 seconds.

![](https://cdn-images-1.medium.com/max/1600/1*G_f11d4QFaYp1wVd5lOTUw.png)

Now you can easily see the button changing text in response to the fired actions.

#### A little success message

Is it really success if no one tells you about it?

Let’s add a little message in our component’s JSX.

![](https://cdn-images-1.medium.com/max/1600/1*jdvYNbbDO5y6z1463Y044Q.png)

And on success, our result is

![](https://cdn-images-1.medium.com/max/1600/1*2DgbHGZm6sO8JeGLw7aRWg.png)

### Now what?

I’d say this app’s built to scale.

The UI and state logic are made of pure, easily tested functions.

Our side effect’s contained within Redux-Observable, and future side effects will follow suit.

We can take this app anywhere we want, but we’ve reached the end of this blog post. Haven’t checked, but this might’ve been my longest post to date.

It was fun, hope to share more. Until next time!
