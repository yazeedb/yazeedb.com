---
title: 30 Seconds of Code reject()
date: '2018-05-06'
subtitle: 'What’s the point?'
---

* * *

# 30 Seconds of Code: reject()

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/front-end-weekly/30-seconds-of-code-reject-500b7c7750c8" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-05-06T20:17:00.870Z">May 6, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="2 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*fS-jTCqIsxtOIw1rWp1PrA.png)

30 Seconds of Code is a brilliant collection of JavaScript snippets, digestible in ≤ 30 seconds. **Anyone looking to master JavaScript should go through the entire thing.**

[My PR to 30secondsofcode](https://github.com/Chalarangelo/30-seconds-of-code/pull/657) added the `reject()` function.

Here’s the code from [the official entry](https://30secondsofcode.org/array#reject):

<pre name="4a06" id="4a06" class="graf graf--pre graf-after--p">reject = (pred, array) => array.filter((...args) => !pred(...args));</pre>

It works on arrays and denies whatever `Array.filter` would’ve kept.

`filter` example using numbers:

<pre name="8228" id="8228" class="graf graf--pre graf-after--p">nums = [1, 2, 3, 4, 5];</pre>

<pre name="5099" id="5099" class="graf graf--pre graf-after--pre">nums.filter(**(x) => x < 4**);
// [1, 2, 3]</pre>

Copy/pasting that predicate into `reject` does the opposite:

<pre name="4c9f" id="4c9f" class="graf graf--pre graf-after--p">reject(**(x) => x < 4**, nums);
// [4, 5]</pre>

You’d reject numbers greater than 3 like so:

<pre name="6a37" id="6a37" class="graf graf--pre graf-after--p">reject((x) => x > 3, nums);
// [1, 2, 3]</pre>

### What’s the point?

`filter` can do whatever `reject` does, so why bother?

The whole point of composition–_combining small things into bigger things_– is to more easily express ideas in code.

By simply negating `filter`'s predicate, we’ve invented a repeatable way to tackle the same problem from a different perspective. Isn’t that amazing?

We now have greater opportunity to reason in terms of **what to do** not **how to do** it.

In the real world, humans need to understand the code before the computer tries to. So when talking to another human we can now say “_Filter for everyone whose ages are 18 or older_”, or “_Reject anyone under 18_”.

I like the second one better…

And by making _pure_ functions your atomic building blocks, this type of abstraction’s possible on the micro and macro level.

Pure functions buy you the most flexibility.

*   Previous state is not a concern
*   No side effects
*   Same Inputs => Same Outputs

But whether it’s FP or Object-Oriented Programming, we all compose software. It’s the mentality that’s important. Keep on coding.

Until next time!

Take care,
Yazeed Bzadough
  