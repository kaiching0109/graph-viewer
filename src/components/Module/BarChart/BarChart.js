import React, { useEffect, useState, useContext, useRef } from 'react'
import { WindowDimensionsContext } from '../../../context/window-dimensions-context'
import * as d3 from 'd3'
import useResponsivefy from '../../../hooks/useResponsivefy'

const BarChart = props => {
  const [svg, setSVG] = useState(null)
  const { chartId, data } = props
  const context = useContext(WindowDimensionsContext)
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)

  const margin = { top: 50, right: 20, bottom: 50, left: 100 }
  const greyColor = '#898989'
  const barColor = d3.interpolateInferno(0.4)
  const highlightColor = d3.interpolateInferno(0.3)
  const chartRef = useRef(null)

  useEffect(() => {
    // let resizeTimer
    const handleResize = () => {
      // clearTimeout(resizeTimer)
      // resizeTimer = setTimeout(function () {
      // console.log(chartRef.current.parentNode.clientHeight)
      const chart = d3.select(`#${chartId}`)
      if (chart) chart.selectAll('svg').remove()
      setWidth(chartRef.current.parentNode.clientWidth)
      setHeight(chartRef.current.parentNode.clientHeight)
      // }, 300)
    }
    setWidth(chartRef.current.parentNode.clientWidth)
    setHeight(chartRef.current.parentNode.clientHeight)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (data && chartId && width && height) {
      console.log({ width, height })
      drawChart()
    }
  }, [width, height])

  function drawChart () {
    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.4)
    const y = d3.scaleLinear()
      .range([height, 0])
    const xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10)
    const yAxis = d3.axisLeft(y)
    x.domain(data.map(d => d.label))
    y.domain([0, 100])

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .style('display', d => { return d.value === null ? 'none' : null })
      .style('fill', d => {
        return d.value === d3.max(data, d => { return d.value })
          ? highlightColor : barColor
      })
      .attr('x', d => { return x(d.label) })
      .attr('width', x.bandwidth())
      .attr('y', d => { return height })
      .attr('height', 0)
      .transition()
      .duration(750)
      .delay(function (d, i) {
        return i * 150
      })
      .attr('y', d => { return y(d.value) })
      .attr('height', d => { return height - y(d.value) })

    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .style('display', d => { return d.value === null ? 'none' : null })
      .attr('x', d => { return x(d.label) + (x.bandwidth() / 2) - 8 })
      .style('fill', d => {
        return d.value === d3.max(data, d => { return d.value })
          ? highlightColor : greyColor
      })
      .attr('y', d => { return height })
      .attr('height', 0)
      .transition()
      .duration(750)
      .delay((d, i) => { return i * 150 })
      .text(d => { return d.value })
      .attr('y', d => { return y(d.value) + 0.1 })
      .attr('dy', '-.7em')
  }

  return (
    <div id={chartId} ref={chartRef} />
  )
}

// const initChart = (svg, { data, xAxisLabels, yAxisLables, width, height, margin }) => {
//   const greyColor = '#898989'
//   const barColor = d3.interpolateInferno(0.4)
//   const highlightColor = d3.interpolateInferno(0.3)
//
// }

export default BarChart
