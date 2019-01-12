import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Posts from '../components/posts'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <Posts />
  </Layout>
)

export default IndexPage
