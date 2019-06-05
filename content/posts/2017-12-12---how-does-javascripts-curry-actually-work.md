---
title: How Does JavaScript’s curry() Actually Work?
date: '2017-12-12'
description: 'A deep dive into this infinitely useful functional programming concept.'
draft: false
template: 'post'
slug: '/posts/how-does-javascripts-curry-actually-work'
category: 'Functional Programming Basics'
tags:
  - 'Currying'
  - 'Functional Programming'
---

Lately I’ve been high on functional programming, courtesy of Eric Elliott’s exceptional [“Composing Software” series](https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c)–a must-read if you write JavaScript.

At one point he mentioned _currying_, a tool that allows you to “partially apply” a function, meaning you don’t have to specify its arguments all at once.

So if you have

```js
greet = (greeting, first, last) => `${greeting}, ${first} ${last}`;
greet('Hello', 'John', 'Doe'); // Hello, John Doe
```

Curry that and you get

```js
curriedGreet = curry(greet);

curriedGreet('Hello')('John')('Doe'); // Hello, John Doe
curriedGreet('Hello', 'John')('Doe'); // Hello, John Doe
```

As you fill up a curried function’s parameters, it returns functions that expect the remaining parameters.

A little more in-depth:

```js
// greet requires 3 params: **(greeting, first, last)

// these all return a function looking for (first, last)
curriedGreet('Hello');
curriedGreet('Hello')();
curriedGreet()('Hello')()();

// these all return a function looking for (last)
curriedGreet('Hello')('John');
curriedGreet('Hello', 'John');
curriedGreet('Hello')()('John')();

// these return a greeting, since all 3 params were honored
curriedGreet('Hello')('John')('Doe');
curriedGreet('Hello', 'John', 'Doe');
curriedGreet('Hello', 'John')()()('Doe');
```

As demonstrated above, you can invoke a curried function forever without parameters and it’ll always return a function that expects the remaining parameters. **#Loyalty**

But how is this possible?

Mr. Elliot shared a `curry` implementation. Here’s the code (or as he aptly called it, a magic spell):

```js
const curry = (f, arr = []) => (...args) =>
  ((a) => (a.length === f.length ? f(...a) : curry(f, a)))([...arr, ...args]);
```

### Umm… **😐**

Let’s expand that concise work of art and appreciate it together

```js
curry = (originalFunction, initialParams = []) => {
  debugger;

  return (...nextParams) => {
    debugger;

    const curriedFunction = (params) => {
      debugger;

      if (params.length === originalFunction.length) {
        return originalFunction(...params);
      }

      return curry(originalFunction, params);
    };

    return curriedFunction([...initialParams, ...nextParams]);
  };
};
```

I’ve sprinkled some `debugger` statements to pause the code at noteworthy points. I highly recommend a modern browser to debug like this because you can easily inspect the relevant parameters at different points.

**Quick and dirty steps to access DevTools (might not work in every case)**

1.  Open a tab in your browser
2.  Right-click anywhere on the page and click “Inspect Element”
3.  A DevTools console _should_ pop up. Click the “console” tab

### All right, let’s do this!

Paste `greet` and `curry` into your console. Then enter `curriedGreet = curry(greet)` and begin the madness.

