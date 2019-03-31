import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

const PostsComponent = ({ allMediumPost: { edges: posts } }) => {
  return (
    <div
      className="posts"
      style={{
        width: '66%',
        margin: '0 auto',
      }}
    >
      <ul className="posts-list">
        {posts.map(({ node }) => (
          <li
            className="post"
            key={node.id}
            style={{
              margin: '40px 0',
            }}
          >
            {console.log(node)}
            <a
              href={`https://medium.com/@yazeedb/${node.uniqueSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              alt={`${node.title}–by Yazeed Bzadough`}
              style={{ textDecoration: 'none' }}
            >
              <h2>{node.title}</h2>
            </a>
            <p>
              {node.firstPublishedAt} · {Math.round(node.virtuals.readingTime)}{' '}
              minute read
            </p>
            <p>{node.content.subtitle}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Post = () => (
  <StaticQuery
    query={graphql`
      query {
        allMediumPost(sort: { fields: [createdAt], order: DESC }) {
          edges {
            node {
              id
              title
              firstPublishedAt
              uniqueSlug
              content {
                subtitle
              }
              virtuals {
                subtitle
                readingTime
                previewImage {
                  imageId
                }
              }
            }
          }
        }
      }
    `}
    render={PostsComponent}
  />
)
export default Post
