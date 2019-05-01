---
title: A quick intro to Higher-Order Functions in JavaScript
date: '2019-03-11'
subtitle: 'Use functions as data, and unlock some powerful patterns.'
---

* * *

# A quick intro to Higher-Order Functions in JavaScript

## Use functions as data, and unlock some powerful patterns.

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.freecodecamp.org/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.freecodecamp.org/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.freecodecamp.org/a-quick-intro-to-higher-order-functions-in-javascript-1a014f89c6b" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2019-03-11T21:44:21.807Z">Mar 11</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="4 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*JyhQls2zLuu22yrnsk6mcA.png)

### Higher-Order Functions

A function that accepts and/or returns another function is called a **higher-order function**.

It’s _higher-order_ because instead of strings, numbers, or booleans, it goes _higher_ to operate on functions. Pretty meta.

With functions in JavaScript, you can

*   Store them as variables
*   Use them in arrays
*   Assign them as object properties (methods)
*   Pass them as arguments
*   Return them from other functions

_Like any other piece of data_. That’s the key here.

### Functions Operate on Data

#### Strings Are Data

<pre name="c485" id="c485" class="graf graf--pre graf-after--h4">sayHi = (name) => `Hi, ${name}!`;
result = sayHi('User');</pre>

<pre name="1710" id="1710" class="graf graf--pre graf-after--pre">console.log(result); // 'Hi, User!'</pre>

#### Numbers Are Data

<pre name="3eef" id="3eef" class="graf graf--pre graf-after--h4">double = (x) => x * 2;
result = double(4);</pre>

<pre name="e9f8" id="e9f8" class="graf graf--pre graf-after--pre">console.log(result); // 8</pre>

#### Booleans Are Data

<pre name="2169" id="2169" class="graf graf--pre graf-after--h4">getClearance = (allowed) => allowed ?
  'Access granted' :
  'Access denied';</pre>

<pre name="3b41" id="3b41" class="graf graf--pre graf-after--pre">result1 = getClearance(true);
result2 = getClearance(false);</pre>

<pre name="b539" id="b539" class="graf graf--pre graf-after--pre">console.log(result1); // 'Access granted'
console.log(result2); // 'Access denied'</pre>

#### Objects Are Data

<pre name="03f1" id="03f1" class="graf graf--pre graf-after--h4">getFirstName = (obj) => obj.firstName;
result = getFirstName({
  firstName: 'Yazeed'
});</pre>

<pre name="fc07" id="fc07" class="graf graf--pre graf-after--pre">console.log(result); // 'Yazeed'</pre>

#### Arrays Are Data

<pre name="607d" id="607d" class="graf graf--pre graf-after--h4">len = (array) => array.length;
result = len([1, 2, 3]);</pre>

<pre name="7104" id="7104" class="graf graf--pre graf-after--pre">console.log(result); // 3</pre>

These 5 types are [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) in every mainstream language.

What makes them first-class? You can pass them around, store them in variables and arrays, use them as inputs for calculations. You can use them like _any piece of data_.

### Functions Can Be Data Too

