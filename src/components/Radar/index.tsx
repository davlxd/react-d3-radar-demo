import React, { Component } from 'react'

import DetailSection from './DetailSection'

import initateSvg from './d3/initate-svg'
import drawBackgroundCirclesAndAxis from './d3/draw-background-circles-and-axis'
import drawQuadrantLabels from './d3/draw-quadrant-labels'
import drawBlips from './d3/draw-blips'

import './index.css'

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
  divId: string
  svgId: string
  simulationRefs: {
    simulation: {
      stop: () => string
    },
    simulation2: {
      stop: () => string
    }
  }

  constructor(props: { blips: Blip[] }) {
    super(props)

    this.divId = 'radar-chart-div'
    this.svgId = 'radar-chart-svg'

    this.simulationRefs = {
      simulation: {
        stop: () => ''
      },
      simulation2: {
        stop: () => ''
      },
    }

    this.state = {
      clickedBlip: { quadrant: '', name: '' },
      highlightedQuadrantIndex: 0,
    }
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
    const { divId, svgId } = this
    const { blips } = this.props
    const { width, height, radius } = this.dimensionalSizes()
    const { simulation, simulation2 } = this.simulationRefs

    const quadrantNames = [...Array.from(new Set<string>(blips.map(blip => blip.quadrant)))]

    simulation.stop()
    simulation2.stop()

    const highlightQuadrant = (quadrantIndex: number) => this.setState({ highlightedQuadrantIndex: quadrantIndex })
    const clickOnBlip = (quadrant: string, name: string) => this.clickOnBlip(quadrant, name)

    const { g } = initateSvg(divId, svgId, width, height)

    drawBackgroundCirclesAndAxis(g, width, height, radius, quadrantNames, highlightQuadrant)
    drawQuadrantLabels(g, radius, quadrantNames, highlightQuadrant)
    const newSimulations = drawBlips(g, radius, blips, highlightQuadrant, clickOnBlip)
    this.simulationRefs.simulation = newSimulations.simulation
    this.simulationRefs.simulation2 = newSimulations.simulation2
  }

  componentDidMount() {
    this.drawSvg()
  }

  componentDidUpdate(prevProps: { blips: Blip[] }) {
    const { blips } = this.props

    if (blips !== prevProps.blips) {
      this.drawSvg()
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
        onClickBlip={(quadrant: string, name: string) => this.clickOnBlip(quadrant, name)}
        entries={blips.filter(blip => blip.quadrant === quadrantNames[quadrantIndex])}
        clickedBlip={clickedBlip}
        flipped={quadrantIndex === 2 || quadrantIndex === 3}
      />
    )
  }


  render() {
    const { divId, svgId } = this

    return (
      <div className='Radar-root'>
        {[3, 2].map(index => this.detailedSection(index))}
        <div id={divId}>
          <svg id={svgId} />
        </div>
        {[0, 1].map(index => this.detailedSection(index))}
      </div>
    )
  }
}
