
export const quadrantLabelX = (radius, i) => Math.sin(Math.PI / 4) * radius * (i === 0 || i === 1 ? 1 : -1)
export const quadrantLabelY = (radius, i) => Math.sin(Math.PI / 4) * radius * (i === 1 || i === 2 ? 1 : -1)
export const slimLabelRadius = radius => radius * 0.4

export default (g, radius, quadrantNames, initialClickedQuadrant) => {
  const quadrantLabelsG = g.append('g').attr('class', 'quadrant-labels')
  const eachQuadrantLabel = quadrantLabelsG.selectAll('text')
                                           .data(quadrantNames)
                                           .enter()
                                             .append('text')
                                             .attr('class', (d, i) => `quadrant-label-${i}`)
                                             .attr('radius', radius)
                                             .attr('x', (d, i) => quadrantLabelX(slimLabelRadius(radius + ( initialClickedQuadrant === i ? 14 : 0 )), i))
                                             .attr('y', (d, i) => quadrantLabelY(slimLabelRadius(radius + ( initialClickedQuadrant === i ? 14 : 0 )), i))
                                             .attr('font-size', '1.5em')
                                             .attr('font-weight', 200)
                                             .attr('pointer-events', 'none')
                                             .text(d => d.toUpperCase())

  const quadrantLabelBBox = index => eachQuadrantLabel.nodes()[index].getBBox()

  eachQuadrantLabel.attr('dx', (d, i) =>  (i === 0 || i === 1 ? 0 : -quadrantLabelBBox(i).width))
  eachQuadrantLabel.attr('dy', (d, i) =>  (i === 0 || i === 3 ? 0 : 0.5 * quadrantLabelBBox(i).height))

  return { quadrantLabelsG }
}