![](https://cdn-images-1.medium.com/max/1600/0*wy_bAnMM-coF9cep.png)

#### Functions as Arguments

<pre name="6c7c" id="6c7c" class="graf graf--pre graf-after--h4">isEven = (num) => num % 2 === 0;
result = [1, 2, 3, 4]**.filter(isEven)**;</pre>

<pre name="52d3" id="52d3" class="graf graf--pre graf-after--pre">console.log(result); // [2, 4]</pre>

See how `filter` uses `isEven` to decide what numbers to keep? `isEven`, a function, was a parameter _to another function_.

It’s called by `filter` for each number, and uses the returned value `true` or `false` to determine if a number should be kept or discarded.

#### Returning Functions

<pre name="5285" id="5285" class="graf graf--pre graf-after--h4">add = (x) => (y) => x + y;</pre>

`add` requires two parameters, but not all at once. It’s a function asking for just `x`, that returns a function asking for just `y`.

Again, this is only possible because JavaScript allows functions to be a return value — just like strings, numbers, booleans, etc.

You can still supply `x` and `y` immediately, if you wish, with a double invocation

<pre name="860e" id="860e" class="graf graf--pre graf-after--p">result = add(10)(20);</pre>

<pre name="0813" id="0813" class="graf graf--pre graf-after--pre">console.log(result); // 30</pre>

Or `x` now and `y` later:

<pre name="deb5" id="deb5" class="graf graf--pre graf-after--p">add10 = add(10);</pre>

<pre name="45d9" id="45d9" class="graf graf--pre graf-after--pre">result = add10(20);</pre>

<pre name="d301" id="d301" class="graf graf--pre graf-after--pre">console.log(result); // 30</pre>

Let’s rewind that last example. `add10` is the result of calling `add` with one parameter. Try logging it in the console.

![](https://cdn-images-1.medium.com/max/1600/1*BaPwZXD00kXBtTy7QV_tzA.png)

`add10` is a function that takes a `y` and returns `x + y`. After you supply `y`, it hurries to calculate and return your end result.

![](https://cdn-images-1.medium.com/max/1600/1*kg9Sv6gQExV_llaE3GUI-g.png)

### Greater Reusability

Probably the greatest benefit of HOFs is greater reusability. Without them, JavaScript’s premiere Array methods — `map`, `filter`, and `reduce` — wouldn’t exist!

Here’s a list of users. We’re going to do some calculations with their information.

<pre name="f528" id="f528" class="graf graf--pre graf-after--p">users = [{
  name: 'Yazeed',
  age: 25
}, {
  name: 'Sam',
  age: 30
}, {
  name: 'Bill',
  age: 20
}];</pre>

#### Map

Without higher-order functions, we’d always need loops to mimic `map`'s functionality.

<pre name="6ba3" id="6ba3" class="graf graf--pre graf-after--p">getName = (user) => user.name;
usernames = [];</pre>

<pre name="2533" id="2533" class="graf graf--pre graf-after--pre">for (let i = 0; i < users.length; i++) {
  const name = getName(users[i]);</pre>

<pre name="dc22" id="dc22" class="graf graf--pre graf-after--pre">  usernames.push(name);
}</pre>

<pre name="7d9e" id="7d9e" class="graf graf--pre graf-after--pre">console.log(usernames);
// ["Yazeed", "Sam", "Bill"]</pre>

Or we could do this!

<pre name="1881" id="1881" class="graf graf--pre graf-after--p">usernames = users.map(getName);</pre>

<pre name="f373" id="f373" class="graf graf--pre graf-after--pre">console.log(usernames);
// ["Yazeed", "Sam", "Bill"]</pre>

#### Filter

In a HOF-less world, we’d still need loops to recreate `filter`'s functionality too.

<pre name="ec86" id="ec86" class="graf graf--pre graf-after--p">startsWithB = (string) => string
  .toLowerCase()
  .startsWith('b');</pre>

<pre name="19a0" id="19a0" class="graf graf--pre graf-after--pre">namesStartingWithB = [];</pre>

<pre name="9f26" id="9f26" class="graf graf--pre graf-after--pre">for (let i = 0; i < users.length; i++) {
  if (startsWithB(users[i].name)) {
    namesStartingWithB.push(users[i]);
  }
}</pre>

<pre name="0d11" id="0d11" class="graf graf--pre graf-after--pre">console.log(namesStartingWithB);
// [{ "name": "Bill", "age": 20 }]</pre>

Or we could do this!

<pre name="a631" id="a631" class="graf graf--pre graf-after--p">namesStartingWithB = users
  .filter((user) => startsWithB(user.name));</pre>

<pre name="89a9" id="89a9" class="graf graf--pre graf-after--pre">console.log(namesStartingWithB);
// [{ "name": "Bill", "age": 20 }]</pre>

#### Reduce

Yup, reduce too… Can’t do much cool stuff without higher-order functions!! 😁

<pre name="26a4" id="26a4" class="graf graf--pre graf-after--p">total = 0;</pre>

<pre name="64b1" id="64b1" class="graf graf--pre graf-after--pre">for (let i = 0; i < users.length; i++) {
  total += users[i].age;
}</pre>

<pre name="a8b3" id="a8b3" class="graf graf--pre graf-after--pre">console.log(total);
// 75</pre>

How’s this?

<pre name="a83f" id="a83f" class="graf graf--pre graf-after--p">totalAge = users
  .reduce((total, user) => user.age + total, 0);</pre>

<pre name="1094" id="1094" class="graf graf--pre graf-after--pre">console.log(totalAge);
// 75</pre>

### Summary

*   Strings, numbers, bools, arrays, and objects can be stored as variables, arrays, and properties or methods.
*   JavaScript treats functions the same way.
*   This allows for functions that operate on other functions: **higher-order functions**.
*   Map, filter, and reduce are prime examples — and make common patterns like transforming, searching, and summing lists much easier!

[I’m on Twitter](https://twitter.com/yazeedBee) if you’d like to talk. Until next time!

Take care,
Yazeed Bzadough
[yazeedb.com](http://yazeedb.com/)
  