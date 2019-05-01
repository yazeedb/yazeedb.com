const fs = require('fs')
const rimRaf = require('rimraf')
const mediumToMarkdown = require('medium-to-markdown')
const { getMediumPosts } = require('./getMediumPosts')
const { cleanupBlogMarkdown } = require('./cleanupBlogMarkdown')
const { slugify } = require('./slugify')
const toKebabCase = string => string.replace(/\s+/g, '-').toLowerCase()
const blogsFolder = './src/pages'

rimRaf.sync(`${blogsFolder}/*.md`)

getMediumPosts().then(posts => {
  posts.forEach(p => {
    mediumToMarkdown.convertFromUrl(p._fullUrl).then(markdown => {
      const titleAsSlug = slugify(p.title)

      fs.writeFileSync(
        `${blogsFolder}/${slugify(p.title)}.md`,
        cleanupBlogMarkdown(markdown)
      )
      console.log('wrote', titleAsSlug)
    })
  })
})

exports.cleanupBlogMarkdown = cleanupBlogMarkdown
