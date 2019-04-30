* * *

# What Is a Pure Function in JavaScript?



Pure functions are the atomic building blocks in functional programming. They are adored for their simplicity and testability.

This post covers a quick checklist to tell if a function’s pure or not.

![](https://cdn-images-1.medium.com/max/1600/0*a_yub2gTwY-1eK8j.png)

### The Checklist

A function must pass two tests to be considered “pure”:

1.  Same inputs _always_ return same outputs
2.  No side-effects

Let’s zoom in on each one.

### 1\. Same Input => Same Output

Compare this:

<pre name="48bb" id="48bb" class="graf graf--pre graf-after--p">const add = (x, y) => x + y;</pre>

<pre name="c333" id="c333" class="graf graf--pre graf-after--pre">add(2, 4); // 6</pre>

To this:

<pre name="d405" id="d405" class="graf graf--pre graf-after--p">let x = 2;</pre>

<pre name="9412" id="9412" class="graf graf--pre graf-after--pre">const add = (y) => {
  x += y;
};</pre>

<pre name="7392" id="7392" class="graf graf--pre graf-after--pre">add(4); // x === 6 (the first time)</pre>

#### Pure Functions = Consistent Results

The first example returns a value based on the given parameters, regardless of where/when you call it.

If you pass `2` and `4`, you’ll always get `6`.

Nothing else affects the output.

#### Impure Functions = Inconsistent Results

The second example returns nothing. It relies on **shared state** to do its job by incrementing a variable outside of its own scope.

This pattern is a developer’s nightmare fuel.

**Shared state** introduces a time dependency. You get different results depending on when you called the function. The first time results in `6`, next time is `10` and so on.

#### Which Version’s Easier to Reason About?

Which one’s less likely to breed bugs that happen only under certain conditions?

Which one’s more likely to succeed in a multi-threaded environment where time dependencies can break the system?

Definitely the first one.

### 2\. No Side-Effects

![](https://cdn-images-1.medium.com/max/1600/0*4rGYQyYm_m8Byoyj.png)

This test itself is a checklist. A few examples of side-effects are

1.  Mutating your input
2.  `console.log`
3.  HTTP calls (AJAX/fetch)
4.  Changing the filesystem (fs)
5.  Querying the DOM

Basically any work a function performs that isn’t related to calculating the final output.

I recommend watching this snippet by Uncle Bob Martin on the problem of state. It starts around 15 min.

<iframe data-width="854" data-height="480" width="700" height="393" src="/media/ccfc2347c0f6e5f9e05c5b34d3367846?postId=acb887375dfe" data-media-id="ccfc2347c0f6e5f9e05c5b34d3367846" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F7Zlp9rKHGD4%2Fhqdefault.jpg&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>

Here’s an impure function with a side-effect.

#### Not So Bad

<pre name="4c4d" id="4c4d" class="graf graf--pre graf-after--h4">const impureDouble = (x) => {
 **console.log('doubling', x);**</pre>

<pre name="c140" id="c140" class="graf graf--pre graf-after--pre">  return x * 2;
};</pre>

<pre name="d17e" id="d17e" class="graf graf--pre graf-after--pre">const result = impureDouble(4);</pre>

<pre name="6c11" id="6c11" class="graf graf--pre graf-after--pre">console.log({ result });</pre>

`console.log` is the side-effect here but, in all practicality, it won’t harm us. We’ll still get the same outputs, given the same inputs.

_This_, however, may cause a problem.

#### “Impurely” Changing an Object

<pre name="7f82" id="7f82" class="graf graf--pre graf-after--h4">const impureAssoc = (key, value, object) => {
  object[key] = value;
};</pre>

<pre name="7e2b" id="7e2b" class="graf graf--pre graf-after--pre">const person = {
  name: 'Bobo'
};</pre>

<pre name="7cd5" id="7cd5" class="graf graf--pre graf-after--pre">const result = impureAssoc('shoeSize', 400, person);</pre>

<pre name="fac9" id="fac9" class="graf graf--pre graf-after--pre">console.log({
  person,
  result
});</pre>

The variable, `person`, has been forever changed because our function introduced an assignment statement.

Shared state means `impureAssoc`'s impact isn’t fully obvious anymore. Understanding its effect on a system now involves tracking down every variable it’s ever touched and knowing their histories.

> Shared state = timing dependencies.

We can purify `impureAssoc` by simply returning a new object with our desired properties.

#### Purifying It Up

<pre name="6642" id="6642" class="graf graf--pre graf-after--h4">const pureAssoc = (key, value, object) => ({
  ...object,
  [key]: value
});</pre>

<pre name="954a" id="954a" class="graf graf--pre graf-after--pre">const person = {
  name: 'Bobo'
};</pre>

<pre name="f401" id="f401" class="graf graf--pre graf-after--pre">const result = pureAssoc('shoeSize', 400, person);</pre>

<pre name="a4f0" id="a4f0" class="graf graf--pre graf-after--pre">console.log({
  person,
  result
});</pre>

Now `pureAssoc` returns a testable result and we’ll never worry if it quietly mutated something elsewhere.

You could even do the following and remain pure:

#### Another Pure Way

<pre name="89ea" id="89ea" class="graf graf--pre graf-after--h4">const pureAssoc = (key, value, object) => {
 **const newObject = { ...object };**</pre>

<pre name="748d" id="748d" class="graf graf--pre graf-after--pre">  newObject[key] = value;</pre>

<pre name="7251" id="7251" class="graf graf--pre graf-after--pre">  return newObject;
};</pre>

<pre name="3f45" id="3f45" class="graf graf--pre graf-after--pre">const person = {
  name: 'Bobo'
};</pre>

<pre name="8181" id="8181" class="graf graf--pre graf-after--pre">const result = pureAssoc('shoeSize', 400, person);</pre>

<pre name="cb86" id="cb86" class="graf graf--pre graf-after--pre">console.log({
  person,
  result
});</pre>

Mutating your input can be dangerous, but mutating a copy of it is no problem. Our end result is still a testable, predictable function that works no matter where/when you call it.

The mutation’s limited to that small scope and you’re still returning a value.

### Deep-Cloning Objects

Heads up! Using the spread operator `...` creates a _shallow_ copy of an object. Shallow copies aren’t safe from nested mutations.

Thank you [Rodrigo Fernández Díaz](https://medium.com/@rodrigo_98972) for bringing this to my attention!

#### Unsafe Nested Mutation

<pre name="6a47" id="6a47" class="graf graf--pre graf-after--h4">const person = {
  name: 'Bobo',
  address: { street: 'Main Street', number: 123 }
}</pre>

<pre name="ae4e" id="ae4e" class="graf graf--pre graf-after--pre">const shallowPersonClone = { ...person };</pre>

<pre name="163d" id="163d" class="graf graf--pre graf-after--pre">**shallowPersonClone.address.number = 456;**</pre>

<pre name="ef2e" id="ef2e" class="graf graf--pre graf-after--pre">console.log({ person, shallowPersonClone });</pre>

![](https://cdn-images-1.medium.com/max/1600/1*SQ9xC_YZWBtp6B0wzNojuA.png)

Both `person` and `shallowPersonClone` were mutated because their children share the same reference!

#### Safe Nested Mutation

To safely mutate nested properties, we need a _deep_ clone.

<pre name="cf92" id="cf92" class="graf graf--pre graf-after--p">const person = {
  name: 'Bobo',
  address: { street: 'Main Street', number: 123 }
}</pre>

<pre name="1ff4" id="1ff4" class="graf graf--pre graf-after--pre">**const deepPersonClone = JSON.parse(JSON.stringify(person));**</pre>

<pre name="f491" id="f491" class="graf graf--pre graf-after--pre">**deepPersonClone.address.number = 456;**</pre>

<pre name="8a40" id="8a40" class="graf graf--pre graf-after--pre">console.log({ person, deepPersonClone });</pre>

![](https://cdn-images-1.medium.com/max/1600/1*jHvmu2WnepV_UbhIQw-9vQ.png)

Now you’re guaranteed safety because they’re truly two separate entities!

### Summary

![](https://cdn-images-1.medium.com/max/1600/0*_FwSya9ut_O6gmfe.png)

*   A function’s pure if it’s free from side-effects and returns the same output, given the same input.
*   Side-effects include: mutating input, HTTP calls, writing to disk, printing to the screen.
*   You can safely _clone_, _then_ _mutate_, your input. Just leave the original one untouched.
*   Spread syntax (`…` syntax) is the easiest way to _shallowly_ clone objects.
*   `JSON.parse(JSON.stringify(object))` is the easiest way to _deeply_ clone objects. Thanks again [Rodrigo Fernández Díaz](https://medium.com/@rodrigo_98972)!

### My Free Course

This tutorial was from **my** **completely free** **course** on Educative.io, [Functional Programming Patterns With RamdaJS](https://www.educative.io/collection/5070627052453888/5738600293466112?authorName=Yazeed%20Bzadough)!

Please consider taking/sharing it if you enjoyed this content.

It’s full of lessons, graphics, exercises, and runnable code samples to teach you a basic functional programming style using RamdaJS.

[I’m also on Twitter](https://twitter.com/yazeedBee) if you’d like to talk. Until next time!

Take care,
Yazeed Bzadough
[http://yazeedb.com/](http://yazeedb.com/)