import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import MediumPosts from '../components/mediumPosts'
import SitePosts from '../components/sitePosts'

const BlogPage = ({ data }) => {
  return (
    <Layout>
      <SEO
        title="Blog"
        keywords={[
          'Yazeed Bzadough',
          'Web Developer',
          'Frontend Developer',
          'Front-end Developer',
          'Front-End Developer',
        ]}
      />
      <SitePosts data={data.allMarkdownRemark} />
      {/* <MediumPosts /> */}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            subtitle
          }
          timeToRead
          fields {
            slug
          }
        }
      }
    }
  }
`

export default BlogPage
