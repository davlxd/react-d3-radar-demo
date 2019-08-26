import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DetailSection.css'


class DetailSection extends Component {
  toggleDesc() {
    this.setState({
      open: !this.state.open
    })
  }

  componentDidMount() {
  }

  render() {
    const { quadrantName, flipped, entries, expand, onClickBlip, clickedBlip } = this.props

    const expandDesc = entry => clickedBlip && clickedBlip.quadrantIndex === entry.quadrantIndex && clickedBlip.name === entry.name
    const blipDescDynamicStyle = entry => ({
      maxHeight: expandDesc(entry) ? (10 + 24 * Math.ceil(entry.desc.length / 20.0)) : 0,
      marginBottom: expandDesc(entry) ? 10 : 0,
    })

    return (
      <section
        className='DetailSection-root'
        style={{
          width: expand ? 200 : 0,
          transform: flipped ? 'scale(-1, 1)' : null,
        }}
        >
        <span
          className='DetailSection-quadrantName'
          style={{ transform: flipped ? 'scale(-1, 1)' : null }}
          >
          {quadrantName}
        </span>
        <div className='DetailSection-entrie'>
          {entries.map((entry, id) => (
            <div
              className='DetailSection-entry'
              style={{ transform: flipped ? 'scale(-1, 1)' : null }}
              key={id}
              >
              <span className='DetailSection-blipName' onClick={() => onClickBlip(entry.quadrant, entry.name)}>{entry.name}</span>
              <p className='DetailSection-desc' style={blipDescDynamicStyle(entry)}>{entry.desc}</p>
            </div>
          ))}
        </div>

      </section>
    )
  }
}

DetailSection.defaultProps = {
  flipped: false
}

DetailSection.propTypes = {
  quadrantName: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired,
  expand: PropTypes.bool.isRequired,
  onClickBlip: PropTypes.func,
  clickedBlip: PropTypes.object,
  flipped: PropTypes.bool,
}


export default DetailSection
