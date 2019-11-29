import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { MDSDisplay } from '../Module'
import { Card } from '../../components/Base'

const EUC_TITLE = 'MDS display (Euclidian distance)'
const CORR_TITLE = 'MDS display (Correlation distance)'

const MDSBuilder = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(1) // 1 is Euclidian Dist, 0 is Corrections
  const [content, setContent] = useState([])
  const [headers, setHeaders] = useState([])
  const [labelRef, setLabelRef] = useState([])
  const data = useStaticQuery(graphql`
    query mdsbQuery {
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
      setContent(content)
      setHeaders(headers)
      setLoading(false)
    }
  }, [data.allMerged2016Json.edges])

  useEffect(() => {
    if (content.length > 0) {
      console.log({ content })
    }
  }, [content])

  const Header = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{mode ? EUC_TITLE : CORR_TITLE}</p>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={Header}>
        <MDSDisplay />
      </Card>
    )
  )
}

export default MDSBuilder
