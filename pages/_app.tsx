// fixes a bug for next-auth and mongodb atlas somehow
// https://github.com/nextauthjs/next-auth/issues/833
import 'reflect-metadata'
import React from 'react'
import Layout from '../components/layout'
import doNotUseLayout from '../utils/no_layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  let noLayout = Component[doNotUseLayout.param]
  
  return noLayout ?
    <Component {...pageProps} /> :
    <Layout><Component {...pageProps} /></Layout>
}

export default MyApp
