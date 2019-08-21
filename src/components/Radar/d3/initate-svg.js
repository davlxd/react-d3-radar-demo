import * as d3 from 'd3'

export default (divId, svgId, width, height) => {
  const _divId = `#${divId}`
  const _svgId = `#${svgId}`

  d3.select(_divId).select(_svgId).remove()

  const svg = d3.select(_divId).append('svg')
                               .attr('id', svgId)
                               .attr('width', width)
                               .attr('height', height)
                               .style('user-select', 'none')
  const g = svg.append('g')
               .attr('transform', `translate(${width/2}, ${height/2})`)
  return { svg, g }
}
