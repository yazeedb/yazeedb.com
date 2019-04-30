* * *

# Go SUPER SAIYAN with RxJS Observables



I loved DragonBall Z as a kid, and still love it as an adult.

Among the ludicrous number of transformations, the original Super Saiyan remains my favorite.

![](https://cdn-images-1.medium.com/max/1600/0*qE2wxzg_yiFOIN-Q)Nothing quite like the original

I’m also loving RxJS the more I level up with it, so why not combine these two for the ultimate showdown?

### Let’s Go Super Saiyan

With four sprite sheets and a bit of HTML, CSS, and RxJS, we can recreate this legendary transformation!

![](https://cdn-images-1.medium.com/max/1600/1*qgex4ns9jPE_tpCy_OTfWA.gif)

This is what we’ll be making. Exciting, right?! 😁

### Setup

Everything’s on [my GitHub](https://github.com/yazeedb/dbz-rxjs).

<pre name="f461" id="f461" class="graf graf--pre graf-after--p">cd ./wherever-you-want
git clone [https://github.com/yazeedb/dbz-rxjs](https://github.com/yazeedb/dbz-rxjs)
cd dbz-rxjs</pre>

Open `index.html` in your favorite browser, and the project in your favorite text editor, and you’re ready to go!

No `npm install`s today 😉

And going forward, I’ll use the acronym “SSJ” instead of “Super Saiyan” for brevity.

### First Day of Training

![](https://cdn-images-1.medium.com/max/1600/1*FpxB4WdbNMmldqZDnpVp1g.png)

You’ll notice that Goku’s already moving. Since we’re focusing on RxJS, we’ll just skim the project’s starting point.

Here’s the main HTML:

<pre name="452e" id="452e" class="graf graf--pre graf-after--p"><div id="root">
    <div id="meter-container">
      <span>Hold any key to POWER UP!</span>
      <div id="meter"></div>
    </div></pre>

<pre name="3244" id="3244" class="graf graf--pre graf-after--pre"> **<div id="sprite" class="base"></div>** </div></pre>

The bottom `div` has `class="base"`, which corresponds to this CSS:

<pre name="4816" id="4816" class="graf graf--pre graf-after--p">.base, .ssj {
  width: 120px;
  height: 250px;
  animation: stand .8s steps(2) infinite;
}</pre>

<pre name="9cad" id="9cad" class="graf graf--pre graf-after--pre">.base {
  background-image: url('img/goku-standing-sheet.png');
}</pre>

This sets Goku’s width, height, and standing animation.

If you look at his base/ssj sprite sheets, it’s two different positions and we’re switching between them every 0.8 seconds.

![](https://cdn-images-1.medium.com/max/1600/1*Cy1fArcSxNJwGDc98YMHEA.png)![](https://cdn-images-1.medium.com/max/1600/1*mNVDs7NKfcfkA8l86IxOTA.png)

The switching’s handled towards the bottom of `style.css`:

<pre name="671b" id="671b" class="graf graf--pre graf-after--p">[@keyframes](http://twitter.com/keyframes "Twitter profile for @keyframes") stand {
  from { background-position: 0px; }
  to { background-position: -255px; }
}</pre>

Same thing for power up:

![](https://cdn-images-1.medium.com/max/1600/1*sSTHMTvkazP0BaZPubo4kg.png)![](https://cdn-images-1.medium.com/max/1600/1*xkI3tsGLGRpVoH2RjaFK9w.png)

<pre name="885f" id="885f" class="graf graf--pre graf-after--figure">[@keyframes](http://twitter.com/keyframes "Twitter profile for @keyframes") powerup {
  from { background-position: 0px; }
  to { background-position: -513px; }
}</pre>

We’ll cover the power up meter when we manipulate it.

### Mastering the DOM Elements

`index.html` already includes `RxJS@6.2.1` via CDN, so you’re covered.

In `app.js`, let’s capture the DOM elements we’re interested in:

<pre name="6523" id="6523" class="graf graf--pre graf-after--p">const sprite = document.querySelector('#sprite');
const meterContainer = document.querySelector('#meter-container');
const meter = document.querySelector('#meter');</pre>

I prefer to alias `document.querySelector` so using it doesn’t cause me wrist pain.

<pre name="cf92" id="cf92" class="graf graf--pre graf-after--p">**const $ = document.querySelector.bind(document);**
const sprite = $('#sprite');
const meterContainer = $('#meter-container');
const meter = $('#meter');</pre>

Next, we’ll create a `main` function and immediately call it.

<pre name="d4b3" id="d4b3" class="graf graf--pre graf-after--p">...</pre>

<pre name="03bb" id="03bb" class="graf graf--pre graf-after--pre">const main = () => {
  // do something
};</pre>

<pre name="edbc" id="edbc" class="graf graf--pre graf-after--pre">main();</pre>

### Powering Up

Here is `main`’s first code snippet:

<pre name="1614" id="1614" class="graf graf--pre graf-after--p">const main = () => {
  const { fromEvent } = rxjs;</pre>

<pre name="ccfc" id="ccfc" class="graf graf--pre graf-after--pre">  const begin = fromEvent(document, 'keydown');
  const end = fromEvent(document, 'keyup');
};</pre>

Goku should power up when a key is held down, and stop when that key is let go. We can use the `fromEvent` operator to create two observables:

*   `begin`: Notifies when the user presses a key **down**.
*   `end`: Notifies whenever the user **lets go** of a key.

Then we can **subscribe** to these emissions and act upon them. To get the power up animation, give `sprite` the `powerup` class name.

<pre name="9ca9" id="9ca9" class="graf graf--pre graf-after--p">begin.subscribe(() => {
  sprite.classList.add('powerup');
});</pre>

![](https://cdn-images-1.medium.com/max/1600/1*6-GLDooG9dTyGqNQ2XP0ww.png)

It works, but pressing a key causes him to power up forever…

We must also subscribe to the `end` observable, so we know when the key has been let go.

<pre name="8613" id="8613" class="graf graf--pre graf-after--p">end.subscribe(() => {
  sprite.classList.remove('powerup');
});</pre>

Now he powers up and down at your command.

### Building a Scouter

Any DBZ fan has seen a scouter, the little eyewear used to track power levels (until like episode 20…).

![](https://cdn-images-1.medium.com/max/1600/0*8H9CSUZbfDPxmdgR.png)Obligatory > 9000 joke

As Saiyans power up, their power level grows. Inconceivable, right?

We need a way to track Goku’s power level as he ascends, and trigger the SSJ transformation after say, 100 points.

We can start his power off at 1, and increase it while the user holds a key down.

#### RxJS Operators

Operators are where RxJS really shines. We can use pure functions to describe how data should transform through the stream.

When the user holds a key down, let’s transform those emissions into a number that increases over time.

#### Scan operator

`[scan](https://www.learnrxjs.io/operators/transformation/scan.html)` is perfect for this. It’s like `Array.reduce`, but it emits **as it’s reducing**.

For example, if you have an array of numbers:

<pre name="b4b1" id="b4b1" class="graf graf--pre graf-after--p">nums = [1, 2, 3, 4, 5];</pre>

And wish to add them up, `reduce` is a great choice.

<pre name="c961" id="c961" class="graf graf--pre graf-after--p">nums.reduce((a, b) => a + b, 0);
// 15</pre>

What if you want to see each addition as it happens?

Enter `scan`. You can run this in our app’s console.

<pre name="4096" id="4096" class="graf graf--pre graf-after--p">const { from } = rxjs;
const { scan } = rxjs.operators;</pre>

<pre name="5da3" id="5da3" class="graf graf--pre graf-after--pre">from([1, 2, 3, 4, 5]).pipe(
 scan((a, b) => a + b, 0)
)
.subscribe(console.log);</pre>

<pre name="3c5c" id="3c5c" class="graf graf--pre graf-after--pre">// 1 (0 + 1)
// 3 (1 + 2)
// 6 (3 + 3)
// 10 (6 + 4)
// 15 (10 + 5)</pre>

See how the emissions increase over time? We can do that with Goku as he powers up!

<pre name="aca9" id="aca9" class="graf graf--pre graf-after--p">const { fromEvent } = rxjs;
**const { scan, tap }  = rxjs.operators;**</pre>

<pre name="c790" id="c790" class="graf graf--pre graf-after--pre">const begin = fromEvent(document, 'keydown');
const end = fromEvent(document, 'keyup');</pre>

<pre name="a2d6" id="a2d6" class="graf graf--pre graf-after--pre">**begin.pipe(
  scan(level => level + 1, 1),
  tap(level => {
    console.log({ level });
  })
)** .subscribe(() => {
  sprite.classList.add('powerup');
});</pre>

We start his level at `1` and increase it by 1 every time the `keydown` event fires.

And the `[tap](https://www.learnrxjs.io/operators/utility/do.html)` operator lets us quickly log the value without disturbing the pipeline.

![](https://cdn-images-1.medium.com/max/1600/1*CviOotpl-fpRm5qrI7INhQ.png)My power infinitely approaches MAXIMUM!

### Going Super Saiyan

We’ve trained hard, it’s time to transform.

The `scan` operator tracks Goku’s power level. Now we need to go SSJ when it emits 100.

I built a map of `levels: transformations`. You can put it right above `main`.

<pre name="fbf3" id="fbf3" class="graf graf--pre graf-after--p">const powerLevels = {
  100: {
    current: 'base',
    next: 'ssj'
  }
};</pre>

<pre name="50f3" id="50f3" class="graf graf--pre graf-after--pre">const main = () => {
    ...
};</pre>

It’s overkill, but should simplify adding future transformations.

When the power level reaches a number in that `powerLevels` map, we’ll remove its `current` class from `sprite` and add the `next` class.

This lets us smoothly go from one transformation to the next.

Here’s the code, I’ve bolded the new stuff:

<pre name="8ceb" id="8ceb" class="graf graf--pre graf-after--p">const { fromEvent } = rxjs;
const { **filter**, **map**, scan, tap }  = rxjs.operators;</pre>

<pre name="e466" id="e466" class="graf graf--pre graf-after--pre">const begin = fromEvent(document, 'keydown');
const end = fromEvent(document, 'keyup');</pre>

<pre name="7594" id="7594" class="graf graf--pre graf-after--pre">begin.pipe(
  scan(level => level + 1, 1),
  tap(level => {
    console.log({ level });
 **sprite.classList.add('powerup');**
  }),
 **map(level => powerLevels[level]),
  filter(level => level && level.next)**
)
**.subscribe(({ current, next }) => {
  sprite.classList.remove(current);
  sprite.classList.add(next);
});**</pre>

#### Map and Filter

Adding the `powerup` class now happens inside of `tap`, because it should always happen. The SSJ transformation however, **shouldn’t** always happen.

Using `map`, the latest power level becomes an entry in the `powerLevels` map. We use `filter` to check if the entry exists **and** has a `.next` property.

If it does, that means Goku can go even further beyond! Our `.subscribe` will swap `current` and `next` as class names on `sprite`.

The end result?

![](https://cdn-images-1.medium.com/max/1600/1*q-ifHhrr8byMWPENjBpNyQ.gif)

### Power Meter

You’re having as much fun as I am, right? Unfortunately, our user won’t.

They can’t see how high Goku’s power level is! They won’t know how to open the DevTools console. We must remedy this!

Let’s improve our UX by filling the power meter. You can put this above `main`.

<pre name="5e72" id="5e72" class="graf graf--pre graf-after--p">const fillMeter = (level) => {
  const limit = 100;</pre>

<pre name="3e31" id="3e31" class="graf graf--pre graf-after--pre">  if (level >= limit) {
    return;
  }</pre>

<pre name="122d" id="122d" class="graf graf--pre graf-after--pre">  const containerWidth = meterContainer.offsetWidth;
  const newWidth = (level / limit) * containerWidth;</pre>

<pre name="c64a" id="c64a" class="graf graf--pre graf-after--pre">  meter.style.width = `${newWidth}px`;
};</pre>

And call it inside `tap`.

<pre name="ca5c" id="ca5c" class="graf graf--pre graf-after--p">tap(level => {
  console.log({ level });
  sprite.classList.add('powerup');
 **fillMeter(level);**
}),</pre>

And here we go:

![](https://cdn-images-1.medium.com/max/1600/1*qvr0L_5cmXzMI4g8sYtoyg.gif)

### Going Even Further Beyond

Unlocking more transformations is just a matter of adding sprites, and updating our `powerLevels` map. If you’re interested, submit a PR on [the repo](https://github.com/yazeedb/dbz-rxjs) and we’ll definitely talk.

Here’s the [original sprite sheet](https://www.deviantart.com/bruguii/art/goku-fin-jus-268665173).

Please hold that clap button if you enjoyed. (You can go up to 50!)

Don’t forget to say hi in the comments! Until next time.

Take care,
Yazeed Bzadough
[http://yazeedb.com/](http://yazeedb.com/)