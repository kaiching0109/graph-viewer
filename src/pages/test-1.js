import React, { useState } from 'react'
import '../styles/index.scss'
import { Card } from '../components/Base'
import { BarChart } from '../components/Module'

const test1 = () => {
  return (
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
  )
}

export default test1
