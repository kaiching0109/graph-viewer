import React, { useEffect, useState, useRef } from 'react'
import * as jz from 'jeezy'
import * as d3 from 'd3'
import * as data2grid from 'data2grid'

const CorrelationMatrix = (props) => {
  const { headers, content, chartId } = props
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = chartRef.current.parentNode.clientWidth * 0.9
      const newHeight = chartRef.current.parentNode.clientHeight * 0.9
      if (newWidth !== width || newHeight !== height) {
        setWidth(newWidth)
        setHeight(newHeight)
      }
    }
    setTimeout(() => {
      setWidth(chartRef.current.parentNode.clientWidth * 1.2)
      setHeight(chartRef.current.parentNode.clientHeight)
    }, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartRef.current])


  useEffect(() => {
    if (content && headers && chartId && width && height) {
      if (!loading) {
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [width, height, headers, content])

  function drawChart () {
    const corr = jz.arr.correlationMatrix(content, headers)
    console.log({ corr })
    const extent = d3.extent(corr
      .map((d) => d.correlation)
      .filter((d) => d !== 1)
    )
    const grid = data2grid.grid(corr)
    const rows = d3.max(grid, (d) => d.row)

    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', 'translate(50,' + 28 + ')')

    const padding = 0.1
    const x = d3.scaleBand()
      .range([0, width * 0.3])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1))
    const y = d3.scaleBand()
      .range([0, height])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1))

    const xAxis = d3.axisTop(y).tickFormat(function (d, i) { return headers[i] })
    const yAxis = d3.axisLeft(x).tickFormat(function (d, i) { return headers[i] })

    svg.append('g')
      .attr('class', 'x axis')
      .attr('color', 'white')
      .attr('height', '100%')
      .call(xAxis)

    svg.append('g')
      .attr('class', 'y axis')
      .attr('color', 'white')
      .call(yAxis)
  }

  return (
    <div id={chartId} ref={chartRef} style={{ height: '100%' }} />
  )
}

export default CorrelationMatrix
