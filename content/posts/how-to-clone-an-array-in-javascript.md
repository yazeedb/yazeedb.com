---
title: How to clone an array in JavaScript
date: '2019-04-11'
subtitle: 'Use #8 for deep copying!'
---

* * *

# How to clone an array in JavaScript

## Use #8 for deep copying!

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.freecodecamp.org/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.freecodecamp.org/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.freecodecamp.org/how-to-clone-an-array-in-javascript-1d3183468f6a" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2019-04-11T16:01:01.069Z">Apr 11</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="5 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*fWhAxeITIQaYWeqE7wogkQ.png)

JavaScript has many ways to do anything. I’ve written on [10 Ways to Write pipe/compose in JavaScript](https://medium.com/front-end-weekly/10-ways-to-write-pipe-compose-in-javascript-f6d54c575616), and now we’re doing arrays.

### 1\. Spread Operator (Shallow copy)

Ever since ES6 dropped, this has been the most popular method. It’s a brief syntax and you’ll find it incredibly useful when using libraries like React and Redux.

<pre name="c4f2" id="c4f2" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
numbersCopy = [...numbers];</pre>

**Note:** This doesn’t safely copy multi-dimensional arrays. Array/object values are copied by _reference_ instead of by _value_.

This is fine

<pre name="e7e6" id="e7e6" class="graf graf--pre graf-after--p">numbersCopy.push(4);
console.log(numbers, numbersCopy);
// [1, 2, 3] and [1, 2, 3, 4]
// numbers is left alone</pre>

This is not fine

<pre name="fece" id="fece" class="graf graf--pre graf-after--p">nestedNumbers = [[1], [2]];
numbersCopy = [...nestedNumbers];</pre>

<pre name="fbcd" id="fbcd" class="graf graf--pre graf-after--pre">numbersCopy[0].push(300);
console.log(nestedNumbers, numbersCopy);
// [[1, 300], [2]]
// [[1, 300], [2]]
// They've both been changed because they share references</pre>

### 2\. Good Old for() Loop (Shallow copy)

I imagine this approach is the _least_ popular, given how trendy functional programming’s become in our circles.

Pure or impure, declarative or imperative, it gets the job done!

<pre name="1cf9" id="1cf9" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
numbersCopy = [];</pre>

<pre name="c858" id="c858" class="graf graf--pre graf-after--pre">for (i = 0; i < numbers.length; i++) {
  numbersCopy[i] = numbers[i];
}</pre>

**Note:** This doesn’t safely copy multi-dimensional arrays. Since you’re using the `=` operator, it’ll assign objects/arrays by _reference_ instead of by _value_.

This is fine

<pre name="6242" id="6242" class="graf graf--pre graf-after--p">numbersCopy.push(4);
console.log(numbers, numbersCopy);
// [1, 2, 3] and [1, 2, 3, 4]
// numbers is left alone</pre>

This is not fine

<pre name="28fa" id="28fa" class="graf graf--pre graf-after--p">nestedNumbers = [[1], [2]];
numbersCopy = [];</pre>

<pre name="78d1" id="78d1" class="graf graf--pre graf-after--pre">for (i = 0; i < nestedNumbers.length; i++) {
  numbersCopy[i] = nestedNumbers[i];
}</pre>

<pre name="1148" id="1148" class="graf graf--pre graf-after--pre">numbersCopy[0].push(300);
console.log(nestedNumbers, numbersCopy);
// [[1, 300], [2]]
// [[1, 300], [2]]
// They've both been changed because they share references</pre>

### 3\. Good Old while() Loop (Shallow copy)

Same as `for`—impure, imperative, blah, blah, blah…it works! 😁

<pre name="4e11" id="4e11" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
numbersCopy = [];
i = -1;</pre>

<pre name="88de" id="88de" class="graf graf--pre graf-after--pre">while (++i < numbers.length) {
  numbersCopy[i] = numbers[i];
}</pre>

**Note:** This also assigns objects/arrays by _reference_ instead of by _value_.

This is fine

<pre name="b4ef" id="b4ef" class="graf graf--pre graf-after--p">numbersCopy.push(4);
console.log(numbers, numbersCopy);
// [1, 2, 3] and [1, 2, 3, 4]
// numbers is left alone</pre>

This is not fine

<pre name="19f2" id="19f2" class="graf graf--pre graf-after--p">nestedNumbers = [[1], [2]];
numbersCopy = [];</pre>

<pre name="d072" id="d072" class="graf graf--pre graf-after--pre">i = -1;</pre>

<pre name="1756" id="1756" class="graf graf--pre graf-after--pre">while (++i < nestedNumbers.length) {
  numbersCopy[i] = nestedNumbers[i];
}</pre>

<pre name="f706" id="f706" class="graf graf--pre graf-after--pre">numbersCopy[0].push(300);
console.log(nestedNumbers, numbersCopy);
// [[1, 300], [2]]
// [[1, 300], [2]]
// They've both been changed because they share references</pre>

### 4\. Array.map (Shallow copy)

Back in modern territory, we’ll find the `map` function. [Rooted in mathematics](https://en.wikipedia.org/wiki/Morphism), `map` is the concept of transforming a set into another type of set, while preserving structure.

In English, that means `Array.map` returns an array of the same length every single time.

To double a list of numbers, use `map` with a `double` function.

<pre name="46d9" id="46d9" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
double = (x) => x * 2;</pre>

<pre name="62fc" id="62fc" class="graf graf--pre graf-after--pre">numbers.map(double);</pre>

#### What about cloning??

True, this article’s about cloning arrays. To duplicate an array, just return the element in your `map` call.

<pre name="0d13" id="0d13" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
numbersCopy = numbers.map((x) => x);</pre>

If you’d like to be a bit more mathematical, `(x) => x` is called [_identity_](https://en.wikipedia.org/wiki/Identity_function). It returns whatever parameter it’s been given.

`map(identity)` clones a list.

<pre name="d0e5" id="d0e5" class="graf graf--pre graf-after--p">identity = (x) => x;
numbers.map(identity);
// [1, 2, 3]</pre>

**Note:** This also assigns objects/arrays by _reference_ instead of by _value_.

### 5\. Array.filter (Shallow copy)

This function returns an array, just like `map`, but it’s not guaranteed to be the same length.

What if you’re filtering for even numbers?

<pre name="151b" id="151b" class="graf graf--pre graf-after--p">[1, 2, 3].filter((x) => x % 2 === 0)
// [2]</pre>

The input array length was 3, but the resulting length is 1.

If your `filter`'s predicate always returns `true`, however, you get a duplicate!

<pre name="bec2" id="bec2" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
numbersCopy = numbers.filter(() => true);</pre>

Every element passes the test, so it gets returned.

**Note:** This also assigns objects/arrays by _reference_ instead of by _value_.

### 6\. Array.reduce (Shallow copy)

I almost feel bad using `reduce` to clone an array, because it’s so much more powerful than that. But here we go…

<pre name="d608" id="d608" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];</pre>

<pre name="6ff5" id="6ff5" class="graf graf--pre graf-after--pre">numbersCopy = numbers.reduce((newArray, element) => {
  newArray.push(element);</pre>

<pre name="fbd5" id="fbd5" class="graf graf--pre graf-after--pre">  return newArray;
}, []);</pre>

`reduce` transforms an initial value as it loops through a list.

Here the initial value is an empty array, and we’re filling it with each element as we go. That array must be returned from the function to be used in the next iteration.

**Note:** This also assigns objects/arrays by _reference_ instead of by _value_.

### 7\. Array.slice (Shallow copy)

`slice` returns a _shallow_ copy of an array based on the provided start/end index you provide.

If we want the first 3 elements:

<pre name="37df" id="37df" class="graf graf--pre graf-after--p">[1, 2, 3, 4, 5].slice(0, 3);
// [1, 2, 3]
// Starts at index 0, stops at index 3</pre>

If we want all the elements, don’t give any parameters

<pre name="5b7b" id="5b7b" class="graf graf--pre graf-after--p">numbers = [1, 2, 3, 4, 5];
numbersCopy = numbers.slice();
// [1, 2, 3, 4, 5]</pre>

**Note:** This is a _shallow_ copy, so it also assigns objects/arrays by _reference_ instead of by _value_.

### 8\. JSON.parse and JSON.stringify (Deep copy)

`JSON.stringify` turns an object into a string.

`JSON.parse` turns a string into an object.

Combining them can turn an object into a string, and then reverse the process to create a brand new data structure.

**Note: This one** **safely copies deeply nested objects/arrays**!

<pre name="4d93" id="4d93" class="graf graf--pre graf-after--p">nestedNumbers = [[1], [2]];
numbersCopy = JSON.parse(
  JSON.stringify(nestedNumbers)
);</pre>

<pre name="2107" id="2107" class="graf graf--pre graf-after--pre">numbersCopy[0].push(300);
console.log(nestedNumbers, numbersCopy);</pre>

<pre name="0c30" id="0c30" class="graf graf--pre graf-after--pre">// [[1], [2]]
// [[1, 300], [2]]
// These two arrays are completely separate!</pre>

### 9\. Array.concat (Shallow copy)

`concat` combines arrays with values or other arrays.

<pre name="49fc" id="49fc" class="graf graf--pre graf-after--p">[1, 2, 3].concat(4); // [1, 2, 3, 4]
[1, 2, 3].concat([4, 5]); // [1, 2, 3, 4, 5]</pre>

If you give nothing or an empty array, a shallow copy’s returned.

<pre name="4b8a" id="4b8a" class="graf graf--pre graf-after--p">[1, 2, 3].concat(); // [1, 2, 3]
[1, 2, 3].concat([]); // [1, 2, 3]</pre>

**Note:** This also assigns objects/arrays by _reference_ instead of by _value_.

### 10\. Array.from (Shallow copy)

This can turn any iterable object into an array. Giving an array returns a shallow copy.

<pre name="0196" id="0196" class="graf graf--pre graf-after--p">numbers = [1, 2, 3];
numbersCopy = Array.from(numbers)
// [1, 2, 3]</pre>

**Note:** This also assigns objects/arrays by _reference_ instead of by _value_.

### Conclusion

Well, this was fun 😁

I tried to clone using just 1 step. You’ll find many more ways if you employ multiple methods and techniques.

Feel free to leave a comment if you find one! [I’m on Twitter](https://twitter.com/yazeedBee) if you’d like to talk. Until next time!

Take care,
Yazeed Bzadough
[yazeedb.com](http://yazeedb.com/)
  