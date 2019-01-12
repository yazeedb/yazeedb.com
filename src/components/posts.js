import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

const PostsComponent = ({ allMediumPost: { edges: posts } }) => {
  return (
    <div className="posts">
      <h1>My Latest Articles</h1>

      <ul className="posts-list">
        {posts.map(({ node }) => (
          <li className="post" key={node.id}>
            <a
              href={`https://medium.com/@yazeedb/${node.uniqueSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              alt={`${node.title}–by Yazeed Bzadough`}
            >
              {node.title}
            </a>
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
              uniqueSlug
              virtuals {
                subtitle
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
