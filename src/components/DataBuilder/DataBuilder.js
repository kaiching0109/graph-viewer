import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { BarChart } from '../Module'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Card } from '../../components/Base'

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
    // if (loadData) {
    console.log('Update content')
    let result = []
    data.allWorldHappiness2015Json.edges
      .map(({ node: { Happiness_Score: score, Region: region } }) => {
        let index = Math.round(score / interval)
        if (interval === max) index = 0
        // if (selectRegion) {
        const isFound = regions.find(_ => {
          console.log(_, region)
          return _.value === region.toLowerCase()
        })
        regions = isFound ? regions : [...regions, { label: region, value: region.toLowerCase() }]
        // }
        if (selectRegion !== 'all') {
          console.log({ selectRegion, region })
          if (selectRegion === region.toLowerCase()) {
            // console.log('Update result')
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
      console.log('Update filter content')
      let counter = 0
      let order = []
      let ref = {}
      console.log({ content, interval })
      for (let from = min; from <= max; from += interval) {
        let to = from + interval - 1
        console.log({ from, to, min, max })
        if (to > max) to = max
        const key = (from === to) ? `${to}` : `${from}-${to}`
        const value = content[counter++]
        ref[key] = value ? value.length : 0
        order.push(key)
      }
      console.log({ ref })
      const result = order.map(key => ({ label: key, value: ref[key] }))
      // console.log({ content })
      setFilterContent(result)
      setLoading(false)
      console.log({ result })
    }
  }, [content, interval])

  // useEffect(() => {
  //   console.log({ filterContent })
  // }, [filterContent])

  const HappinessScoreDistributionHeader = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>Title</p>
        <DropdownButton id='dropdown-basic-button' style={{ float: 'right', display: 'inline-block' }}>
          {dropdownItems.map((item, i) => {
            const { label, value } = item
            return <Dropdown.Item key={i} onClick={() => {
              console.log(value)
              setSelectRegion(value)
            }}>{label}</Dropdown.Item>
          })}
        </DropdownButton>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={HappinessScoreDistributionHeader} footer={<input type='range' value={interval} min={min} max={max} step='1' onChange={e => setInterval(parseInt(e.target.value))} />}>
        <BarChart chartId='happiness-score-bin' subChartId='sub-happiness-score-bin' data={filterContent} xKey='label' yKey='value' hoverColor='black' />
      </Card>
    )
  )
}

export default DataBuilder
