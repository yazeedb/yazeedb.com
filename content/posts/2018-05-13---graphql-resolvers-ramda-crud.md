---
title: GraphQL Resolvers + Ramda = CRUD
date: '2018-05-13'
description: "While playing around with GraphQL, using Ramda seemed like a good idea. Here's the result!"
draft: false
template: 'post'
slug: '/posts/graphql-resolvers-plus-ramda'
category: 'GraphQL'
tags:
  - 'GraphQL'
  - 'Ramda'
---

![](https://cdn-images-1.medium.com/max/1600/1*VOtR2vbt1fFGFFF_12N1Og.png)

I began learning GraphQL and already love how it compliments Redux by [shaping API responses without actions/reducers](https://hackernoon.com/how-graphql-replaces-redux-3fff8289221d). Writing resolvers feels _a bit_ like writing reducers, which [I already love doing with Ramda](https://medium.com/front-end-hacking/redux-ramda-lets-code-a-higher-order-duck-dc87021406cc).

I’m currently following [this amazing GraphQL tutorial](https://www.howtographql.com/graphql-js/3-a-simple-mutation/), and wish to discuss implementing its exercises with Ramda.

#### Disclaimer:

These patterns are intentionally overkill, and only meant to have some Ramda fun 🐏. You’ll learn some basic GraphQL if you haven’t already. 😁

### Setup

- Clone [this repo](https://github.com/yazeedb/howtographql-tutorial)
- Checkout the `start` branch
- Run `npm i && npm start`
- Go to http://localhost:4000

#### Schema

`src/schema.graphql` looks like this. You can only get all `links` for now.

```graphql
type Query {
  links: [Link!]
}

type Link {
  id: ID!
  description: String!
  url: String!
}
```

`src/links.json` is based on the howtographql tutorial, just duplicated a few times for more sample data.

```json
[
  {
    "id": "link-0",
    "url": "[www.howtographql.com](http://www.howtographql.com)",
    "description": "Fullstack tutorial for GraphQL"
  },
  {
    "id": "link-1",
    "url": "[www.howtographql.com](http://www.howtographql.com)",
    "description": "Fullstack tutorial for GraphQL"
  },
  {
    "id": "link-2",
    "url": "[www.howtographql.com](http://www.howtographql.com)",
    "description": "Fullstack tutorial for GraphQL"
  },
  {
    "id": "link-3",
    "url": "[www.howtographql.com](http://www.howtographql.com)",
    "description": "Fullstack tutorial for GraphQL"
  }
]
```

Here’s `src/index.js`

```js
const { GraphQLServer } = require('graphql-yoga');
let links = require('./links.json');

const resolvers = {
  Query: {
    links: () => links
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => console.log('Running on port 4000'));
```

Since our `links` resolver returns the `links` array, querying for it returns the entire dataset.

![](https://cdn-images-1.medium.com/max/1600/1*-GL8Hvs3mrU4z0SEW3LCvQ.png)

Query:

```graphql
query {
  links {
    id
    url
    description
  }
}
```

### Find by ID

Let’s update `src/schema.graphql` and allow finding `link`s by ID.

```graphql
type Query {
  links: [Link!]
  link(id: ID!): Link
}
```

Now our resolver in `src/index.js`

```js
const resolvers = {
  Query: {
    links: () => links,
    link: (root, { id }) => links.find((link) => link.id === id)
  }
};
```

Search `links` with the given `id`.

Try this query:

```graphql
query {
  link(id: "link-2") {
    id
    url
    description
  }
}
```

Our result:

```json
{
  "data": {
    "link": {
      "id": "link-2",
      "url": "[www.howtographql.com](http://www.howtographql.com)",
      "description": "Fullstack tutorial for GraphQL"
    }
  }
}
```

Works perfectly! Feel free to try other IDs.

### R.find and R.propEq

Much like the native `Array.find`, `R.find` returns the first element matching your predicate function.

So we could refactor our `link` resolver to

```js
const { find } = require('ramda');

const resolvers = {
  Query: {
    links: () => links,
    link: (root, { id }) => find((link) => link.id === id, links)
  }
};
```

But that’s not exciting enough. We can replace the predicate with `R.propEq`.

```js
const { find, propEq } = require('ramda');
const idEq = propEq('id');

const resolvers = {
  Query: {
    links: () => links,
    link: (root, { id }) => find(idEq(id), links)
  }
};
```

`R.propEq` takes 3 parameters:

1.  Property name
2.  A value
3.  The object to match on

Since it’s curried, we can supply one or two params and get back a function expecting the rest. This makes partial application trivial.

We supplied `'id'` as the property name to look for, then `id` from the `link` resolver as the value, and `find` will supply each `link` object as it loops over the list.

Our query results haven’t changed.

![](https://cdn-images-1.medium.com/max/1600/1*0_ynHSqcHfosTU2jeWAsHQ.png)

### Mutation: Add new links

Let’s update `src/schema.graphql` and support adding new `link` resources.

```graphql
type Mutation {
  post(url: String!, description: String!): Link!
}
```

We require a `url` and `description`, and will return the new `link` upon creating it.

Now we add a `post` resolver.

```js
const resolvers = {
  Query: {
    links: () => links,
    link: (root, { id }) => find(propEq('id', id), links)
  },
  Mutation: {
    post: (root, { url, description }) => {
      const link = {
        id: `link-${links.length}`,
        url,
        description
      };

      links.push(link);

      return link;
    }
  }
};
```

Try this query:

```graphql
mutation {
  post(url: "website", description: "lol") {
    id
    url
    description
  }
}
```

Our result:

![](https://cdn-images-1.medium.com/max/1600/1*jgIeISez1SPc2AysA6yQFQ.png)

### R.merge, R.pick, and R.pipe

I think using Ramda here is overkill, but let’s experiment!

- `R.merge` merges two objects
- `R.pick` returns a shallow copy of an object’s chosen keys
- `R.pipe` will allow `merge` and `pick` to beautifully flow, left-to-right

For more detail on `pipe`, see [my article on it](https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937)!

```js
const { merge, pick, pipe } = require('ramda');

Mutation: {
  post: (root, args) =>
    pipe(
      pick(['url', 'description']),
      merge({ id: `link-${links.length}` }),
      (link) => {
        // OMG side-effect! O_o"
        links.push(link);

        return link;
      }
    )(args);
}
```

`pick` returns `{ url, description }`, `merge` fuses it with an object containing the new `id`, and our last arrow function returns the new `link` after pushing it into the `links` array.

Each function’s output is supplied to the next via `pipe`!

Amazingly, our query results haven’t changed.

![](https://cdn-images-1.medium.com/max/1600/1*oqWabh1RSywrJ35xCuYLBw.png)

### Mutation: Updating Links

We’ve fulfilled the **C**reate and **R**ead portions of **CRUD**, now let’s do **U**pdate.

Edit `src/schema.graphql`

```graphql
type Mutation {
  post(url: String!, description: String!): Link!
  updateLink(id: ID!, url: String, description: String): Link
}
```

We require an ID and optionally take the new `url` and `description`. Updated `link` is returned (if found).

Now `src/index.js`

We’ve already covered the pattern of matching objects by ID, so we can reuse `idEq` here.

```js
Mutation: {
  // post: ...
  updateLink: (root, args) => {
    let newLink;

    links = links.map((link) => {
      if (idEq(link.id, args)) {
        newLink = { ...link, ...args };

        return newLink;
      }

      return link;
    });

    return newLink;
  };
}
```

Try this query:

```graphql
mutation {
  updateLink(
    id: "link-0"
    url: "[https://bit.ly/2IzZV4C](https://bit.ly/2IzZV4C)"
  ) {
    id
    url
    description
  }
}
```

Successfully updated!

![](https://cdn-images-1.medium.com/max/1600/1*lPApxO0WqVUSE4aqTVJHSA.png)

### R.when and R.merge

`updateLink`'s mapping function had an `if` without an `else`.

```js
if (idEq(link.id, args)) {
  newLink = { ...link, ...args };

  return newLink;
}

return link;
```

`R.when` is a great function to express that logic.

```js
doubleSmallNums = when((num) => num < 10, (num) => num * 2);

doubleSmallNums(9); // 18
doubleSmallNums(10); // 10
```

If the first function returns `true`, run the second function.
Else, do nothing.

See [my article on when()](30-seconds-of-code-when) for more info.

**Spoiler alert:** We’ll be using `when` to delete `links` too, so let’s abstract it right now.

```js
const { when } = require('ramda');
const doIfMatchingId = (id) => when(idEq(id));

updateLink: (root, args) => {
  let newLink;
  const updateLink = (link) => {
    newLink = merge(link, args);
    return newLink;
  };

  links = links.map(doIfMatchingId(args.id)(updateLink));

  return newLink;
};
```

Our new logic reads like a sentence: “**When** `args` and `link` IDs are equal**,** create and return `newLink`.”

We don’t even need to specify “otherwise, do nothing” because `when` handles that for us!

Our query results haven’t changed.

![](https://cdn-images-1.medium.com/max/1600/1*ybWFROLj36TlCNuOMGRB4A.png)

### `Mutation: Deleting Links`

Let’s finish off CRUD and implement **D**elete!

Edit `src/schema.graphql`

```graphql
type Mutation {
  post(url: String!, description: String!): Link!
  updateLink(id: ID!, url: String, description: String): Link
  deleteLink(id: ID!): Link
}
```

We’ll delete and return the `link` if we can find it by ID.

Now `src/index.js`

```js
deleteLink: (root, { id }) => {
  let linkToDelete;

  links.forEach((link, index) => {
    const matchAndRemove = (match) => {
      linkToDelete = match;
      links.splice(index, 1);
    };

    return doIfMatchingId(id)(matchAndRemove, link);
  });

  return linkToDelete;
};
```

Try this query:

```graphql
mutation {
  deleteLink(id: "link-1") {
    id
    url
    description
  }
}
```

We get the expected response:

```json
{
  "data": {
    "deleteLink": {
      "id": "link-1",
      "url": "[www.howtographql.com](http://www.howtographql.com)",
      "description": "Fullstack tutorial for GraphQL"
    }
  }
}
```

Then try this query:

```graphql
query {
  link(id: "link-1") {
    id
    url
    description
  }
}
```

And get nothing back, if everything worked out:

```json
{
  "data": {
    "link": null
  }
}
```

#### Again, this is intentionally overkill.

Ramda truly shines when you enforce immutable data structures. Here, it’s at least intriguing and helping us to think laterally because it’s such a flexible library.
