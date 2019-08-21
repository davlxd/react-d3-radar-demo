import React from 'react'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import grey from '@material-ui/core/colors/grey'
import indigo from '@material-ui/core/colors/indigo'
import blue from '@material-ui/core/colors/blue'
import lightBlue from '@material-ui/core/colors/lightBlue'


const badgeColor = badge => {
  switch ((badge || '').toUpperCase()) {
    case 'FAMILIAR':
      return indigo[500]
    case 'INTERMEDIATE':
      return blue[700]
    case 'ENTRY':
      return lightBlue[500]
    case 'RUSTY':
      return grey[500]
    case 'ENTRY/RUSTY':
      return grey[500]
    default:
      return grey[500]
  }
}

const useStyles = makeStyles({
  blipName: {
    cursor: 'pointer',
  },
  badge: {
    cursor: 'pointer',
    top: '50%',
    transform: 'translate(100%, -50%)',
    right: 0,
    border: `2px solid ${grey[200]}`,
    backgroundColor: ({ badge }) => badgeColor(badge)
  },
})

export default ({ entry, onClick }) => {
  const classes = useStyles(entry)

  return entry.badge ? (
    <Badge
      badgeContent={entry.badge.toUpperCase()}
      color='primary'
      onClick={onClick}
      classes={{ badge: classes.badge }}
    >
      <Typography variant="subtitle1" className={classes.blipName}>
        {entry.name}
      </Typography>
    </Badge>
  ) : (
    <Typography
      variant="subtitle1"
      className={classes.blipName}
      onClick={onClick}
    >
      {entry.name}
    </Typography>
  )
}
