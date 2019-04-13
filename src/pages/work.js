import React from 'react'
import pokedexScreenshot from '../images/pokedex-screenshot.png'
import Layout from '../components/layout'
import PortfolioProject from '../components/portfolioProject'

const IndexPage = () => (
  <Layout
    additionalStyles={{
      maxWidth: 'none',
    }}
  >
    <PortfolioProject
      projectName="Pokedex in Material-UI"
      demoLink="https://yazeed-pokedex.netlify.com"
      sourceCodeLink="https://github.com/yazeedb/pokedex"
      technologiesUsed={[
        'React',
        'Redux',
        'RxJS',
        'Redux-Observable',
        'TypeScript',
        'React-Virtualized',
        'Material-UI',
      ]}
      coverImage={pokedexScreenshot}
    />

    <PortfolioProject
      projectName="Product Mgmt Tool"
      technologiesUsed={[
        'React',
        'Redux',
        'RxJS',
        'Redux-Observable',
        'Recompose',
        'Ramda',
      ]}
      internalProject={true}
    />

    <PortfolioProject
      projectName="Client Benefit Manager"
      technologiesUsed={[
        'React',
        'Redux',
        'RxJS',
        'Redux-Observable',
        'TypeScript',
        'Ramda',
      ]}
      internalProject={true}
    />

    <PortfolioProject
      projectName="Forbes Article Page"
      technologiesUsed={['Angular 2', 'TypeScript', 'RxJS']}
      internalProject={true}
    />
  </Layout>
)

export default IndexPage
