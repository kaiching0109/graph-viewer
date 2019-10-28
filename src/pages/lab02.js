import React from 'react'
import Layout from '../components/layout'
import '../styles/index.scss'
import { ScatterplotBuilder } from '../components/DataBuilder'
import 'bootstrap/dist/css/bootstrap.min.css'
import WindowDimensionsContextProvider from '../context/window-dimensions-context'

const Lab02Page = () => {
  // WindowDimensionsContext = useContext()
  return (
    <WindowDimensionsContextProvider>
      <Layout>
        <div className='graph-container'>
          <div className='u-center-text'>
            <div className='row'>
              <ScatterplotBuilder />
            </div>
          </div>
        </div>
      </Layout>
    </WindowDimensionsContextProvider>
  )
}

export default Lab02Page
