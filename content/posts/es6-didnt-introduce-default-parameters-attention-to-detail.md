---
title: ES6 Didn’t Introduce Default Parameters (Attention to Detail)
date: '2018-07-04'
subtitle: 'JavaScript Defaulted the Second Parameter'
---

* * *

# ES6 Didn’t Introduce Default Parameters (Attention to Detail)

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/@yazeedb/es6-didnt-introduce-default-parameters-attention-to-detail-3a081d3f0387" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-07-05T02:42:07.911Z">Jul 4, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="2 min read"></span>

> The **Attention to Detail** series aims to better our appreciation of JavaScript by delving into its syntax. Say hi in the comments! 😁

![](https://cdn-images-1.medium.com/max/1600/1*r6RChRNt3ampPhEPoTgfPQ.jpeg)[Background vector created by Freepik](https://www.freepik.com/free-vector/hand-holding-magnifying-glass-in-flat-style_2034694.htm)

ES6 didn’t invent default function parameters, it just let us change what the default would be.

Let’s say you have a function, `add`, and use it like so:

<pre name="dc43" id="dc43" class="graf graf--pre graf-after--p">add = (x, y) => x + y;</pre>

<pre name="c4b6" id="c4b6" class="graf graf--pre graf-after--pre">add(10, 20); // 30</pre>

What happens if you do this?

<pre name="f4ba" id="f4ba" class="graf graf--pre graf-after--p">add(10); // NaN</pre>

### JavaScript Defaulted the Second Parameter

When your function doesn’t receive an expected parameter, it isn’t just left hanging. JavaScript defaults missing parameters to `undefined`.

We can prove this with two `console.log`s inside of `add`.

<pre name="d42c" id="d42c" class="graf graf--pre graf-after--p">add = (x, y) => {
 **console.log({ x });
  console.log({ y });**</pre>

<pre name="3adb" id="3adb" class="graf graf--pre graf-after--pre">  return x + y;
};</pre>

<pre name="4947" id="4947" class="graf graf--pre graf-after--pre">add(10);
**// { x: 10 }
// { y: undefined }**
// NaN</pre>

### This Behavior isn’t New

[Section 4.3.9](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%201st%20edition,%20June%201997.pdf#sec-4.3.9) of the **1997** ECMAScript spec gave meaning to `undefined`. So around my 4th birthday, the ECMA guys wrote:

> **Undefined** is a primitive value used when a variable has not been assigned a value.

That includes function parameters.

### ES6 Default Parameters

Here’s how we presently do things:

<pre name="bc14" id="bc14" class="graf graf--pre graf-after--p">add = (x = 0, y = 0) => x + y;</pre>

<pre name="b4d9" id="b4d9" class="graf graf--pre graf-after--pre">add(10); // 10
add(10, undefined); // 10</pre>

But certain [falsy](https://developer.mozilla.org/en-US/docs/Glossary/falsy) values can cause problems:

<pre name="61f5" id="61f5" class="graf graf--pre graf-after--p">add(10, ''); // "10"
add(10, NaN); // NaN
add(10, document.all); // "10[object HTMLAllCollection]"</pre>

Why?

Because according to that spec, variables are defaulted when they _aren’t assigned a value_. A `null`, `false,` or `''` variable has technically been assigned a value.

This has been the case since the language’s birth, and it isn’t changing.

ES6 introduced a way to _change the default value_, not change the defaulting rules.

### Pre-ES6 Defaulting

In the old days, we defaulted parameters like this:

<pre name="ba16" id="ba16" class="graf graf--pre graf-after--p">add = function (x, y) {
  x = x || 0;
  y = y || 0;</pre>

<pre name="09aa" id="09aa" class="graf graf--pre graf-after--pre">  return x + y;
};</pre>

<pre name="0f9f" id="0f9f" class="graf graf--pre graf-after--pre">add(10); // 10
add(10, undefined); // 10</pre>

Unlike ES6 default parameters, this protected against [falsy](https://developer.mozilla.org/en-US/docs/Glossary/falsy) values:

<pre name="8ad4" id="8ad4" class="graf graf--pre graf-after--p">add(10, ''); // 10
add(10, NaN); // 10
add(10, document.all); // 10, lolwut?</pre>

### So ES6 screwed up, right? Wrong.

I remember feeling disappointed when first learning of these subtle, yet important distinctions.

Familiarity bias made me yearn for ES6 to mimic our familiar hack. I didn’t want to be careful when migrating my [logical OR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators)s to default parameters.

But that’s because I misunderstood the problem being solved.

**Problem**: A variable without a value gets `undefined` by default, how can a JavaScript developer change that default within a function?

**Solution**: ES6 Default Parameters.

By all means, if your problem is falsy values in general, keep using logical OR. Just know what knife you’re bringing to the fight.

It’s all in the details.

Please don’t forget to say hi! Until next time, friends.

Take care,
Yazeed Bzadough
  