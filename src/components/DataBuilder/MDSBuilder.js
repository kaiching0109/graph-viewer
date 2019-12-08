import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { ScatterPlot } from '../Module'
import { Card } from '../../components/Base'
import * as d3 from 'd3'
import * as numeric from 'numericjs'
import { SVD } from 'svd-js'

const EUC_TITLE = 'MDS display (Euclidian distance)'
const CORR_TITLE = 'MDS display (Correlation distance)'

const MDSBuilder = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(1) // 1 is Euclidian Dist, 0 is Corrections
  const [content, setContent] = useState([])
  const [headers, setHeaders] = useState([])
  const [labelRef, setLabelRef] = useState([])
  const [formatContent, setFormatContent] = useState([])
  const data = useStaticQuery(graphql`
    query AllMdsPoints {
      allMdsPointsDistCsv {
        edges {
          node {
            x
            y
          }
        }
      }
    }
  `)

  useEffect(() => {
    // data.allPeopleCsv.nodes.length
    if (data.allMdsPointsCsv.edges.length > 0) {
      const headers = Object.keys(data.allMdsPointsCsv.edges[0].node)
      const content = data.allMdsPointsCsv.edges
        .map(({ node }, i) => {
          Object.keys(key => Number(node[key]))
          return ({ ...node, index: i })
        })

      // const headers = Object.keys(data.allMerged2016Json.edges[0].node)
      // const content = data.allMerged2016Json.edges
      //   .map(({ node }, i) => {
      //     return ({ ...node, index: i })
      //   })
      setContent(content)
      setHeaders(headers)
      setLoading(false)
    }
  }, [data.allPointsCsv])


  // useEffect(() => {
  //
  // }, [content])

  // useEffect(() => {
  //   if (formatContent.length > 0) {
  //     const pointsData = mdsClassic(formatContent)
  //     // let hello = numeric.transpose(pointsData)
  //     //
  //     setLoading(false)
  //     //
  //   }
  // }, [formatContent])

  function mdsClassic (distances, dimensions) {
    dimensions = dimensions || 2;
    // distances = [[0, 587, 1212, 701, 1936, 604, 748, 2139, 2182, 543], [587, 0, 920, 940, 1745, 1188, 713, 1858, 1737, 597], [1212, 920, 0, 879, 831, 1726, 1631, 949, 1021, 1494], [701, 940, 879, 0, 1374, 968, 1420, 1645, 1891, 1220], [1936, 1745, 831, 1374, 0, 2339, 2451, 347, 959, 2300], [604, 1188, 1726, 968, 2339, 0, 1092, 2594, 2734, 923], [748, 713, 1631, 1420, 2451, 1092, 0, 2571, 2408, 205], [2139, 1858, 949, 1645, 347, 2594, 2571, 0, 678, 2442], [2182, 1737, 1021, 1891, 959, 2734, 2408, 678, 0, 2329], [543, 597, 1494, 1220, 2300, 923, 205, 2442, 2329, 0]];

    // square distances
    var M = numeric.mul(-0.5, numeric.pow(distances, 2));

    // double centre the rows/columns
    function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    let rowMeans = []
    for(let m of M){
      const rowMean = mean(M)
      rowMeans.push(rowMean)
    }
        // colMeans = mean(numeric.transpose(M)),
        // totalMean = mean(rowMeans);

    // for (var i = 0; i < M.length; ++i) {
      //
      // calculate(M, totalMean, rowMeans, colMeans, i)
    // }



    // take the SVD of the double centred matrix, and return the
    // points from it
    // var ret = numeric.svd(M),
    //     eigenValues = numeric.sqrt(ret.S);
    // return ret.U.map(function(row) {
    //     return numeric.mul(row, eigenValues).splice(0, dimensions);
    // });
  };

  function calculate (M, totalMean, rowMeans, colMeans, i) {
    for (var j =0; j < M[0].length; ++j) {
        // M[i][j] += totalMean - rowMeans[i] - colMeans[j]
        //

    }
  }

  const Header = (
    <div className='row'>
      <div className='col-sm-12' style={{ display: 'block' }}>
        <p style={{ display: 'inline-block' }}>{mode ? EUC_TITLE : CORR_TITLE}</p>
      </div>
    </div>
  )

  return (
    !loading && (
      <Card header={Header}>
        <ScatterPlot
          chartId='mds'
          xLabel={'x'}
          yLabel={'y'}
          xKey={'x'}
          yKey={'y'}
          content={content}
          hoverColor='#c467d4'
          color='rgb(200, 38, 103)'
        />
      </Card>
    )
  )
}

export default MDSBuilder
