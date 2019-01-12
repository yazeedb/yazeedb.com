import React from 'react'
import { Link } from 'gatsby'

import myPicture from '../images/me-2016.jpg'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

    {/* <img src={myPicture} className="my-picture" /> */}

    {/* <ul>
      <li>
        <a href="">Resume</a>
      </li>
      <li>
        <a href="">Blog</a>
      </li>
      <li>
        <a href="">GitHub</a>
      </li>
      <li>
        <a href="">LinkedIn</a>
      </li>
    </ul> */}
  </Layout>
)

export default IndexPage
