---
title: How Do Object.assign and Spread Actually Work?
date: '2017-12-17'
description: 'A deep dive.'
draft: false
template: 'post'
slug: '/posts/how-do-object-assign-and-spread-actually-work'
category: 'JavaScript In-depth'
tags:
  - 'JavaScript'
  - 'Deep dive'
---

### What is spread?

It lets you expand any iterable (like an array or string) in an array or function parameters, or expand any object into another object.

By now, we’ve seen _plenty_ of spread examples (React, Redux, etc)

![](https://cdn-images-1.medium.com/max/1600/1*yO-LJz4y_5cZM1Z5CO1S0Q.png)Combining arrays with spread![](https://cdn-images-1.medium.com/max/1600/1*C0H_Nv_z9lRobedHGwrRAw.png)Combining objects with spread

Let’s dive deeper into each one.

We’ll create a function called `identity` that just returns whatever parameter we give it.

`identity = (arg) => arg`

And a simple array.

`arr = [1, 2, 3]`

If you call `identity` with `arr`, we know what’ll happen

![](https://cdn-images-1.medium.com/max/1600/1*Ngch7Otz4pz-fn4Vu3g_8w.png)identity returns whatever you give it

But what if you _spread_ (can I use it as a verb?) `arr` into `identity`?

![](https://cdn-images-1.medium.com/max/1600/1*zOqJjEFQQKYC0apcga1-aw.png)

Wait, where’s 2 and 3? `identity`’s holding out on us!

Mmm, probably not. Something else is going on here. Let’s use my favorite tool for analyzing next-gen JavaScript code: [the Babel REPL](https://babeljs.io/repl/).

REPL stands for **Read**, **Evaluate**, **Print**, **Loop**, meaning, “I’ll **read**/**evaluate** your code and **print** the result as many times as you want–like a **loop**.” A browser’s JavaScript console is a REPL, for example. **Instant feedback**.

Alright, head over [https://babeljs.io/repl/](https://babeljs.io/repl/) and view the REPL in all its glory. You enter code on the left, and its transformed by Babel and printed on the right.

![](https://cdn-images-1.medium.com/max/1600/1*enU6_g81MwwfvVOwllPyTQ.png)Make sure to check the **es2015** option to have your code properly transformed

Let’s add our initial code

![](https://cdn-images-1.medium.com/max/1600/1*6T4kT-CHKV8FJxodNDBsbg.png)

Whoa `_toConsumableArray`, what’s that? Let’s expand and restructure it.

```js
function _toConsumableArray(arr) {
  // if it's already an array
  if (Array.isArray(arr)) {
    // create a new array
    // of the same length
    var newArr = Array(arr.length);
    var i = 0;

    // and populate it with the
    // original's contents
    for (i; i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    // If it's not an array,
    // turn it into one
    return Array.from(arr);
  }
}
```

Okay cool... If we have an array return a new copy, otherwise, make an array out of it. But something’s still not adding up here…

### Why did identity(…arr) return 1?!

`_toConsumableArray` returns an array. `identity` returns whatever you give it. We should’ve gotten an array!

Look further down in the REPL’s output.

![](https://cdn-images-1.medium.com/max/1600/1*G7duPv_fFxiObnRqa2naYw.png)

`identity.apply(undefined, _toConsumableArray(arr))`

Interesting…

You can use `apply` to invoke a function and pass it parameters, sure…but why not just use `identity(_toConsumableArray(arr))`? Isn’t that easier?

[MDN Docs to the rescue](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)!

The first sentence:

> The `apply()` method calls a function with a given `this` value, **and** `arguments` **provided as an array (or an** [array-like object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)**).**

![](https://cdn-images-1.medium.com/max/1600/1*Nh-S3PxSlsiSOs3-KR2jEw.png)

That makes so much sense. `apply` takes an array of params and feeds it to your function _one by one_.

```js
// 1
identity.apply(undefined, [1, 2, 3]);
```

is the same as saying this

```js
// 1
identity(1, 2, 3);
```

and **NOT** this

```js
// This says identity([1, 2, 3])
// which is **NOT** the same
identity(_toConsumableArray(arr));
```

And in JavaScript, extra parameters are thrown away.

```js
combineWords = (one, two) => `${one} ${two}`;

// 'big sandwich'
combineWords('big', 'sandwich');

// 'now' isn't used
// still returns 'big sandwich'
combineWords('big', 'sandwich', 'now');
```

See that? We kept getting `'big sandwich'` because `combineWords` only accepts two arguments. Any others are thrown out.

If you want `identity` to return all of its arguments, use the rest syntax to get the _rest_ of them. 👏

```js
restIdentity = (...args) => args;
restIdentity(...arr); // [1, 2, 3]
```

This uses _rest_ to capture all params in an array. Since we _spread_ `[1, 2, 3]`, Babel turned it into

```js
restIdentity.apply(undefined, [1, 2, 3]);
```

or

```js
restIdentity(1, 2, 3);
```

### Quick recap:

- When using _spread_ in function calls, Babel “fakes it” by wrapping your arguments in `_toConsumableArray` and invoking your function’s `apply` method to…apply them. 👏
- Since `identity` only returns the first argument, passings params with `apply` will only return your first argument. All others are discarded.
- If you’d like `identity` to capture all parameters in a single array, use _rest_ syntax:`(…params) => params`

That’s one mystery solved! So what actually happens when you combine arrays using _spread_? Using our earlier example:

![](https://cdn-images-1.medium.com/max/1600/1*e7f8EYjND8ieDpyVHXe5fQ.png)

Okay, our arrays are still wrapped in `_toConsumableArray` and then concatenated to an empty array using the `concat` method.

Once again, ❤️ [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat):

> The `concat()` method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.

Nice. So however many arrays we combine, `concat` returns a new array with the end result.

### What about objects?

> Arrays and objects aren’t the same- Captain Obvious

I’m predicting that `_toConsumableArray` won’t suffice when we’re using _spread_ on objects. Let’s see what our good friend, REPL, has to say.

![](https://cdn-images-1.medium.com/max/1600/1*KRC9ML9a5gMXHMMrwtkn4w.png)

> I broke it

Whoops, I forgot to mention: make sure to select any of the **stage-x** presets.

![](https://cdn-images-1.medium.com/max/1600/1*GqkHXygIL0fWK9lVNTE1aw.png)

> I fixed it

So with that out of the way, let’s look at our newly generated code from when we entered `bigFoot` and friends.

![](https://cdn-images-1.medium.com/max/1600/1*YVLuudd52754IGZyQLKGUw.png)

> I see a familiar face on line 3

**Look very closely at line 3…**

#### It’s Object.assign

Seems if you’re merging objects with _spread_, Babel looks for `Object.assign` in your browser. If `Object.assign` isn’t available, it falls back to a hand-written function.

I think we’ll get two gems for the price of one today.

By understanding that custom function Babel wrote, we’ll understand object _spread_ and `Object.assign` at the same time!

Let’s restructure and play with this in DevTools

```js
function fakeObjectAssign(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    debugger;

    for (var key in source) {
      debugger;

      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  debugger;
  return target;
}
```

Remember, `Object.assign`'s first parameter is the _target._

```js
Object.assign({}, bill, bigFoot);
```

Here an empty object `{}` is populated with `bill` and `bigFoot`'s fusion. So you get a brand new object.

`{ name: 'bill', shoeSize: 9001 }`

So we’d like to use `fakeObjectAssign` the same way.

![](https://cdn-images-1.medium.com/max/1600/1*Lhcx60pxjdU39PglEMK0hA.png)

If you used our restructured `fakeObjectAssign` above, you should be looking at a `debugger` statement right now.

![](https://cdn-images-1.medium.com/max/1600/1*ZQVC5MEQjOJWcTVXTvleCg.png)

Let’s break this down a bit.

Our `target` is a brand-new object, and each argument after that is what we’re merging together. Once the merge’s complete, stick it all into `target`.

Remember how I mentioned using _rest_ parameters to capture your arguments in an array?

```js
restIdentity = (...args) => args;
```

Pre-ES6 arrow functions, we used the `arguments` object.

```js
function oldSchoolArguments() {
  return arguments;
}
```

For fun, I’ll do

```js
oldSchoolArguments('Hello', 'World');
```

![](https://cdn-images-1.medium.com/max/1600/1*pwsmfIAF7o8862kjpYB_mQ.png)

It’s not _quite_ an array but it has indices, so its iterable. We can loop through it.

That’s what `fakeObjectAssign` does on line 2

```js
for (var i = 1; i < arguments.length; i++)
```

Wait, but `arguments` indices are zero-based, meaning the first argument’s in position 0\. This loop skips the first argument!

Ahh but remember, `target` is at position 0, and we don’t want to touch it until we’re done merging everything else.

Looking at line 3, `arguments[i]` (the current argument) has been appropriately named `source`, because [according to the docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), every argument after `target` is called a _source_ object.

Now on line 7 it loops through the current `source` and does an interesting check

```js
if (Object.prototype.hasOwnProperty.call(source, key)) {
  target[key] = source[key];
}
```

`hasOwnProperty` is a method on every JavaScript object that tells you whether or not that object has a certain property. **Inherited properties don’t count**.

![](https://cdn-images-1.medium.com/max/1600/1*hH2NHMOMyqYhUT_N4OjhzA.png)

`bill.hasOwnProperty('name')` returns true because we _directly_ defined `name` on `bill`. But what if `bill` inherits a method `sayName`?

```js
function inherit(name) {
  this.name = name;

  inherit.prototype.sayName = function() {
    return this.name;
  };
}
```

I won’t cover prototypes in this post. If you’re unfamiliar with them, just understand that `bill` will _inherit_ the `sayName` method. [Further reading if you’re interested](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes).

![](https://cdn-images-1.medium.com/max/1600/1*9VSyxGpMN7xHtzItSYTuTg.png)

We’ve got the point across: `hasOwnProperty` only returns `true` for properties _defined directly on that object_.

Back to our loop:

```js
if (Object.prototype.hasOwnProperty.call(source, key)) {
  target[key] = source[key];
}
```

If `key` was defined directly on `source`, copy it to `target`.

That’s it.

If that property was inherited from somewhere else, we don’t want it.

Similar to our `.apply` question above: why are we using `.call` instead of just `source.hasOwnProperty(key)`?

In a nutshell (from my understanding), it’s a safety-net against how a `source` object might’ve been created. If you’d like to dig deeper, see [this awesome StackOverflow answer](https://stackoverflow.com/a/12017703/5924051).

Let’s finish this!

Jump to the next `debugger`, and you see that `target` has a `name` property now. It’s `bill`!

![](https://cdn-images-1.medium.com/max/1600/1*c7VYBdARTYqqoYa59aflhA.png)Bill! Bill! Bill!

On the next `debugger` (line 8), we’re evaluating `bigFoot`'s original properties

![](https://cdn-images-1.medium.com/max/1600/1*Fm2--x5c5mv0uRJ3ESofkw.png)

> bigFoot does indeed have a shoeSize > 9000

Jump to the next `debugger` and we’re on line 16, just before we return the `target` object. This means we’ve finished looping through each `argument` and its properties.

![](https://cdn-images-1.medium.com/max/1600/1*S2Ndw8gpSr0XOb9WrWvlFA.png)

And `bigFootBill` has been successfully created.

![](https://cdn-images-1.medium.com/max/1600/1*l7vtWEsvj7zv7qdFjoF1iQ.png)

### Quick recap:

- _Spread_ and `Object.assign` are _exactly the same_ regarding objects. _Spread_ uses `Object.assign` if your browser supports it.
- `Object.assign`'s first parameter is the `target` object, every parameter after that is a `source` object to be merged into the `target`.
- **Inherited properties don’t count**. A `source` object’s property will only get merged if it was defined _directly_ on that `source` object.

That was fun. I learned several new things writing this article, and couldn’t be happier that you stuck with me through all of it.

Until next time!
