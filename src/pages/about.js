import React from 'react'
import Layout from '../components/layout'
import profilePic from '../images/me-2016.jpg'

const AboutPage = () => (
  <Layout>
    <div style={{ textAlign: 'center' }}>
      <img
        src={profilePic}
        alt="Yazeed Bzadough"
        style={{
          borderRadius: '100px',
          textAlign: 'center',
        }}
      />
      <h3
        style={{
          fontWeight: 400,
          width: '66%',
          margin: 'auto',
          marginBottom: '30px',
        }}
      >
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
