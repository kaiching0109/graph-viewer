import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const Brush = (props) => {
  const { parentX, parentY, chartId, xLabel, yLabel, xKey, yKey, content, color } = props
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
      setWidth(chartRef.current.parentNode.clientWidth)
      setHeight(chartRef.current.parentNode.clientHeight)
    }, 100)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartRef.current])

  useEffect(() => {
    if (content && chartId && width && height) {
      if (!loading) {
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [width, height, content])

  function drawChart () {
    const margin = { top: 430, right: 20, bottom: 30, left: 40 }
    const newWidth = width - margin.left - margin.right
    const newHeight = height - margin.top - margin.bottom
    const xScale = d3.scaleLinear()
    xScale
      .domain([d3.min(content, d => Number(d[xKey])) - 1, d3.max(content, d => Number(d[xKey])) + 1])
      .range([0, newWidth])
    // const xMap = function (d) { return xScale(xValues(d)) }
    const xAxis = d3.axisBottom(xScale).tickPadding(1)
    const yScale = d3.scaleLinear().range([newHeight, 0])
    // const yMap = function (d) { return yScale(yValues(d)) }
    yScale.domain([d3.min(content, d => Number(d[yKey])), d3.max(content, d => Number(d[yKey]))])
    const yAxis = d3.axisLeft(yScale)
    const brush = d3.brushX()
      .extent([[0, 0], [width, newHeight]])
      .on('brush end', brushed)

    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // const area = d3.area()
    //   .curve(d3.curveMonotoneX)
    //   .x(function (d) { return xScale(d[xKey]) })
    //   .y0(newHeight)
    //   .y1(function (d) { return yScale(d[yKey]) })

    const area2 = d3.area()
      .curve(d3.curveMonotoneX)
      .x(function (d) { return xScale(d[xKey]) })
      .y0(newHeight)
      .y1(function (d) { return yScale(d[yKey]) })

    const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // focus.append('path')
    //     .datum(content)
    //     .attr('class', 'area')
    //     .attr('d', area)

    svg.append('g')
      .attr('class', `x axis ${chartId}`)
      .attr('width', '100%')
      .attr('transform', 'translate(20,' + newHeight + ')')
      .attr('color', 'white')

    // focus.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', 'translate(0,' + height + ')')
    //   .call(xAxis)
    //
    // focus.append('g')
    //   .attr('class', 'axis axis--y')
    //   .call(yAxis)

    context.append('path')
      .datum(content)
      .attr('class', 'area')
      .attr('d', area2)

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)
      //
      // .call(xAxis)
      // .append('text')
      // .attr('class', 'label')
      // // .attr('x', width)
      // // .attr('y', -6)
      // .style('text-anchor', 'end')
      // .text(xLabel)

    svg.append('g')
      .attr('class', `y axis ${chartId}`)
      .attr('color', 'white')
      .attr('transform', 'translate(25,' + 10 + ')')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 20)
      // .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(yLabel)

    svg.append('g')
      .selectAll('dot')
      .data(content)
      .enter()
      .append('circle')
      .attr('cx', function (d) {

        //
        return xScale(Number(d[xKey]))
      })
      .attr('cy', function (d) { return yScale(Number(d[yKey])) })
      .attr('r', 2.5)
      .style('fill', color)

    function brushed () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom
      var s = d3.event.selection || xScale.range()
      // parentX.domain(s.map(xScale.invert, xScale))
      // focus.select('.area').attr('d', area)
      // focus.select('.axis--x').call(xAxis)
      // svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
      //     .scale(width / (s[1] - s[0]))
      //     .translate(-s[0], 0));
    }
  }

  return (
    <div id={chartId} ref={chartRef} style={{ height: '100%', top: '50' }} />
  )
}

export default Brush
