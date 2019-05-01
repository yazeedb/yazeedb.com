const cleanupBlogMarkdown = (blogMarkdown) => {
  const title = blogMarkdown.match(/# (.+)/).pop();
  const dateWritten = blogMarkdown.match('<time.+>(.+)</time>').pop();
  const blogBody = blogMarkdown.substring(blogMarkdown.indexOf('`'));

  return `
    ---
    title: ${title}
    date: ${dateWritten}
    ---

    ${blogBody}
  `;
};

exports.cleanupBlogMarkdown = cleanupBlogMarkdown;
