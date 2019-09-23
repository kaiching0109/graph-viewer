import React, { useEffect } from 'react'
import * as d3 from 'd3'

const BarChart = props => {
  useEffect(() => {
    drawChart()
  })

  const drawChart = () => {
    const data = [12, 5, 6, 6, 9, 10]
    const svg = d3.select('#chart').append('svg').attr('width', 400).attr('height', 300)
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 70)
      .attr('y', 0)
      .attr('width', 25)
      .attr('height', (d, i) => d)
      .attr('fill', 'green')
  }

  return <div id='chart' />
}

export default BarChart
