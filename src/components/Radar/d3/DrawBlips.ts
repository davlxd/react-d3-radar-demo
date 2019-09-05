import * as d3 from 'd3'
import { Blip } from '..'

import forceOfWithinQuandrant from './ForceOfWithinQuadrant'
import forceOfPlaceholdingCirclesTailingDad from './ForceOfPlaceholdingCirclesTailingDad'
import {
  hoverInQuadrantEffect,
  hoverOutQuadrantEffect
} from './QuadrantHoverEffect'


export interface BlipSimulationNode extends Blip { 
  x: number,
  y: number,
  vx: number,
  vy: number,
  distanceToCenter: number,
  quadrantIndex: number,
  shapeName: string,
  collideRadius: number,
}

export interface TextPlaceholdingCircleSimulationNode { 
  dad: BlipSimulationNode;
  nth: number;
  collideRadius: number;
  x: number;
  y: number;
}

export interface CollideAvoidNode {
  x: number;
  y: number;
  collideRadius: number;
}

const attachSimulationDataToBlips = (
  rootSVGRadius: number,
  blips: Blip[]
): BlipSimulationNode[] => {
  const blipShapes = [ { shapeName: 'rect', }, { shapeName: 'circle', } ]

  const uniqueQuadrantNames = [...Array.from(new Set(blips.map(blip => blip.quadrant)))]
  const minAndMaxOfBlipScore = blips.map(blip => blip.score)
                                    .reduce((acc, cur) => {
                                      return [Math.min(acc[0], cur), Math.max(acc[1], cur)]
                                    }, [Infinity, -Infinity])
  const scoreToRadiusScale = d3.scaleLinear()
                               .domain(minAndMaxOfBlipScore)
                               .range([rootSVGRadius, 50])

  return blips.map(blip => {
    const quadrantIndex = uniqueQuadrantNames.indexOf(blip.quadrant)
    return {
      ...blip,
      distanceToCenter: scoreToRadiusScale(blip.score),
      quadrantIndex,
      ...blipShapes[quadrantIndex % blipShapes.length],
      collideRadius: 0, // will set later via reflection
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }
  })
}

