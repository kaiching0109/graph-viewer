import React, { useEffect, useState, useContext } from 'react'
import { WindowDimensionsContext } from '../../../context/window-dimensions-context'
import * as d3 from 'd3'
import useResponsivefy from '../../../hooks/useResponsivefy'

const BarChart = props => {
  const [svg, setSVG] = useState(null)
  const { chartId } = props
  const context = useContext(WindowDimensionsContext)
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  const target = useResponsivefy(svg)
  if (!height && !width) {
    if (target) {
      const { targetWidth, targetHeight } = target
      setWidth(targetWidth)
      setHeight(targetHeight)
    }
  }

  useEffect(() => {
    const margin = { top: 40, right: 30, bottom: 30, left: 50 }
    // const width = 460 - margin.left - margin.right,
    // height = 320 - margin.top - margin.bottom
    const { data } = props
    console.log({ data })
    if (context.width && context.height) {
      console.log('hohoho')
      if ((!svg || !data)) {
        console.log('123123123')
        const chart = d3.select(`#${chartId}`)
        const svgSelector = chart
          .append('svg')
        setSVG(svgSelector)
      } else { drawChart(svg, { ...props, margin, height, width }) }
    }
  }, [svg, chartId, props, props.data, context.width, context.height, height, width])

  return (
    <div style={{ padding: '2rem' }} id={chartId} />
  )
}

const drawChart = (svg, { data, xAxisLabels, yAxisLables, width, height, margin }) => {
  console.log('Here')
  console.log({ height, width })
  var greyColor = '#898989'
  var barColor = d3.interpolateInferno(0.4)
  var highlightColor = d3.interpolateInferno(0.3)
  svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
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
        .style('fill',  d => {
            return d.value === d3.max(data,  d => { return d.value })
            ? highlightColor : barColor
            })
        .attr('x',  d => { return x(d.label) })
        .attr('width', x.bandwidth())
            .attr('y',  d => { return height })
            .attr('height', 0)
                .transition()
                .duration(750)
                .delay(function (d, i) {
                    return i * 150
                })
        .attr('y',  d => { return y(d.value) })
        .attr('height',  d => { return height - y(d.value) })

        svg.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .style('display',  d => { return d.value === null ? 'none' : null })
            .attr('x', ( d => { return x(d.label) + (x.bandwidth() / 2) - 8  }))
                .style('fill',  d => {
                    return d.value === d3.max(data,  d => { return d.value })
                    ? highlightColor : greyColor
                    })
            .attr('y',  d => { return height })
                .attr('height', 0)
                    .transition()
                    .duration(750)
                    .delay((d, i) => { return i * 150 })
            .text( d => { return d.value })
            .attr('y',  d => { return y(d.value) + .1 })
            .attr('dy', '-.7em')
}

export default BarChart
