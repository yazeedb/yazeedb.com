import React from 'react'
import PropTypes from 'prop-types'

const PortfolioProject = ({
  projectName,
  technologiesUsed,
  // coverImage,
  demoLink,
  sourceCodeLink,
  internalProject,
}) => {
  return (
    <div className="portfolio-project">
      {/* {coverImage && (
        <img
          src={coverImage}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )} */}

      <h2 className="portfolio-name">{projectName}</h2>
      <p className="portfolio-technologies-used">
        {technologiesUsed.join(', ')}
      </p>

      {demoLink && <a href={demoLink}>Demo</a>}
      {sourceCodeLink && <a href={sourceCodeLink}>Source Code</a>}
      {internalProject && (
        <span className="internal-project-indicator">Internal Project</span>
      )}
    </div>
  )
}

PortfolioProject.propTypes = {
  projectName: PropTypes.string.isRequired,
  technologiesUsed: PropTypes.arrayOf(PropTypes.string).isRequired,
  // coverImage: PropTypes.string,
  demoLink: PropTypes.string,
  sourceCodeLink: PropTypes.string,
  internalProject: PropTypes.bool,
}

export default PortfolioProject
