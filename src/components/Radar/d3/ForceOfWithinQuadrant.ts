import { BlipSimulationNode } from "./DrawBlips"

export default () => {
  let nodes: BlipSimulationNode[]
  const BOUNDARY_PADDING = 12

  const force = () => {
    nodes.forEach(node => {
      const quadrantIndex = node.quadrantIndex
      if (quadrantIndex === 0 ) {
        node.x = Math.max(BOUNDARY_PADDING, node.x)
        node.y = Math.min(-BOUNDARY_PADDING, node.y)
      } else if (quadrantIndex === 1) {
        node.x = Math.max(BOUNDARY_PADDING, node.x)
        node.y = Math.max(BOUNDARY_PADDING, node.y)
      } else if (quadrantIndex === 2) {
        node.x = Math.min(-BOUNDARY_PADDING, node.x)
        node.y = Math.max(BOUNDARY_PADDING, node.y)
      } else {
        node.x = Math.min(-BOUNDARY_PADDING, node.x)
        node.y = Math.min(-BOUNDARY_PADDING, node.y)
      }
    })
  }

  force.initialize = (_: BlipSimulationNode[]) => nodes = _

  return force
}
