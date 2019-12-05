import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { BarChart } from '../Module'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Card } from '../../components/Base'

const TITLE = 'Happiness Score Distribution'

const DataBuilder = ({ children }) => {
  const data = useStaticQuery(graphql`
    query WorldHappinessQuery {
      allWorldHappiness2015Json {
        edges {
          node {
            Happiness_Score,
            Region
          }
        }
      }
    }
  `)

  const [loading, setLoading] = useState(true)
  const [loadData, setLoadData] = useState(true)
  const [content, setContent] = useState([])
  const [filterContent, setFilterContent] = useState([])
  const [dropdownItems, setDropdownItems] = useState([])
  const [interval, setInterval] = useState(2)
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(10)
  const [selectRegion, setSelectRegion] = useState('all')

  useEffect(() => {
    let temp = [] // an array to score all points by index, e.g  temp[0] represent the number of having 1 points
    let regions = [{ label: 'ALL', value: 'all' }]
    let result = []
    data.allWorldHappiness2015Json.edges
      .map(({ node: { Happiness_Score: score, Region: region } }) => {
        let index = Math.round(score / interval)
        if (interval === max) index = 0
        // if (selectRegion) {
        const isFound = regions.find(_ => {
          
          return _.value === region.toLowerCase()
        })
        regions = isFound ? regions : [...regions, { label: region, value: region.toLowerCase() }]
        // }
        if (selectRegion !== 'all') {
          
          if (selectRegion === region.toLowerCase()) {
            // 
            if (result[index]) result[index] = [...result[index], { region }]
            else result[index] = [{ region }]
          }
        } else {
          if (result[index]) result[index] = [...result[index], { region }]
          else result[index] = [{ region }]
        }
      })
    setContent(result)
    setDropdownItems(regions)
    setLoadData(false)
    // }
  }, [data.allWorldHappiness2015Json.edges, selectRegion, interval])

  useEffect(() => {
    // To produce
    if (content.length > 0) {
      let counter = 0
      let order = []
      let ref = {}
      
      for (let from = min; from <= max; from += interval) {
        let to = from + interval - 1
        
        if (to > max) to = max
        const key = (from === to) ? `${to}` : `${from}-${to}`
        const value = content[counter++]
        ref[key] = value ? value.length : 0
        order.push(key)
      }
      
      const result = order.map(key => ({ label: key, value: ref[key] }))
      // 
      setFilterContent(result)
      setLoading(false)
      
    }
  }, [content, interval])

  const addIntervalHandler = () => { if (interval < max) setInterval(interval + 1) }

  const reduceIntervalHandler = () => { if (interval > min) setInterval(interval - 1) }

  const HappinessScoreDistributionHeader = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{TITLE}</p>
        <DropdownButton id='dropdown-basic-button' style={{ float: 'right', display: 'inline-block', paddingRight: '5rem'}} title={selectRegion}>
          {dropdownItems.map((item, i) => {
            const { label, value } = item
            return <Dropdown.Item key={i} onClick={() => {
              
              setSelectRegion(value)
            }}>{label}</Dropdown.Item>
          })}
        </DropdownButton>
      </div>
    </div>
  )

  const HappinessScoreDistributionFooter = (
    <div className='row'>
      <div className="col-sm-2">
        <button type="button" class="btn btn-primary" onClick={reduceIntervalHandler}>-</button>
      </div>
      <div className="col-sm">
        <input type='range' class='custom-range' value={interval} min={min} max={max} step='0.5' onChange={e => setInterval(parseInt(e.target.value))} slider-tooltip='show' />
      </div>
      <div className="col-sm-2">
        <button type="button" class="btn btn-primary" onClick={addIntervalHandler}>+</button>
      </div>
    </div>
    // <input type='range' value={interval} min={min} max={max} step='1' onChange={e => setInterval(parseInt(e.target.value))} />
  )

  return (
    !loading && (
      <Card header={HappinessScoreDistributionHeader} footer={HappinessScoreDistributionFooter}>
        <BarChart chartId='happiness-score-bin' subChartId='sub-happiness-score-bin' data={filterContent} xKey='label' yKey='value' hoverColor='#c467d4' />
      </Card>
    )
  )
}

export default DataBuilder
