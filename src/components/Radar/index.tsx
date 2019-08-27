import React, { Component } from 'react'
import * as d3 from 'd3'

import DetailSection from './DetailSection'

import initateSvg from './d3/InitateSvg'
import drawBackgroundCirclesAndAxis from './d3/draw-background-circles-and-axis'
import drawQuadrantLabels from './d3/draw-quadrant-labels'
import drawBlips from './d3/draw-blips'

import './index.css'
import { Simulation, SimulationNodeDatum } from 'd3-force'

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
    simulation: Simulation<SimulationNodeDatum, undefined>,
    simulation2: Simulation<SimulationNodeDatum, undefined>,
  }
  rootSvgGroupToDraw: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null

  constructor(props: { blips: Blip[] }) {
    super(props)

    this.svgId = 'radar-chart-svg'

    this.state = {
      clickedBlip: { quadrant: '', name: '' },
      highlightedQuadrantIndex: 0,
    }
    this.simulationRefs = {
      simulation: d3.forceSimulation(),
      simulation2: d3.forceSimulation(),
    }
    this.rootSvgGroupToDraw = d3.select(this.svgId)

    this.clickOnBlip = this.clickOnBlip.bind(this)
  }

  clickOnBlip(quadrant: string, name: string){
    const { quadrant: prevQuadrant, name: prevName } = this.state.clickedBlip
    if (prevQuadrant === quadrant && prevName === name) {
      this.setState({ clickedBlip: { quadrant: '', name: '' } })
      return
    }
    this.setState({ clickedBlip: { quadrant, name } })
  }

  dimensionalSizes() {
    const DEFAULT_RADAR_WIDTH = 800, DEFAULT_RADAR_HEIGHT = 600

    let width = DEFAULT_RADAR_WIDTH, height = DEFAULT_RADAR_HEIGHT
    let radius = Math.min(width / 2, height / 2) * 0.95

    return { width, height, radius }
  }

  drawSvg() {
    const { svgId } = this
    const { width, height } = this.dimensionalSizes()

    this.rootSvgGroupToDraw = initateSvg(svgId, width, height)
  }

  drawBackgroundAndBlips() {
    const { blips } = this.props
    const { width, height, radius } = this.dimensionalSizes()
    const { simulation, simulation2 } = this.simulationRefs

    const quadrantNames = [...Array.from(new Set<string>(blips.map(blip => blip.quadrant)))]

    simulation.stop()
    simulation2.stop()

    const highlightQuadrant = (quadrantIndex: number) => this.setState({ highlightedQuadrantIndex: quadrantIndex })

    drawBackgroundCirclesAndAxis(
      this.rootSvgGroupToDraw,
      width,
      height,
      radius,
      quadrantNames,
      highlightQuadrant
    )
    drawQuadrantLabels(
      this.rootSvgGroupToDraw,
      radius,
      quadrantNames,
      highlightQuadrant
    )
    const newSimulations = drawBlips(
      this.rootSvgGroupToDraw,
      radius,
      blips,
      highlightQuadrant,
      this.clickOnBlip
    )
    this.simulationRefs.simulation = newSimulations.simulation
    this.simulationRefs.simulation2 = newSimulations.simulation2
  }

  componentDidMount() {
    this.drawSvg()
    this.drawBackgroundAndBlips()
  }

  componentDidUpdate(prevProps: { blips: Blip[] }) {
    if (this.props.blips !== prevProps.blips) {
      this.drawBackgroundAndBlips()
    }
  }

  detailedSection(quadrantIndex: number) {
    const { blips } = this.props
    const { highlightedQuadrantIndex, clickedBlip } = this.state

    const quadrantNames = [...Array.from(new Set<string>(blips.map(blip => blip.quadrant)))]

    return (
      <DetailSection
        key={quadrantIndex}
        expand={highlightedQuadrantIndex === quadrantIndex}
        quadrantName={quadrantNames[quadrantIndex]}
        onClickBlip={this.clickOnBlip}
        entries={blips.filter(blip => blip.quadrant === quadrantNames[quadrantIndex])}
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
