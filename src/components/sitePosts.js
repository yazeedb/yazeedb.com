import React from 'react'
import Posts from './posts'

const formatEdgesForPost = edges =>
  edges.map(({ node }) => ({
    id: node.id,
    subtitle: node.frontmatter.subtitle,
    title: node.frontmatter.title,
    date: node.frontmatter.date,
    readingTime: node.timeToRead,
    url: node.fields.slug,
  }))

const SitePosts = ({ data }) => {
  console.log({ data })

  return <Posts posts={formatEdgesForPost(data.edges)} />
}

export default SitePosts
