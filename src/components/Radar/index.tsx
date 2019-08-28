import React, { Component } from 'react'
import * as d3 from 'd3'

import DetailSection from './DetailSection'

import initateSvg from './d3/InitateSvg'
import drawBackgroundCirclesAndAxis from './d3/DrawBackgroundCirclesAndAxis'
import drawQuadrantLabels from './d3/DrawQuadrantLabels'
import drawBlips, { BlipSimulationNode, CollideAvoidNode } from './d3/DrawBlips'

import './index.css'
import { Simulation } from 'd3-force'

export interface Blip {
  quadrant: string,
  name: string,
  score: number,
  desc: string,
}

interface RadarState {
  clickedBlip: {
    quadrant: string,
    name: string,
  },
  highlightedQuadrantIndex: number,
}

export default class Radar extends Component<{ blips: Blip[] }, RadarState>  {
  svgId: string
  simulationRefs: {
    radialSimulation: Simulation<BlipSimulationNode, undefined>,
    collideAvoidSimulation: Simulation<CollideAvoidNode, undefined>,
  }
  rootSVGGroupToDraw: d3.Selection<SVGGElement, unknown, HTMLElement, any>

  constructor(props: { blips: Blip[] }) {
    super(props)

    this.svgId = 'radar-chart-svg'
    this.simulationRefs = {
      radialSimulation: d3.forceSimulation(),
      collideAvoidSimulation: d3.forceSimulation(),
    }
    this.rootSVGGroupToDraw = d3.select('_')

    this.state = {
      clickedBlip: { quadrant: '_', name: '_' },
      highlightedQuadrantIndex: 0,
    }

    this.clickOnBlip = this.clickOnBlip.bind(this)
  }

  get quadrantNames() {
    return [...Array.from(new Set<string>(this.props.blips.map(blip => blip.quadrant)))]
  }

  get dimensionalSizes() {
    const DEFAULT_RADAR_WIDTH = 800, DEFAULT_RADAR_HEIGHT = 600

    let width = DEFAULT_RADAR_WIDTH, height = DEFAULT_RADAR_HEIGHT
    let radius = Math.min(width / 2, height / 2) * 0.95

    return { width, height, radius }
  }

  clickOnBlip(quadrant: string, name: string){
    const { quadrant: prevQuadrant, name: prevName } = this.state.clickedBlip
    if (prevQuadrant === quadrant && prevName === name) {
      this.setState({ clickedBlip: { quadrant: '', name: '' } })
      return
    }
    this.setState({ clickedBlip: { quadrant, name } })
  }

  drawSVGBackground() {
    const { svgId } = this
    const { width, height, radius } = this.dimensionalSizes

    const toHighlightQuadrant = (quadrantIndex: number) => {
      this.setState({ highlightedQuadrantIndex: quadrantIndex })
    }

    this.rootSVGGroupToDraw = initateSvg(svgId, width, height)
    drawBackgroundCirclesAndAxis(
      this.rootSVGGroupToDraw,
      radius,
      this.quadrantNames,
      toHighlightQuadrant
    )
  }

  drawQuadrantLabelsAndBlips() {
    const { blips } = this.props
    const { radius } = this.dimensionalSizes
    const { radialSimulation, collideAvoidSimulation } = this.simulationRefs

    radialSimulation.stop()
    collideAvoidSimulation.stop()

    const highlightQuadrant = (quadrantIndex: number) => this.setState({ highlightedQuadrantIndex: quadrantIndex })

    drawQuadrantLabels(
      this.rootSVGGroupToDraw,
      radius,
      this.quadrantNames,
      highlightQuadrant
    )

    const newSimulations = drawBlips(
      this.rootSVGGroupToDraw,
      radius,
      blips,
      highlightQuadrant,
      this.clickOnBlip
    )
    this.simulationRefs.radialSimulation = newSimulations.radialSimulation
    this.simulationRefs.collideAvoidSimulation = newSimulations.collideAvoidSimulation
  }

  componentDidMount() {
    this.drawSVGBackground()
    this.drawQuadrantLabelsAndBlips()
  }

  componentDidUpdate(prevProps: { blips: Blip[] }) {
    if (this.props.blips !== prevProps.blips) {
      this.drawQuadrantLabelsAndBlips()
    }
  }

  detailedSection(quadrantIndex: number) {
    const { blips } = this.props
    const { highlightedQuadrantIndex, clickedBlip } = this.state

    return (
      <DetailSection
        key={quadrantIndex}
        expand={highlightedQuadrantIndex === quadrantIndex}
        quadrantName={this.quadrantNames[quadrantIndex]}
        onClickBlip={this.clickOnBlip}
        entries={blips.filter(blip => blip.quadrant === this.quadrantNames[quadrantIndex])}
        clickedBlip={clickedBlip}
        flipped={quadrantIndex === 2 || quadrantIndex === 3}
      />
    )
  }


  render() {
    const { svgId } = this

    return (
      <div className='Radar-root'>
        {[3, 2].map(index => this.detailedSection(index))}
        <div>
          <svg id={svgId} />
        </div>
        {[0, 1].map(index => this.detailedSection(index))}
      </div>
    )
  }
}
