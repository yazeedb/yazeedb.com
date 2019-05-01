const fs = require('fs')
const rimRaf = require('rimraf')
const mediumToMarkdown = require('medium-to-markdown')
const { getMediumPosts } = require('./getMediumPosts')
const { cleanupBlogMarkdown } = require('./cleanupBlogMarkdown')

const toKebabCase = string => string.replace(/\s+/g, '-').toLowerCase()
const blogsFolder = './src/pages'

rimRaf.sync('*!(.js)')

getMediumPosts().then(posts =>
  posts.forEach(p => {
    mediumToMarkdown.convertFromUrl(p._fullUrl).then(markdown => {
      const normalizedBlogTitle = `${toKebabCase(p.title).replace(
        '/',
        ' and '
      )}`

      const newBlogFolder = `${blogsFolder}/${normalizedBlogTitle}`

      fs.mkdirSync(newBlogFolder)

      fs.writeFileSync(
        `${newBlogFolder}/index.md`,
        cleanupBlogMarkdown(markdown)
      )
      console.log('wrote file')
    })
  })
)

exports.cleanupBlogMarkdown = cleanupBlogMarkdown
