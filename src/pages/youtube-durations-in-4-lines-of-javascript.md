---
title: YouTube durations in 4 lines of JavaScript
date: '2017-12-20'
subtitle: ''
---

* * *

# YouTube durations in 4 lines of JavaScript

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/@yazeedb/youtube-durations-in-4-lines-of-javascript-e9a92cea67a4" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2017-12-21T01:43:42.919Z">Dec 20, 2017</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="2 min read"></span>

While _very gradually_ creating a [YouTube clone](https://github.com/yazeedb/youtube-clone) in my spare time, I marveled at how easy making consistent video durations was. By durations, I mean the little running times in the corner of each video.

![](https://cdn-images-1.medium.com/max/1600/1*V-q__OZoY0L_LrUEQpaYBA.png)

Durations can vary greatly, but YouTube’s UI has a good ruleset for consistently formatting them. Some rules I noticed were

*   Durations must be 4 characters minimum–a 1 second video is represented as **0:01**.
*   Anything under a minute must be padded with **0:**, like **0:59** or **0:12**
*   Anything under ten seconds must be padded with **0:0,** like **0:09** or **0:01**

YouTube’s Data API returns durations in [ISO_8601 format](https://en.wikipedia.org/wiki/ISO_8601#Durations). The duration’s prefixed with **PT**. **P** stands for **period**, **T** stands for **time**.

Some examples

*   30 seconds => PT**30S**
*   4 minutes, 42 seconds => PT**4M42S**
*   1 hour => PT**1H**
*   6 hours, 41 minutes, 55 seconds => PT**6H41M55S**

Since manually parsing these would’ve _sucked_, I leaned on the awesome [moment-duration-format](https://github.com/jsmreese/moment-duration-format) library to handle it with two easy function calls.

<pre name="92d4" id="92d4" class="graf graf--pre graf-after--p">processDuration = (duration) => moment
    .duration(duration)
    .format('h:mm:ss')</pre>

We’re not done yet, however. This function doesn’t always conform to YouTube’s formatting rules.

![](https://cdn-images-1.medium.com/max/1600/1*yk6yOAgO11a-SuHJ842W1Q.png)

In those first three, we expect **0:30**, **0:02**,and **0:11**.

What to do, what to do…?

Well remember I titled this post “4 lines of JavaScript”? We’ve only written _three_.

Here’s the last one.

<pre name="58da" id="58da" class="graf graf--pre graf-after--p">processDuration = (duration) => moment
    .duration(duration)
    .format('h:mm:ss')
 **.padStart(4, '0:0')**</pre>

![](https://cdn-images-1.medium.com/max/1600/1*utZuHSnHNVcquuMHQs2Qbw.png)

Please, check out the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) while I try not to fly out of my chair.

> The `**padStart()**` method pads the current string with another string (repeated, if needed) so that the resulting string reaches the given length. The padding is applied from the start (left) of the current string.

`padStart(4, ‘0:0’)` says, “Until the string is **4 characters long**, keep adding to it from `‘0:0’`. If it’s already 4 or more, leave it alone.”

Our results?

![](https://cdn-images-1.medium.com/max/1600/1*IDEHQX4-oB78dWfErpX1ZQ.png)

Honestly, what more do you want? This magical method saved me a lot of time.

Please drop a comment if this method’s ever saved you! Until next time!

Take care,
Yazeed Bzadough
  