import * as d3 from 'd3'
import {
  hoverInQuadrantEffect,
  hoverOutQuadrantEffect,
} from './QuadrantHoverEffect'

export default (
  rootSVGGroupToDraw: d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
  width: number,
  height: number,
  radius: number, 
  quadrantNames: string[],
  hoverOnQuadrant: (quadrantIndex: number) => void
): void => {
  const quadrantCount = quadrantNames.length

  const arcs = d3.pie()(new Array(quadrantCount).fill(1))

  const arcConfig = (
    annulusIndex: number, 
    focus: boolean = false
  ): d3.Arc<any, d3.DefaultArcObject> => { // Relationship between padAngle and radius see: https://github.com/d3/d3-shape#arc_padAngle
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

  const backgroundSVGGroup = rootSVGGroupToDraw.append('g').attr('class', 'background')

  backgroundSVGGroup.append('g')
                      .attr('class', 'quadrant-rect-backdrop')
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
                          hoverInQuadrantEffect(rootSVGGroupToDraw, i)
                          hoverOnQuadrant(i)
                        })
                        .on('mouseout', (d, i) => {
                          hoverOutQuadrantEffect(rootSVGGroupToDraw, i)
                        })

  const quadrantSVGGroup = backgroundSVGGroup.append('g').attr('class', 'background-circle')
                                             .selectAll('path')
                                             .data(arcs)
                                             .enter()
                                               .append('g')
                                               .attr('class', (d, i) => `quadrant-${i}`)

  quadrantSVGGroup.selectAll('path')
                  .data((d, i) => [{d, i}, {d, i}, {d, i}])
                  .enter().append('path')
                  .attr('class', (_, i) => `annulus-${i}`)
                  .style('fill', '#AAAAAA')
                  .attr('d', ({ d }, i) => (arcConfig(i) as any)(d) )
                  .style('fill-opacity', (d, i) => (0.7 - 0.2 * i))
                  .style('z-index', 0)
                  .on('mouseover', ({ i }) => {  // i is quadrant index, j is annulusIndex
                    hoverInQuadrantEffect(rootSVGGroupToDraw, i)
                    hoverOnQuadrant(i)
                  })
                  .on('mouseout', ({ i }) => {
                    hoverOutQuadrantEffect(rootSVGGroupToDraw, i)
                  })
}
