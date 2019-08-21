import * as d3 from 'd3'
import { slimLabelRadius, quadrantLabelX, quadrantLabelY } from './draw-slim-quadrant-labels'


export default (g, radius, quadrantNames, initialClickedQuadrant, clickOnQuadrant) => {
  const quadrantCount = quadrantNames.length
  const color = d3.scaleOrdinal(d3.schemeCategory10)

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

  const quadrantG = backgroundG.append('g').attr('class', 'background-circle')
                                           .selectAll('path')
                                           .data(arcs)
                                           .enter()
                                             .append('path')
                                             .attr('class', (d, i) => `quadrant-${i}`)
                                             .attr('d', (d, i) => arcConfig(2, i === initialClickedQuadrant)(d) )
                                             .style('fill', (d, i) => color(i))
                                             .style('opacity', 0.7)
                                             .style('z-index', 0)
                                             .on('click', (d, i) => {
                                               backgroundG.selectAll('g.background-circle path')
                                                          .transition().duration('200')
                                                          .attr('d', (d, j) => arcConfig(2, i === j)(d) )

                                               g.selectAll('g.quadrant-labels text')
                                                .transition().duration('200')
                                                .attr('x', (d, j) => quadrantLabelX(slimLabelRadius(radius + ( j === i ? 14 : 0 )), j))
                                                .attr('y', (d, j) => quadrantLabelY(slimLabelRadius(radius + ( j === i ? 14 : 0 )), j))

                                               clickOnQuadrant(i)
                                             })

  return { backgroundG, quadrantG }
}
