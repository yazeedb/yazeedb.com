---
title: My Favorite Recompose Functions
date: '2018-03-25'
subtitle: 'Ramda, but for React!'
---

![](https://cdn-images-1.medium.com/max/1600/1*GqfBOm-WZKNslxosoZaB0g.png)

[Recompose](https://github.com/acdlite/recompose) is great. Ever used libraries like Lodash or Ramda? Recompose is that, but for React.

This

![](https://cdn-images-1.medium.com/max/1600/1*gipsb3nHwe8n7dkYy71E-Q.png)

Becomes this

![](https://cdn-images-1.medium.com/max/1600/1*MtQrh_MPgTVSkk_A6jNQTQ.png)

This style’s really grown on me, and I’d like to share a few of my favorite functions from this awesome utility belt.

### withHandlers() and withState()

Let’s say we want to display a user’s name as they type. I’m basing this off the example in the [official docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#withhandlers).

Traditionally, our JSX might look like

![](https://cdn-images-1.medium.com/max/1600/1*B9KydRuH6yRGUR8oPrix9Q.png)

We need state management to handle the user’s name, so we use `this.state.value`. Let’s define that state in the constructor and add a handler to update it.

![](https://cdn-images-1.medium.com/max/1600/1*H-MXigdQSRhsiFYB5Y_48A.png)

Our state’s initialized to `{ value: '' }` and we’ve added an `updateValue` method. We’ve already hooked it up in our JSX. Let’s try it out.

![](https://cdn-images-1.medium.com/max/1600/1*HGShevlvL4xEpXu4qQUnQA.png)

Cool, it works. As you type, the username’s updated in real-time.

Here’s a possible Recompose version. Our component will now accept a prop called `onChange`.

![](https://cdn-images-1.medium.com/max/1600/1*P8BgC9HknovNaQi9sj83Mw.png)

We’ll add state and a handler to update it using `withState`.

![](https://cdn-images-1.medium.com/max/1600/1*iKSoW9OtqAGkL-sqrJ4xMA.png)

`withState` accepts three parameters, `stateName`, `stateUpdaterName`, and `initialState`.

In this case we created a piece of state called `value`, initialized it as an empty string, and made a function to update it called `updateValue`.

Now for `withHandlers`.

![](https://cdn-images-1.medium.com/max/1600/1*eW3uxQdUILoXLtoEwFZi0A.png)

`withHandlers` accepts as an object of handlers: higher-order functions that accept `props` and return a handler. Even after the handler’s returned, it can access its parent function’s `props` via closure.

`updateValue` is the updater function provided by `withState`, and we’re using it inside of `withHandlers` to set `event.target.value` as the new state value. All of this happens inside the handler `onChange`, which will be passed to our component as a prop!

Remember `MyForm` now calls its `onChange` prop whenever the user updates the input box.

![](https://cdn-images-1.medium.com/max/1600/1*tVuSzf72tuLFV0prRTbKdQ.png)

Our default export now looks like this

![](https://cdn-images-1.medium.com/max/1600/1*S0x-Z6WQgXD-6eN15X0WJw.png)

After invoking `withState` and `withHandlers`, you get back higher-order components. A higher-order component must be invoked with another component.

That’s why we’re passing `MyForm` to `addHandlers`, then passing `addHandlers(MyForm)` to `addState`. One decorates the next, uniting to form a greater entity.

And our functionality remains unchanged.

![](https://cdn-images-1.medium.com/max/1600/1*oY0Ekj1emZvzmNzjSPPK9w.png)

### compose()

If you’re familiar with functional programming, you likely recognize `compose()`. If not, I’ve written [a post explaining it and](https://medium.com/@yazeedb/pipe-and-compose-in-javascript-5b04004ac937) `[pipe()](https://medium.com/@yazeedb/pipe-and-compose-in-javascript-5b04004ac937)` [here.](https://medium.com/@yazeedb/pipe-and-compose-in-javascript-5b04004ac937)

`compose` combines `n` functions, allowing you to more elegantly nest functions. Let’s refactor our enhanced `MyForm` with it.

We previously had this

![](https://cdn-images-1.medium.com/max/1600/1*S0x-Z6WQgXD-6eN15X0WJw.png)

We’ll import `compose`

![](https://cdn-images-1.medium.com/max/1600/1*oGm4dmu7jNECKPMQ8hcr5g.png)

And use it like so

![](https://cdn-images-1.medium.com/max/1600/1*f55mNUFAXOGtJPXCCzi0jA.png)

One pattern I’ve seen in the [Recompose docs](http://import%20%7B%20compose,%20withHandlers,%20withState%20%7D%20from%20%27recompose%27;) is storing your “enhancements” in a variable, then exporting that variable + your component. Here’s an example.

![](https://cdn-images-1.medium.com/max/1600/1*7y6j9z_iMN6qlXF3iJmtsg.png)

I’ve adopted this pattern as it makes a lot of sense to me.

Your component is a pure function that takes `props` and returns JSX.

Your “enhancements” are higher-order components meant to add or improve upon your component’s functionality.

Defining and combining them in this fashion seems to complement that idea.

I’ll share one more of my favorite higher-order components: `lifecycle`.

### lifecycle

You might guess by the name, `lifecycle` gives your pure, functional component access to React’s lifecycle hooks, meant strictly for classes.

`lifecycle` actually uses a class under the hood, but you only deal with functions. And that’s the whole point. Since everything is exposed to you as a function, that’s all you have to think about.

Let’s add it to our `enhanceComponent` higher-order component. We’ll import it first.

![](https://cdn-images-1.medium.com/max/1600/1*NMtS3z07K6FyN5NMyi0LLw.png)

Then put it down below

![](https://cdn-images-1.medium.com/max/1600/1*vjtjDY27j18U00_Mkd-_Zg.png)

As you can see, `lifecycle` takes an object of functions, like `withHandlers`, but these functions must be named after a valid React lifecycle hook.

We get the following alert on the screen

![](https://cdn-images-1.medium.com/max/1600/1*Ul_VxynI0ryiPOCGF0KyLw.png)

It’s also preferable to use [ES6 method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) to allow access to `this.props`. If you want to call a handler from `props`, you’d need `this` pointing at the right context.

Let’s say in `componentDidMount()` we want to set the username to “Lifecycle hook!”

![](https://cdn-images-1.medium.com/max/1600/1*7Z_TFQXUaXxf6OYb8Q2SBg.png)

Resulting in this

![](https://cdn-images-1.medium.com/max/1600/1*Q1notpQX1rAJPwKzlwXBxA.png)

That won’t work if we use an arrow function

![](https://cdn-images-1.medium.com/max/1600/1*Ml-1md4__Bt_gcA47juhpA.png)![](https://cdn-images-1.medium.com/max/1600/1*gSbMmkyaPOkAdy-eVUtZyA.png)

If we `console.log(this)` we get the following

![](https://cdn-images-1.medium.com/max/1600/1*JRGNfGHpSXI7yRsqDooQHA.png)![](https://cdn-images-1.medium.com/max/1600/1*Fq7f_mpzc4uLX20XM5Nnsg.png)

It works if you use an ES5-style function, though.

![](https://cdn-images-1.medium.com/max/1600/1*psFc3--98dgEhMCDaxhLFg.png)![](https://cdn-images-1.medium.com/max/1600/1*S4PGAIFeYYno-FWl1EYXOg.png)

Nowadays I shy away from ES5 functions, so method definitions will do just fine.

### Other utility functions

These are my go-to Recompose functions.

As I’ve begun using [RxJS Observables](http://reactivex.io/rxjs/) again, some other Recompose functions have caught my interest.

They might be the subject of a future post, here’s [a link to the Recompose observable utils docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities) if you’re interested.

Until next time!

Take care,
Yazeed Bzadough
