---
title: 'A Walkthrough of the FreeCodeCamp Palindrome Checker Project'
date: '2019-09-10'
description: 'Project 1 from JavaScript Algos and DS.'
draft: false
template: 'post'
slug: '/posts/freecodecamp-palindrome-checker-walkthrough'
category: 'JavaScript'
coverImageUrl: '/media/imgs-palindrome-walkthrough/cover-image.png'
tags:
  - 'JavaScript'
  - 'FreeCodeCamp'
  - 'Algorithms'
  - 'Data Structures'
  - 'Coding Interviews'
---

## Project 1 from JavaScript Algos and DS Certification.

This is the blog version of my walkthrough. If you prefer video [here is the YouTube video link](https://youtu.be/XV5OCibNpLI).

<iframe width="560" height="315" src="https://www.youtube.com/embed/XV5OCibNpLI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The Challenge

![project-1-intro-screenshot](/media/imgs-palindrome-walkthrough/project-1-intro-screenshot.png)

Write a function called `palindrome` that takes a string, `str`. If `str` is a palindrome, return `true`, otherwise return `false`.

## What Is a Palindrome?

A palindrome is a word that reads the same forwards and backwards. Some examples are

- Eye
- Racecar
- A Man, A Plan, A Canal – Panama!

Whether you read these left-to-right or right-to-left, you get the same sequence of characters. **We’ll be ignoring punctuation like commas, periods, question marks, exclamation points, and casing.**

## Step 0 - Step Away from the Code

I like keeping this mind during any interview or problem I have to solve at work. Rushing into the code first is usually a losing strategy, because now you have to consider syntax while trying to solve the problem in your head.

> Code should come last

Don't let your nerves get the better of you. Instead of frantically hacking at a solution and elevating your blood pressure, take a deep breath and try to write it out on a whiteboard or in a notebook.

Once you've thought out a solution, the code comes easy. All the hard work happens in your mind and notes, not on the keyboard.

## Step 1 - Equalize All Casing

A palindrome is valid whether or not its casing reads the same forwards or backwards. So "Racecar" is valid even though it's technically spelt "racecaR" backwards.

To safeguard us against any casing issues, I'll add a comment saying we'll lowercase everything.

Here's my code so far (notice I wrote no real code yet).

```js
function palindrome(str) {
  // 1) Lowercase the input
}

palindrome('eye');
```

## Step 2 - Strip Non-Alphanumeric Characters

Just like the casing scenario, a palindrome is valid even if the punctuation and spaces aren't consistent back and forth.

For example "A Man, A Plan, A Canal – Panama!" is valid because we examine it without any marks or spaces. If you do that and lowercase everything, it becomes this.

```js
'A Man, A Plan, A Canal – Panama!';

// lowercase everything
// strip out non-alphanumeric characters

'amanaplanacanalpanama';
```

Which reads the same forwards and backwards.

### What does alphanumeric mean?

It means "letters and numbers", so anything from a-z and 0-9 is an alphanumeric character. In order to properly examine our input non-alphanumeric characters (spaces, punctuation, etc) must go.

Here's our updated pseudocode.

```js
function palindrome(str) {
  // 1) Lowercase the input
  // 2) Strip out non-alphanumeric characters
}

palindrome('eye');
```

## Step 3 - Compare String to Its Reverse

Once our string's properly cleaned up, we can flip it around and see if it reads the same.

I'm thinking a comparison along these lines

```js
return string === reversedString;
```

I'm using triple equals (`===`) for comparison in JavaScript. If the two strings are identical, it's a palindrome and we return `true`! If not we return `false`.

Here's our updated pseudocode.

```js
function palindrome(str) {
  // 1) Lowercase the input
  // 2) Strip out non-alphanumeric characters
  // 3) return string === reversedString
}

palindrome('eye');
```

## Executing Step 1 - Lowercase

This is the easiest step. If you are unsure how to lowercase something in JavaScript, a quick Google search should lead to the `toLowerCase` method.

This is a method available on all string, so we can use it to lowercase our input before doing anything else.

I'll store the lowercase version in a variable called `alphanumericOnly` because we're eventually going to remove alphanumeric characters too.

```js
function palindrome(str) {
  // 1) Lowercase the input
  const alphanumericOnly = str.toLowerCase();

  // 2) Strip out non-alphanumeric characters
  // 3) return string === reversedString
}

palindrome('eye');
```

## Executing Step 2 - Alphanumeric Only

We'll have to dive a bit deeper here, as this is the toughest step. How exactly are we going to purify a string of its non-alphanumeric characters?

### The .match method

Just like `toLowerCase` all strings support a method called `match`. It takes a parameter indicating what character(s) you'd like to look for in a given string.

Let's use my name as an example.

```js
myName = 'yazeed';

myName.match('e');
// ["e", index: 3, input: "yazeed", groups: undefined]
```

As you can see `.match` returns an array with some information. The part we care about is the first element, `'e'`. That's the match we found in the string `'yazeed'`.

But my name has two e's! How do we match the other one?

### Regular Expressions (Regex)

The `.match` method's first parameter can instead be a _regular expression_.

> Regular Expression - A sequence of characters that define a search pattern. Also known as "Regex".

Instead of quotation marks for a string, put your parameter between forward slashes.

```js
myName = 'yazeed';

myName.match(/e/);
// ["e", index: 3, input: "yazeed", groups: undefined]
```

We get the same result so who cares? Well check this out, regex allows us to add _flags_.

> Regex Flag - An indicator that tells Regex to do something special.

```js
myName = 'yazeed';

myName.match(/e/g);
// ^^ Notice the little g now ^^
// ["e", "e"]
```

We got back all the e's! If you try an a or z, you get an array of just one match. Makes sense.

```js
myName.match(/a/g);
// ["a"]

myName.match(/z/g);
// ["z"]
```

### Finding all alphanumeric characters

So regex not only matches patterns, but it can match _many_ of the same kind of pattern! This sounds perfect for our algorithm's next step.

If you Google a bit, this may be the regex you find for matching all alphanumeric characters.

```js
/[a-z0-9]/g;
```

You're looking at the definition of _alphanumeric_. This regex can be broken into 3 parts.

1. A character set `[]` - match any character between these brackets. ![character-sets](/media/imgs-palindrome-walkthrough/character-sets.png)
2. `a-z` - match all lowercase letters ![a-z](/media/imgs-palindrome-walkthrough/a-z.png)
3. `0-9` - match all numbers ![0-9](/media/imgs-palindrome-walkthrough/0-9.png)

Running it on `myName` returns an array of every letter.

```js
myName = 'yazeed';

myName.match(/[a-z0-9]/g);
// ["y", "a", "z", "e", "e", "d"]
```

Let's try it with one of the project's test cases. How about this crazy one they expect to be a palindrome?

```js
crazyInput = '0_0 (: /- :) 0-0';

crazyInput.match(/[a-z0-9]/g);
// ["0", "0", "0", "0"]
```

Wow without the crazy characters it's just four zeroes. Yep that's a palindrome! I'll update our code.

```js
function palindrome(str) {
  const alphanumericOnly = str
    // 1) Lowercase the input
    .toLowerCase()
    // 2) Strip out non-alphanumeric characters
    .match(/[a-z0-9]/g);

  // 3) return string === reversedString
}

palindrome('eye');
```

## Executing Step 3 - Compare String to Its Reverse

Remember that `.match` returns an _array_ of matches. How can we use that array to compare our cleaned up string to its reversed self?

### Array.reverse

The `reverse` method, true to its name, reverses an array's elements.

```js
[1, 2, 3].reverse();
// [3, 2, 1]
```

This looks pretty useful! After matching all alphanumeric characters, we can flip that array and see if everything still lines up.

But comparing arrays isn't as straightforward as comparing strings, so how can we turn that array of matches back into a string?

### Array.join

The `join` method stitches your array's elements together into a string, optionally taking a _separator_.

The separator is the first parameter, you don't need to supply it. It'll basically "stringify" your array.

```js
[1, 2, 3].join();
// "1,2,3"
```

If you do supply it, the separator goes in between each element.

```js
[1, 2, 3].join('my separator');
// "1my separator2my separator3"

[1, 2, 3].join(',');
// "1,2,3"

[1, 2, 3].join(', ');
// "1, 2, 3"

[1, 2, 3].join('sandwich');
// "1sandwich2sandwich3"
```

Let's see how this would fit into our algorithm.

```js
'Ra_Ce_Ca_r   -_-'
  .toLowerCase()
  .match(/[a-z0-9]/g)
  .join('');

// "racecar"
```

See how doing all that simply recreates the original string without punctuation or mixed casing?

What if we reverse it?

```js
'Ra_Ce_Ca_r   -_-'
  .toLowerCase()
  .match(/[a-z0-9]/g)
  // flip it around
  .reverse()
  .join('');

// "racecar"
```

That's a palindrome! My name would not be a palindrome.

```js
'yazeed'
  .toLowerCase()
  .match(/[a-z0-9]/g)
  // flip it around
  .reverse()
  .join('');

// "deezay"
```

Seems we have our solution. Let's see the final code.

## The Final Code

```js
function palindrome(str) {
  const alphanumericOnly = str
    // 1) Lowercase the input
    .toLowerCase()
    // 2) Strip out non-alphanumeric characters
    .match(/[a-z0-9]/g);

  // 3) return string === reversedString
  return alphanumericOnly.join('') === alphanumericOnly.reverse().join('');
}

palindrome('eye');
```

Input this and run the tests, and we're good!

![all-tests-passed](/media/imgs-palindrome-walkthrough/all-tests-passed.png)

## Summary

1. Lowercase input via `str.toLowerCase()`;
2. Match all alphanumeric characters using a regular expression via `str.match(/[a-z0-9]/g)`.
3. Use `Array.reverse` and `Array.join` on the alphanumeric matches to compare the original against its reversed self. If they're identical we get back `true`, otherwise we get back `false`!

## Thanks for reading

If you'd like a video with even more detail, [here's the YouTube version again](https://youtu.be/XV5OCibNpLI)!

<iframe width="560" height="315" src="https://www.youtube.com/embed/XV5OCibNpLI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com</a>. And please let me know what else you'd like to see! [My DMs are open on Twitter.](https://twitter.com/yazeedBee)

Until next time!
