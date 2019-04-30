* * *

# 30 Seconds of Code: Conditionally Change Values with when()

![](https://cdn-images-1.medium.com/max/1600/1*Ye9GrpJqOsiaZPbMeZkpGQ.png)

30 Seconds of Code is a brilliant collection of JavaScript snippets, digestible in ≤ 30 seconds. **Anyone looking to master JavaScript should go through the entire thing.**

Inspired by [Ramda](http://ramdajs.com/docs/#when), I contributed `when()` to 30secondsofcode’s [official GitHub repo](https://github.com/Chalarangelo/30-seconds-of-code/pull/652). This is one my favorite functions.

`when()` takes 3 parameters:

1.  `pred`: A predicate function (must return `true` or `false`)
2.  `whenTrue`: A function to run if `pred` returns `true`.
3.  A value: `x`.

Here’s the most basic implementation:

<pre name="6a00" id="6a00" class="graf graf--pre graf-after--p">when = (pred, whenTrue, x) => {
    if (pred(x)) {
        return whenTrue(x);
    } else {
        return x;
    }
}</pre>

Which you can shorten to:

<pre name="0499" id="0499" class="graf graf--pre graf-after--p">when = (pred, whenTrue, x) => pred(x) ? whenTrue(x) : x;</pre>

Let’s say we want to triple even numbers

<pre name="8faf" id="8faf" class="graf graf--pre graf-after--p">when(
    (x) => x % 2 === 0,
    (x) => x * 3,
    2
);</pre>

<pre name="403f" id="403f" class="graf graf--pre graf-after--pre">// 6</pre>

We got `6` because `2` is an even number. What if we pass `11`?

<pre name="7fed" id="7fed" class="graf graf--pre graf-after--p">when(
    (x) => x % 2 === 0,
    (x) => x * 3,
    11
);</pre>

<pre name="7942" id="7942" class="graf graf--pre graf-after--pre">// 11</pre>

### A Step Further

`when` currently needs all 3 parameters at once–what if we could supply just the first 2, and give `x` later on?

<pre name="c671" id="c671" class="graf graf--pre graf-after--p">when = (pred, whenTrue) => (x) => pred(x) ? whenTrue(x) : x;</pre>

This version’s what I submitted to [30secondsofcode.org](https://30secondsofcode.org/function#when). Now our code’s more flexible.

<pre name="ea63" id="ea63" class="graf graf--pre graf-after--p">tripleEvenNums = when(
    (x) => x % 2 === 0,
    (x) => x * 3
);</pre>

<pre name="1c4d" id="1c4d" class="graf graf--pre graf-after--pre">tripleEvenNums(20); // 60
tripleEvenNums(21); // 21
tripleEvenNums(22); // 66</pre>

### Even Further Beyond

We can pass `x` later because `when(pred, whenTrue)` returns a function expecting `x`. What if we curry `when()`?

If you’re new to currying see [my article](https://medium.com/front-end-hacking/how-does-javascripts-curry-actually-work-8d5a6f891499) on it.

A curried function doesn’t need all its parameters at once. You can supply some and get a function that takes the rest, allowing for powerful patterns.

#### A Silly Example

Imagine we have two lists of people, both contain a guy named `Bobo`.

`Bobo` wants a nickname for each list.

*   If we find `Bobo` in list 1, change his name to `B Money`.
*   If we find `Bobo` in list 2, change his name to `Bo-bob`.

Currying `when` allows us to easily write a function for each concern.

If you’re following along, here’s a `curry` function from [30secondsofcode.org](https://30secondsofcode.org/function#curry).

<pre name="0a24" id="0a24" class="graf graf--pre graf-after--p">curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);</pre>

We’ll need a predicate to find `Bobo`.

<pre name="d543" id="d543" class="graf graf--pre graf-after--p">isBobo = (person) => person.name === 'Bobo';</pre>

To keep our functions pure, we’ll need a way to _immutably_ change a person’s name.

<pre name="ad87" id="ad87" class="graf graf--pre graf-after--p">changeName = (newName, obj) => ({
    ...obj,
    name: newName
});</pre>

Let’s also curry it so we can supply just `newName`.

<pre name="a38a" id="a38a" class="graf graf--pre graf-after--p">changeName = curry((newName, obj) => ({
    ...obj,
    name: newName
}));</pre>

Here’s our lists.

<pre name="22b1" id="22b1" class="graf graf--pre graf-after--p">list1 = [{
    name: 'Bobo',
    id: 1,
    iq: 9001
}, {
    name: 'Jaime',
    id: 2,
    iq: 9000
}, {
    name: 'Derek',
    id: 3,
    iq: 8999
}];</pre>

<pre name="9608" id="9608" class="graf graf--pre graf-after--pre">list2 = [{
    name: 'Sam',
    id: 1,
    iq: 600
}, {
    name: 'Bobo',
    id: 2,
    iq: 9001
}, {
    name: 'Peter',
    id: 3,
    iq: 8
}];</pre>

Let’s map over `list1`.

<pre name="d20e" id="d20e" class="graf graf--pre graf-after--p">doIfBobo = when(isBobo);
renameToBMoney = changeName('B Money');</pre>

<pre name="3a24" id="3a24" class="graf graf--pre graf-after--pre">list1.map(doIfBobo(renameToBMoney));</pre>

Our result:

<pre name="c5f9" id="c5f9" class="graf graf--pre graf-after--p">[{
  **"name": "B Money",
  "id": 1,
  "iq": 9001**
},
 {
   "name": "Jaime",
   "id": 2,
   "iq": 9000
 },
 {
   "name": "Derek",
   "id": 3,
   "iq": 8999
 }
];</pre>

Because of `when`, we only changed `Bobo` and ignored everyone else!

Now map over `list2`.

<pre name="28a7" id="28a7" class="graf graf--pre graf-after--p">renameToBoBob = changeName('Bo-bob');</pre>

<pre name="3bb7" id="3bb7" class="graf graf--pre graf-after--pre">list2.map(doIfBobo(renameToBoBob));</pre>

Our result:

<pre name="bce5" id="bce5" class="graf graf--pre graf-after--p">[{
  "name": "Sam",
  "id": 1,
  "iq": 600
},
 {
 **"name": "Bo-bob",
   "id": 2,
   "iq": 9001**
 },
 {
   "name": "Peter",
   "id": 3,
   "iq": 8
 }
];</pre>

Looks good to me! We gave `Bobo` his nicknames without affecting anyone else.

If you’re further interested, consider these links:

*   [30secondsofcode.org’s collection](https://30secondsofcode.org/array)
*   [My article on currying](https://medium.com/front-end-hacking/how-does-javascripts-curry-actually-work-8d5a6f891499)
*   [Ramda](http://ramdajs.com/docs/)

Until next time!

Take care,
Yazeed Bzadough