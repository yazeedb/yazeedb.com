---
title: JavaScript TDD Automate your Inputs
date: '2018-01-13'
subtitle: 'Let’s do it together!'
---

* * *

# JavaScript TDD: Automate your Inputs

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/@yazeedb/javascript-tdd-automating-your-inputs-18d46374bdef" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-01-14T05:52:43.372Z">Jan 13, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="4 min read"></span>

Recently embracing Test-Driven-Development (TDD) has crushed some of my bad coding habits and forged better ones. Jump on the TDD bandwagon if you haven’t already–I’ll let [Eric Elliott](https://medium.com/@_ericelliott) [explain why it’s amazing](https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3).

Among those better habits is the concept of automating inputs in my unit tests.

### Let’s do it together!

Grab your favorite editor/terminal combo. I’m using [Atom](https://atom.io/) and [PlatformIO IDE Terminal](https://atom.io/packages/platformio-ide-terminal).

#### Setup

Use `npm init -y` and install [Jest](https://facebook.github.io/jest/) as a devDependency.

![](https://cdn-images-1.medium.com/max/1600/1*vixhtd2IsqQ4RB7atepG-A.png)

In your `package.json`, fill out the `test` NPM script with `jest --watchAll`. This tells Jest to rerun our unit tests on every change.

![](https://cdn-images-1.medium.com/max/1600/1*e62AMrNmI8AU2iieEtDhLw.png)

#### The functionality

We’re going to write a function called `randomBetween`; it generates a random number between two numbers.

And since we’re preaching TDD, we’ll write the test first! Add a file called `randomBetween.spec.js`. Here’s the spec code.

![](https://cdn-images-1.medium.com/max/1600/1*OpagbBZA8vM-65K47ZT5og.png)

The test is pretty simple: make sure `randomBetween(1, 10)` returns a number between 1–10\. Let’s run Jest in terminal with `npm test`.

![](https://cdn-images-1.medium.com/max/1600/1*YT6rMwiTzTFaIa7Wjzhk2Q.png)

Oh yeah, we didn’t define `randomBetween`…let’s do that! Create a new file called `randomBetween.js`. Here’s the code.

![](https://cdn-images-1.medium.com/max/1600/1*OTyk29AX2mHesGXXu5TYKw.png)

Now import it and watch your test pass with flying colors.

![](https://cdn-images-1.medium.com/max/1600/1*85IqqAaDhABeJPgwpjIqNw.png)![](https://cdn-images-1.medium.com/max/1600/1*QEygLq2z3v5nQoT4bVx86g.png)

#### That’s great, but…

…I’m not a fan of testing this way. The whole point of a unit test is to avoid _manual_ work, but we’re _manually_ giving `randomBetween` its input.

Our test only passes in _that exact scenario_. What if we call `randomBetween` more than once or provide a different range? Are we also writing those scenarios by hand? **No thanks**.

#### Loops for days

We can automate our inputs with loops! All we need is the ability to run a function `n` times and see the results as an array.

I personally use the `times` function from [Ramda](http://ramdajs.com/docs/#times), but we can write a simple `times` for our purposes. Create a new file called `times.js`. Here’s the code.

![](https://cdn-images-1.medium.com/max/1600/1*YEGpooKvs_6jcyfBhfMfHw.png)

It calls `fn(n)` `n` times and returns an array of the results. Try it in your browser console.

![](https://cdn-images-1.medium.com/max/1600/1*10xBbqhuMXbpXB_duQjzVA.png)

#### Back to the tests!

![](https://cdn-images-1.medium.com/max/1600/1*2fdcfv_ih3DtzGPTIHRfZQ.png)

Just like that, we have 1000 numbers between 1–10\. And since it’s an array, we can use the `every` method!

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every):

> The `**every()**` method tests whether all elements in the array pass the test implemented by the provided function.

Tests every element, huh? **Perfect**.

![](https://cdn-images-1.medium.com/max/1600/1*EAYpp-KmHr6mubK63niqMg.png)![](https://cdn-images-1.medium.com/max/1600/1*X96a4OwC2iThR4rtkCijZQ.png)

#### All done

Another benefit is your test inputs will always be unique, because you’re generating 1000 random numbers every single time.

If you want to get really crazy, randomize the range you call `randomBetween` with. **O_O”**

This idea’s made unit testing much more enjoyable for me. After planning a function’s test, hammer it with tons of different inputs and see what breaks. That’s how you ensure truly bulletproof code. Let me know if this helps, or if you’ve already been doing this.

Until next time!

Take care,
Yazeed Bzadough
  