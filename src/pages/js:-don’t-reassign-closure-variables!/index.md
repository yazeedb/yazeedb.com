* * *

# JS: Don’t Reassign Closure Variables!

![](https://cdn-images-1.medium.com/max/1600/1*ziaoudVG48VIFLJJasu6XA.jpeg)Photo by [Bastien Hervé](https://unsplash.com/photos/1Cz9S1LNFBE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/change?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I had a serious “gotcha” moment while writing a GraphQL article and felt completely lost.

Consider this code:

<pre name="3c5c" id="3c5c" class="graf graf--pre graf-after--p">always = (value) => () => value;</pre>

<pre name="9579" id="9579" class="graf graf--pre graf-after--pre">give10 = always(10);
give10(); // 10</pre>

`always` takes a `value` and returns a function that _always_ returns `value`. Simple, right?

This is only possible because JavaScript allows functions to share their variable scope with any functions they return. So even though `always` executed, `value` isn’t garbage-collected because the returned function, `give10`, is referencing it as a closure variable.

This works with objects/arrays too:

<pre name="c4a6" id="c4a6" class="graf graf--pre graf-after--p">nums = [1, 2, 3];</pre>

<pre name="2534" id="2534" class="graf graf--pre graf-after--pre">giveNums = always(nums);
giveNums(); // [1, 2, 3]</pre>

You can even mutate `nums` down the road and be just fine:

<pre name="b05f" id="b05f" class="graf graf--pre graf-after--p">nums.pop();
giveNums(); // [1, 2]</pre>

#### But things get weird when you reassign it…

<pre name="56bb" id="56bb" class="graf graf--pre graf-after--h4">nums = [4, 5, 6];
giveNums(); // [1, 2]</pre>

> Reassigning a variable doesn’t change it across closures.

> (╯°□°）╯︵ ┻━┻

You might reassign a variable being used in hundreds of closure scopes and get tons of errors (silent ones, if you’re unlucky), and you’ll have no idea why.

We all knew this applies to primitives (numbers, strings, booleans), because they are passed _by value_. They’re copied and stored in a new memory address.

<pre name="e65c" id="e65c" class="graf graf--pre graf-after--p">myNum = 10;
getMyNum = always(myNum);</pre>

<pre name="1484" id="1484" class="graf graf--pre graf-after--pre">++myNum; // 11
getMyNum(); // 10</pre>

Arrays and objects aren’t copied, however, they’re passed _by reference_. So the function’s just told, “Hey, `myNum` is at this address, go get it.”

**But reassigning a variable _creates a new reference, no matter what_**.

Consider this code:

<pre name="8541" id="8541" class="graf graf--pre graf-after--p">bobo = { name: 'Bobo' };
getBobo = always(bobo);</pre>

<pre name="817c" id="817c" class="graf graf--pre graf-after--pre">bobo === getBobo(); // true</pre>

That returns `true` because `getBobo` references `bobo`'s address.

Mutating `bobo` doesn’t affect that relationship:

<pre name="6c24" id="6c24" class="graf graf--pre graf-after--p">bobo.name = 'Mutant-Bobo';
bobo === getBobo(); // true</pre>

But reassigning `bobo` stores him somewhere else, leaving our closures hanging.

<pre name="fb2b" id="fb2b" class="graf graf--pre graf-after--p">bobo = { name: 'New-Bobo' };
getBobo(); // { name: 'Mutant-Bobo' }</pre>

Old `bobo`'s still in memory, but he’s only accessible through `getBobo`’s closure, because no one else is referencing him.

This is all based on my own testing, and I’m further researching this enlightening “gotcha”. If anything’s missing/incorrect, please leave a comment! ❤️

Be careful, my friends. Until next time!

Take care,
Yazeed Bzadough