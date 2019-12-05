import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { MDSDisplay } from '../Module'
import { Card } from '../../components/Base'
// import * as d3 from 'd3'

const EUC_TITLE = 'MDS display (Euclidian distance)'
// const CORR_TITLE = 'MDS display (Correlation distance)'

const MDSBuilder = ({ children }) => {
  const [loading, setLoading] = useState(true)
  // const [mode, setMode] = useState(1) // 1 is Euclidian Dist, 0 is Corrections
  const [content, setContent] = useState([])
  const [headers, setHeaders] = useState([])
  // const [labelRef, setLabelRef] = useState([])
  // const [formatContent, setFormatContent] = useState([])
  const data = useStaticQuery(graphql`
    query AllMdsBrushPoints {
      allMdsPointsCsv {
        edges {
          node {
            x
            y
            Happiness_Score
          }
        }
      }
    }
  `)

  useEffect(() => {
    // data.allPeopleCsv.nodes.length
    if (data.allMdsPointsCsv.edges.length > 0) {
      const headers = Object.keys(data.allMdsPointsCsv.edges[0].node)
      const content = data.allMdsPointsCsv.edges
        .map(({ node }, i) => {
          Object.keys(node).map(key => { node[key] = Number(node[key]) })
          return ({ ...node, index: i })
        })

      // const headers = Object.keys(data.allMerged2016Json.edges[0].node)
      // const content = data.allMerged2016Json.edges
      //   .map(({ node }, i) => {
      //     return ({ ...node, index: i })
      //   })
      setContent(content)
      setHeaders(headers)
      setLoading(false)
    }
  }, [data.allPointsCsv])
  // var xAxis = d3.axisBottom(x)
  //   xAxis2 = d3.axisBottom(x2)
  //   yAxis = d3.axisLeft(y)
  // useEffect(() => {
  //
  // }, [content])

  // useEffect(() => {
  //   if (formatContent.length > 0) {
  //     const pointsData = mdsClassic(formatContent)
  //     // let hello = numeric.transpose(pointsData)
  //     //
  //     setLoading(false)
  //     //
  //   }
  // }, [formatContent])

  const Header = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{EUC_TITLE}</p>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={Header}>
        <MDSDisplay
          chartId='mdsWithBrush'
          headers={headers}
          content={content}
          hoverColor='#c467d4'
          color='rgb(200, 38, 103)'
        />
      </Card>
    )
  )
}

export default MDSBuilder
