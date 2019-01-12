import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: `#00b2d7`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>

      <h4 className="short-bio">Lead Front-End Developer</h4>

      <ul className="personal-links">
        <li>
          <a href="http://yazeedb.com/resume.pdf">Resume</a>
        </li>
        <li>
          <a href="https://medium.com/@yazeedb">Blog</a>
        </li>
        <li>
          <a href="https://github.com/yazeedb">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/yazeedb/">LinkedIn</a>
        </li>
      </ul>
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
