* * *

# GraphQL Resolvers + Ramda = CRUD

![](https://cdn-images-1.medium.com/max/1600/1*VOtR2vbt1fFGFFF_12N1Og.png)

I began learning GraphQL and already love how it compliments Redux by [shaping API responses without actions/reducers](https://hackernoon.com/how-graphql-replaces-redux-3fff8289221d). Writing resolvers feels _a bit_ like writing reducers, which [I already love doing with Ramda](https://medium.com/front-end-hacking/redux-ramda-lets-code-a-higher-order-duck-dc87021406cc).

I’m currently following [this amazing GraphQL tutorial](https://www.howtographql.com/graphql-js/3-a-simple-mutation/), and wish to discuss implementing its exercises with Ramda.

#### Disclaimer:

These patterns are intentionally overkill, and only meant to have some Ramda fun 🐏. You’ll learn some basic GraphQL if you haven’t already. 😁

### Setup

*   Clone [this repo](https://github.com/yazeedb/howtographql-tutorial)
*   Checkout the `start` branch
*   Run `npm i && npm start`
*   Go to http://localhost:4000

#### Schema

`src/schema.graphql` looks like this. You can only get all `links` for now.

<pre name="c31d" id="c31d" class="graf graf--pre graf-after--p">type Query {
  links: [Link!]
}</pre>

<pre name="2082" id="2082" class="graf graf--pre graf-after--pre">type Link {
  id: ID!
  description: String!
  url: String!
}</pre>

`src/links.json` is based on the howtographql tutorial, just duplicated a few times for more sample data.

<pre name="2a50" id="2a50" class="graf graf--pre graf-after--p">[
   {
      "id":"link-0",
      "url":"[www.howtographql.com](http://www.howtographql.com)",
      "description":"Fullstack tutorial for GraphQL"
   },
   {
      "id":"link-1",
      "url":"[www.howtographql.com](http://www.howtographql.com)",
      "description":"Fullstack tutorial for GraphQL"
   },
   {
      "id":"link-2",
      "url":"[www.howtographql.com](http://www.howtographql.com)",
      "description":"Fullstack tutorial for GraphQL"
   },
   {
      "id":"link-3",
      "url":"[www.howtographql.com](http://www.howtographql.com)",
      "description":"Fullstack tutorial for GraphQL"
   }
]</pre>

Here’s `src/index.js`

<pre name="3c2b" id="3c2b" class="graf graf--pre graf-after--p">const { GraphQLServer } = require('graphql-yoga');
let links = require('./links.json');</pre>

<pre name="2438" id="2438" class="graf graf--pre graf-after--pre">const resolvers = {
  Query: {
    links: () => links
  }
};</pre>

<pre name="12d4" id="12d4" class="graf graf--pre graf-after--pre">const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});</pre>

<pre name="142e" id="142e" class="graf graf--pre graf-after--pre">server.start(() => console.log('Running on port 4000'));</pre>

Since our `links` resolver returns the `links` array, querying for it returns the entire dataset.

![](https://cdn-images-1.medium.com/max/1600/1*-GL8Hvs3mrU4z0SEW3LCvQ.png)

Query:

<pre name="62ee" id="62ee" class="graf graf--pre graf-after--p">query {
  links {
    id
    url
    description
  }
}</pre>

### Find by ID

Let’s update `src/schema.graphql` and allow finding `link`s by ID.

<pre name="3539" id="3539" class="graf graf--pre graf-after--p">type Query {
  links: [Link!]
 **link(id: ID!): Link**
}</pre>

Now our resolver in `src/index.js`

<pre name="7e7e" id="7e7e" class="graf graf--pre graf-after--p">const resolvers = {
  Query: {
    links: () => links,
 **link: (root, { id }) => links.find((link) => link.id === id)**
  }
};</pre>

Search `links` with the given `id`.

Try this query:

<pre name="0037" id="0037" class="graf graf--pre graf-after--p">query {
  link(**id: "link-2"**) {
    id
    url
    description
  }
}</pre>

Our result:

<pre name="c018" id="c018" class="graf graf--pre graf-after--p">{
  "data": {
    "link": {
 **"id": "link-2",**      "url": "[www.howtographql.com](http://www.howtographql.com)",
      "description": "Fullstack tutorial for GraphQL"
    }
  }
}</pre>

Works perfectly! Feel free to try other IDs.

### R.find and R.propEq

Much like the native `Array.find`, `R.find` returns the first element matching your predicate function.

So we could refactor our `link` resolver to

<pre name="c15f" id="c15f" class="graf graf--pre graf-after--p">const { **find** } = require('ramda');</pre>

<pre name="e4c3" id="e4c3" class="graf graf--pre graf-after--pre">const resolvers = {
  Query: {
    links: () => links,
    **link: (root, { id }) => find((link) => link.id === id, links)**
  }
};</pre>

But that’s not exciting enough. We can replace the predicate with `R.propEq`.

<pre name="5d46" id="5d46" class="graf graf--pre graf-after--p">const { find, **propEq** } = require('ramda');
**const idEq = propEq('id');**</pre>

<pre name="a7c8" id="a7c8" class="graf graf--pre graf-after--pre">const resolvers = {
  Query: {
    links: () => links,
 **link: (root, { id }) => find(idEq(id), links)**
  }
};</pre>

`R.propEq` takes 3 parameters:

1.  Property name
2.  A value
3.  The object to match on

Since it’s [curried](https://medium.com/@yazeedb/how-does-javascripts-curry-actually-work-8d5a6f891499), we can supply one or two params and get back a function expecting the rest. This makes partial application trivial.

We supplied `'id'` as the property name to look for, then `id` from the `link` resolver as the value, and `find` will supply each `link` object as it loops over the list.

Our query results haven’t changed.

![](https://cdn-images-1.medium.com/max/1600/1*0_ynHSqcHfosTU2jeWAsHQ.png)

### Mutation: Add new links

Let’s update `src/schema.graphql` and support adding new `link` resources.

<pre name="07d6" id="07d6" class="graf graf--pre graf-after--p">type Mutation {
  post(url: String!, description: String!): Link!
}</pre>

We require a `url` and `description`, and will return the new `link` upon creating it.

Now we add a `post` resolver.

<pre name="53ac" id="53ac" class="graf graf--pre graf-after--p">const resolvers = {
  Query: {
    links: () => links,
    link: (root, { id }) => find(propEq('id', id), links)
  },
 **Mutation: {
    post: (root, { url, description }) => {
      const link = {
        id: `link-${links.length}`,
        url,
        description
      };**</pre>

<pre name="f6f5" id="f6f5" class="graf graf--pre graf-after--pre"> **links.push(link);**</pre>

<pre name="9733" id="9733" class="graf graf--pre graf-after--pre"> **return link;
    }
  }**
};</pre>

Try this query:

<pre name="924c" id="924c" class="graf graf--pre graf-after--p">mutation {
  post(url: "website", description: "lol") {
    id
    url
    description
  }
}</pre>

Our result:

![](https://cdn-images-1.medium.com/max/1600/1*jgIeISez1SPc2AysA6yQFQ.png)

### R.merge, R.pick, and R.pipe

I think using Ramda here is overkill, but let’s experiment!

*   `R.merge` merges two objects
*   `R.pick` returns a shallow copy of an object’s chosen keys
*   `R.pipe` will allow `merge` and `pick` to beautifully flow, left-to-right

For more detail on `pipe`, see [my article on it](https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937)!

<pre name="218c" id="218c" class="graf graf--pre graf-after--p">const { merge, pick, pipe } = require('ramda');</pre>

<pre name="aabc" id="aabc" class="graf graf--pre graf-after--pre">Mutation: {
    post: (root, args) => pipe(
      pick(['url', 'description']),
      merge({ id: `link-${links.length}` }),
      (link) => {
        // OMG side-effect! O_o"
        links.push(link);</pre>

<pre name="d7de" id="d7de" class="graf graf--pre graf-after--pre">        return link;
      }
    )(args)
 }</pre>

`pick` returns `{ url, description }`, `merge` fuses it with an object containing the new `id`, and our last arrow function returns the new `link` after pushing it into the `links` array.

Each function’s output is supplied to the next via `pipe`!

Amazingly, our query results haven’t changed.

![](https://cdn-images-1.medium.com/max/1600/1*oqWabh1RSywrJ35xCuYLBw.png)

### Mutation: Updating Links

We’ve fulfilled the **C**reate and **R**ead portions of **CRUD**, now let’s do **U**pdate.

Edit `src/schema.graphql`

<pre name="1e35" id="1e35" class="graf graf--pre graf-after--p">type Mutation {
  post(url: String!, description: String!): Link!
 **updateLink(id: ID!, url: String, description: String): Link**
}</pre>

We require an ID and optionally take the new `url` and `description`. Updated `link` is returned (if found).

Now `src/index.js`

We’ve already covered the pattern of matching objects by ID, so we can reuse `idEq` here.

<pre name="2c35" id="2c35" class="graf graf--pre graf-after--p">Mutation: {
    post: ...
    **updateLink: (root, args) => {
      let newLink;**</pre>

<pre name="5d47" id="5d47" class="graf graf--pre graf-after--pre"> **links = links.map((link) => {
        if (idEq(link.id, args)) {
          newLink = { ...link, ...args };**</pre>

<pre name="94eb" id="94eb" class="graf graf--pre graf-after--pre"> **return newLink;
        }**</pre>

<pre name="d1b2" id="d1b2" class="graf graf--pre graf-after--pre"> **return link;
      });**</pre>

<pre name="9278" id="9278" class="graf graf--pre graf-after--pre"> **return newLink;
    }**
  }</pre>

Try this query:

<pre name="3e5c" id="3e5c" class="graf graf--pre graf-after--p">mutation {
  updateLink(id: "link-0" url: "[https://bit.ly/2IzZV4C](https://bit.ly/2IzZV4C)") {
    id
    url
    description
  }
}</pre>

Successfully updated!

![](https://cdn-images-1.medium.com/max/1600/1*lPApxO0WqVUSE4aqTVJHSA.png)

### R.when and R.merge

`updateLink`'s mapping function had an `if` without an `else`.

<pre name="85b0" id="85b0" class="graf graf--pre graf-after--p">if (idEq(link.id, args)) {
    newLink = { ...link, ...args };</pre>

<pre name="0bf2" id="0bf2" class="graf graf--pre graf-after--pre">    return newLink;
}</pre>

<pre name="1219" id="1219" class="graf graf--pre graf-after--pre">return link;</pre>

`R.when` is a great function to express that logic.

<pre name="fe06" id="fe06" class="graf graf--pre graf-after--p">doubleSmallNums = when(
  (num) => num < 10,
  (num) => num * 2
);</pre>

<pre name="5c0b" id="5c0b" class="graf graf--pre graf-after--pre">doubleSmallNums(9); // 18
doubleSmallNums(10); // 10</pre>

If the first function returns `true`, run the second function.
Else, do nothing.

See [my article on](https://medium.com/front-end-hacking/30-seconds-of-code-conditionally-change-values-with-when-732b09e46334) `[when()](https://medium.com/front-end-hacking/30-seconds-of-code-conditionally-change-values-with-when-732b09e46334)`for more info.

**Spoiler alert:** We’ll be using `when` to delete `links` too, so let’s abstract it right now.

<pre name="09b1" id="09b1" class="graf graf--pre graf-after--p">const { **when** } = require('ramda');
**const doIfMatchingId = (id) => when(idEq(id));**</pre>

<pre name="d9bd" id="d9bd" class="graf graf--pre graf-after--pre">updateLink: (root, args) => {
  let newLink;
  const updateLink = (link) => {
    newLink = merge(link, args);
    return newLink;
  };</pre>

<pre name="2e64" id="2e64" class="graf graf--pre graf-after--pre">  links = links.map(doIfMatchingId(args.id)(updateLink));</pre>

<pre name="717d" id="717d" class="graf graf--pre graf-after--pre">  return newLink;
}</pre>

Our new logic reads like a sentence: “**When** `args` and `link` IDs are equal**,** create and return `newLink`.”

We don’t even need to specify “otherwise, do nothing” because `when` handles that for us!

Our query results haven’t changed.

![](https://cdn-images-1.medium.com/max/1600/1*ybWFROLj36TlCNuOMGRB4A.png)

### `Mutation: Deleting Links`

Let’s finish off CRUD and implement **D**elete!

Edit `src/schema.graphql`

<pre name="0e7e" id="0e7e" class="graf graf--pre graf-after--p">type Mutation {
  post(url: String!, description: String!): Link!
  updateLink(id: ID!, url: String, description: String): Link
 **deleteLink(id: ID!): Link**
}</pre>

We’ll delete and return the `link` if we can find it by ID.

Now `src/index.js`

<pre name="846f" id="846f" class="graf graf--pre graf-after--p">deleteLink: (root, { id }) => {
  let linkToDelete;</pre>

<pre name="df77" id="df77" class="graf graf--pre graf-after--pre">  links.forEach((link, index) => {
    const matchAndRemove = (match) => {
      linkToDelete = match;
      links.splice(index, 1);
    };</pre>

<pre name="d45f" id="d45f" class="graf graf--pre graf-after--pre">    return doIfMatchingId(id)(matchAndRemove, link);
  });</pre>

<pre name="0dc8" id="0dc8" class="graf graf--pre graf-after--pre">  return linkToDelete;
}</pre>

Try this query:

<pre name="09e3" id="09e3" class="graf graf--pre graf-after--p">mutation {
  deleteLink(id: "link-1") {
    id url description
  }
}</pre>

We get the expected response:

<pre name="a01a" id="a01a" class="graf graf--pre graf-after--p">{
  "data": {
    "deleteLink": {
      "id": "link-1",
      "url": "[www.howtographql.com](http://www.howtographql.com)",
      "description": "Fullstack tutorial for GraphQL"
    }
  }
}</pre>

Then try this query:

<pre name="e329" id="e329" class="graf graf--pre graf-after--p">query {
  link(id: "link-1") {
    id url description
  }
}</pre>

And get nothing back, if everything worked out:

<pre name="ce55" id="ce55" class="graf graf--pre graf-after--p">{
  "data": {
    "link": null
  }
}</pre>

#### Again, this is intentionally overkill.

Ramda truly shines when you enforce immutable data structures. Here, it’s at least intriguing and helping us to think laterally because it’s such a flexible library.

Find anything interesting? How can we improve this? Leave a comment below and let’s discuss.

Until next time!

Take care,
Yazeed Bzadough