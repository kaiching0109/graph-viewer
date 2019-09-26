import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const HIGHLIGHT_COLOR = d3.interpolateInferno(0.3)
const BAR_COLOR = d3.interpolateInferno(0.4)
const GREY_COLOR = '#898989'
const MARGIN = { top: 50, right: 20, bottom: 50, left: 100 }

const BarChart = props => {
  const { chartId, data, xKey, yKey } = props
  console.log({ data })
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      const chart = d3.select(`#${chartId}`)
      if (chart) chart.selectAll('svg').remove()
      setWidth(chartRef.current.parentNode.clientWidth)
      setHeight(chartRef.current.parentNode.clientHeight)
    }
    setWidth(chartRef.current.parentNode.clientWidth)
    setHeight(chartRef.current.parentNode.clientHeight)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (data && chartId && width && height) drawChart()
  }, [width, height])

  function drawChart () {
    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
    const { xScale, yScale } = getScales(width, height, xKey, yKey, data)
    setAxis(svg, width, height, xScale, yScale, xKey, yKey, data)
    setBars(svg, width, height, xScale, yScale, xKey, yKey, data)
    svg.selectAll(xKey)
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'xKey')
      .style('display', d => { return d[yKey] === null ? 'none' : null })
      .attr('x', d => { return xScale(d[xKey]) + (xScale.bandwidth() / 2) - 8 })
      .style('fill', d => {
        return d[yKey] === d3.max(data, d => { return d[yKey] })
          ? HIGHLIGHT_COLOR : GREY_COLOR
      })
      .attr('y', d => { return height })
      .attr('height', 0)
      .transition()
      .duration(750)
      .delay((d, i) => { return i * 150 })
      .text(d => { return d[yKey] })
      .attr('y', d => { return yScale(d[yKey]) + 0.1 })
      .attr('dy', '-.7em')
  }

  return (
    <div id={chartId} ref={chartRef} />
  )
}

const getScales = (width, height, xKey, yKey, data) => {
  const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.4)
  const yScale = d3.scaleLinear()
    .range([height, 0])
  return { xScale, yScale }
}

const getAxis = (width, height, xScale, yScale, xKey, yKey, data) => {
  const xAxis = d3.axisBottom(xScale).tickSize([]).tickPadding(10)
  const yAxis = d3.axisLeft(yScale)
  xScale.domain(data.map(d => d[xKey]))
  yScale.domain([0, 100])
  return { xAxis, yAxis }
}

const setAxis = (svg, width, height, xScale, yScale, xKey, yKey, data) => {
  const { xAxis, yAxis } = getAxis(width, height, xScale, yScale, xKey, yKey, data)
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
  return { xScale, yScale }
}

const setBars = (svg, width, height, xScale, yScale, xKey, yKey, data) => {
  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .style('display', d => { return d[yKey] === null ? 'none' : null })
    .style('fill', d => {
      return d[yKey] === d3.max(data, d => { return d[yKey] })
        ? HIGHLIGHT_COLOR : BAR_COLOR
    })
    .attr('x', d => { return xScale(d[xKey]) })
    .attr('width', xScale.bandwidth())
    .attr('y', d => { return height })
    .attr('height', 0)
    .transition()
    .duration(750)
    .delay(function (d, i) {
      return i * 150
    })
    .attr('y', d => { return yScale(d[yKey]) })
    .attr('height', d => { return height - yScale(d[yKey]) })
}

export default BarChart
