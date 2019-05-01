import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import { Link } from 'gatsby'

const Posts = ({ posts }) => {
  return (
    <div className="posts">
      <ul className="posts-list">
        {posts.map(post => (
          <li
            className="post"
            key={post.id}
            style={{
              margin: '60px 0',
            }}
          >
            <Link
              to={post.url}
              alt={`${post.title}–by Yazeed Bzadough`}
              style={{ textDecoration: 'none' }}
            >
              <h2>{post.title}</h2>
            </Link>
            <p style={{ fontFamily: 'Georgia', color: '#AAAAAA' }}>
              {format(post.date, 'MMM DD, YYYY')} ·{' '}
              {Math.round(post.readingTime)} minute read
            </p>
            <p style={{ fontFamily: 'Georgia' }}>{post.subtitle}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

const PostPropType = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  url: PropTypes.string,
  date: PropTypes.string,
  readingTime: PropTypes.number,
  subtitle: PropTypes.number,
})

Posts.propTypes = {
  posts: PropTypes.arrayOf(PostPropType),
}

export default Posts
