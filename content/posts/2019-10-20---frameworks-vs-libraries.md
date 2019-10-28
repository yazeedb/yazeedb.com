---
title: What's the Difference Between a Framework and Library?
date: '2019-10-28'
description: 'Buy a house, or cautiously build your own.'
draft: false
template: 'post'
slug: '/frameworks-vs-libraries'
category: 'Motivational'
coverImageUrl: '/media/imgs-frameworks-vs-libraries/cover-image.png'
tags:
  - 'JavaScript'
  - 'Frameworks'
  - 'Libraries'
  - 'React'
  - 'Angular'
  - 'Vue'
---

![cover-image](/media/imgs-frameworks-vs-libraries/cover-image.png)

## Buy a house, or cautiously build your own.

What's the difference between a framework and library? I've had this discussion with developers at work and meetups, and the core idea boils down to this.

> You tell libraries what to do, frameworks tell you what to do.

## Framework Upsides

Generally speaking a framework tells you what to do. It has a "right way" of doing things and provides tooling to support you.

Two perfect examples are [Angular](https://angular.io) and [Vue](https://vuejs.org).

![angular-and-vue](/media/imgs-frameworks-vs-libraries/angular-and-vue.png)

### All the tools are here

These are frameworks created by dedicated teams, and ship with everything you need to build large-scale applications.

- Components
- Basic state management
- Directives
- Handling forms
- Routing
- HTTP
- Testing
- More (UI libraries, animations, etc.)

### Official style guides

The respective teams then provide official style guides, depicting their framework's best practices. Once you learn that you're immediately productive.

![one-tool-to-conquer](/media/imgs-frameworks-vs-libraries/one-tool-to-conquer.jpeg)

### Streamlined onboarding

If you believe in the structure and wish to invest, a framework is perfect for your project. Training new teammates becomes easier too, as they only need to learn one core tool.

### Clear upgrade path

On top of that your upgrade path is super clear. Just follow the team's release schedule, read up on their breaking changes, and upgrade when you're ready.

## Framework Downsides

This is just in my experience. I'm sure I've missed something.

### Decreased Performance (sort of)

By necessity a framework is comprised of _a lot_ of code. More code means longer download times and decreased performance.

As [frameworks become compilers](https://tomdale.net/2017/09/compilers-are-the-new-frameworks/), however, I suspect this will be less of an issue.

### Small applications don't need it

A scalable architecture must address many concerns like we discussed above. Some applications are so simple that using an entire framework makes things more complicated. You end up with tons of boilerplate without a ton of payoff.

### Going against the framework can be difficult

This reared its head at my first job out of college, where we tried to compile some content outside of Angular's awareness. The result wasn't pretty, but we got the job done after some trial and error, and lots of bruises.

![going-against-frameworks](/media/imgs-frameworks-vs-libraries/going-against-frameworks.jpeg)

Although I hear Vue lets you incrementally adopt it to your existing application. This sounds promising!

### It's a lot to learn

This point applies to any architecture, though. Whatever tool(s) you use, learning all of it takes time. It's either one big tool or many small ones.

![almost-understood](/media/imgs-frameworks-vs-libraries/almost-understood.jpeg)

### You get too comfy

This applies to anything in life–sometimes we get too comfortable doing things in a particular way. This totally depends on your career goals though. Maybe this tool helps you keep a steady job or run an efficient business building applications. If that's what you want, keep doing it!

But if you're like many of us, the same tech every day gets a bit stale. Experimenting with other frameworks and libraries is key to keeping your skills sharp.

## Libraries Upsides

In direction opposition to frameworks, libraries are utilities built for a singular purpose.

- [React](https://reactjs.org) creates UIs
- [Redux](http://redux.js.org) provides state management
- [JQuery](https://jquery.com) provides cross-browser DOM manipulation

The list goes on. Let's zoom in on React. What does it do?

![react-logo-small](/media/imgs-frameworks-vs-libraries/react-logo-small.png)

> A JavaScript library for building user interfaces - [Official React website](https://reactjs.org)

### Single focus

That's _all it does_. Their guides show you how to use React and that's mainly it. The team doesn't officially appoint libraries for global state management, routing, HTTP, services, or forms.

And that's their design choice! It's a great position depending on what you're looking for.

### You're in control

A library is 100% in your control. You determine how it's used, and you're sailing smooth after investing some time to learn it.

![learned-a-lib-quickly](/media/imgs-frameworks-vs-libraries/learned-a-lib-quickly.jpeg)

### Add only what you need

If your application is small, a single library may be enough! No need to complicate things. As the app grows, you can mix and match libraries to build your own architecture. It's a great learning experience!

### Learn many different tools

And speaking of which, using many different libraries will keep your JavaScript skills nice and sharp. You'll always be reading documentation, trying out new things, and expanding your technical horizons.

It's not all perfect though...

## Libraries Downsides

### Custom architecture can ruin your app

Custom architectures are fun at first, but can be very costly down the road. I advise extreme caution if it's your first time building one.

A good architecture increases developer productivity and minimizes the pain of adding, modifying, and deleting code.

![when-architecture-scales](/media/imgs-frameworks-vs-libraries/when-architecture-scales.jpeg)

A bad architecture causes fear and suffering whenever someone touches it.

![refactor-or-redo](/media/imgs-frameworks-vs-libraries/refactor-or-redo.jpeg)

People choose Angular and Vue because they don't want to risk time and money building their own rules. They simply learn the framework's rules and focus on playing the game.

While in the React world, any two large-scale applications will vary in their structure. It all depends on what the team thought best.

### Paralysis analysis

Sometimes too many options is a bad thing, and we're struck by the dreaded [analysis paralysis](https://en.wikipedia.org/wiki/Analysis_paralysis). Instead of picking a library and moving forward, we spend countless hours comparing different libraries that pretty much do the same thing.

![analyze-all-the-libs](/media/imgs-frameworks-vs-libraries/analyze-all-the-libs.jpeg)

### It's still a lot to learn

Framework or not, a big application still takes time to understand. This is another reason why strong architecture's important, because it'll ease the learning curve.

### Potentially hectic upgrade path

If I got paid every time two libraries in my `package.json` weren't compatible after an upgrade, I'd be retired. Enough said.

![one-does-not-simply-upgrade](/media/imgs-frameworks-vs-libraries/one-does-not-simply-upgrade.jpeg)

## Want Free Coaching?

If you'd like to schedule a free call to discuss Front-End development code, interviews, career, or anything else [follow me on Twitter and DM me](https://twitter.com/yazeedBee).

After that if you enjoy our first meeting, we can discuss ongoing coaching to help you reach your Front-End development goals!

## Thanks for reading

For more content like this, check out <a href="https://yazeedb.com">https://yazeedb.com!</a>

Until next time!
