import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const ParallelCoordinates = (props) => {
  const { headers, content, chartId, labelRef } = props
  console.log({ labelRef })
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const handleResize = () => {
        const newWidth = chartRef.current.parentNode.clientWidth
        const newHeight = chartRef.current.parentNode.clientHeight
        if (newWidth !== width || newHeight !== height) {
          const dim = d3.min([newWidth, newHeight])
          setWidth(dim)
          setHeight(dim)
        }
      }
      setTimeout(() => {
        const newWidth = chartRef.current.parentNode.clientWidth
        const newHeight = chartRef.current.parentNode.clientHeight
        const dim = d3.min([newWidth, newHeight])
        setWidth(dim)
        setHeight(dim)
      }, 100)
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [chartRef.current])

  useEffect(() => {
    if (content && headers && chartId && width && height) {
      console.log('Here')
      if (!loading) {
        const chart = d3.select(`#${chartId}`)
        if (chart) chart.selectAll('svg').remove()
      } else setLoading(false)
      drawChart()
    }
  }, [width, height, headers, content, labelRef])

  function drawChart () {
    var margin = {top: 30, right: 50, bottom: 10, left: 50}
      // width = 460 - margin.left - margin.right,
      // height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(`#${chartId}`)
    .append("svg")
      .attr("width", width * 3)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data


      // Color scale: give me a specie name, I return a color
      var color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])

      // Here I set the list of dimension manually to control the order of axis:
      const dimensions = labelRef

      // For each dimension, I build a linear scale. I store all in a y object
      var y = {}
      for (const i in dimensions) {
        const name = dimensions[i]
        y[name] = d3.scaleLinear()
          .domain( [0,3] ) // --> Same axis range for each group
          // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
          .range([height, 0])
      }
      const axis_length = width * 2.8
      // Build the X scale -> it find the best position for each Y axis
      const x = d3.scalePoint()
        // .range([0, width * 3])
        .rangeRound([0, axis_length])
        .domain(dimensions)


      // Draw the axis:
      svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) * 1.3 + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
        // Add axis title
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function(d) { return d; })
          .style("fill", "black")

  }


  return (
    <div id={chartId} ref={chartRef} style={{ height: '100%' }} />
  )
}

export default ParallelCoordinates
