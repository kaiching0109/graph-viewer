import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const HIGHLIGHT_COLOR = d3.interpolateInferno(0.3)
const BAR_COLOR = d3.interpolateInferno(0.4)
const GREY_COLOR = '#898989'
const MARGIN = { top: 50, right: 20, bottom: 50, left: 100 }

const BarChart = props => {
  const { chartId, subChartId, data, xKey, yKey, hoverColor, color } = props
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)
  const [barColor, setBarColor] = useState(color || BAR_COLOR)
  // const hoverColor = useState(hoverColor || null)

  useEffect(() => {
    
    const handleResize = () => {
      const newWidth = chartRef.current.parentNode.clientWidth * 0.95
      const newHeight = chartRef.current.parentNode.clientHeight * 0.8
      if (newWidth !== width || newHeight !== height) {
        setWidth(newWidth)
        setHeight(newHeight)
      }
    }
    setTimeout(() => {
      setWidth(chartRef.current.parentNode.clientWidth * 0.95)
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

  // useEffect(() => {
  //   svg.selectAll('.bar').style('fill').style('fill', d => barColor)
  // }, [barColor])
  //
  // handleHover = () => {
  //
  // }

  const drawChart = () => {
    const chart = d3.select(`#${chartId}`)
    let svg = chart
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%')
      // .attr('transform', 'translateX(100rem)')
    const { xScale, yScale } = getScales(width, height, xKey, yKey, data)
    setAxis(svg, width, height, xScale, yScale, xKey, yKey, data)
    // svg = svg.append('g')
    setBars(svg, width, height, xScale, yScale, xKey, yKey, data)
    // setSubBars(svg, subChartId, width, height, xScale, yScale, xKey, yKey, data)
    svg.selectAll(xKey)
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'xKey')
      .style('fill', 'white')
      .style('display', d => { return d[yKey] === null ? 'none' : null })
      .attr('x', d => { return xScale(d[xKey]) + (xScale.bandwidth() / 2) - 8 })
      // .style('fill', d => {
      //   return d[yKey] === d3.max(data, d => { return d[yKey] })
      //     ? HIGHLIGHT_COLOR : GREY_COLOR
      // })
      .attr('y', d => { return height })
      .attr('height', 0)
      .transition()
      .duration(750)
      .delay((d, i) => { return i * 150 })
      .text(d => { return d[yKey] })
      .attr('y', d => { return yScale(d[yKey]) })
      .attr('dy', '-.7em')
      // .attr('color', 'white')
  }

  // useEffect(() => {
  //   barRef.enter().attr()
  //     .style('fill', d => {
  //       return barColor
  //     })
  // }, [barColor, barRef])

  function setBars (svg, width, height, xScale, yScale, xKey, yKey, data) {
    const bar = svg.selectAll('.bar')
    bar
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('fill', barColor)
      .on('mouseover', function () {
        if (hoverColor) d3.select(this).attr('fill', hoverColor)
        // if (hoverColor) {
        //   // 
        //   setBarColor(hoverColor)
        // }
        // div.transition()
        //     .duration(200)
        //     .style('opacity', 0.9)
        // div	.html(formatTime(d.date) + '<br/>' + d.close)
        //     .style('left', (d3.event.pageX) + 'px')
        //     .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', function () {
        // if (hoverColor) {
        //   d3.select(this).attr("fill", function() {
        //       return "" + colorScale(this.id) + "";
        //   });
        // }
        // setBarColor(barColor)
        d3.select(this).transition().attr('fill', barColor)
          // .style('fill', d => {
          //   return d[yKey] === d3.max(data, d => { return d[yKey] })
          //     ? HIGHLIGHT_COLOR : BAR_COLOR
          // })
        // .attr('fill', 'white')
        // // div.transition()
        // //   .duration(500)
        // //   .style('opacity', 0)
      })
      .style('display', d => { return d[yKey] === null ? 'none' : null })
      // .style('fill', d => {
      //   return d[yKey] === d3.max(data, d => { return d[yKey] })
      //     ? HIGHLIGHT_COLOR : BAR_COLOR
      // })
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
    // setBarRef(bar)
    // setBarColor(barColor)
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
  yScale.domain([0, 200])
  return { xAxis, yAxis }
}

const setAxis = (svg, width, height, xScale, yScale, xKey, yKey, data) => {
  const { xAxis, yAxis } = getAxis(width, height, xScale, yScale, xKey, yKey, data)
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('color', 'white')
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    // .attr('transform', 'translate(10,' + height + ')')
    .attr('color', 'white')
    .call(yAxis)
  return { xScale, yScale }
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
  
  return prevProps.data === props.data
})
