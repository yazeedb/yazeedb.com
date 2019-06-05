---
title: How to build GitHub search functionality in React with RxJS 6 and Recompose
date: '2018-08-06'
description: 'Code along with me as we learn about RxJS and Recompose!'
draft: false
template: 'post'
slug: '/posts/build-a-github-ui-with-rxjs-and-recompose'
category: 'React'
tags:
  - 'React'
  - 'RxJS'
  - 'Recompose'
  - 'Functional Programming'
  - 'Reactive Programming'
---

![](https://cdn-images-1.medium.com/max/1600/1*ZeifRZJH1QudGiIiA6En4Q.png)

This post is intended for those with React and RxJS experience. I’m just sharing patterns I found useful while making this UI.

Here’s what we’re building:

![](https://cdn-images-1.medium.com/max/1600/1*KeoXx3EaGVrHXaZzK_QBzA.gif)

No classes, lifecycle hooks, or `setState`.

### Setup

Everything’s on [my GitHub](https://github.com/yazeedb/recompose-github-ui).

```
git clone https://github.com/yazeedb/recompose-github-ui
cd recompose-github-ui
yarn install
```

The `master` branch has the finished project, so checkout the `start` branch if you wish to follow along.

`git checkout start`

And run the project.

`npm start`

The app should be running on `localhost:3000`, and here’s our initial UI.

![](https://cdn-images-1.medium.com/max/1600/1*_XoqdpqQdmYrXs3q6_063w.png)

Open the project in your favorite text editor and view `src/index.js`.

![](https://cdn-images-1.medium.com/max/1600/1*iQy1zXOnGQIIb5noAzYvfw.png)

### Recompose

If you haven’t seen it yet, [Recompose](https://github.com/acdlite/recompose/) is a wonderful React utility belt for making components in a functional programming style. It has a ton of functions, and I’d have a hard time picking [my favorites](my-favorite-recompose-functions).

It’s Lodash/Ramda, but for React. I also love that they support observables. Quoting from [the docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities):

> It turns out that much of the React Component API can be expressed in terms of observables

We’ll be exercising that concept today! 😁

### Streaming Our Component

Right now `App` is an ordinary React component. We can return it through an observable using Recompose’s [componentFromStream](https://github.com/acdlite/recompose/blob/master/docs/API.md#componentfromstream) function.

This function initially renders [a null component](https://github.com/acdlite/recompose/blob/master/src/packages/recompose/componentFromStream.js#L8), and _re-renders_ when our observable returns a new value.

#### A Dash of Config

Recompose streams follow the [ECMAScript Observable Proposal](https://github.com/tc39/proposal-observable). It lays out how observables should work when they eventually ship to modern browsers.

Until they’re fully implemented, however, we rely on libraries like RxJS, xstream, most, Flyd, and so on.

Recompose doesn’t know which library we’re using, so it provides a `setObservableConfig` to convert ES Observables to/from whatever we need.

Create a new file in `src` called `observableConfig.js`.

And add this code to make Recompose compatible with RxJS 6:

```js
import { from } from 'rxjs';
import { setObservableConfig } from 'recompose';

setObservableConfig({
  fromESObservable: from
});
```

Import it into `index.js`:

```js
import './observableConfig';
```

And we’re ready!

#### Recompose + RxJS

Import `componentFromStream`.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { componentFromStream } from 'recompose';
import './styles.css';
import './observableConfig';
```

And begin redefining `App` with this code:

```js
const App = componentFromStream((prop$) => {
  // ...
});
```

Notice that `componentFromStream` takes a callback function expecting a `prop$` stream. The idea is that our `props` become an observable, and we map them to a React component.

And if you’ve used RxJS, you know the perfect operator to _map_ values.

#### Map

As the name implies, you’re transforming `Observable(something)` into `Observable(somethingElse)`. In our case, `Observable(props)` into `Observable(component)`.

Import the `map` operator:

```js
import { map } from 'rxjs/operators';
```

And redefine App:

```js
const App = componentFromStream((prop$) => {
  return prop$.pipe(
    map(() => (
      <div>
        <input placeholder="GitHub username" />
      </div>
    ))
  );
});
```

Ever since RxJS 5, we use `pipe` instead of chaining operators.

Save and check your UI, same result!

![](https://cdn-images-1.medium.com/max/1600/1*Edm3g3VL9121uIgwkzRiSA.png)

### Adding an Event Handler

Now we’ll make our `input` a bit more reactive.

Import the `createEventHandler` from Recompose.

```js
import { componentFromStream, createEventHandler } from 'recompose';
```

And use it like so:

```jsx
const App = componentFromStream((prop$) => {
  const { handler, stream } = createEventHandler();

  return prop$.pipe(
    map(() => (
      <div>
        <input onChange={handler} placeholder="GitHub username" />{' '}
      </div>
    ))
  );
});
```

`createEventHandler` is an object with two interesting properties: `handler` and `stream`.

[Under the hood](https://github.com/acdlite/recompose/blob/master/src/packages/recompose/createEventHandler.js), `handler` is an event emitter pushing values to `stream`, which is an observable broadcasting those values to its subscribers.

So we’ll combine the `stream` observable and the `prop$` observable to access the `input`'s current value.

`combineLatest` is a good choice here.

#### Chicken and Egg Problem

To use `combineLatest`, though, both `stream` and `prop$` must emit. `stream` won’t emit until `prop$` emits, and vice versa.

We can fix that by giving `stream` an initial value.

Import RxJS’s `startWith` operator:

```js
import { map, startWith } from 'rxjs/operators';
```

And create a new variable to capture the modified `stream`.

```js
const { handler, stream } = createEventHandler();

const value$ = stream.pipe(
  map((e) => e.target.value),
  startWith('')
);
```

We know that `stream` will emit events from `input`'s onChange, so let’s immediately map each `event` to its text value.

On top of that, we’ll initialize `value$` as an empty string — an appropriate default for an empty `input`.

#### Combining It All

We’re ready to combine these two streams and import `combineLatest` as a creation method, **not as an operator**.

```js
import { combineLatest } from 'rxjs';
```

You can also import the `tap` operator to inspect values as they come:

```js
import { map, startWith, tap } from 'rxjs/operators';
```

And use it like so:

```jsx
const App = componentFromStream((prop$) => {
  const { handler, stream } = createEventHandler();
  const value$ = stream.pipe(
    map((e) => e.target.value),
    startWith('')
  );

  return combineLatest(prop$, value$).pipe(
    tap(console.warn),
    map(() => (
      <div>
        <input onChange={handler} placeholder="GitHub username" />
      </div>
    ))
  );
});
```

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

```jsx
import React from 'react';
import { componentFromStream } from 'recompose';
import { debounceTime, filter, map, pluck } from 'rxjs/operators';
import Component from './Component';
import './User.css';

const User = componentFromStream((prop$) => {
  const getUser$ = prop$.pipe(
    debounceTime(1000),
    pluck('user'),
    filter((user) => user && user.length),
    map((user) => <h3>{user}</h3>)
  );

  return getUser$;
});

export default User;
```

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

```jsx
return combineLatest(prop$, value$).pipe(
  tap(console.warn),
  map(([props, value]) => (
    <div>
      <input onChange={handler} placeholder="GitHub username" />
      <User user={value} />{' '}
    </div>
  ))
);
```

Now your value’s rendered to the screen after 1 second.

![](https://cdn-images-1.medium.com/max/1600/1*ti-OF_cqiKmQx1iTZZJFrA.gif)

Good start, but we need to actually fetch the user.

### Fetching the User

GitHub’s User API is available [here](https://api.github.com/users). We can easily extract that into a helper function inside `User/index.js`:

```js
const formatUrl = (user) => `https://api.github.com/users/${user}`;
```

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

```js
import { ajax } from 'rxjs/ajax';
import { debounceTime, filter, map, pluck, switchMap } from 'rxjs/operators';
```

And use them like so:

```js
const User = componentFromStream((prop$) => {
  const getUser$ = prop$.pipe(
    debounceTime(1000),
    pluck('user'),
    filter((user) => user && user.length),
    map(formatUrl),
    switchMap((url) =>
      ajax(url).pipe(
        pluck('response'),
        map(Component)
      )
    )
  );

  return getUser$;
});
```

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

```js
import {
  catchError,
  debounceTime,
  filter,
  map,
  pluck,
  switchMap
} from 'rxjs/operators';
```

And stick it to the end of your `ajax` chain.

```jsx
switchMap((url) =>
  ajax(url).pipe(
    pluck('response'),
    map(Component),
    catchError(({ response }) => alert(response.message))
  )
);
```

![](https://cdn-images-1.medium.com/max/1600/1*krBPGwW4tSv7FOxGaleZxQ.png)

At least we get some feedback, but we can do better.

#### An Error Component

Create a new component, `src/Error/index.js`.

```jsx
import React from 'react';

const Error = ({ response, status }) => (
  <div className="error">
    <h2>Oops!</h2>
    <b>
      {status}: {response.message}
    </b>
    <p>Please try searching again.</p>
  </div>
);

export default Error;
```

This will nicely display `response` and `status` from our AJAX call.

Let’s import it in `User/index.js`:

```jsx
import Error from '../Error';
```

And `of` from RxJS:

```jsx
import { of } from 'rxjs';
```

Remember, our `componentFromStream` callback must return an observable. We can achieve that with `of`.

Here’s the new code:

```jsx
ajax(url).pipe(
  pluck('response'),
  map(Component),
  catchError((error) => of(<Error {...error} />))
);
```

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

```jsx
import { merge, of } from 'rxjs';
```

When the request is made, we’ll merge our `ajax` with a Loading Component stream.

Inside `componentFromStream`:

```jsx
const User = componentFromStream((prop$) => {
  const loading$ = of(<h3>Loading...</h3>);
  // ...
});
```

A simple `h3` loading indicator turned into an observable! And use it like so:

```jsx
const loading$ = of(<h3>Loading...</h3>);

const getUser$ = prop$.pipe(
  debounceTime(1000),
  pluck('user'),
  filter((user) => user && user.length),
  map(formatUrl),
  switchMap((url) =>
    merge(
      loading$,
      ajax(url).pipe(
        pluck('response'),
        map(Component),
        catchError((error) => of(<Error {...error} />))
      )
    )
  )
);
```

I love how concise this is. Upon entering `switchMap`, merge the `loading$` and `ajax` observables.

Since `loading$` is a static value, it’ll emit first. Once the asynchronous `ajax` finishes, however, _it’ll_ emit and be displayed on the screen.

Before testing it out, we can import the `delay` operator so the transition doesn’t happen too fast.

```js
import {
  catchError,
  debounceTime,
  delay,
  filter,
  map,
  pluck,
  switchMap,
  tap
} from 'rxjs/operators';
```

And use it just before `map(Component)`:

```jsx
ajax(url).pipe(
  pluck('response'),
  delay(1500),
  map(Component),
  catchError((error) => of(<Error {...error} />))
);
```

Our result?

![](https://cdn-images-1.medium.com/max/1600/1*9ZPxZaVZt5d5TVKbPKGT9w.gif)

I’m wondering how far to take this pattern and in what direction. Please share your thoughts!
