---
title: Immutably Rename Object Keys in Javascript
date: '2018-01-27'
description: "Immutability's become very popular. Renaming object keys immutably will provide a good exercise!"
draft: false
template: 'post'
slug: '/posts/immutably-rename-object-keys-in-javascript'
category: 'Code Snippets Explained'
tags:
  - 'Code snippets explained'
---

![](https://cdn-images-1.medium.com/max/1600/1*LEDiErvPVtrnmf7lbwS2Cw.jpeg)

- [How to rename multiple object keys](30-seconds-of-code-rename-multiple-object-keys)

If you’re okay with mutating data, renaming an object’s key is easy.

```js
obj = { name: 'Bobo' };
obj.somethingElse = obj.name;
delete obj.name;
```

If you don’t want to mutate your data, however, consider this function.

```js
renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => ({
  [newProp]: old,
  ...others
});
```

What’s happening here:

- Computed property names
- Spread syntax
- Rest params
- Destructuring assignment

Let’s add a `debugger` and inspect.

```js
renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => {
  debugger;

  return {
    [newProp]: old,
    ...others
  };
};
```

Imagine we have an object, `bobo`.

```js
bobo = {
  name: 'Bobo',
  job: 'Front-End Master',
  age: 25
};
```

And we want to change `bobo`’s `name` to `firstName`, so we plug him into `renameProp`.

```js
renameProp('name', 'firstName', bobo);
```

![](https://cdn-images-1.medium.com/max/1600/1*K6i63VJ-KdBZFPsiosfJbg.png)

Our local variables are

- `oldProp`: the first parameter, `'name'`
- `newProp`: the second parameter, `'firstName'`
- `old`: A _computed property name_ based on `oldProp`. It’s `bobo.name`.
- `others`: All of `bobo`'s other properties

Let’s dive into line 4 of our code.

```js
{ [oldProp]: old, ...others }
```

#### Dynamically find bobo’s name

Our function’s `oldProp` param is `‘name’`, right? And the third parameter, the object, is `bobo`, so typing `bobo[oldProp]` would return `bobo.name`.

![](https://cdn-images-1.medium.com/max/1600/1*4Ynk0jcOHza841aAnlJLkw.png)

The first half of line 4 uses `oldProp` to find `bobo`'s name and assigns it to a new variable, `old`.

![](https://cdn-images-1.medium.com/max/1600/1*VNtodam92e7iP9e5Kp7Hog.png)![](https://cdn-images-1.medium.com/max/1600/1*IIe9-hGSTZDIOIKBzhRxFQ.png)

#### Gather bobo’s other properties

Now let’s focus on line 4’s other half.

Our function must change one of `bobo`'s property names without mutating him, so `bobo`'s _other_ properties must remain untouched. We use _spread syntax_ to achieve this.

![](https://cdn-images-1.medium.com/max/1600/1*pbNmnIywvCDtaRiRoacXvA.png)

Spread syntax is a beautiful shorthand for gathering `bobo`’s other properties and assigning them a variable named `others`.

![](https://cdn-images-1.medium.com/max/1600/1*irc7a-eisZa8Y2Sh_KOI8w.png)

Let’s write a similar function to cement the concept into our heads.

```js
getPropsWithout = (names, object) =>
  Object.keys(object)
    .filter((key) => !names.includes(key))
    .reduce(
      (newObject, currentKey) => ({
        ...newObject,
        [currentKey]: object[currentKey]
      }),
      {}
    );
```

Don’t think about that function too much (unless you’re feeling adventurous! 😁). Just know that it takes an array of properties to exclude from a given object. We can use it like so:

```js
boboNoName = getPropsWithout(['name'], bobo);
```

Since we’re only omitting `name`, `boboNoName` is identical to our `others` variable that used _spread syntax_.

![](https://cdn-images-1.medium.com/max/1600/1*1JxTLQFIu5qCG7swWtfy5g.png)

#### Let’s recap!

Again, our local variables are

- `oldProp`: `‘name’` because it’s the first parameter
- `newProp`: `‘firstName’` because it’s the second parameter
- `old`: `‘Bobo’` because we dynamically assigned it using _computed property names_.
- `others`: `{ job: ‘Front-End Master’, age: 25 }` because we used _spread syntax_ to dynamically assign it. (Check out [my _spread_ article](https://medium.com/@yazeedb/how-do-object-assign-and-spread-actually-work-169b53275cb)! 😁)

Now let’s focus on the `return` statement.

```js
return {
  [newProp]: old,
  ...others
};
```

_Computed property names_ are being leveraged once again. We dynamically create a new object and set its `firstName` to `old`. It’s like writing

```js
// remember,
// old = 'Bobo'
// newProp = 'firstName'

newBobo = {};

newBobo[newProp] = old;
// OR
newBobo.firstName = old;
```

Finally, we merge `others` with the new object. If you’re familiar with `Object.assign`, it’s just like writing

```js
return Object.assign({}, newBobo, others);
```

Now `bobo` has a `firstName`!

![](https://cdn-images-1.medium.com/max/1600/1*Ftqqv5tRbcZvtxRH1b64TQ.png)

And the original `bobo` is left unaffected.

![](https://cdn-images-1.medium.com/max/1600/1*xSwlwzpGHBSO-AR9QnOnGg.png)
