import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import { colors } from '../colors'

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <div
        style={{
          maxWidth: '66%',
          margin: '0 auto',
          color: colors.secondary,
        }}
      >
        <h1 style={{ color: colors.primary }}>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
