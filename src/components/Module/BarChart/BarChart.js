import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'

const BarChart = props => {

  const [svg, setSVG] = useState(null)
  const { chartId } = props
  const dataset = [
    {
      label: '0-1',
      value: 0
    },
    {
      label: '2-3',
      value: 2
    },
    {
      label: '4-5',
      value: 63
    },
    {
      label: '6-7',
      value: 78
    },
    {
      label: '8-9',
      value: 15
    },
    {
      label: '10',
      value: 0
    }
  ]

  useEffect(() => {
    const margin = {top: 40, right: 30, bottom: 30, left: 50},
      width = 460 - margin.left - margin.right,
      height = 320 - margin.top - margin.bottom;
    if (!svg) {
      const svgSelector = d3.select(`#${chartId}`)
        .append('svg')
      setSVG(svgSelector)
    } else drawChart(svg, { ...props, width, height, margin, dataset })
  }, [svg, chartId, props])

  return <div style={{ padding: '2rem' }} id={chartId} />
}

const drawChart = (svg, { dataset, xAxisLabels, yAxisLables, width, height, margin }) => {
  var greyColor = "#898989";
  var barColor = d3.interpolateInferno(0.4);
  var highlightColor = d3.interpolateInferno(0.3);
  svg.attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.4)
  const y = d3.scaleLinear()
    .range([height, 0])
  const xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10)
  const yAxis = d3.axisLeft(y)
  x.domain(dataset.map(d => d.label))
  y.domain([0, 100])

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    svg.selectAll('.bar')
        .data(dataset)
        .enter().append('rect')
        .attr('class', 'bar')
        .style('display', d => { return d.value === null ? 'none' : null; })
        .style('fill',  d => {
            return d.value === d3.max(dataset,  d => { return d.value; })
            ? highlightColor : barColor
            })
        .attr('x',  d => { return x(d.label); })
        .attr('width', x.bandwidth())
            .attr('y',  d => { return height; })
            .attr('height', 0)
                .transition()
                .duration(750)
                .delay(function (d, i) {
                    return i * 150;
                })
        .attr('y',  d => { return y(d.value); })
        .attr('height',  d => { return height - y(d.value); });

        svg.selectAll('.label')
            .data(dataset)
            .enter()
            .append('text')
            .attr('class', 'label')
            .style('display',  d => { return d.value === null ? 'none' : null; })
            .attr('x', ( d => { return x(d.label) + (x.bandwidth() / 2) -8 ; }))
                .style('fill',  d => {
                    return d.value === d3.max(dataset,  d => { return d.value; })
                    ? highlightColor : greyColor
                    })
            .attr('y',  d => { return height; })
                .attr('height', 0)
                    .transition()
                    .duration(750)
                    .delay((d, i) => { return i * 150; })
            .text( d => { return d.value })
            .attr('y',  d => { return y(d.value) + .1; })
            .attr('dy', '-.7em');
}

export default BarChart
