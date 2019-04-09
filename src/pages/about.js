import React from 'react'
import Layout from '../components/layout'
import profilePic from '../images/me-2016.jpg'
import typingHands from '../images/typing hands.gif'

const AboutPage = () => (
  <Layout>
    <img
      className="gif-background-wrapper"
      src={typingHands}
      alt=""
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        zIndex: -1,
      }}
    />
    <div style={{ textAlign: 'center' }}>
      <img
        src={profilePic}
        alt="Yazeed Bzadough"
        style={{
          borderRadius: '100px',
          textAlign: 'center',
        }}
      />
      <h3 className="short-bio">
        I am a Front-End Developer, specializing in well-architected, scalable
        user interfaces.
      </h3>
      <ul className="about-links">
        <li>
          <a href="http://yazeedb.com/resume.pdf">Resume</a>
        </li>
        <li>
          <a href="https://github.com/yazeedb">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/yazeedb/">LinkedIn</a>
        </li>
        <li>
          <a href="https://medium.com/@yazeedb">Blog on Medium</a>
        </li>
      </ul>
    </div>
  </Layout>
)

export default AboutPage
