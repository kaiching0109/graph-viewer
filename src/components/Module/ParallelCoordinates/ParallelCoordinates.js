import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const ParallelCoordinates = (props) => {
  const { headers, content, chartId, labelRef } = props
  // console.log({ labelRef })
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const handleResize = () => {
        const newWidth = chartRef.current.parentNode.clientWidth
        const newHeight = chartRef.current.parentNode.clientHeight * 1.5
        if (newWidth !== width || newHeight !== height) {
          // const dim = d3.min([newWidth, newHeight])
          setWidth(newWidth)
          setHeight(newHeight)
        }
      }
      setTimeout(() => {
        if (chartRef.current) {
          const newWidth = chartRef.current.parentNode.clientWidth
          const newHeight = chartRef.current.parentNode.clientHeight * 1.5
          // const dim = d3.min([newWidth, newHeight])
          setWidth(newWidth)
          setHeight(newHeight)
        }
      }, 100)
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [chartRef.current])

  useEffect(() => {
    if (content && headers && chartId && height && width) {
      console.log('Here')
      if (!loading) {
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [headers, content, labelRef, height, width])

  function drawChart () {
    const margin = { top: 30, right: 50, bottom: 10, left: 50 }
    let newWidth = 1800 - margin.left - margin.right
    let newHeight = height - margin.top - margin.bottom
    console.log({height})
    // append the svg object to the body of the page
    const svg = d3.select(`#${chartId}`)
      .append('svg')
      .attr('width', newWidth)
      .attr('height', newHeight)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Parse the Data

    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
      .domain(['setosa', 'versicolor', 'virginica'])
      .range(['#440154ff', '#21908dff', '#fde725ff'])

      // Here I set the list of dimension manually to control the order of axis:
      const dimensions = labelRef

      // For each dimension, I build a linear scale. I store all in a y object
      let y = {}
      for (const i in dimensions) {
        const name = dimensions[i]
        y[name] = d3.scaleLinear()
        .domain([-4, 6]) // --> Same axis range for each group
        // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
        .range([height, 0])
      }
      // const axis_length = width * 2.8
      // Build the X scale -> it find the best position for each Y axis
      const x = d3.scalePoint()
        // .range([0, width * 3])
      .rangeRound([0, newWidth])
      .domain(dimensions)

    // Draw the lines
    svg
      .selectAll('myPath')
      .data(content)
      .enter().append('path')
      .attr('transform', function (d) { return 'translate(' + x(d) + ')' })
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', '#69b3a2')
      .style('opacity', 0.5)

    // Draw the axis:
    svg.selectAll('myAxis')
      // For each dimension of the dataset I add a 'g' element:
      // .data(dimensions).enter()
      // .append('g')
      // .attr('class', 'axis')
      // // I translate this element to its right position on the x axis
      // .attr('transform', function (d) { return 'translate(' + x(d) * 1.3 + ')' })
      // // And I build the axis with the call function
      // .each(function (d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])) })
      // // Add axis title
      // .append('text')
      // .style('text-anchor', 'middle')
      // .attr('y', -9)
      // .text(function (d) { return d })
      // .style('fill', 'black')
      //
      svg.selectAll('myAxis')
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append('g')
        // I translate this element to its right position on the x axis
        .attr('transform', function (d) {
          console.log({ d, 'x[d]': x(d) })
          return 'translate(' + x(d) + ')'
         })
        // And I build the axis with the call function
        .each(function (d) {
          console.log(d)
          return d3.select(this).call(d3.axisLeft().scale(y[d]))
        })
        // Add axis title
        .append('text')
        .style('text-anchor', 'middle')
        .attr('y', -9)
        .text(function (d) { return d; })
        .style('fill', 'black')

      function path (d) {
        return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])] }))
      }
  }

  return (
    <div id={chartId} ref={chartRef} style={{ height: '100%' }} />
  )
}

export default ParallelCoordinates
