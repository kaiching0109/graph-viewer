import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { BarChart } from '../Module'

const DataBuilder = ({ children }) => {
  const data = useStaticQuery(graphql`
    query WorldHappinessQuery {
      allWorldHappiness2015Json {
        edges {
          node {
            Happiness_Score
          }
        }
      }
    }
  `)

  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState([])
  const [xAxisLabel, setxAxisLabel] = useState([])
  const [interval, setInterval] = useState(2)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(10)

  useEffect(() => {
    let ref = {}
    let temp = []
    let order = []
    if (loading) {
      let counter = 0
      data.allWorldHappiness2015Json.edges
        .map(({ node: { Happiness_Score: score } }, i) => {
          const index = Math.round(score / interval)
          if (temp[index]) temp[index]++
          else temp[index] = 1
        })
      for (let from = min; from <= max; from += interval) {
        let to = from + interval - 1
        if (to > max) to = max
        const key = (from === to) ? `${to}` : `${from}-${to}`
        const value = temp[counter++]
        ref[key] = value ? value : 0
        order.push(key)
      }
      const result = order.map(key => ({ label: key, value: ref[key] }))
      setContent(result)
      setLoading(false)
    }
  }, [data.allWorldHappiness2015Json.edges])

  console.log(content)

  return (
    !loading && (
        <BarChart chartId='happiness-score-bin' data={content} xAxisLabels={xAxisLabel} />
    )
  )
}

export default DataBuilder
