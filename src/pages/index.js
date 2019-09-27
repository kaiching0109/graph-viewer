import React, { useContext } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'
import '../styles/index.scss'
import { Card } from '../components/Base'
import DataBuilder from '../components/DataBuilder'
import 'bootstrap/dist/css/bootstrap.min.css'
import WindowDimensionsContextProvider from '../context/window-dimensions-context'

const IndexPage = () => {
  // WindowDimensionsContext = useContext()
  return (
    <WindowDimensionsContextProvider>
      <Layout>
        <div className='graph-container'>
          <div className='u-center-text'>
            <div className='row'>
              <div className='col-sm'>
                <DataBuilder />
              </div>
              <div className='col-sm'>
                <Card header='hello'>
                  <p>What's up</p>
                </Card>
              </div>
              <div className='col-sm'>
                <Card header='hello'>
                  <p>What's up</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </WindowDimensionsContextProvider>
  )
}

export default IndexPage
