const { format } = require('date-fns')

const addYearIfMissing = dateWritten =>
  dateWritten.includes(',')
    ? dateWritten
    : `${dateWritten}, ${new Date().getFullYear()}`

const getSubtitle = blogMarkdown => {
  const matchingSubtitle = blogMarkdown.match(/## (.+)/)

  if (matchingSubtitle) {
    return matchingSubtitle.pop()
  }

  return ''
}

const cleanupBlogMarkdown = blogMarkdown => {
  const title = blogMarkdown.match(/# (.+)/).pop()
  const dateWritten = blogMarkdown.match('<time.+>(.+)</time>').pop()
  // const blogBody = blogMarkdown.substring(blogMarkdown.indexOf('`'))

  return `---
title: ${title.replace(':', '')}
date: '${format(addYearIfMissing(dateWritten), 'YYYY-MM-DD')}'
subtitle: '${getSubtitle(blogMarkdown)}'
---

${blogMarkdown}
  `
}

exports.cleanupBlogMarkdown = cleanupBlogMarkdown
