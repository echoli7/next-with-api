import React, { FC, Fragment } from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import Container from '../components/container'
import Hero from '../components/hero'
import HomeNav from '../components/homeNav'
import FeatureSection from '../components/featureSection'
import { home } from '../content'
// import Layout from '../components/Layout'

const Home: FC<{ content: { hero: any; features: any[] } }> = ({ content }) => {
  return <Fragment>
    {content.features.map((feature, i) => (
      <FeatureSection
        key={feature.title}
        title={feature.title}
        body={feature.body}
        image="/docs.png"
        invert={i % 2 === 0}
      />
    ))}
  </Fragment>
}

/**
 * Should really get this content from our CMS
 */

Home.defaultProps = {
  content: {
    features: [{ title: 'default feature', body: 'default body' }],
    hero: { title: 'default title', body: 'default body' },
  },
}

export default Home

export function getStaticProps(context) {
  let { preview } = context
  return { props: { content: preview ? home.draft : home.published } }
}
