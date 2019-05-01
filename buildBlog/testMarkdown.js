exports.testMarkdown = `* * *

# 10 Ways to Write pipe and compose in JavaScript

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/@yazeedb/10-ways-to-write-pipe-compose-in-javascript-f6d54c575616" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-05-16T16:41:19.329Z">May 16, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="3 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*I2oy7YWlgX6Ej9uGSOGD7Q.jpeg)

\`compose\`, and especially \`pipe\`, are easily among my favorite functions.

This article’s just to have fun and explore different implementations of these two gems. I recommend you understand what they do before reading this; perhaps check out [my deep-dive here](https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937).

<pre name="3336" id="3336" class="graf graf--pre graf-after--p">pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)</pre>

Classic.

Starting with the leftmost function, reduce an array of functions to a single value by calling the next function with the previous one’s output.

<pre name="2fff" id="2fff" class="graf graf--pre graf-after--p">double = (x) => x * 2
add1 = (x) => x + 1</pre>

<pre name="4c85" id="4c85" class="graf graf--pre graf-after--pre">pipe(double, add1)(100) // 201</pre>

I discovered this implementation through [Eric Elliott](https://medium.com/@_ericelliott), and wrote a deep-dive on it [here](https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937).

Use \`reduceRight\` to implement \`compose\`. Now your functions are called from right, to left.

<pre name="29e6" id="29e6" class="graf graf--pre graf-after--p">compose = (...fns) => x => fns.**reduceRight**((v, f) => f(v), x)</pre>

<pre name="fa26" id="fa26" class="graf graf--pre graf-after--pre">compose(double, add1)(100) **// 202**</pre>

You could also reverse \`fns\` and keep using \`reduce\` (less performant).

<pre name="2e3d" id="2e3d" class="graf graf--pre graf-after--p">compose = (...fns) => x => (
 fns
  .reverse()
  .reduce((v, f) => f(v), x)
)</pre>

<pre name="f8b5" id="f8b5" class="graf graf--pre graf-after--pre">compose(double, add1)(100) // 202</pre>

\`reverse\` mutates the array, though, so you might copy it first (even less performant).

<pre name="7edc" id="7edc" class="graf graf--pre graf-after--p">compose = (...fns) => x => (
 [...fns]
  .reverse()
  .reduce((v, f) => f(v), x)
)</pre>

<pre name="2644" id="2644" class="graf graf--pre graf-after--pre">compose(double, add1)(100) // 202</pre>

Use \`reduceRight\` to go back to \`pipe\`.

<pre name="c25a" id="c25a" class="graf graf--pre graf-after--p">pipe = (...fns) => x => (
 [...fns]
  .reverse()
  .**reduceRight**((v, f) => f(v), x)
)</pre>

<pre name="7333" id="7333" class="graf graf--pre graf-after--pre">pipe(double, add1)(100) // 201</pre>

### But They’re All Unary

All the above snippets, by the way, are _unary_. Each function may only accept _a single argument_.

If your pipeline’s first function must be _nAry_ (accepting \`n\` arguments), try this implementation:

<pre name="120b" id="120b" class="graf graf--pre graf-after--p">multiply = (x, y) => x * y;
**pipe = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));**</pre>

<pre name="c7cf" id="c7cf" class="graf graf--pre graf-after--pre">pipe(multiply, add1)(10, 10) // 101
**// Takes multiple args now**</pre>

This snippet’s from [30secondsofcode.org](https://30secondsofcode.org/adapter#pipefunctions). Your first (leftmost) function may accept \`n\` arguments–all others must be unary.

Again, \`reduceRight\` gives us \`compose\`. Now your rightmost function may accept \`n\` arguments. Let’s move \`multiply\` to the end of the chain.

<pre name="b4ad" id="b4ad" class="graf graf--pre graf-after--p">compose = (...fns) => fns.**reduceRight**((f, g) => (...args) => g(f(...args)));</pre>

<pre name="70b8" id="70b8" class="graf graf--pre graf-after--pre">compose(add1, **multiply**)(10, 10) // 101
**// Takes multiple args now
// Put multiply first**</pre>

Like before, you could reverse the \`fns\` array and keep using \`reduce\`:

<pre name="1c59" id="1c59" class="graf graf--pre graf-after--p">compose = (...fns) => (
 [...fns]
  .reverse()
  .reduce((f, g) => (...args) => g(f(...args)))
);</pre>

<pre name="a50a" id="a50a" class="graf graf--pre graf-after--pre">compose(add1, multiply)(10, 10) // 101</pre>

If you want to keep \`reduce\` without the slight performance hit, just switch \`g\` and \`f\`:

<pre name="afab" id="afab" class="graf graf--pre graf-after--p">compose = (...fns) => fns.reduce((f, g) => (...args) => **f**(**g**(...args)));</pre>

<pre name="7524" id="7524" class="graf graf--pre graf-after--pre">compose(add1, multiply)(10, 10) // 101</pre>

And use \`reduceRight\` to switch back to \`pipe\`.

<pre name="2f99" id="2f99" class="graf graf--pre graf-after--p">pipe = (...fns) => fns.**reduceRight**((f, g) => (...args) => f(g(...args)));</pre>

<pre name="ae20" id="ae20" class="graf graf--pre graf-after--pre">pipe(**multiply**, add1)(10, 10) // 101
**// put multiply first now**</pre>

### Conclusion

Phew! That’s a lot of ways to pipe and compose!

It just proves that, no matter what, you _must loop over an array of functions, calling the next one with the previous one’s result_.

Doesn’t matter if you use \`reduce\`, \`reduceRight\`, switch the invocation order, or whatever else.

> If you want \`pipe()\`, go left-to-right. Want compose()? Go right-to-left.

Plain and simple. Until next time!

Take care,
Yazeed Bzadough`;
