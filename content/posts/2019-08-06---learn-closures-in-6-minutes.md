---
title: 'Learn JavaScript Closures in 6 Minutes'
date: '2019-08-06'
description: "They're stateful functions."
draft: false
template: 'post'
slug: '/posts/learn-closures-in-6-minutes'
category: 'JavaScript In-depth'
coverImageUrl: '/media/imgs-closures-in-6-minutes/cover-card.png'
tags:
  - 'JavaScript In-depth'
---

![cover-image](/media/imgs-closures-in-6-minutes/cover-card.png)

## They're stateful functions.

Closures are notoriously difficult to grasp, yet vital to advancing as a JavaScript developer. Understanding them can lead to more elegant code and better job opportunities.

I hope this post helps the concept stick as fast as possible.

**BONUS**: Closures aren't JS specific! They're a computer science concept that you'll recognize anywhere else after learning them.

## Functions Are Values Too

First off, understand that JavaScript supports _first-class functions_.

![winnie-1](/media/imgs-closures-in-6-minutes/winnie.jpeg)

A fancy name, but it just means functions _are treated like any other value_. Values like strings, numbers, and objects.

What can you do with values?

### Values can be variables

```js
const name = 'Yazeed';
const age = 25;
const fullPerson = {
  name: name,
  age: age
};
```

### Values can be in arrays

```js
const items = ['Yazeed', 25, { name: 'Yazeed', age: 25 }];
```

### Values can be returned from functions

```js
function getPerson() {
  return ['Yazeed', 25, { name: 'Yazeed', age: 25 }];
}
```

Guess what? Functions can be all that too.

![functions-can-do-that-too](/media/imgs-closures-in-6-minutes/functions-can-do-that-too.jpeg)

### Functions can be variables

```js
const sayHi = function(name) {
  return `Hi, ${name}!`;
};
```

### Functions can be in arrays

```js
const myFunctions = [
  function sayHi(name) {
    return `Hi, ${name}!`;
  },
  function add(x, y) {
    return x + y;
  }
];
```

And here's the big one...

## Functions Can Return _Other Functions_

A function that returns another function has a special name. It's called a _higher-order_ function.

This is the foundation on which closures stand. Here's our first example of a _higher-order_ function.

```js
function getGreeter() {
  return function() {
    return 'Hi, Jerome!';
  };
}
```

`getGreeter` returns a function. To be greeted, call it twice.

```js
getGreeter(); // Returns function
getGreeter()(); // Hi, Jerome!
```

One call for the returned function, and one more for the greeting.

You can store it in a variable for easier reuse.

```js
const greetJerome = getGreeter();

greetJerome(); // Hi, Jerome!
greetJerome(); // Hi, Jerome!
greetJerome(); // Hi, Jerome!
```

## Get Some Closure

Now for the grand unveiling.

Instead of hardcoding Jerome, we'll make `getGreeter` dynamic by accepting one parameter called `name`.

```js
// We can greet anyone now!
function getGreeter(name) {
  return function() {
    return `Hi, ${name}!`;
  };
}
```

And use it like so...

```js
const greetJerome = getGreeter('Jerome');
const greetYazeed = getGreeter('Yazeed');

greetJerome(); // Hi, Jerome!
greetYazeed(); // Hi, Yazeed!
```

![fallout-hold-up](/media/imgs-closures-in-6-minutes/fallout-hold-up.jpg)

Look at this code again.

```js
function getGreeter(name) {
  return function() {
    return `Hi, ${name}!`;
  };
}
```

## We Used a Closure

The _outer_ function takes `name`, but the _inner_ function uses it later. This is the power of closures.

When a function returns, its lifecycle is complete. It can no longer perform any work, and its local variables are cleaned up.

_Unless_ it returns another function. If that happens, then the returned function still has access to those outer variables, even after the parent passes on.

## Benefits of Closures

![why-do-i-care](/media/imgs-closures-in-6-minutes/why-do-i-care.jpeg)

