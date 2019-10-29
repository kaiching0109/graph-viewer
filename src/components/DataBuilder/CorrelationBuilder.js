import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { CorrelationMatrix } from '../Module'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Card } from '../../components/Base'

const TITLE = 'Correction Matrix Map'

const LABEL_REF = {
  Happiness_Score: 'hs',
  Economy: 'ec',
  Family: 'fa',
  Freedom: 'fr',
  Government_Trust: 'gt',
  Generosity: 'ge',
  Dystopia_Residual: 'dr',
  Cost_of_Living_Index: 'cl',
  Cost_of_Living_Plus_Rent_Index: 'clr',
  Rent_Index: 'r',
  Groceries_Index: 'gr',
  Restaurant_Price_Index: 'rp',
  Local_Purchasing_Power_Index: 'lp',
  Region: 're'
}

const CorrelationMatrixBuilder = ({ children }) => {
  const data = useStaticQuery(graphql`
    query allMergedQuery {
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
            Local_Purchasing_Power_Index
          }
        }
      }
    }
  `)

  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState([])
  const [headers, setHeaders] = useState([])

  useEffect(() => {
    if (data.allMerged2016Json.edges.length > 0) {
      const headers = Object.keys(data.allMerged2016Json.edges[0].node)
      const content = data.allMerged2016Json.edges
        .map(({ node }, i) => {
          Object.keys(node).forEach(oldKey => {
            node[LABEL_REF[oldKey]] = node[oldKey]
            delete node[oldKey]
          })
          return ({ ...node, index: i })
        })
      setContent(content)
      setHeaders(headers)
      setLoading(false)
    }
  }, [data.allMerged2016Json.edges])

  const Header = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{TITLE}</p>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={Header}>
        <CorrelationMatrix
          chartId='correlation-matrix'
          content={content}
          headers={headers}
          labelRef={LABEL_REF}
          // xLabel={selectX}
          // yLabel={selectY}
          // xKey={selectX}
          // yKey={selectY}
          // content={content}
          // hoverColor='#c467d4'
          // color='rgb(147, 38, 103)'
        />
      </Card>
    )
  )
}

export default CorrelationMatrixBuilder
