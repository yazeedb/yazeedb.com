* * *

# A quick introduction to pipe() and compose() in JavaScript



Functional programming’s been quite the eye-opening journey for me. This post, and posts like it, are an attempt to share my insights and perspectives as I trek new functional programming lands.

[Ramda’s](http://ramdajs.com/) been my go-to FP library because of how much easier it makes functional programming in JavaScript. I highly recommend it.

![](https://cdn-images-1.medium.com/max/1600/1*FKEc-DbmFn54VPLQmCOLRA.jpeg)Composing blocks to form a structure. Pretty deep stuff…

### Pipe

The concept of `pipe` is simple — it combines `n` functions. It’s a pipe flowing left-to-right, calling each function with the output of the last one.

Let’s write a function that returns someone’s `name`.

<pre name="42c1" id="42c1" class="graf graf--pre graf-after--p">getName = (person) => person.name</pre>

<pre name="1ffe" id="1ffe" class="graf graf--pre graf-after--pre">getName({ name: 'Buckethead' })
// 'Buckethead'</pre>

Let’s write a function that uppercases strings.

<pre name="7ad8" id="7ad8" class="graf graf--pre graf-after--p">uppercase = (string) => string.toUpperCase()</pre>

<pre name="e890" id="e890" class="graf graf--pre graf-after--pre">uppercase('Buckethead')
// 'BUCKETHEAD'</pre>

So if we wanted to get and capitalize `person`'s name, we could do this:

<pre name="61fa" id="61fa" class="graf graf--pre graf-after--p">name = getName({ name: 'Buckethead' })
uppercase(name)</pre>

<pre name="1db2" id="1db2" class="graf graf--pre graf-after--pre">// 'BUCKETHEAD'</pre>

That’s fine but let’s eliminate that intermediate variable `name`.

<pre name="3a51" id="3a51" class="graf graf--pre graf-after--p">uppercase(getName({ name: 'Buckethead' }))</pre>

Better, but I’m not fond of that nesting. It can get too crowded. What if we want to add a function that gets the first 6 characters of a string?

<pre name="320a" id="320a" class="graf graf--pre graf-after--p">get6Characters = (string) => string.substring(0, 6)</pre>

<pre name="b360" id="b360" class="graf graf--pre graf-after--pre">get6Characters('Buckethead')
// 'Bucket'</pre>

Resulting in:

<pre name="fac3" id="fac3" class="graf graf--pre graf-after--p">get6Characters(uppercase(getName({ name: 'Buckethead' })))</pre>

<pre name="02fd" id="02fd" class="graf graf--pre graf-after--pre">'BUCKET'</pre>

Let’s get really crazy and add a function to reverse strings.

<pre name="17f0" id="17f0" class="graf graf--pre graf-after--p">reverse = (string) => string
  .split('')
  .reverse()
  .join('')</pre>

<pre name="4c22" id="4c22" class="graf graf--pre graf-after--pre">reverse('Buckethead')
// 'daehtekcuB'</pre>

Now we have:

<pre name="ba9a" id="ba9a" class="graf graf--pre graf-after--p">reverse(get6Characters(uppercase(getName({ name: 'Buckethead' }))))</pre>

<pre name="68c8" id="68c8" class="graf graf--pre graf-after--pre">// 'TEKCUB'</pre>

It can get a bit…much.

### Pipe to the rescue!

Instead of jamming functions within functions or creating a bunch of intermediate variables, let’s `pipe` all the things!

<pre name="ba84" id="ba84" class="graf graf--pre graf-after--p">pipe(
  getName,
  uppercase,
  get6Characters,
  reverse 
)({ name: 'Buckethead' })</pre>

<pre name="29c9" id="29c9" class="graf graf--pre graf-after--pre">// 'TEKCUB'</pre>

Pure art. It’s like a todo list!

Let’s step through it.

For demo purposes, I’ll use a `pipe` implementation from one of [Eric Elliott](https://medium.com/@_ericelliott)’s [functional programming articles](https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d).

<pre name="e637" id="e637" class="graf graf--pre graf-after--p">pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)</pre>

I love this little one-liner.

Using _rest_ parameters, [see my article on that](https://medium.com/@yazeedb/how-do-javascript-rest-parameters-actually-work-227726e16cc8), we can pipe `n` functions. Each function takes the output of the previous one and it’s all _reduced_ 👏 to a single value.

And you can use it just like we did above.

<pre name="a001" id="a001" class="graf graf--pre graf-after--p">pipe(
  getName,
  uppercase,
  get6Characters,
  reverse 
)({ name: 'Buckethead' })</pre>

<pre name="9140" id="9140" class="graf graf--pre graf-after--pre">// 'TEKCUB'</pre>

I’ll expand `pipe` and add some debugger statements, and we’ll go line by line.

<pre name="2842" id="2842" class="graf graf--pre graf-after--p">pipe = (...functions) => (value) => {
  debugger;</pre>

<pre name="92d4" id="92d4" class="graf graf--pre graf-after--pre">  return functions
    .reduce((currentValue, currentFunction) => {
       debugger;</pre>

<pre name="ac41" id="ac41" class="graf graf--pre graf-after--pre">       return currentFunction(currentValue);
    }, value)
}</pre>

![](https://cdn-images-1.medium.com/max/1600/1*jqrKgVeO-raAUJjuN-adug.png)

Call `pipe` with our example and let the wonders unfold.

![](https://cdn-images-1.medium.com/max/1600/1*rqi22p06rTtc2m0k1yHrRw.png)

Check out the local variables. `functions` is an array of the 4 functions, and `value` is `{ name: 'Buckethead' }`.

Since we used _rest_ parameters (again, see [my article](https://medium.com/@yazeedb/how-do-javascript-rest-parameters-actually-work-227726e16cc8) 😁), `pipe` allows any number of functions to be used. It’ll just loop and call each one.

![](https://cdn-images-1.medium.com/max/1600/1*UjM5plW8s--8chfQQg3cMg.png)

On the next debugger, we’re inside `reduce`. This is where `currentValue` is passed to `currentFunction` and returned.

We see the result is `'Buckethead'` because `currentFunction` returns the `.name` property of any object. That will be returned in `reduce`, meaning it becomes the new `currentValue` next time. Let’s hit the next debugger and see.

![](https://cdn-images-1.medium.com/max/1600/1*sEcE5tBFSpCzJZrKz8mmEQ.png)

Now `currentValue` is `‘Buckethead’` because that’s what got returned last time. `currentFunction` is `uppercase`, so `'BUCKETHEAD'` will be the next `currentValue`.

![](https://cdn-images-1.medium.com/max/1600/1*Va6taGFU8dSyhz1wLVMWMQ.png)

The same idea, pluck `‘BUCKETHEAD’`'s first 6 characters and hand them off to the next function.

![](https://cdn-images-1.medium.com/max/1600/1*YaI1oxsZW5qZZUC146DYoQ.png)

`reverse(‘.aedi emaS’)`

![](https://cdn-images-1.medium.com/max/1600/1*moIMQxr82r2Z8IuXwuZfKQ.png)

And you’re done!

### What about compose()?

It’s just `pipe` in the other direction.

So if you wanted the same result as our `pipe` above, you’d do the opposite.

<pre name="f81a" id="f81a" class="graf graf--pre graf-after--p">compose(
  reverse,
  get6Characters,
  uppercase,
  getName,
)({ name: 'Buckethead' })</pre>

Notice how `getName` is last in the chain and `reverse` is first?

Here’s a quick implementation of `compose`, again courtesy of the Magical [Eric Elliott](https://medium.com/@_ericelliott), from [the same article](https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d).

<pre name="a698" id="a698" class="graf graf--pre graf-after--p">compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);</pre>

I’ll leave expanding this function with `debugger`s as an exercise to you. Play around with it, use it, appreciate it. And most importantly, have fun!

Until next time!

Take care,
Yazeed Bzadough