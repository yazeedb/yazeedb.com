import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Posts from '../components/posts'

const BlogPage = () => (
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
    <Posts />
  </Layout>
)

export default BlogPage
