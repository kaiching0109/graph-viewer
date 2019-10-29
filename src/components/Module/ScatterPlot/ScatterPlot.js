import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const marginHeight = 70

const ScatterPlot = (props) => {
  const { chartId, xLabel, yLabel, xKey, yKey, content, color } = props
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = chartRef.current.parentNode.clientWidth * 0.95
      const newHeight = chartRef.current.parentNode.clientHeight * 0.9
      if (newWidth !== width || newHeight !== height) {
        setWidth(newWidth)
        setHeight(newHeight)
      }
    }
    setTimeout(() => {
      setWidth(chartRef.current.parentNode.clientWidth * 0.95)
      setHeight(chartRef.current.parentNode.clientHeight * 0.9)
    }, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartRef.current])

  useEffect(() => {
    if (xKey && yKey && content && chartId && width && height) {
      if (!loading) {
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [width, height, xKey, yKey, content])

  function drawChart () {
    const xScale = d3.scaleLinear().range([0, width])
    // const xMap = function (d) { return xScale(xValues(d)) }
    const xAxis = d3.axisBottom(xScale).tickSize([]).tickPadding(10)

    const yScale = d3.scaleLinear().range([height, 0])
    // const yMap = function (d) { return yScale(yValues(d)) }
    const yAxis = d3.axisLeft(yScale)

    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('transform', 'translate(-5,' + 15 + ')')

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(20,' + height + 10 + ')')
      .attr('color', 'white')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      // .attr('x', width)
      // .attr('y', -6)
      .style('text-anchor', 'end')
      .text(xLabel)

    svg.append('g')
      .attr('class', 'y axis')
      .attr('color', 'white')
      .attr('transform', 'translate(25,' + 2.5 + ')')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 20)
      // .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(yLabel)

    xScale.domain(d3.extent(content, d => d[xKey])).nice()
    yScale.domain(d3.extent(content, d => d[yKey])).nice()

    svg.append('g')
      .selectAll('dot')
      .data(content)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return xScale(d[xKey])
      })
      .attr('cy', function (d) { return yScale(d[yKey]) })
      .attr('r', 3.5)
      .style('fill', color)
  }

  return (
    <div id={chartId} ref={chartRef} style={{ height: '100%', top: '50' }} />
  )
}

export default ScatterPlot