![](https://cdn-images-1.medium.com/max/1600/1*8_q3YkOu6fDzIEMY65lqUg.png)

We pause on line 2\. Inspecting our two params we see `originalFunction` is `greet` and `initialParams` defaulted to an empty array because we didn’t supply it. Move to the next breakpoint and, oh wait… that’s it.

Yep! `curry(greet)` just returns a new function that expects 3 more parameters. Type `curriedGreet` in the console to see what I’m talking about.

When you’re done playing with that, let’s get a bit crazier and do
`sayHello = curriedGreet('Hello')`.

![](https://cdn-images-1.medium.com/max/1600/1*FXCJQi5Numlbis5d_bGsjw.png)

Now we’re inside of that function defined on line 4\. Before moving on, type `originalFunction` and `initialParams` in your console. Notice we can still access those 2 parameters even though we’re in a completely new function? That’s because functions returned from parent functions enjoy their parent’s scope.

#### Even if a parent function has passed on, they leave the parameters for their kids to use.

Kind of like inheritance (in the real life sense, not OOP). `curry` was initially given `originalFunction` and `initialParams` and then returned a “child” function. Those 2 variables weren’t [garbage collected](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management) yet because maybe Function Jr. wants to use them. If he doesn’t, _then_ that scope gets cleaned up because when no one references you, that’s when you truly die.

Ok, back to line 4…

![](https://cdn-images-1.medium.com/max/1600/1*_TFVnxtqgisi1i0q_K3dUQ.png)

Inspect `nextParams` and see that it’s `['Hello']`…an array? But I thought we said `curriedGreet(‘Hello’)` , not `curriedGreet(['Hello'])`!

Correct: we invoked `curriedGreet` with `'Hello'`, but thanks to the [rest syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator#Rest_syntax_%28parameters%29), we’ve _turned_ `'Hello'` into `['Hello']`.

**Y THO?!**

`curry` is a general function that can be supplied 1, 10, or 10,000,000 parameters, so it needs a way to reference all of them. Using the rest syntax like that captures every single parameter in one array, making `curry`'s job much easier.

Let’s jump to the next `debugger` statement.

Now we’re on line 6, but hold on.

You may have noticed that line 12 actually ran before the `debugger` statement on line 6\. If not, look closer. Our program defines a function called `curriedFunction` on line 5, uses it on line 12, and _then_ we hit that `debugger` statement on line 6\. And what’s `curriedFunction` invoked with?

```js
[...initialParams, ...nextParams];
```

Yuuuup. Look at `params` on line 5 and you’ll see `['Hello']`. Both `initialParams` and `nextParams` were arrays, so we flattened and combined them into a single array using the handy [_spread_ operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator#Syntax) (Same syntax as _rest_, but it “expands” instead of “condensing”).

If you like, I wrote an article covering spread and `Object.assign` in detail: [https://medium.com/@ybzadough/how-do-object-assign-and-spread-actually-work-169b53275cb](https://medium.com/@ybzadough/how-do-object-assign-and-spread-actually-work-169b53275cb)

Here’s where the good stuff happens.

![](https://cdn-images-1.medium.com/max/1600/1*pM31i2QVNxVUiqj9aZzVvg.png)

Line 7 says “If `params` and `originalFunction` are the same length, call `greet` with our params and we’re done.” Which reminds me…

### JavaScript functions have lengths too

This is how `curry` does its magic! This is how it decides whether or not to ask for more parameters. In JavaScript, a function’s `.length` property tells you [_how many arguments it expects_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length).

```js
greet
  .length(
    // 3
    (a, b) => {}
  )
  .length(
    // 2
    (a) => {}
  ).length; // 1
```

If our provided and expected parameters match, we’re good, just hand them off to the original function and finish the job!

**That’s baller** 🏀

But in our case, the parameters and function length are _not_ the same. We only provided `‘Hello’`, so `params.length` is 1, and `originalFunction.length` is 3 because `greet` expects 3 parameters: `greeting, first, last`.

### So what happens next?

Well since that `if` statement evaluates to `false`, the code will skip to line 10 and re-invoke our master `curry` function. It re-receives `greet` and this time, `'Hello'`, and begins the madness all over again.

That’s [recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion), my friends.

`curry` is essentially an infinite loop of self-calling, parameter-hungry functions that won’t rest until their guest is full. Hospitality at its finest.

![](https://cdn-images-1.medium.com/max/1600/1*AZKiupYSanV5iJSQWrtUwg.png)

Now you’re back at line 2 with the same parameters as before, except `initialParams` is `['Hello']` this time. Skip again to exit the cycle. Type our new variable into the console, `sayHello`. It’s another function, still expecting more parameters, but we’re getting warmer…

Let’s turn up the heat with `sayHelloToJohn = sayHello('John')`.

We’re inside line 4 again, and `nextParams` is `['John']`. Jump to the next debugger on line 6 and inspect `params`: it’s `['Hello', 'John']`! 🙀

![](https://cdn-images-1.medium.com/max/1600/1*pej6yZ-vGvA2T9LgIIc-vg.png)

### Why, why, why?

Because remember, line 12 says “Hey `curriedFunction`, he gave me `'Hello'` last time and `‘John’` this time. Take them both in this array `[...initialParams, ...nextParams]`.”

![](https://cdn-images-1.medium.com/max/1600/1*Ljvk2BMLxIsbJ09idgStdg.png)

Now `curriedFunction` again compares the `length` of these `params` to `originalFunction`, and since `2 < 3` we move to line 10 and call `curry` once again! And of course, we pass along `greet` and our 2 params, `['Hello', 'John']`

![](https://cdn-images-1.medium.com/max/1600/1*EYv9jdo2id8tynbTI5SXYQ.png)

We’re so close, let’s finish this and get the full greeting back!

`sayHelloToJohnDoe = sayHelloToJohn('Doe')`

I think we know what happens next.

![](https://cdn-images-1.medium.com/max/1600/1*tMJvls2j9eAjrCGykVN84g.png)![](https://cdn-images-1.medium.com/max/1600/1*NHm1TMo8Tjk7jQVlGGa9zQ.png)![](https://cdn-images-1.medium.com/max/1600/1*eTwjEYLKGCGJoqdP4Xe9hA.png)

### The deed is done.

`greet` got his parameters, `curry` stopped looping, and we’ve received our greeting: `Hello, John Doe`.

Play around with this function some more. Try supplying multiple or no parameters in one shot, get as crazy as you want. See how many times `curry` has to recurse before returning your expected output.

```js
curriedGreet('Hello', 'John', 'Doe');
curriedGreet('Hello', 'John')('Doe');
curriedGreet()()('Hello')()('John')()()()()('Doe');
```

Many thanks to [Eric Elliott](https://medium.com/@_ericelliott) for introducing this to me, and even more thanks to you for appreciating `curry` with me. Until next time!