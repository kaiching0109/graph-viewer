import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { ScatterPlot } from '../Module'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Card } from '../../components/Base'

const TITLE = 'Attributes Relationship Scatterplot'

const ScatterplotBuilder = ({ children }) => {
  const data = useStaticQuery(graphql`
    query MergedQuery {
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
            Region
          }
        }
      }
    }
  `)

  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState([])
  const [dropdownItems, setDropdownItems] = useState([])
  const [xDropdown, setXDropdown] = useState([])
  const [yDropdown, setYDropdown] = useState([])
  const [selectX, setSelectX] = useState(null)
  const [selectY, setSelectY] = useState(null)
  const [xContent, setXContent] = useState([])
  const [yContent, setYContent] = useState([])

  useEffect(() => {
    const filterContent = data.allMerged2016Json.edges.map(({ node }) => ({ ...node }))
    if (filterContent.length) {
      const dropdownAttributes = Object.keys(filterContent[0])
        .map(item => {
          const label = item.replace('_', ' ')
          const value = item
          return { label, value }
        })
      setContent(filterContent)
      setDropdownItems(dropdownAttributes)
    }
  }, [data.allMerged2016Json.edges])

  useEffect(() => {
    if (selectX === null && selectY === null && dropdownItems.length > 1) {
      // init
      setSelectX(dropdownItems[0].value)
      setSelectY(dropdownItems[1].value)
    } else if (selectX !== null && selectY !== null && dropdownItems.length > 1) {
      renderDropdowns()
      renderContent()
      setLoading(false)
    }
  }, [selectX, selectY, dropdownItems])

  // useEffect(() => {
  //   if (xContent.length > 0 && yContent.length > 0) {
  //     console.log({ xContent, yContent })
  //   }
  // }, [xContent, yContent])

  function renderDropdowns () {
    const yItems = dropdownItems.filter(({ label, value }) => selectX !== value)
    const xItems = dropdownItems.filter(({ label, value }) => selectY !== value)
    setXDropdown(xItems)
    setYDropdown(yItems)
  }

  function renderContent () {
    console.log({ content })
    const xItems = content.map(row => row[selectX])
    const yItems = content.map(row => row[selectY])
    setXContent(xItems)
    setYContent(yItems)
  }

  const Header = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{TITLE}</p>
        <DropdownButton id='dropdown-basic-button' style={{ float: 'right', display: 'inline-block', paddingRight: '5rem'}} title={selectX}>
          {xDropdown.map((item, i) => {
            const { label, value } = item
            return (
              <Dropdown.Item
                key={i} onClick={() => {
                  setSelectX(value)
                // console.log(value)
                // setSelectRegion(value)
                }}>
                {label}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
        <DropdownButton id='dropdown-basic-button' style={{ float: 'right', display: 'inline-block', paddingRight: '5rem'}} title={selectY}>
          {yDropdown.map((item, i) => {
            const { label, value } = item
            return (
              <Dropdown.Item
                key={i} onClick={() => {
                  setSelectY(value)
                // console.log(value)
                // setSelectRegion(value)
                }}>
                {label}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={Header}>
        <ScatterPlot
          chartId='scatter'
          xLabel={selectX}
          yLabel={selectY}
          xValues={xContent}
          yValues={yContent}
          hoverColor='#c467d4'
        />
      </Card>
    )
  )
}

export default ScatterplotBuilder
