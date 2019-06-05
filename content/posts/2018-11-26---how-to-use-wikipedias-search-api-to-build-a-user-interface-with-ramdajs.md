---
title: How to use Wikipedia’s search API to build a user interface with RamdaJS
date: '2018-11-26'
description: 'Code along with me!'
draft: false
template: 'post'
slug: '/posts/react-hooks-wikipedia-search-interface'
category: 'React'
tags:
  - 'React'
  - 'React Hooks'
  - 'Wikipedia search'
---

![](https://cdn-images-1.medium.com/max/1600/1*UbRHe_HbWSPhIdqPoNkpdA.gif)

> Our Wikipedia Search UI

In this tutorial, we’ll build a UI using Wikipedia’s public search API along with some JavaScript + RamdaJS.

### Getting Started

Here’s the [GitHub link](https://github.com/yazeedb/ramda-wikipedia-search) and [Codesandbox link](https://codesandbox.io/s/y2zpq2xw39). Open your terminal and pick a directory to clone it.

```
git clone [https://github.com/yazeedb/ramda-wikipedia-search](https://github.com/yazeedb/ramda-wikipedia-search)
cd ramda-wikipedia-search
yarn install (or npm install)
```

The `master` branch has the finished project, so check out the `start` branch if you wish to code along.

`git checkout start`

And start the project!

`npm start`

Your browser should automatically open [localhost:1234](http://localhost:1234/).

### **Getting the Input Value**

Here’s the initial app.

![](https://cdn-images-1.medium.com/max/1600/0*Wu4Qmu5newQZWGzt.png)

To capture the user’s input as they type, our `input` element needs an event listener.

Your `src/index.js` file is already hooked up and ready to go. You’ll notice we imported Bootstrap for styling.

![](https://cdn-images-1.medium.com/max/1600/0*qHfza67WgAEMZ-by.png)

Let’s add a dummy event listener to get things going.

```js
import 'bootstrap/dist/css/bootstrap.min.css';

const inputElement = document.querySelector('input');

inputElement.addEventListener('keyup', (event) => {
  console.log('value:', event.target.value);
});
```

We know `event.target.value`'s the standard way to access an input’s value. Now it shows the value.

![](https://cdn-images-1.medium.com/max/1600/0*NLxwt8JdO7YkAUNV.png)

How can Ramda help us achieve the following?

- Grab `event.target.value`
- Trim the output (strip leading/trailing whitespace)
- Default to empty string if `undefined`

The `pathOr` function can actually handle the first and third bullet points. It takes three parameters: the default, the path, and the data.

So the following works perfectly

```js
import { pathOr } from 'ramda';

const getInputValue = pathOr('', ['target', 'value']);
```

If `event.target.value` is `undefined`, we’ll get an empty string back!

Ramda also has a `trim` function, so that solves our whitespace issue.

```js
import { pathOr, trim } from 'ramda';

const getInputValue = (event) => trim(pathOr('', ['target', 'value'], event));
```

Instead of nesting those functions, let’s use `pipe`. See [my article on pipe](a-quick-intro-to-pipe-and-compose) if it’s new to you.

```js
import { pathOr, pipe, trim } from 'ramda';

const getInputValue = pipe(
  pathOr('', ['target', 'value']),
  trim
);
```

We now have a composed function that takes an `event` object, grabs its `target.value`, defaults to `''`, and trims it.

Beautiful.

I recommend storing this in a separate file. Maybe call it `getInputValue.js` and use the default export syntax.

![](https://cdn-images-1.medium.com/max/1600/1*EKKGBfZBV5jhZRl9S7wORw.png)

### Getting the Wikipedia URL

As of this writing, Wikipedia’s API search URL is [https://en.wikipedia.org/w/api.php?origin=\*&action=opensearch&search=](https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=)

For an actual search, just append a topic. If you need bears, for example, the URL looks like this:

[https://en.wikipedia.org/w/api.php?origin=\*&action=opensearch&search=bears](https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=bears)

We’d like a function that takes a topic and returns the full Wikipedia search URL. As the user types we build the URL based off their input.

Ramda’s `concat` works nicely here.

```js
import { concat } from 'ramda';

const getWikipediaSearchUrlFor = concat(
  'https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search='
);
```

`concat`, true to its name, concatenates strings and arrays. It’s curried so providing the URL as one argument returns a function expecting a second string. See [my article on currying](https://medium.com/front-end-hacking/how-does-javascripts-curry-actually-work-8d5a6f891499) if it’s new!

Put that code into a module called `getUrl.js`.

![](https://cdn-images-1.medium.com/max/1600/1*K-qJqHr60zKPUe_-5ql5cw.png)

Now let’s update `index.js`. Import our two new modules, along with `pipe` and `tap` from Ramda.

```js
import 'bootstrap/dist/css/bootstrap.min.css';
import { pipe, tap } from 'ramda';
import getInputValue from './getInputValue';
import getUrl from './getUrl';

const makeUrlFromInput = pipe(
  getInputValue,
  getUrl,
  tap(console.warn)
);

const inputElement = document.querySelector('input');

inputElement.addEventListener('keyup', makeUrlFromInput);
```

This new code’s constructing our request URL from the user’s input and logging it via `tap`.

Check it out.

![](https://cdn-images-1.medium.com/max/1600/1*xZxxcq2MpNutqcfvzTUXKQ.png)

### **Making the AJAX Request**

Next step is mapping that URL to an AJAX request and collecting the JSON response.

Replace `makeUrlFromInput` with a new function, `searchAndRenderResults`.

```js
const searchAndRenderResults = pipe(
  getInputValue,
  getUrl,
  (url) =>
    fetch(url)
      .then((res) => res.json())
      .then(console.warn)
);
```

Don’t forget to change your event listener too!

```js
inputElement.addEventListener('keyup', searchAndRenderResults);
```

Here’s our result.

![](https://cdn-images-1.medium.com/max/1600/1*gMD8q10P6eFtW7qLNz7uXQ.png)

### **Making a Results Component**

Now that we have JSON, let’s create a component that pretties it up.

Add `Results.js` to your directory.

![](https://cdn-images-1.medium.com/max/1600/1*5L38JxtvqbyjxfVeM2lRvA.png)

Look back at our Wikipedia search JSON response. Note its shape. It’s an array with the following indices:

1.  Query (what you searched for)
2.  Array of result names
3.  Array of summaries
4.  Array of links to results

Our component can take an array of this shape and return a nicely formatted list. Through ES6 array destructuring, we can use that as our function signature.

Edit `Results.js`

```js
export default ([query, names, summaries, links]) => `
  <h2>Searching for "${query}"</h2>
  <ul class="list-group">
    ${names.map(
      (name, index) => `
        <li class="list-group-item">
          <a href=${links[index]} target="_blank">
            <h4>${name}</h4>
          </a>
          <p>${summaries[index]}</p>
        </li>
      `
    )}
  </ul>
`;
```

Let’s go step by step.

- It’s a function that takes an array of our expected elements: `query`, `names`, `summaries`, and `links`.
- Using [ES6 template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), it returns an HTML string with a title and a list.
- Inside the `<ul>` we map `names` to `<li>` tags, so one for each.
- Inside those are `<a>` tags pointing to each result’s link. Each link opens in a new tab.
- Below the link is a paragraph summary.

Import this in `index.js` and use it like so:

```js
// ...

import Results from './Results';

// ...

const searchAndRenderResults = pipe(
  getInputValue,
  getUrl,
  (url) =>
    fetch(url)
      .then((res) => res.json())
      .then(Results)
      .then(console.warn)
);
```

This passes the Wikipedia JSON to `Results` and logs the result. You should be seeing a bunch of HTML in your DevTools console!

![](https://cdn-images-1.medium.com/max/1600/0*_A5qIZOpTB3HPsga.png)

All that’s left is to render it to the DOM. A simple `render` function should do the trick.

```js
const render = (markup) => {
  const resultsElement = document.getElementById('results');

  resultsElement.innerHTML = markup;
};
```

Replace `console.warn` with the `render` function.

```js
const searchAndRenderResults = pipe(
  getInputValue,
  getUrl,
  (url) =>
    fetch(url)
      .then((res) => res.json())
      .then(Results)
      .then(render)
);
```

And check it out!

![](https://cdn-images-1.medium.com/max/1600/0*v6by39wYex3-NwIl.png)

Each link should open in a new tab.

### **Removing Those Weird Commas**

You may have noticed something off about our fresh UI.

![](https://cdn-images-1.medium.com/max/1600/0*ZAeJJS-ZP1YNAv5f.png)

It has extra commas! Why??

### Template Literals

It’s all about how template literals join things. If you stick in an array, it’ll join it using the `toString()` method.

See how this becomes joined?

```js
const joined = [1, 2, 3].toString();

console.log(joined);
// 1,2,3

console.log(typeof joined);
// string
```

Template literals do that if you put arrays inside of them.

```js
const nums = [1, 2, 3];
const msg = `My favorite nums are ${nums}`;

console.log(msg);
// My favorite nums are 1,2,3
```

You can fix that by joining the array without commas. Just use an empty string.

```js
const nums = [1, 2, 3];
const msg = `My favorite nums are ${nums.join('')}`;

console.log(msg);
// My favorite nums are 123
```

Edit `Results.js` to use the `join` method.

```jsx
export default ([query, names, summaries, links]) => `
  <h2>Searching for "${query}"</h2>
  <ul class="list-group">
    ${names
      .map(
        (name, index) => `
        <li class="list-group-item">
          <a href=${links[index]} target="_blank">
            <h4>${name}</h4>
          </a>
          <p>${summaries[index]}</p>
        </li>
      `
      )
      .join('')}
  </ul>
`;
```

Now your UI’s much cleaner.

![](https://cdn-images-1.medium.com/max/1600/0*JFmZsramtJjAI0yJ.png)

### **Fixing a Little Bug**

I found a little bug while building this. Did you notice it?

![](https://cdn-images-1.medium.com/max/1600/0*8qwAFsWU_6nKuXUH.png)

Emptying the `input` throws this error.

![](https://cdn-images-1.medium.com/max/1600/0*-aUVIsS0rtQoVomy.png)

That’s because we’re sending an AJAX request without a search topic. Check out the URL in your Network tab.

![](https://cdn-images-1.medium.com/max/1600/0*4cDzbOBm8Sw7KDwy.png)

That link points to a default HTML page. We didn’t get JSON back because we didn’t specify a search topic.

To prevent this from happening we can avoid sending the request if the `input`'s empty.

We need a function that **does nothing** if the `input`'s empty, and **does the search** if it’s filled.

Let’s first create a function called `doNothing`. You can guess what it looks like.

```js
const doNothing = () => {};
```

This is better known as `noOp`, but I like `doNothing` in this context.

Next remove `getInputValue` from your `searchAndRenderResults` function. We need a bit more security before using it.

```js
const searchAndRenderResults = pipe(
  getUrl,
  (url) =>
    fetch(url)
      .then((res) => res.json())
      .then(Results)
      .then(render)
);
```

Import `ifElse` and `isEmpty` from Ramda.

```js
import { ifElse, isEmpty, pipe, tap } from 'ramda';
```

Add another function, `makeSearchRequestIfValid`.

```js
const makeSearchRequestIfValid = pipe(
  getInputValue,
  ifElse(isEmpty, doNothing, searchAndRenderResults)
);
```

Take a minute to absorb that.

If the input value’s empty, do nothing. Else, search and render the results.

You can gather that information just by reading the function. _That’s_ expressive.

Ramda’s [isEmpty](https://ramdajs.com/docs/#isEmpty) function works with strings, arrays, objects.

![](https://cdn-images-1.medium.com/max/1600/0*VSddS4PKGUKcW_NC.png)

This makes it perfect to test our input value.

`ifElse` fits here because when `isEmpty` returns true, `doNothing` runs. Otherwise `searchAndRenderResults` runs.

Lastly, update your event handler.

```js
inputElement.addEventListener('keyup', makeSearchRequestIfValid);
```

And check the results. No more errors when clearing the `input`!

![](https://cdn-images-1.medium.com/max/1600/0*rKRi-EEHpN0FaRER.png)

This tutorial was from **my** **completely free** **course** on Educative.io, [Functional Programming Patterns With RamdaJS](https://www.educative.io/collection/5070627052453888/5738600293466112?authorName=Yazeed%20Bzadough)!

Please consider taking/sharing it if you enjoyed this content.

It’s full of lessons, graphics, exercises, and runnable code samples to teach you a basic functional programming style using RamdaJS.

Thank you for reading ❤️
