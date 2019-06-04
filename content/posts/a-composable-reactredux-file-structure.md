---
title: A “Composable” React/Redux File Structure?
date: '2018-02-11'
subtitle: 'By nature'
---

* * *

# A “Composable” React/Redux File Structure?

[![Go to the profile of Yazeed Bzadough](https://cdn-images-1.medium.com/fit/c/100/100/1*D0_8f6gW_H8ufCLRpsjVtA@2x.jpeg)](https://medium.com/@yazeedb?source=post_header_lockup)[Yazeed Bzadough](https://medium.com/@yazeedb)<span class="followState js-followState" data-user-id="93124e8e38fc"><button class="button button--smallest u-noUserSelect button--withChrome u-baseColor--buttonNormal button--withHover button--unblock js-unblockButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-block-user" data-requires-token="true" data-redirect="https://medium.com/@yazeedb/a-composable-react-redux-file-structure-576dcdcfbcd9" data-action-source="post_header_lockup"><span class="button-label  button-defaultState">Blocked</span><span class="button-label button-hoverState">Unblock</span></button><button class="button button--primary button--smallest button--dark u-noUserSelect button--withChrome u-accentColor--buttonDark button--follow js-followButton u-marginLeft10 u-xs-hide" data-action="sign-up-prompt" data-sign-in-action="toggle-subscribe-user" data-requires-token="true" data-redirect="https://medium.com/_/subscribe/user/93124e8e38fc" data-action-source="post_header_lockup-93124e8e38fc-------------------------follow_byline"><span class="button-label  button-defaultState js-buttonLabel">Follow</span><span class="button-label button-activeState">Following</span></button></span><time datetime="2018-02-11T17:57:53.415Z">Feb 11, 2018</time><span class="middotDivider u-fontSize12"></span><span class="readingTime" title="2 min read"></span>![](https://cdn-images-1.medium.com/max/1600/1*ATMuSLHc45UK3RsgJ7-w_w.png)

**I need your feedback to further refine this! 😁**

Even though users don’t care about your file structure and a [correct one doesn’t exist](https://twitter.com/dan_abramov/status/701767939633057793?lang=en), I’ve a habit of experimenting with them in my React/Redux applications.

The two most popular I’ve tried are [by nature](https://github.com/erikras/react-redux-universal-hot-example) and [by domain](https://marmelab.com/blog/2015/12/17/react-directory-structure.html).

#### By nature

<pre name="2941" id="2941" class="graf graf--pre graf-after--h4">/src
  /components
  /reducers
  /actions
  /containers</pre>

#### By domain

<pre name="ec15" id="ec15" class="graf graf--pre graf-after--h4">/src
  /feature1
    component.js
    reducer.js
    actions.js
    container.js</pre>

<pre name="8382" id="8382" class="graf graf--pre graf-after--pre">  /feature2
    component.js
    reducer.js
    actions.js
    container.js</pre>

“By nature” is perfect for smaller apps and beginners learning React/Redux. Everything is self-explanatory and sits with its own kind.

“By domain” makes larger apps easier to think about as everything’s broken up by _what it does_, not _what it is_.

I love them both, but feel something’s missing. Neither lend themselves well to the mantra, “composition over inheritance”. I don’t _feel_ like my features are compositions of many components, reducers, and actions.

So what if we fused these two popular paradigms?

### A Composable, Hybrid Structure

<pre name="5ab1" id="5ab1" class="graf graf--pre graf-after--h3">/src
  /features
    /feature1
      index.js
      component.js
      duck.js</pre>

<pre name="cf1e" id="cf1e" class="graf graf--pre graf-after--pre">  /components
  /ducks</pre>

I believe this hybrid nicely supports apps that emphasize composition.

Key points:

*   `/components` contains HoCs ([higher-order components](https://reactjs.org/docs/higher-order-components.html)) and other simple components. These are your building blocks.
*   `/ducks` is like `/components`, except with higher-order ducks ([reducers/actions](https://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html)). Implements [Erik Rasmussen](https://medium.com/@erikras)’s [“Ducks” proposal](https://github.com/erikras/ducks-modular-redux).
*   `feature/index.js` is the Redux-connected container, composed of building blocks from `/components`.
*   `feature/component.js` is the stateless, presentational component also composed from `/components`.
*   `feature/duck.js` is composed from `/ducks` and is used in your Redux store.

I purposely excluded the router, store, root reducer and unit tests because that’s all subjective.

The main point is to think about your features as composing a bunch of components, reducers, and actions, which **_are all just functions_**.

Again, this is new to me, and I’d love your feedback. Please leave a comment and share to get others’ thoughts.

Until next time!

Take care,
Yazeed Bzadough
  