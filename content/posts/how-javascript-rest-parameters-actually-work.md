---
title: How JavaScript rest parameters actually work
date: '2017-12-19'
subtitle: ''
---

* * *

# How JavaScript rest parameters actually work

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.freecodecamp.org/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.freecodecamp.org/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.freecodecamp.org/how-do-javascript-rest-parameters-actually-work-227726e16cc8" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2017-12-20T00:32:29.926Z">Dec 19, 2017</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="3 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*10krG9dLp-2JAyOo1TNVPQ.jpeg)

[My last article](https://medium.com/@yazeedb/how-do-object-assign-and-spread-actually-work-169b53275cb) covered **spread**syntaxand `Object.assign` in detail, but glossed over **rest parameters**in the interest of time. I do, however, feel they deserve a closer look.

Let’s begin at the trusty [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters):

> The **rest parameter** syntax allows us to represent an indefinite number of arguments as an array.

That last part, “as an array”, is interesting, because before [ES6 arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), we used the `arguments` **object**. It was array-_like_, but not actually an array.

Example:

<pre name="6fca" id="6fca" class="graf graf--pre graf-after--p">function returnArgs() {
    return arguments;
}</pre>

![](https://cdn-images-1.medium.com/max/1600/1*Xuhn5NvMtl3Mev2FqL-oug.png)

We see `arguments` has indices, so it’s loop-able:

<pre name="be58" id="be58" class="graf graf--pre graf-after--p">function loopThruArgs() {
    let i = 0;</pre>

<pre name="2a38" id="2a38" class="graf graf--pre graf-after--pre">    for (i; i < arguments.length; i++) {
      console.log(arguments[i]);
    }
}</pre>

![](https://cdn-images-1.medium.com/max/1600/1*jU_wgPi5ILJrOQ7F0J8sUA.png)

But it’s not an array.

![](https://cdn-images-1.medium.com/max/1600/1*KNeT3_DX6pQE3TWkjzJiMg.png)

Let’s contrast that with a function using **rest** parameters:

<pre name="1c19" id="1c19" class="graf graf--pre graf-after--p">es6Params = (...params) => {
   console.log('Array?', Array.isArray(params));
   return params;
}</pre>

![](https://cdn-images-1.medium.com/max/1600/1*cPEtXM-jUWC3oDsCHU2keg.png)

It’s _just an array_, meaning we can use any of the `Array` methods on it!

Let’s write a function that **doubles** and **sums** every parameter you give it.

<pre name="9cde" id="9cde" class="graf graf--pre graf-after--p">double = (x) => x * 2
sum = (x, y) => x + y</pre>

<pre name="694c" id="694c" class="graf graf--pre graf-after--pre">doubleAndSum = (...numbers) => numbers
    .map(double)
    .reduce(sum, 0)</pre>

![](https://cdn-images-1.medium.com/max/1600/1*Hdk9NP-ZGteTef7v5RPBEg.png)

And you can name as many parameters as you want in your function before using **rest**.

<pre name="e1aa" id="e1aa" class="graf graf--pre graf-after--p">someFunction = (a, b, c, ...others) => {
    console.log(a, b, c, others)
}</pre>

![](https://cdn-images-1.medium.com/max/1600/1*NZVvRUAyRffRtcckUIPdLA.png)

But it has to be the last one specified, since it captures the _rest_ of your arguments. 👏

![](https://cdn-images-1.medium.com/max/1600/1*xjYSLt00rbmHdUtBYWUPMg.png)

I think we know what’s happening under the hood, but let’s be thorough. Check out [babeljs.io/repl](https://babeljs.io/repl), where you can write ES6+ code and have it transpiled into ES5 in real-time.

![](https://cdn-images-1.medium.com/max/1600/1*qYBa9yW0izOhXaTfP8IBKw.png)

That’s a neat little function, let’s expand it and add comments.

<pre name="ca2c" id="ca2c" class="graf graf--pre graf-after--p">someFunction = function someFunction() {
    var _len = arguments.length;</pre>

<pre name="bd04" id="bd04" class="graf graf--pre graf-after--pre">    // create an array same length
    // as the arguments object
    var args = Array(_len);
    var i = 0;</pre>

<pre name="39f0" id="39f0" class="graf graf--pre graf-after--pre">    // iterate through arguments
    for (i; i < _len; i++) {
        // assign them to
        // the new array
        args[i] = arguments[i];
    }</pre>

<pre name="f933" id="f933" class="graf graf--pre graf-after--pre">    // and return it
    return args;
};</pre>

Since Babel wrote an old-school function for us, it can access the `arguments` object! `arguments` has indices and a `.length` property, which is all we need to create a perfect clone of it.

This is why we can use Array methods like `map`, `filter`, `reduce` on **rest** parameters, because it creates an Array clone of `arguments`.

Have fun _rest_ing. Please hold that clap button if you enjoyed. (You can go up to 50!)

Until next time!

Take care,
Yazeed Bzadough
  