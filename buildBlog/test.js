const { testMarkdown } = require('./testMarkdown');
const { cleanupBlogMarkdown } = require('./cleanupBlogMarkdown');

const result = cleanupBlogMarkdown(testMarkdown);

console.log(result);
