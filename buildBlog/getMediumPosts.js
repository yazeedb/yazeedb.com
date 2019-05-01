const axios = require('axios');

const prefix = '])}while(1);</x>';
const authorLink = 'https://medium.com/@yazeedb';
const url = `${authorLink}/latest?format=json&limit=200`;

exports.getMediumPosts = () =>
  axios.default
    .get(url)
    .then((response) => response.data.replace(prefix, ''))
    .then(JSON.parse)
    .then((data) => Object.values(data.payload.references.Post))
    .then((posts) =>
      posts.map((p) => ({
        ...p,
        _fullUrl: `${authorLink}/${p.uniqueSlug}`
      }))
    );