Like I said, closures can level up your developer game. Here's a few practical uses.

## 1. Data Privacy

Data privacy is essential for safely sharing code.

Without it, anyone using your function/library/framework can maliciously manipulate its inner variables.

### A bank with no privacy

Consider this code that manages a bank account. The `accountBalance` is exposed globally!

```js
let accountBalance = 0;
const manageBankAccount = function() {
  return {
    deposit: function(amount) {
      accountBalance += amount;
    },
    withdraw: function(amount) {
      // ... safety logic
      accountBalance -= amount;
    }
  };
};
```

What's stopping me from inflating my balance or ruining someone else's?

```js
// later in the script...

accountBalance = 'Whatever I want, muhahaha >:)';
```

![who-reset-my-balance-this-time](/media/imgs-closures-in-6-minutes/who-reset-my-balance-this-time.jpeg)

Languages like Java and C++ allow classes to have private fields. These fields cannot be accessed outside the class, enabling perfect privacy.

JavaScript doesn't support private variables ([yet](https://github.com/tc39/proposal-class-fields)), but we can use closures!

### A bank with proper privacy

This time `accountBalance` sits _inside_ our manager.

```js
const manageBankAccount = function(initialBalance) {
  let accountBalance = initialBalance;

  return {
    getBalance: function() {
      return accountBalance;
    },
    deposit: function(amount) {
      accountBalance += amount;
    },
    withdraw: function(amount) {
      if (amount > accountBalance) {
        return 'You cannot draw that much!';
      }

      accountBalance -= amount;
    }
  };
};
```

And perhaps use it like so...

```js
const accountManager = manageBankAccount(0);

accountManager.deposit(1000);
accountManager.withdraw(500);
accountManager.getBalance();
```

Notice I can't directly access `accountBalance` anymore. I can only view it through `getBalance`, and change it via `deposit` and `withdraw`.

How's this possible? Closures!

Even though `manageBankAccount` created the `accountBalance` variable, the three functions it returns all have access to `accountBalance` via closure.

![i-wish-my-bank-did-that](/media/imgs-closures-in-6-minutes/i-wish-my-bank-did-that.jpeg)

## 2. Currying

[I've written on currying before](/posts/deeply-understand-currying-in-7-minutes). It's when a function takes its arguments one at a time.

So instead of this...

```js
const add = function(x, y) {
  return x + y;
};

add(2, 4); // 6
```

You can _curry_ `add` by leveraging closures...

```js
const add = function(x) {
  return function(y) {
    return x + y;
  };
};
```

And you know that the returned function has access to `x` and `y`, so you could do something like this...

```js
const add10 = add(10);

add10(10); // 20
add10(20); // 30
add10(30); // 40
```

Currying's great if you'd like to "preload" a function's arguments for easier reuse. Again, only possible through JavaScript closures!

## 3. React Developers Use Closures

If you've kept up with React news, you heard that they released [hooks](https://reactjs.org/docs/hooks-intro.html) last year. The most confusing hook, `useEffect`, relies on closures.

This article won't have a full React tutorial, so I hope the example's simple enough for all.

<iframe src="https://codesandbox.io/embed/react-hooks-closures-example-2kixb?fontsize=14" title="react-hooks-closures-example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Here's the important part...

```js
function App() {
  const username = 'yazeedb';

  React.useEffect(function() {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((user) => console.log(user));
  });

  // blah blah blah
}
```

Change `username` in the code, notice that it will fetch that username and log the output to the console.

This is closures once again. `username` is defined inside the _outer_ function, but `useEffect`'s _inner_ function actually uses it.

## Summary

1. Functions are values too.
2. Functions can return other functions.
3. An outer function's variables are still accessible to its inner function, _even after the outer has passed on_.
4. Those variables are also known as _state_.
5. Therefore, closures can also be called _stateful_ functions.

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com</a>. And please let me know what else you'd like to see! [My DMs are open on Twitter.](https://twitter.com/yazeedBee)

Until next time!
