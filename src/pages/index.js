import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import '../styles/index.scss'
import { Card } from '../components/Base'
import { BarChart } from '../components/Module'
import 'bootstrap/dist/css/bootstrap.min.css'

const IndexPage = () => (
  <Layout>
    <div className='graph-container'>
      <div className='u-center-text'>
        <div className='row'>
          <div className='col-sm'>
            <Card title='hello'>
              <BarChart />
            </Card>
          </div>
          <div className='col-sm'>
            <Card title='hello'>
              <p>What's up</p>
            </Card>
          </div>
          <div className='col-sm'>
            <Card title='hello'>
              <p>What's up</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
