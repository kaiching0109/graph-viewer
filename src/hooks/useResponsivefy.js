import * as d3 from 'd3'

const responsivefy = (svg) => {
  // get container + svg aspect ratio
  if (!svg) return { targetWidth: null, targetHeight: null }
  console.log('1231rtergfhgndsgbx')
  const container = d3.select(svg.node().parentNode)
  console.log({ container })
  const width = parseInt(svg.style('width'))
  const height = parseInt(svg.style('height'))
  const aspect = width / height
  const { width: targetWidth, height: targetHeight } = getTargetDimension()

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('perserveAspectRatio', 'xMinYMid')
    .call(() => resize(targetWidth, targetHeight))

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on('resize.' + container.attr('id'), resize)

  // get width of container and resize svg to fit it
  function getTargetDimension () {
    const targetWidth = parseInt(container.style('width'))
    const targetHeight = Math.round(targetWidth / aspect)
    return { width: targetWidth, height: targetHeight }
  }

  function resize (targetWidth, targetHeight) {
    svg.attr('width', targetWidth)
    svg.attr('height', targetHeight)
  }

  return { targetWidth, targetHeight }
}

export default responsivefy
