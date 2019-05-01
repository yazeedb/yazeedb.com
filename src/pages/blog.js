import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import MediumPosts from '../components/mediumPosts'
import SitePosts from '../components/sitePosts'

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
    <SitePosts />
    <MediumPosts />
  </Layout>
)

export default BlogPage
