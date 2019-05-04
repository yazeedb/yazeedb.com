import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import { colors } from '../colors'

// TODO: continue cleaning articles. You left off
// at 30 Seconds of Code Conditionally Change Values with when()

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
