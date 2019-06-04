---
title: How to build GitHub search functionality in React with RxJS 6 and Recompose
date: '2018-08-06'
subtitle: 'Setup'
---

* * *

# How to build GitHub search functionality in React with RxJS 6 and Recompose

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.freecodecamp.org/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.freecodecamp.org/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.freecodecamp.org/how-to-build-a-github-search-in-react-with-rxjs-6-and-recompose-e9c6cc727e7f" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-08-06T19:08:03.271Z">Aug 6, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="9 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*ZeifRZJH1QudGiIiA6En4Q.png)

This post is intended for those with React and RxJS experience. I’m just sharing patterns I found useful while making this UI.

Here’s what we’re building:

![](https://cdn-images-1.medium.com/max/1600/1*KeoXx3EaGVrHXaZzK_QBzA.gif)

No classes, lifecycle hooks, or `setState`.

### Setup

Everything’s on [my GitHub](https://github.com/yazeedb/recompose-github-ui).

<pre name="e203" id="e203" class="graf graf--pre graf-after--p">git clone [https://github.com/yazeedb/recompose-github-ui](https://github.com/yazeedb/recompose-github-ui)
cd recompose-github-ui
yarn install</pre>

The `master` branch has the finished project, so checkout the `start` branch if you wish to follow along.

<pre name="c222" id="c222" class="graf graf--pre graf-after--p">git checkout start</pre>

And run the project.

<pre name="310d" id="310d" class="graf graf--pre graf-after--p">npm start</pre>

The app should be running on `localhost:3000`, and here’s our initial UI.

![](https://cdn-images-1.medium.com/max/1600/1*_XoqdpqQdmYrXs3q6_063w.png)

Open the project in your favorite text editor and view `src/index.js`.

![](https://cdn-images-1.medium.com/max/1600/1*iQy1zXOnGQIIb5noAzYvfw.png)

### Recompose

If you haven’t seen it yet, [Recompose](https://github.com/acdlite/recompose/) is a wonderful React utility belt for making components in a functional programming style. It has a ton of functions, and I’d have a hard time picking [my favorites](https://medium.com/@yazeedb/my-favorite-recompose-functions-c8ff98ea308f#9da6-2f8c5cce0b28).

It’s Lodash/Ramda, but for React.

I also love that they support observables. Quoting from [the docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities):

> It turns out that much of the React Component API can be expressed in terms of observables

We’ll be exercising that concept today! 😁

### Streaming Our Component

Right now `App` is an ordinary React component. We can return it through an observable using Recompose’s `[componentFromStream](https://github.com/acdlite/recompose/blob/master/docs/API.md#componentfromstream)` function.

This function initially renders [a](https://github.com/acdlite/recompose/blob/master/src/packages/recompose/componentFromStream.js#L8) `[null](https://github.com/acdlite/recompose/blob/master/src/packages/recompose/componentFromStream.js#L8)` [component](https://github.com/acdlite/recompose/blob/master/src/packages/recompose/componentFromStream.js#L8), and _re-renders_ when our observable returns a new value.

#### A Dash of Config

Recompose streams follow the [ECMAScript Observable Proposal](https://github.com/tc39/proposal-observable). It lays out how observables should work when they eventually ship to modern browsers.

Until they’re fully implemented, however, we rely on libraries like RxJS, xstream, most, Flyd, and so on.

Recompose doesn’t know which library we’re using, so it provides a `setObservableConfig` to convert ES Observables to/from whatever we need.

Create a new file in `src` called `observableConfig.js`.

And add this code to make Recompose compatible with RxJS 6:

<pre name="7240" id="7240" class="graf graf--pre graf-after--p">import { from } from 'rxjs';
import { setObservableConfig } from 'recompose';</pre>

<pre name="3bb0" id="3bb0" class="graf graf--pre graf-after--pre">setObservableConfig({
  fromESObservable: from
});</pre>

Import it into `index.js`:

<pre name="9656" id="9656" class="graf graf--pre graf-after--p">import './observableConfig';</pre>

And we’re ready!

#### Recompose + RxJS

Import `componentFromStream`.

<pre name="9f57" id="9f57" class="graf graf--pre graf-after--p">import React from 'react';
import ReactDOM from 'react-dom';
**import { componentFromStream } from 'recompose';** import './styles.css';
import './observableConfig';</pre>

And begin redefining `App` with this code:

<pre name="3a7a" id="3a7a" class="graf graf--pre graf-after--p">const App = componentFromStream(prop$ => {
  ...
});</pre>

Notice that `componentFromStream` takes a callback function expecting a `prop$` stream. The idea is that our `props` become an observable, and we map them to a React component.

And if you’ve used RxJS, you know the perfect operator to _map_ values.

#### Map

As the name implies, you’re transforming `Observable(something)` into `Observable(somethingElse)`. In our case, `Observable(props)` into `Observable(component)`.

Import the `map` operator:

<pre name="63d2" id="63d2" class="graf graf--pre graf-after--p">import { map } from 'rxjs/operators';</pre>

And redefine App:

<pre name="2ef7" id="2ef7" class="graf graf--pre graf-after--p">const App = componentFromStream(prop$ => {
  return **prop$.pipe(
    map(() => (
      <div>
        <input placeholder="GitHub username" />
      </div>
    ))
  )**
});</pre>

Ever since RxJS 5, we use `pipe` instead of chaining operators.

Save and check your UI, same result!

![](https://cdn-images-1.medium.com/max/1600/1*Edm3g3VL9121uIgwkzRiSA.png)

### Adding an Event Handler

Now we’ll make our `input` a bit more reactive.

Import the `createEventHandler` from Recompose.

<pre name="ced6" id="ced6" class="graf graf--pre graf-after--p">import { componentFromStream, **createEventHandler** } from 'recompose';</pre>

And use it like so:

<pre name="0470" id="0470" class="graf graf--pre graf-after--p">const App = componentFromStream(prop$ => {
  **const { handler, stream } = createEventHandler();**</pre>

<pre name="0885" id="0885" class="graf graf--pre graf-after--pre">  return prop$.pipe(
    map(() => (
      <div>
 **<input**
 **onChange={handler}**
 **placeholder="GitHub username"
        />**      </div>
    ))
  )
});</pre>

`createEventHandler` is an object with two interesting properties: `handler` and `stream`.

[Under the hood](https://github.com/acdlite/recompose/blob/master/src/packages/recompose/createEventHandler.js), `handler` is an event emitter pushing values to `stream`, which is an observable broadcasting those values to its subscribers.

So we’ll combine the `stream` observable and the `prop$` observable to access the `input`'s current value.

`combineLatest` is a good choice here.

#### Chicken and Egg Problem

To use `combineLatest`, though, both `stream` and `prop$` must emit. `stream` won’t emit until `prop$` emits, and vice versa.

We can fix that by giving `stream` an initial value.

Import RxJS’s `startWith` operator:

<pre name="13e9" id="13e9" class="graf graf--pre graf-after--p">import { map, **startWith** } from 'rxjs/operators';</pre>

And create a new variable to capture the modified `stream`.

<pre name="9735" id="9735" class="graf graf--pre graf-after--p">const { handler, stream } = createEventHandler();</pre>

<pre name="b385" id="b385" class="graf graf--pre graf-after--pre">**const value$ = stream.pipe(
  map(e => e.target.value),
  startWith('')
);**</pre>

We know that `stream` will emit events from `input`'s onChange, so let’s immediately map each `event` to its text value.

On top of that, we’ll initialize `value$` as an empty string — an appropriate default for an empty `input`.

#### Combining It All

We’re ready to combine these two streams and import `combineLatest` as a creation method, **not as an operator**.

<pre name="4a6a" id="4a6a" class="graf graf--pre graf-after--p">import { combineLatest } from 'rxjs';</pre>

You can also import the `tap` operator to inspect values as they come:

<pre name="bc69" id="bc69" class="graf graf--pre graf-after--p">import { map, startWith, **tap** } from 'rxjs/operators';</pre>

And use it like so:

<pre name="a027" id="a027" class="graf graf--pre graf-after--p">const App = componentFromStream(prop$ => {
  const { handler, stream } = createEventHandler();
  const value$ = stream.pipe(
    map(e => e.target.value),
    startWith('')
  );</pre>

<pre name="84ff" id="84ff" class="graf graf--pre graf-after--pre">  return **combineLatest(prop$, value$)**.pipe(
 **tap(console.warn),**
    map(() => (
      <div>
        <input
          onChange={handler}
          placeholder="GitHub username"
        />
      </div>
    ))
  )
});</pre>

Now as you type, `[props, value]` is logged.

![](https://cdn-images-1.medium.com/max/1600/1*E1jAWy0UTDbWFfEh___Psg.png)

### User Component

This component will be responsible for fetching/displaying the username we give it. It’ll receive the `value` from `App` and map it to an AJAX call.

#### JSX/CSS

It’s all based off this awesome [GitHub Cards](https://lab.lepture.com/github-cards/) project. Most of the stuff, especially the styles, is copy/pasted or reworked to fit with React and props.

Create a folder `src/User`, and put [this code](https://raw.githubusercontent.com/yazeedb/recompose-github-ui/master/src/User/User.css) into `User.css`:

And [this code](https://raw.githubusercontent.com/yazeedb/recompose-github-ui/master/src/User/Component.js) into `src/User/Component.js`:

The component just fills out a template with GitHub API’s standard JSON response.

#### The Container

Now that the “dumb” component’s out of the way, let’s do the “smart” component:

Here’s `src/User/index.js`:

<pre name="5dac" id="5dac" class="graf graf--pre graf-after--p">import React from 'react';
import { componentFromStream } from 'recompose';
import {
  debounceTime,
  filter,
  map,
  pluck
} from 'rxjs/operators';
import Component from './Component';
import './User.css';</pre>

<pre name="9814" id="9814" class="graf graf--pre graf-after--pre">const User = componentFromStream(prop$ => {
  const getUser$ = prop$.pipe(
    debounceTime(1000),
    pluck('user'),
    filter(user => user && user.length),
    map(user => (
      <h3>{user}</h3>
    ))
  );</pre>

<pre name="bbb8" id="bbb8" class="graf graf--pre graf-after--pre">  return getUser$;
});</pre>

<pre name="3ac6" id="3ac6" class="graf graf--pre graf-after--pre">export default User;</pre>

We define `User` as a `componentFromStream`, which returns a `prop$` stream that maps to an `<h3>`.

#### debounceTime

Since `User` will receive its props through the keyboard, we don’t want to listen to every single emission.

When the user begins typing, `debounceTime(1000)` skips all emissions for 1 second. This pattern’s commonly employed in [type-aheads](https://www.learnrxjs.io/operators/filtering/debouncetime.html).

#### pluck

This component expects `prop.user` at some point. `pluck` grabs `user`, so we don’t need to destructure our `props` every time.

#### filter

Ensures that `user` exists and isn’t an empty string.

#### map

For now, just put `user` inside an `<h3>` tag.

#### Hooking It Up

Back in `src/index.js`, import the `User` component:

<pre name="aa45" id="aa45" class="graf graf--pre graf-after--p">import User from './User';</pre>

And provide `value` as the `user` prop:

<pre name="61a3" id="61a3" class="graf graf--pre graf-after--p">  return combineLatest(prop$, value$).pipe(
    tap(console.warn),
 **map(([props, value]) => (**      <div>
        <input
          onChange={handler}
          placeholder="GitHub username"
        /></pre>

<pre name="53cd" id="53cd" class="graf graf--pre graf-after--pre"> **<User user={value} />**      </div>
    ))
  );</pre>

Now your value’s rendered to the screen after 1 second.

![](https://cdn-images-1.medium.com/max/1600/1*ti-OF_cqiKmQx1iTZZJFrA.gif)

Good start, but we need to actually fetch the user.

### Fetching the User

GitHub’s User API is available at `[https://api.github.com/users/${user}](https://api.github.com/users/$%7Buser%7D.)`[.](https://api.github.com/users/$%7Buser%7D.) We can easily extract that into a helper function inside `User/index.js`:

<pre name="1155" id="1155" class="graf graf--pre graf-after--p">const formatUrl = user => `https://api.github.com/users/${user}`;</pre>

Now we can add `map(formatUrl)` after `filter`:

![](https://cdn-images-1.medium.com/max/1600/1*bdCfDgYzFP9laQAg9Y1AKw.png)

You’ll notice the API endpoint is rendered to the screen after 1 second now:

![](https://cdn-images-1.medium.com/max/1600/1*5ZTeqmDCGjnwe-MIP0H83g.png)

But we need to make an API request! Here comes `switchMap` and `ajax`.

#### switchMap

Also used in type-aheads, `switchMap`’s great for literally **switching** from one observable to another.

Let’s say the user enters a username, and we fetch it inside `switchMap`.

What happens if the user enters something new before the result comes back? Do we care about the previous API response?

Nope.

`switchMap` will cancel that previous fetch and focus on the current one.

#### ajax

RxJS provides its own implementation of `ajax` that works great with `switchMap`!

#### Using Them

Let’s import both. My code is looking like this:

<pre name="86a2" id="86a2" class="graf graf--pre graf-after--p">**import { ajax } from 'rxjs/ajax';** import {
  debounceTime,
  filter,
  map,
  pluck,
  **switchMap**
} from 'rxjs/operators';</pre>

And use them like so:

<pre name="6a8d" id="6a8d" class="graf graf--pre graf-after--p">const User = componentFromStream(prop$ => {
  const getUser$ = prop$.pipe(
    debounceTime(1000),
    pluck('user'),
    filter(user => user && user.length),
    map(formatUrl),
    **switchMap(url =>
      ajax(url).pipe(
        pluck('response'),
        map(Component)
      )
    )**
  );</pre>

<pre name="bc0a" id="bc0a" class="graf graf--pre graf-after--pre">  return getUser$;
});</pre>

**Switch** from our `input` stream to an `ajax` request stream. Once the request completes, grab its `response` and `map` to our `User` component.

We’ve got a result!

![](https://cdn-images-1.medium.com/max/1600/1*NIVF7Iq9bjqremAKS2VOYQ.gif)

### Error handling

Try entering a username that doesn’t exist.

![](https://cdn-images-1.medium.com/max/1600/1*cvF0zqPlndM4VAjyGHgxsQ.png)

Even if you change it, our app’s broken. You must refresh to fetch more users.

That’s a bad user experience, right?

#### catchError

With the `catchError` operator, we can render a reasonable response to the screen instead of silently breaking.

Import it:

<pre name="1e9c" id="1e9c" class="graf graf--pre graf-after--p">import {
 **catchError,**
  debounceTime,
  filter,
  map,
  pluck,
  switchMap
} from 'rxjs/operators';</pre>

And stick it to the end of your `ajax` chain.

<pre name="5329" id="5329" class="graf graf--pre graf-after--p">switchMap(url =>
  ajax(url).pipe(
    pluck('response'),
    map(Component),
 **catchError(({ response }) => alert(response.message))**
  )
)</pre>

![](https://cdn-images-1.medium.com/max/1600/1*krBPGwW4tSv7FOxGaleZxQ.png)

At least we get some feedback, but we can do better.

#### An Error Component

Create a new component, `src/Error/index.js`.

<pre name="e9a6" id="e9a6" class="graf graf--pre graf-after--p">import React from 'react';

const Error = ({ response, status }) => (
  <div className="error">
    <h2>Oops!</h2>
    <b>
      {status}: {response.message}
    </b>
    <p>Please try searching again.</p>
  </div>
);

export default Error;</pre>

This will nicely display `response` and `status` from our AJAX call.

Let’s import it in `User/index.js`:

<pre name="7147" id="7147" class="graf graf--pre graf-after--p">import Error from '../Error';</pre>

And `of` from RxJS:

<pre name="770a" id="770a" class="graf graf--pre graf-after--p">import { of } from 'rxjs';</pre>

Remember, our `componentFromStream` callback must return an observable. We can achieve that with `of`.

Here’s the new code:

<pre name="02e7" id="02e7" class="graf graf--pre graf-after--p">ajax(url).pipe(
  pluck('response'),
  map(Component),
  **catchError(error => of(<Error {...error} />))**
)</pre>

Simply spread the `error` object as props on our component.

Now if we check our UI:

![](https://cdn-images-1.medium.com/max/1600/1*OA8An4fuwA5CK4-ogDRwYw.gif)

Much better!

### A Loading Indicator

Normally, we’d now require some form of state management. How else does one build a loading indicator?

But before reaching for `setState`, let’s see if RxJS can help us out.

The [Recompose docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities) got me thinking in this direction:

> Instead of `setState()`, combine multiple streams together.

**Edit**: I initially used `BehaviorSubject`s, but [Matti Lankinen](https://medium.com/@milankinen) responded with a brilliant way to simplify this code. Thank you Matti!

Import the `merge` operator.

<pre name="5a05" id="5a05" class="graf graf--pre graf-after--p">import { **merge**, of } from 'rxjs';</pre>

When the request is made, we’ll merge our `ajax` with a Loading Component stream.

Inside `componentFromStream`:

<pre name="e47f" id="e47f" class="graf graf--pre graf-after--p">const User = componentFromStream(prop$ => {
 **const loading$ = of(<h3>Loading...</h3>);**  const getUser$ = ...</pre>

A simple `h3` loading indicator turned into an observable! And use it like so:

<pre name="a4a4" id="a4a4" class="graf graf--pre graf-after--p">const loading$ = of(<h3>Loading...</h3>);</pre>

<pre name="8fac" id="8fac" class="graf graf--pre graf-after--pre">const getUser$ = prop$.pipe(
  debounceTime(1000),
  pluck('user'),
  filter(user => user && user.length),
  map(formatUrl),
  switchMap(url =>
    **merge(
      loading$,
      ajax(url).pipe(
        pluck('response'),
        map(Component),
        catchError(error => of(<Error {...error} />))
      )
    )**
  )
);</pre>

I love how concise this is. Upon entering `switchMap`, merge the `loading$` and `ajax` observables.

Since `loading$` is a static value, it’ll emit first. Once the asynchronous `ajax` finishes, however, _it’ll_ emit and be displayed on the screen.

Before testing it out, we can import the `delay` operator so the transition doesn’t happen too fast.

<pre name="c700" id="c700" class="graf graf--pre graf-after--p">import {
  catchError,
  debounceTime,
 **delay,**
  filter,
  map,
  pluck,
  switchMap,
  tap
} from 'rxjs/operators';</pre>

And use it just before `map(Component)`:

<pre name="0baa" id="0baa" class="graf graf--pre graf-after--p">ajax(url).pipe(
  pluck('response'),
 **delay(1500),**  map(Component),
  catchError(error => of(<Error {...error} />))
)</pre>

Our result?

![](https://cdn-images-1.medium.com/max/1600/1*9ZPxZaVZt5d5TVKbPKGT9w.gif)

I’m wondering how far to take this pattern and in what direction. Please leave a comment and share your thoughts!

And remember to hold that clap button. (You can go up to 50!)

Until next time.

Take care,
Yazeed Bzadough
[http://yazeedb.com/](http://yazeedb.com/)
  