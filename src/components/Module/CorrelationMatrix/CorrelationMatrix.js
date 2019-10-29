import React, { useEffect, useState, useRef } from 'react'
import * as jz from 'jeezy'
import * as d3 from 'd3'
import * as data2grid from 'data2grid'
import * as chroma from 'chroma-js'

const CorrelationMatrix = (props) => {
  const { headers, content, chartId, labelRef } = props
  console.log({ labelRef })
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef) {
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
  }, [chartRef])


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
    console.log({ headers })
    const displayLabels = headers.map(header => labelRef[header])
    const corr = jz.arr.correlationMatrix(content, displayLabels)
    const extent = d3.extent(corr
      .map(function (d) { return d.correlation })
      .filter(function (d) { return d !== 1 })
    )
    const grid = data2grid.grid(corr)
    const rows = d3.max(grid, (d) => d.row)

    const chart = d3.select(`#${chartId}`)
    const svg = chart
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', 'translate(0,' + 30 + ')')

    const padding = 0.1
    const x = d3.scaleBand()
      .range([0, width * 0.7])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1))
    const y = d3.scaleBand()
      .range([0, height * 0.7])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1))
    const c = chroma.scale(['tomato', 'white', 'steelblue'])
      .domain([extent[0], 0, extent[1]])

    const xAxis = d3.axisTop(y).tickFormat(function (d, i) { return labelRef[headers[i]] })
    const yAxis = d3.axisLeft(x).tickFormat(function (d, i) { return labelRef[headers[i]] })

    svg.append('g')
      .attr('class', 'x axis')
      .attr('color', 'white')
      .attr('height', '100%')
      .attr('transform', 'translate(30,-5)')
      .call(xAxis)

    svg.append('g')
      .attr('class', 'y axis')
      .attr('color', 'white')
      .attr('height', '100%')
      .attr('transform', 'translate(30,0)')
      .call(yAxis)

    svg.selectAll('rect')
      .data(grid, function (d) { return d.column_x + d.column_y })
      .enter().append('rect')
      .attr('x', function (d) { return x(d.column) })
      .attr('y', function (d) { return y(d.row) })
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) { return c(d.correlation) })
      .style('opacity', 1e-6)
      .attr('transform', 'translate(35, 0)')
      .style('opacity', 1)

    svg.selectAll('rect')
  }

  return (
    <div id={chartId} ref={chartRef} style={{ height: '100%' }} />
  )
}

export default CorrelationMatrix
