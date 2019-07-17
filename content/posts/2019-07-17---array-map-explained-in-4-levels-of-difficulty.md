---
title: Array.map Explained in 4 Levels of Difficulty
date: '2019-07-17'
description: 'From kid to functional programmer.'
draft: false
template: 'post'
slug: '/posts/array-map-explained-in-4-levels-of-difficulty'
category: 'JavaScript'
tags:
  - 'JavaScript'
  - 'JavaScript In-Depth'
  - 'Arrays'
  - 'Functional Programming'
---

`Array.map` might be JavaScript's most useful function. Forgoing it nowadays is like donning your toolbelt without a hammer.

To further appreciate `map` and deepen our understanding of it, let's see 4 levels of explanations in ascending complexity.

Tell me which ones you got and which ones surprised you!

## Table of Contents

1. <a href="#toafiveyearold">To a Five Year Old</a>
2. <a href="#toahighschoolcodingstudent">To a High School Coding Student</a>
3. <a href="#toareactdeveloper">To a React Developer</a>
4. <a href="#toafunctionalprogrammer">To a Functional Programmer</a>

## To a Five Year Old

Do you know DragonBall Z? Here are my favorite characters from the show!

#### Goku

<img src="/media/array-map-explained-in-5-levels/goku-saluting.png" alt="Goku saluting" />

#### Vegeta

![vegeta-standing-2](/media/array-map-explained-in-5-levels/vegeta-standing.png)

#### Trunks

![trunks-with-sword-1](/media/array-map-explained-in-5-levels/trunks-with-sword.png)

They're saiyans, and they're really strong!

I put them in this list–JavaScript calls them _arrays_. It lets you hold a bunch of things together:

```js
saiyans = [goku, vegeta, trunks];
```

And I have code that turns them into Super Saiyans, so they get 50x stronger (literally)! This code is called a _function_.

```js
turnSuperSaiyan = () => {
  /* use your imagination */
};
turnSuperSaiyan(goku);
```

![transforming-goku](/media/array-map-explained-in-5-levels/transforming-goku.png)

What if I want to transform all 3 of them? I have to run the function 3 times! Repeating things like that is boring 😞

```js
turnSuperSaiyan(goku);
turnSuperSaiyan(vegeta);
turnSuperSaiyan(trunks);
```

Luckily, programming lets you repeat things lots of times really easily! `Array.map` can turn them all into Super Saiyans at once!

Just plug `turnSuperSaiyan` in there and get back a _new array_ of Super Saiyan Goku, Vegeta, and Trunks.

```js
superSaiyans = saiyans.map(turnSuperSaiyan);
```

![mapping-saiyans](/media/array-map-explained-in-5-levels/mapping-saiyans.png)

## To a High School Coding Student

Hi!

So you've learned `for` loops. They're great for performing repetitive work, but I personally haven't needed one in years.

Don't get me wrong, I still love automating repetitive work. In fact, most applications involve repetitive work.

Think of these examples...

- Instagram
- Whatsapp
- Google search results
- Emails
- Contacts
- Text messages

If you boil them down to the core, these everyday apps are just fancy lists. Much of Front-End development is transforming these lists into something user-friendly.

Of course the big picture is more complex, but the core of most apps is manipulating lists!

In a JavaScript program, we represent lists as arrays.

All arrays carry a special method called `map`. It lets you transform an array into a new one based on some function you give it.

Here's some numbers.

```js
numbers = [1, 2, 3, 4, 5];
```

And a `double` function.

```js
double = (x) => x * 2;
```

Can you double each one using a `for` loop?

```js
doubledNumbers = [];

for (let i = 0; i < numbers.length; i++) {
  doubledNumbers.push(double(numbers[i]));
}

// [2, 4, 6, 8, 10]
```

Cool! Here's the same idea expressed with `map`.

```js
doubledNumbers = numbers.map(double);
// [2, 4, 6, 8, 10]
```

`map` constructs the loop under the hood, so you don't have to worry about typos or missing semicolons anymore!

![cant-forget-semis-if-you-forget-loops](/media/array-map-explained-in-5-levels/cant-forget-semis-if-you-forget-loops.jpeg)

And this goes beyond just numbers. Here's some users...

```js
users = [
  {
    name: 'Bruce Wayne',
    location: 'Gotham City',
    heroName: 'Batman'
  },
  {
    name: 'Barry Allen',
    location: 'Central City',
    heroName: 'The Flash'
  },
  {
    name: 'Clark Kent',
    location: 'Kryptonopolis',
    heroName: 'Superman'
  }
];
```

How would you create _a new array_ of every user's `name` and `heroName`? Probably using a `for` loop.

```js
userInfo = [];

for (let i = 0; i < users.length; i++) {
  userInfo.push({
    name: users[i].name,
    heroName: users[i].heroName
  });
}

// Result
[
  {
    name: 'Bruce Wayne',
    heroName: 'Batman'
  },
  {
    name: 'Barry Allen',
    heroName: 'The Flash'
  },
  {
    name: 'Clark Kent',
    heroName: 'Superman'
  }
];
```

Here's a loop-less version.

```js
userInfo = users.map((u) => ({
  name: u.name,
  heroName: u.heroName
}));

// Result
[
  {
    name: 'Bruce Wayne',
    heroName: 'Batman'
  },
  {
    name: 'Barry Allen',
    heroName: 'The Flash'
  },
  {
    name: 'Clark Kent',
    heroName: 'Superman'
  }
];
```

See how much easier that is? We can implement `map` like so:

```js
map = (fn, array) => {
  const results = [];

  for (let i = 0; i < array.length; i++) {
    results.push(fn(array[i]));
  }

  return results;
};
```

So for every element, call the given function and store it inside a new array!

## To a React Developer

Hi!

The Array prototype offers a method called `map`.

It will loop over your array, calling a given function on each item, and return a new array with those changes.

Instead of a `for` loop, just use `map` to get usernames and render the UI.

```jsx
const App = (users) => {
  return (
    <ul>
      <li>My name is {users.map((u) => u.name)}!</li>
    </ul>
  );
};
```

Yep you can method chain, since it returns the same type!

```jsx
const App = (users) => {
  return (
    <ul>
      {users
        .map((u) => u.name)
        .map((name) => (
          <li>My name is {name}!</li>
        ))}
    </ul>
  );
};
```

Tremendously useful. Most of your main components will probably use `map`.

## To a Functional Programmer

Map simply lifts a function `a -> b` into a context `F a -> F b`.

![functors](/media/array-map-explained-in-5-levels/functors.png)

JavaScript doesn't extend this expressibility beyond arrays, unfortunately...

![i-think-harold-gets-it](/media/array-map-explained-in-5-levels/i-think-harold-gets-it.jpg)

Thank you Brian Lonsdorf for [the wicked explanation](https://twitter.com/yazeedBee/status/1150108731759300608)!

And please let me know what else you'd like to see! [My DMs are open](https://twitter.com/yazeedBee) for questions, comments, and suggestions!
