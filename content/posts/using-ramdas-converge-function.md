---
title: Using Ramda’s converge() Function
date: '2018-02-17'
subtitle: 'But That’s Not All!'
---

* * *

# Using Ramda’s converge() Function

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/@yazeedb/using-ramdas-converge-function-676d90031937" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-02-17T20:59:32.286Z">Feb 17, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="4 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*Nmv_XVkJn_X61m7XcLfjWw.jpeg)Photo credit (without text): Wasan Ritthawon / Shutterstock.com

Summarizing the [docs](http://ramdajs.com/docs/#converge), `converge` takes two parameters:

1.  A function (**converging** function)
2.  An array of functions (**branching** functions).

I’ll be using **converging** and **branching** to refer to these parameters.

`converge` then returns a new function that takes `n` parameters, applies them to your branching functions, and feeds each result to the converging function.

Consider this example.

![](https://cdn-images-1.medium.com/max/1600/1*XgPsjMM_DGdIpQKTjM7Lag.png)

`console.log` is the **converging** function, and the array of functions that return 1, 2, 3 is the list of **branching** functions.

Let’s add more branching functions.

![](https://cdn-images-1.medium.com/max/1600/1*-UlPCU2gUZmNjyT4BkJOYg.png)

See? For every branching function, the converging function gets a new parameter.

#### But That’s Not All!

We said invoking `converge` with converging and branch functions returns a _new_ function, right? Well that _new_ function adopts the arity of the branching function with the largest arity.

**Arity = the number of arguments a function takes.**

This function, for example, has an arity of 2.

![](https://cdn-images-1.medium.com/max/1600/1*XoJ6g3SmMj40sUoak031MQ.png)

So if you supply two branching functions, one with 4 arity and the other with 2, your returned function will have an arity of 4.

![](https://cdn-images-1.medium.com/max/1600/1*c7xHPk5ulPVUcfDW4ACX8w.png)

Our first branching function takes 4 parameters, so it has an arity of 4\. Notice the returned function from `R.converge` is also 4 arity, and we proved it by using its `.length` method.

#### But That’s Not All!

We just demonstrated that the result of `converge` is a function that takes `n` parameters, according to the largest arity of your branching functions. But what does it do with those parameters?

It applies them to your branching functions!

![](https://cdn-images-1.medium.com/max/1600/1*1JN8TdRWJX-yGAmd3u95fA.png)

Starting from top to bottom `console.log` received four parameters, `6, 0, 9, 1`, each the result of a branching function receiving `3, 3`.

### A More Practical Example

Hopefully the basic idea’s clear now: do `n` things to `n` parameters and somehow merge the results in a single function.

But how can we use this magic in our apps?

In my experience, `converge` is great for processing several form fields via branching functions and merging them in the converging function.

Let’s code out a little form. We’ll include [Ramda via CDN](https://cdnjs.com/libraries/ramda) in a `script` tag to access `R.converge`.

![](https://cdn-images-1.medium.com/max/1600/1*E2zA7W6TK9A4qI4JuYvkPQ.png)

Our form has four fields–**name**, **birthday**, **country**, and **favorite language**. We wish to collect each field’s value and return a sentence to our user.

Here’s what we’re looking for.

![](https://cdn-images-1.medium.com/max/1600/1*nwVQioMqUYtA-MmWx416tA.png)

Here’s the steps we might take to get there:

1.  Write a function to collect the form values
2.  Write a function that merges everything via `converge`
3.  Hook up the `button`'s `onclick` method to run everything.

First, the function to get the form values. Let’s call it `getFormValues`. This’ll dig in to each `input` and grab its value.

![](https://cdn-images-1.medium.com/max/1600/1*j78jgsJhDBv5YLJSrL5lhw.png)

In Chrome, `$` is similar to `document.querySelector`. If you’re not in Chrome, just add this line before `getFormValues`:

![](https://cdn-images-1.medium.com/max/1600/1*DDKqntyZ9m4pt5vcRaIh8A.png)

Now a function to converge our fields, let’s call it `mergeFields`.

![](https://cdn-images-1.medium.com/max/1600/1*CchhkjKziFE3vDm15CP93Q.png)

We have a branching function per field, and our converging function will receive them from top to bottom and construct a sentence.

Lastly, we’ll set the `button`'s `onclick` method.

![](https://cdn-images-1.medium.com/max/1600/1*28LcvlmihKwW7cJbkIpiGA.png)

Here’s the entire script, if you like.

![](https://cdn-images-1.medium.com/max/1600/1*aCh7ltLieoAzZ9kxOueUBg.png)

And our end result:

![](https://cdn-images-1.medium.com/max/1600/1*lNLfBoeXdFMtF02wFcFu3A.gif)

Using `converge` has been most effective for forms in my experience, but I’m sure you can think of many more use cases. I hope this post’s given you some ideas and would love your feedback!

Until next time!

Take care,
Yazeed Bzadough
  