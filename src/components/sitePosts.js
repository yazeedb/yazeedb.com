import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Layout from '../components/layout'

const SitePostsComponent = ({ data }) => {
  console.log({ data })
  return <div>Yo</div>
  return (
    <Layout>
      <div>
        <h1
          style={{
            display: 'inline-block',
            borderBottom: '1px solid',
          }}
        >
          Amazing Pandas Eating Things
        </h1>
        <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <h3
              style={{
                marginBottom: '20px',
              }}
            >
              {node.frontmatter.title}{' '}
              <span
                style={{
                  color: '#bbb',
                }}
              >
                — {node.frontmatter.date}
              </span>
            </h3>
            <p>{node.excerpt}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}

const SitePosts = () => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark {
          totalCount
          edges {
            node {
              id
              frontmatter {
                title
              }
              excerpt
            }
          }
        }
      }
    `}
    render={SitePostsComponent}
  />
)

export default SitePosts
