import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

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
  const [interval, setInterval] = useState(2)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(10)

  useEffect(() => {
    let ref = {}
    let arrangedContent = []
    if (loading) {
      let counter = 0
      data.allWorldHappiness2015Json.edges
        .map(({ node: { Happiness_Score: score } }, i) => {
          const index = Math.round(score / interval)
          if (arrangedContent[index]) arrangedContent[index]++
          else arrangedContent[index] = 1
        })
      for (let from = min; from <= max; from += interval) {
        let to = from + interval - 1
        if (to > max) to = max
        if (from === to) ref[`${to}`] = 0
        else {
          const value = arrangedContent[counter++]
          ref[`${from}-${to}`] = value ? value : 0
        }
      }
      // setContent()
      console.log({ arrangedContent, ref })
      setLoading(false)
    }
  }, [data.allWorldHappiness2015Json.edges])

  console.log(content)

  return (
    <>
      <h1>Hello world</h1>
    </>
  )
}

export default DataBuilder
