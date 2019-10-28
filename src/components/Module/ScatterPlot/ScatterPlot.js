import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const ScatterPlot = (props) => {
  const { chartId, xLabel, yLabel, xValues, yValues } = props
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)

  useEffect(() => {
    console.log('INIT')
    const handleResize = () => {
      const newWidth = chartRef.current.parentNode.clientWidth * 0.95
      const newHeight = chartRef.current.parentNode.clientHeight * 0.8
      if (newWidth !== width || newHeight !== height) {
        setWidth(newWidth)
        setHeight(newHeight)
      }
    }
    setTimeout(() => {
      setWidth(chartRef.current.parentNode.clientWidth * 0.95)
      setHeight(chartRef.current.parentNode.clientHeight * 0.8)
    }, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartRef.current])

  useEffect(() => {
    if (xValues && yValues && chartId && width && height) {
      if (!loading) {
        console.log('123123123')
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [width, height, xValues, yValues])

  function drawChart () {
    const xScale = d3.scaleLinear().range([0, width])
    // const xMap = function (d) { return xScale(xValues(d)) }
    const xAxis = d3.axisBottom(xScale).tickSize([]).tickPadding(10)

    const yScale = d3.scaleLinear().range([height, 0])
    // const yMap = function (d) { return yScale(yValues(d)) }
    // const yAxis = d3.axisLeft(yMap)

    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%')

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(20,' + height + ')')
      .attr('color', 'white')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Calories')
  }

  return (
    <div id={chartId} ref={chartRef} style={{ height: '90%' }} />
  )
}

export default ScatterPlot
