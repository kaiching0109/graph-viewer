import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const HIGHLIGHT_COLOR = d3.interpolateInferno(0.3)
const BAR_COLOR = d3.interpolateInferno(0.4)
const GREY_COLOR = '#898989'
const MARGIN = { top: 50, right: 20, bottom: 50, left: 100 }

const BarChart = props => {
  const { chartId, subChartId, data, xKey, yKey } = props
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)
  const subChartRef = useRef(null)

  useEffect(() => {
    console.log('INIT')
    const handleResize = () => {
      const newWidth = chartRef.current.parentNode.clientWidth
      const newHeight = chartRef.current.parentNode.clientHeight * 0.8
      if (newWidth !== width || newHeight !== height) {
        setWidth(newWidth)
        setHeight(newHeight)
      }
    }
    setTimeout(() => {
      setWidth(chartRef.current.parentNode.clientWidth)
      setHeight(chartRef.current.parentNode.clientHeight * 0.8)
    }, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartRef.current])

  useEffect(() => {
    if (data && chartId && width && height) {
      if (!loading) {
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [width, height, data])

  function drawChart () {
    const chart = d3.select(`#${chartId}`)
    let svg = chart
      .append('svg')
      .attr('height', '100%')
      // .attr('transform', 'translateX(100rem)')
    const { xScale, yScale } = getScales(width, height, xKey, yKey, data)
    setAxis(svg, width, height, xScale, yScale, xKey, yKey, data)
    svg = svg.append('g')
    setBars(svg, width, height, xScale, yScale, xKey, yKey, data)
    // setSubBars(svg, subChartId, width, height, xScale, yScale, xKey, yKey, data)
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
    <div id={chartId} ref={chartRef} style={{ height: '90%' }} />
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
    .attr('transform', 'translate(20,' + height + ')')
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

const setSubBars = (svg, subChartId, width, height, xScale, yScale, xKey, yKey, data) => {
  const chart = d3.select(`#${subChartId}`)
  svg = chart
    .append('svg')
    .attr('height', '100%')
  const xOverview = d3.scaleBand()
    .domain(data.map(function (d) { return d.label }))
    .range([0, width], 0.2)
  const yOverview = d3.scaleLinear()
    .range([height, 0])
  yOverview.domain(yScale.domain())
  const subBars = svg.selectAll('.subBar')
    .data(data)
  subBars.enter().append('rect')
    .classed('subBar', true)
    .attr('height', d => `${height - yScale(d[yKey])}`)
    .attr('x', d => { return xOverview(d[xKey]) })
    .attr('width', xOverview.bandwidth())
    .attr('y', d => { return yOverview(d[yKey]) })
}

export default React.memo(BarChart, (prevProps, props) => {
  console.log({ prevProps: prevProps.data, props: props.data })
  return prevProps.data === props.data
})
