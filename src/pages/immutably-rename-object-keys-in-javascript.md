---
title: Immutably Rename Object Keys in Javascript
date: '2018-01-27'
subtitle: 'Dynamically find bobo’s name'
---

![](https://cdn-images-1.medium.com/max/1600/1*LEDiErvPVtrnmf7lbwS2Cw.jpeg)

**Edit: See how to rename _many_ objectkeys**[**here**](https://medium.com/front-end-hacking/30-seconds-of-code-rename-many-object-keys-in-javascript-268f279c7bfa?source=linkShare-93124e8e38fc-1525786737).

If you’re okay with mutating data, renaming an object’s key is easy.

<pre name="6122" id="6122" class="graf graf--pre graf-after--p">obj = { name: 'Bobo' }
obj.somethingElse = obj.name
delete obj.name</pre>

If you don’t want to mutate your data, however, consider this function.

<pre name="739c" id="739c" class="graf graf--pre graf-after--p">renameProp = (
    oldProp,
    newProp,
{ [oldProp]: old, ...others }
) => ({
    [newProp]: old,
    ...others
})</pre>

What’s happening here:

- [Computed property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
- [Spread syntax](https://medium.com/@yazeedb/how-do-object-assign-and-spread-actually-work-169b53275cb)
- [Rest params](https://medium.com/@yazeedb/how-do-javascript-rest-parameters-actually-work-227726e16cc8)
- [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

Let’s add a `debugger` and inspect.

<pre name="64a3" id="64a3" class="graf graf--pre graf-after--p">renameProp = (
  oldProp,
  newProp,
  { [oldProp]: old, ...others }
) => {
  debugger;</pre>

<pre name="7034" id="7034" class="graf graf--pre graf-after--pre">  return {
    [newProp]: old,
    ...others
  };
};</pre>

Imagine we have an object, `bobo`.

<pre name="cd0e" id="cd0e" class="graf graf--pre graf-after--p">bobo = {
    name: 'Bobo',
    job: 'Front-End Master',
    age: 25
}</pre>

And we want to change `bobo`’s `name` to `firstName`, so we plug him into `renameProp`.

<pre name="f319" id="f319" class="graf graf--pre graf-after--p">renameProp('name', 'firstName', bobo)</pre>

![](https://cdn-images-1.medium.com/max/1600/1*K6i63VJ-KdBZFPsiosfJbg.png)

Our local variables are

- `oldProp`: the first parameter, `'name'`
- `newProp`: the second parameter, `'firstName'`
- `old`: A _computed property name_ based on `oldProp`. It’s `bobo.name`.
- `others`: All of `bobo`'s other properties

Let’s dive into line 4 of our code.

<pre name="d2d3" id="d2d3" class="graf graf--pre graf-after--p">{ [oldProp]: old, ...others }</pre>

<iframe data-width="800" data-height="400" width="700" height="350" src="/media/18214d8333adbb5668f31791a3202b60?postId=5f6353c7b6dd" data-media-id="18214d8333adbb5668f31791a3202b60" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Fucarecdn.com%2F48210494-aaf4-4ea8-96ac-afa3aa561cc2%2F&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>

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

<pre name="37b8" id="37b8" class="graf graf--pre graf-after--p">getPropsWithout = (names, object) => Object.keys(object)
    .filter((key) => !names.includes(key))
    .reduce((newObject, currentKey) => ({
        ...newObject,
        [currentKey]: object[currentKey]
    }), {})</pre>

Don’t think about that function too much (unless you’re feeling adventurous! 😁). Just know that it takes an array of properties to exclude from a given object. We can use it like so:

<pre name="fe91" id="fe91" class="graf graf--pre graf-after--p">boboNoName = getPropsWithout(['name'], bobo)</pre>

Since we’re only omitting `name`, `boboNoName` is identical to our `others` variable that used _spread syntax_.

![](https://cdn-images-1.medium.com/max/1600/1*1JxTLQFIu5qCG7swWtfy5g.png)

See [my article on _spread_](https://medium.com/@yazeedb/how-do-object-assign-and-spread-actually-work-169b53275cb) if you’d like a deeper look!

#### Let’s recap!

Again, our local variables are

- `oldProp`: `‘name’` because it’s the first parameter
- `newProp`: `‘firstName’` because it’s the second parameter
- `old`: `‘Bobo’` because we dynamically assigned it using _computed property names_.
- `others`: `{ job: ‘Front-End Master’, age: 25 }` because we used _spread syntax_ to dynamically assign it. (Check out [my _spread_ article](https://medium.com/@yazeedb/how-do-object-assign-and-spread-actually-work-169b53275cb)! 😁)

Now let’s focus on the `return` statement.

<pre name="2b03" id="2b03" class="graf graf--pre graf-after--p">return {
    [newProp]: old,
    ...others
};</pre>

_Computed property names_ are being leveraged once again. We dynamically create a new object and set its `firstName` to `old`. It’s like writing

<pre name="2a19" id="2a19" class="graf graf--pre graf-after--p">// remember,
// old = 'Bobo'
// newProp = 'firstName'</pre>

<pre name="e8cb" id="e8cb" class="graf graf--pre graf-after--pre">newBobo = {}</pre>

<pre name="c478" id="c478" class="graf graf--pre graf-after--pre">newBobo[newProp] = old
// OR
newBobo.firstName = old</pre>

Finally, we merge `others` with the new object. If you’re familiar with `Object.assign`, it’s just like writing

<pre name="b3c1" id="b3c1" class="graf graf--pre graf-after--p">return Object.assign({}, newBobo, others)</pre>

Now `bobo` has a `firstName`!

![](https://cdn-images-1.medium.com/max/1600/1*Ftqqv5tRbcZvtxRH1b64TQ.png)

And the original `bobo` is left unaffected.

![](https://cdn-images-1.medium.com/max/1600/1*xSwlwzpGHBSO-AR9QnOnGg.png)

Fun fun, until next time!

Take care,
Yazeed Bzadough
