import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const linkStyles = {
  color: '#AAAAAA',
}

const activeLinkStyles = {
  color: 'white',
}

const Header = ({ siteTitle }) => (
  <div
    style={{
      paddingBottom: '20px',
    }}
  >
    <h2 style={{ display: 'inline-block', fontWeight: 400 }}>
      <Link
        to="/"
        style={{
          color: `white`,
          textDecoration: `none`,
        }}
      >
        {siteTitle}
      </Link>
    </h2>

    <ul className="personal-links">
      <li>
        <Link to="/work" style={linkStyles} activeStyle={activeLinkStyles}>
          Work
        </Link>
      </li>
      <li>
        <Link to="/" style={linkStyles} activeStyle={activeLinkStyles}>
          Blog
        </Link>
      </li>
      <li>
        <Link to="/about" style={linkStyles} activeStyle={activeLinkStyles}>
          About
        </Link>
      </li>
    </ul>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