export default (
  rootSVGGroupToDraw: d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
  rootSVGRadius: number,
  blips: Blip[], 
  hoverOnQuadrant: (quadrantIndex: number) => void, 
  clickOnBlip: (quadrant: string, name: string) => void
) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const enhancedBlips = attachSimulationDataToBlips(rootSVGRadius, blips)

  const blipsSVGGroup = rootSVGGroupToDraw.append('g')
                                          .attr('class', 'blips')

  const eachBlip = blipsSVGGroup.selectAll('g.blip')
                                .data(enhancedBlips)
                                .enter()
                                  .append('g')
                                  .attr('class', 'blip')
                                  .attr('quadrant-name', d => d.quadrant)
                                  .attr('quadrant-index', d => d.quadrantIndex)
                                  .style('cursor', 'pointer')
                                  .style('pointer-events', 'click')
                                  .on('mouseover', ({ quadrantIndex }) => {
                                    hoverInQuadrantEffect(rootSVGGroupToDraw, quadrantIndex)
                                    hoverOnQuadrant(quadrantIndex)
                                  })
                                  .on('mouseout', ({ quadrantIndex}) => {
                                    hoverOutQuadrantEffect(rootSVGGroupToDraw, quadrantIndex)
                                  })
                                  .on('click', ({ quadrant, name }) => {
                                    clickOnBlip(quadrant, name)
                                  })

  const eachBlipSymbol = eachBlip.append(d => document.createElementNS(d3.namespaces.svg, d.shapeName))
                                 .attr('class', 'blip-element blip-symbol')
                                 .style('fill', d => color(d.quadrantIndex.toString()))
                                 .attr('width', 22)
                                 .attr('height', 22)
                                 .attr('r', 12)
                                 .attr('rx', '0.4em')
                                 .attr('ry', '0.4em')

  const eachBlipText = eachBlip.append('text')
                               .attr('class', 'blip-element blip-text')
                               .text(d => d.name)

  const blipSymbolBBox = (index: number) => (eachBlipSymbol.nodes()[index] as SVGGraphicsElement).getBBox()
  const blipTextBBox = (index: number) => (eachBlipText.nodes()[index] as SVGGraphicsElement).getBBox()
                             
  const positionSymbolAndText = (withPlaceholdingCircles: boolean) => () => {
    eachBlipSymbol.attr('x', ({ x }, i) => x - blipSymbolBBox(i).width / 2)
                  .attr('y', ({ y }, i) => y - blipSymbolBBox(i).height / 2)
                  .attr('cx', ({ x }) => x)
                  .attr('cy', ({ y }) => y)

    eachBlipText.attr('x', ({ quadrantIndex, x }, i) => (quadrantIndex === 0 || quadrantIndex === 1) ? (x + blipSymbolBBox(i).width / 2) : (x - blipTextBBox(i).width - blipSymbolBBox(i).width / 2))
                .attr('y', ({ quadrantIndex, y }, i) => (quadrantIndex === 1 || quadrantIndex === 2) ? (y + blipTextBBox(i).height / 2) : y)

    if (withPlaceholdingCircles) {
      eachPlaceholdingCircle.attr('cx', ({ x }) => x)
                            .attr('cy', ({ y }) => y)
    }
  }

  const radialSimulation = d3.forceSimulation(enhancedBlips)
                             .force('radial', d3.forceRadial(d => (d as BlipSimulationNode).distanceToCenter))
                             .force('in-quandrant', forceOfWithinQuandrant())
                             .on('tick', positionSymbolAndText(false))
                             .alphaDecay(0.01)

                       
  const BLIP_COLLIDE_RADIUS_MARGIN = 10
  const textPlaceHoldingCircleNodes: TextPlaceholdingCircleSimulationNode[] = enhancedBlips.flatMap((blip, index) => {
    blip.collideRadius = Math.max(
      blipSymbolBBox(index).width,
      blipSymbolBBox(index).height
    ) / 2 + BLIP_COLLIDE_RADIUS_MARGIN

    let placeholdingCircleAmount = 0
    if (blipTextBBox(index).height !== 0) {
      placeholdingCircleAmount = Math.floor(blipTextBBox(index).width / blipTextBBox(index).height)
    }

    return [
      ...[...Array.from(Array(placeholdingCircleAmount).keys())].map(nthForBlip => ({
        dad: blip,
        nth: nthForBlip,
        collideRadius: blipTextBBox(index).height / 2,
        x: 0,
        y: 0,
      }))
    ]
  })

  const eachPlaceholdingCircle = rootSVGGroupToDraw.select('g.blips')
                                                   .selectAll('g.fake-circle')
                                                   .data(textPlaceHoldingCircleNodes)
                                                   .enter()
                                                     .append('g')
                                                     .attr('class', 'fake-circle')
                                                     .append('circle')
                                                     .style('pointer-events', 'none')
                                                     .attr('r', d => d.collideRadius)
                                                     .attr('cx', d => d.x)
                                                     .attr('cy', d => d.x)
                                                     .attr('fill-opacity', 0)
                                                     .attr('stroke', '#000000')
                                                     .attr('stroke-opacity', 0)
                                                     .attr('dad-name', d => d.dad.name)

  const blipsAndTextPlaceHoldingCircleNodes: CollideAvoidNode[] = (enhancedBlips as CollideAvoidNode[]).concat(
    textPlaceHoldingCircleNodes as CollideAvoidNode[]
  )
  const collideAvoidSimulation = d3.forceSimulation(blipsAndTextPlaceHoldingCircleNodes)
                        .force('collide', d3.forceCollide(d => (d as BlipSimulationNode).collideRadius).strength(0.999))
                        .force('position-placeholding-circles', forceOfPlaceholdingCirclesTailingDad())
                        .on('tick', positionSymbolAndText(true))
                        .alphaDecay(0.01)

  return { radialSimulation, collideAvoidSimulation }
}
