import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DetailSection from './detail-section'

import initateSvg from './d3/initate-svg'
import drawBackgroundCirclesAndAxis from './d3/draw-background-circles-and-axis'
import drawSlimBackgroundCirclesAndAxis from './d3/draw-slim-background-circles-and-axis'
import drawQuadrantLabels from './d3/draw-quadrant-labels'
import drawSlimQuadrantLabels from './d3/draw-slim-quadrant-labels'
import drawBlips from './d3/draw-blips'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
})

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1
}

class Radar extends Component {
  constructor(props) {
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

  clickOnBlip(quadrant, name){
    const { quadrant: prevQuadrant, name: prevName } = this.state.clickedBlip
    if (prevQuadrant === quadrant && prevName === name) {
      this.setState({ clickedBlip: { quadrant: '', name: '' } })
      return
    }
    this.setState({ clickedBlip: { quadrant, name } })
  }

  dimensionalSizes() {
    const { smallMedia } = this.props
    const DEFAULT_RADAR_WIDTH = 800, DEFAULT_RADAR_HEIGHT = 600

    let width = DEFAULT_RADAR_WIDTH, height = DEFAULT_RADAR_HEIGHT
    let radius = Math.min(width / 2, height / 2) * 0.95

    if (smallMedia) {
      const SLIM_RADAR_DEFAULT_WIDTH = 500
      const SLIM_WIDTH_PADDING = 20 //TODO
      width = Math.min(window.innerWidth - SLIM_WIDTH_PADDING, SLIM_RADAR_DEFAULT_WIDTH)
      height = width * (6 / 8)
      radius = Math.min(width / 2, height / 2) * 0.9
    }

    return { width, height, radius }
  }

  drawSvg() {
    const { divId, svgId } = this
    const { blips, smallMedia } = this.props
    const { highlightedQuadrantIndex } = this.state
    const { width, height, radius } = this.dimensionalSizes()
    const { simulation, simulation2 } = this.simulationRefs

    const quadrantNames = [...new Set(blips.map(blip => blip.quadrant))]

    simulation.stop()
    simulation2.stop()

    const highlightQuadrant = quadrantIndex => this.setState({ highlightedQuadrantIndex: quadrantIndex })
    const clickOnBlip = (quadrant, name) => this.clickOnBlip(quadrant, name)

    const { g } = initateSvg(divId, svgId, width, height)

    if (smallMedia || isSafari()) {
      drawSlimBackgroundCirclesAndAxis(g, radius, quadrantNames, highlightedQuadrantIndex, highlightQuadrant)
      drawSlimQuadrantLabels(g, radius, quadrantNames, highlightedQuadrantIndex)
    } else {
      drawBackgroundCirclesAndAxis(g, width, height, radius, quadrantNames, highlightQuadrant)
      drawQuadrantLabels(g, radius, quadrantNames, highlightQuadrant)
      const { simulation, simulation2 } = drawBlips(g, radius, blips, highlightQuadrant, clickOnBlip)
      this.simulationRefs.simulation = simulation
      this.simulationRefs.simulation2 = simulation2
    }
  }

  componentDidMount() {
    this.drawSvg()
  }

  componentDidUpdate(prevProps) {
    const { blips, smallMedia } = this.props

    if (blips !== prevProps.blips || smallMedia !== prevProps.smallMedia) {
      this.drawSvg()
    }
  }

  detailedSection(quadrantIndex) {
    const { blips, smallMedia } = this.props
    const { highlightedQuadrantIndex, clickedBlip } = this.state

    const quadrantNames = [...new Set(blips.map(blip => blip.quadrant))]

    return smallMedia ? (
      highlightedQuadrantIndex === quadrantIndex &&
        <DetailSection
          key={quadrantIndex}
          expand={true}
          quadrantName={quadrantNames[quadrantIndex]}
          onClickBlip={(quadrant, name) => this.clickOnBlip(quadrant, name)}
          clickedBlip={clickedBlip}
          entries={blips.filter(blip => blip.quadrant === quadrantNames[quadrantIndex])}
        />
    ) : (
      <DetailSection
        key={quadrantIndex}
        expand={highlightedQuadrantIndex === quadrantIndex}
        quadrantName={quadrantNames[quadrantIndex]}
        onClickBlip={(quadrant, name) => this.clickOnBlip(quadrant, name)}
        entries={blips.filter(blip => blip.quadrant === quadrantNames[quadrantIndex])}
        clickedBlip={clickedBlip}
        flipped={quadrantIndex === 2 || quadrantIndex === 3}
      />
    )
  }


  render() {
    const { classes, smallMedia } = this.props
    const { divId, svgId } = this

    const smallMediaRootStyle = {
      flexDirection: 'column',
      alignItems: 'center',
    }

    return smallMedia ? (
      <div className={classes.root} style={smallMediaRootStyle} >
        <div id={divId}>
          <svg id={svgId} />
        </div>
        {[0, 1, 2, 3].map(index => this.detailedSection(index))}
      </div>
    ) : (
      <div className={classes.root}>
        {[3, 2].map(index => this.detailedSection(index))}
        <div id={divId}>
          <svg id={svgId} />
        </div>
        {[0, 1].map(index => this.detailedSection(index))}
      </div>
    )
  }
}

Radar.propTypes = {
  blips: PropTypes.arrayOf(PropTypes.object).isRequired,
  smallMedia: PropTypes.bool.isRequired,
}

export const StyledRadar = withStyles(styles)(Radar)

export default props => (
  <StyledRadar
    {...props}
    smallMedia={useMediaQuery(useTheme().breakpoints.down('sm'))}
  />
)
