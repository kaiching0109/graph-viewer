import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const MDSDisplay = props => {
  const { chartId, content, color } = props
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)
  const brushChartRef = useRef(null)
  const [displayContent, setDisplayContent] = useState([...content])
  const [selection, setSelection] = useState([])
  const [rangeX, setRangeX] = useState([])
  const [rangeY, setRangeY] = useState([])

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
      console.log({
        width: chartRef.current.parentNode.clientWidth,
        height: chartRef.current.parentNode.clientHeight
      })
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
        const chartBrush = d3.select(`#${chartId}-brush`)
        if (chart || chartBrush) {
          chart.selectAll('svg').remove()
          chartBrush.selectAll('svg').remove()
        }
      } else {
        setLoading(false)
      }
      drawChart(true)
    }
  }, [width, height, content, displayContent])

  function drawChart (withBrush) {
    const margin = { top: 20, right: 20, bottom: 110, left: 40 }
    const margin2 = { top: 50, right: 20, bottom: 30, left: 40 }
    const chart = d3.select(`#${chartId}`)
    const brushChart = d3.select(`#${chartId}-brush`)
    const width1 = width - margin.left - margin.right
    const height1 = height * 9 / 10 - margin.top - margin.bottom
    const height2 = height - height1 - margin.top - margin.bottom

    const svg = chart.append('svg')
      .attr('height', height1 + margin.top + margin.bottom)
      .attr('width', width)
    const brushSvg = brushChart.append('svg')
      .attr('height', height2 + margin2.top + margin2.bottom)
      .attr('width', width)

    const x = d3.scaleLinear().range([0, width1])
    const x2 = d3.scaleLinear().range([0, width1])
    const y = d3.scaleLinear().range([height1, 0])
    const y2 = d3.scaleLinear().range([height2, 0])
    const xAxis = d3.axisBottom(x)
    const xAxis2 = d3.axisBottom(x2)
    const yAxis = d3.axisLeft(y)

    const area = d3.area()
      // .curve(d3.curveMonotoneX)
      .x(function (d) { return x(d.x) })
      .y0(height1)
      .y1(function (d) { return y(d.y) })

    const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('fill', 'none')
      // .axis line,
      // .axis path {
      //   fill: none;
      //   stroke: #000;
      //   shape-rendering: crispEdges;
      // }

    let xRange = d3.extent(displayContent, function (d) { return Number(d.x) })
    let yRange = d3.extent(displayContent, function (d) { return Number(d.y) })

    if (rangeX.length !== 2) {
      setRangeX(xRange)
    } else xRange = rangeX
    x.domain(xRange)
    console.log({ xRange })
    if (rangeY.length !== 2) {
      setRangeY(yRange)
    } else yRange = rangeY
    y.domain(yRange)
    console.log({ yRange })
    x2.domain(d3.extent(content, function (d) { return Number(d.Happiness_Score) }))
    y2.domain(y.domain())

    if (withBrush) {
      drawBrush(svg)
      // setInit(false)
    }

    focus.append('path')
      .datum(displayContent)
      .attr('class', 'area')
      .attr('d', area)
      .attr('z', 999)

    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height1 + ')')
      .call(xAxis)

    focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis)

    svg.append('g')
      // .attr('class', 'zoom')
      .selectAll('dot')
      .data(displayContent)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return x(Number(d.x))
      })
      .attr('cy', function (d) { return y(Number(d.y)) })
      .attr('r', 2.5)
      .style('fill', color)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    function drawBrush (svg) {
      const brush = d3.brushX()
        .extent([[0, 0], [width1, height2]])
        // .on('brush', brushended)
        .on('end', brushended)

      const area2 = d3.area()
        // .curve(d3.curveMonotoneX)
        .x(function (d) { return x2(d.Happiness_Score) })
        .y0(height2)
        .y1(function (d) { return y2(d.y) })

      const context = brushSvg.append('g')
        .attr('class', 'context')
        .attr('transform', 'translate(' + margin.left + ', 0)')
        .attr('fill', 'none')

      context
        .append('path')
        .datum(displayContent)
        .attr('class', 'area')
        .attr('d', area2)
        .attr('z', 999)

      context
        .append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis2)

      context.append('g')
        .attr('class', 'brush')
        .attr('transform', 'translate(0, 0)')
        .call(brush)
        .call(brush.move, selection.length === 2 ? selection : x2.range())
    }

    function brushended () {
      const d3Selection = d3.event.selection
      if (!d3.event.sourceEvent || !d3Selection) return null
      else {
        setSelection(d3Selection)
        const selectedScores = d3Selection.map(d => {
          console.log({ d })
          // console.log({ 'x2.invert(d)': x2.invert(d) })
          return x2.invert(d)
        })
        onBrushed(selectedScores)
      }
    }

    function onBrushed (selectedScores) {
      console.log({ selectedScores })
      const newContent = content.map(_ => {
        if (selectedScores.length === 2) {
          const min = selectedScores[0]
          const max = selectedScores[1]
          if (min < _.Happiness_Score && _.Happiness_Score < max) return _
          else return null
        }
      }).filter(x => x)
      console.log({ newContent })
      if (selectedScores.length === 2) {
        // let resizeTimer
        // const handleResize = () => {
        // clearTimeout(resizeTimer)
        setTimeout(function () {
          setDisplayContent(newContent)
        }, 300)
        // }
      }
    }
  }

  // funciotn updateChart () {
  //   const chart = d3.select(`#${chartId}`)
  //   chart
  // }

  return (
    [
      <div key={0} id={chartId} ref={chartRef} />,
      <div key={1} id={`${chartId}-brush`} ref={brushChartRef} />
    ]
  )
}

export default MDSDisplay
