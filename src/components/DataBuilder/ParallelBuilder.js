import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { ParallelCoordinates } from '../Module'
import { Card } from '../../components/Base'
import * as d3 from 'd3'
import * as data2grid from 'data2grid'
import * as chroma from 'chroma-js'
import * as jz from 'jeezy'

const TITLE = 'Parallel Coordinates for Attribute Corrections'

const ParallelBuilder = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState([])
  const [headers, setHeaders] = useState([])
  const [corrMatrix, setCorrMatrix] = useState([])
  const [labelRef, setLabelRef] = useState([])
  const data = useStaticQuery(graphql`
    query parallelQuery {
      allMerged2016Json {
        edges {
          node {
            Happiness_Score,
            Economy,
            Family,
            Freedom,
            Government_Trust,
            Generosity,
            Dystopia_Residual,
            Cost_of_Living_Index,
            Cost_of_Living_Plus_Rent_Index,
            Rent_Index,
            Groceries_Index,
            Restaurant_Price_Index,
            Local_Purchasing_Power_Index,
          }
        }
      }
    }
  `)

  useEffect(() => {
    if (data.allMerged2016Json.edges.length > 0) {
      const headers = Object.keys(data.allMerged2016Json.edges[0].node)
      const content = data.allMerged2016Json.edges
        .map(({ node }, i) => {
          return ({ ...node, index: i })
        })
      const corr = jz.arr.correlationMatrix(content, headers)
      setCorrMatrix(corr)
      setContent(content)
      setHeaders(headers)
      setLoading(false)
    }
  }, [data.allMerged2016Json.edges])

  useEffect(() => {
    if (headers.length > 1 && corrMatrix.length > 1) {
      let corrMatrixSum = getCorrelationsSum()
      const corrMatrixRel = getCorrespondingAttr()
      // let max = -Infinity
      // let maxIndex = 0
      // Object.keys(corrMatrixSum).forEach((key, i) => {
      //   if (corrMatrixSum[key] > max) {
      //     max = corrMatrixSum[key]
      //     maxIndex = i
      //   }
      // })
      const orders = Object.keys(corrMatrixSum)
        .sort((a, b) => (corrMatrixSum[a] < corrMatrixSum[b]) ? 1 : -1)
      setLabelRef(orders)
      // console.log({ corrMatrixSum, corrMatrixRel, content, orders, sortedContent })
    }
  }, [corrMatrix])

  function getCorrelationsSum (n) {
    if (corrMatrix.length > 1) {
      const sum = corrMatrix.reduce((acc, val, i) => {
        let { column_x: key, column_y: target, correlation } = val
        correlation = Math.abs(correlation)
        const originalValue = acc[key] ? acc[key] : 0
        const corr = (key !== target) ? originalValue + correlation : originalValue
        delete acc.column_x
        delete acc.column_y
        delete acc.correlation
        return { ...acc, [key]: corr }
      })
      return sum
    } else return []
  }

  function getCorrespondingAttr () {
    let corrRef = {}
    // create Object to store which attr is max
    headers.forEach(header => { corrRef[header] = [header, 0] })
    corrMatrix.forEach((row) => {
      if (Object.entries(row).length !== 0 || row.constructor !== Object) {
        let { column_x: columnX, column_y: columnY, correlation } = row
        correlation = Math.abs(correlation)
        const [attr, value] = corrRef[columnX]
        if (columnX !== columnY && columnY !== attr) {
          if (value < correlation) corrRef[columnX] = [columnY, correlation]
        }
      }
    })
    return corrRef
  }

  const Header = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{TITLE}</p>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={Header} overrideStyle={{cardBody: {overflowX: 'scroll'}}}>
        <ParallelCoordinates
          chartId='parallel-coordinates'
          content={content}
          headers={headers}
          labelRef={labelRef}
        />
      </Card>
    )
  )
}

export default ParallelBuilder
