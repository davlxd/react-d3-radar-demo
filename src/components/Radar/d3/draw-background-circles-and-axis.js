import * as d3 from 'd3'
import { hoverInQuadrantEffect, hoverOutQuadrantEffect } from './quadrant-hover-effect'


export default (g, width, height, radius, quadrantNames, hoverOnQuadrant) => {
  const quadrantCount = quadrantNames.length

  const arcs = d3.pie()(new Array(quadrantCount).fill(1))

  const arcConfig = (annulusIndex, focus = false) => { // Relationship between padAngle and radius see: https://github.com/d3/d3-shape#arc_padAngle
    const cornerRadiusValue = annulusIndex === 2 ? 4 : 0
    let padAngleValue = (1.0 / (annulusIndex + 1)) * 0.01
    let outerRadiusValue = radius / 3 * (annulusIndex + 1)
    let innerRadiusValue = 3

    if (focus) {
      innerRadiusValue = innerRadiusValue  + 14
      padAngleValue = padAngleValue * 14
      outerRadiusValue = outerRadiusValue + 14
    }
    return d3.arc()
             .padAngle(padAngleValue)
             .innerRadius(innerRadiusValue)
             .cornerRadius(cornerRadiusValue)
             .outerRadius(outerRadiusValue)
  }

  const backgroundG = g.append('g').attr('class', 'background')

  const eachQuadrantRectBackdrop = backgroundG.append('g').attr('class', 'quadrant-rect-backdrop')
                                                          .selectAll('rect')
                                                          .data(quadrantNames)
                                                          .enter()
                                                            .append('rect')
                                                            .attr('x', (d, i) => i === 0 || i === 1 ? 0 : - width / 2)
                                                            .attr('y', (d, i) => i === 1 || i === 2 ? 0 : - height / 2)
                                                            .attr('width', width / 2)
                                                            .attr('height', height / 2)
                                                            .attr('fill-opacity', 0)
                                                            .style('z-index', -100)
                                                            .on('mouseover', (d, i) => {
                                                              hoverInQuadrantEffect(g, i)
                                                              hoverOnQuadrant(i)
                                                            })
                                                            .on('mouseout', (d, i) => {
                                                              hoverOutQuadrantEffect(g, i)
                                                            })

  const quadrantG = backgroundG.append('g').attr('class', 'background-circle')
                                           .selectAll('path')
                                           .data(arcs)
                                           .enter()
                                             .append('g')
                                             .attr('class', (d, i) => `quadrant-${i}`)

  quadrantG.selectAll('path')
         .data((d, i) => [{d, i}, {d, i}, {d, i}])
         .enter().append('path')
         .attr('class', ({ d }, i) => `annulus-${i}`)
         .style('fill', '#AAAAAA')
         .attr('d', ({ d }, i) => arcConfig(i)(d) )
         .style('fill-opacity', (d, i) => (0.7 - 0.2 * i))
         .style('z-index', 0)
         .on('mouseover', ({ d, i }, j) => {  // i is quadrant index, j is annulusIndex
           hoverInQuadrantEffect(g, i)
           hoverOnQuadrant(i)
         })
         .on('mouseout', ({ d, i }, j) => {
           hoverOutQuadrantEffect(g, i)
         })

  return { backgroundG, eachQuadrantRectBackdrop, quadrantG, }
}
