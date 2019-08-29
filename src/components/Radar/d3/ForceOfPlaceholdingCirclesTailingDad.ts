import { TextPlaceholdingCircleSimulationNode } from "./DrawBlips"

export default () => {
  let nodes: TextPlaceholdingCircleSimulationNode[]
  const force = () => {
    nodes.forEach(node => {
      if (node.hasOwnProperty('name')){
        return
      }
      const dadX = node.dad.x + node.dad.vx
      const dadY = node.dad.y + node.dad.vy
      const dadCollideRadius = node.dad.collideRadius
      const quadrantIndex = node.dad.quadrantIndex
      const nodeCollideRadius = node.collideRadius

      if (quadrantIndex === 0 ) {
        node.x = dadX + dadCollideRadius + node.nth * nodeCollideRadius * 2 + nodeCollideRadius
        node.y = dadY - nodeCollideRadius / 2
      } else if (quadrantIndex === 1) {
        node.x = dadX + dadCollideRadius + node.nth * nodeCollideRadius * 2 + nodeCollideRadius
        node.y = dadY + nodeCollideRadius / 2
      } else if (quadrantIndex === 2) {
        node.x = dadX - (dadCollideRadius + node.nth * nodeCollideRadius * 2 + nodeCollideRadius)
        node.y = dadY + nodeCollideRadius / 2
      } else if (quadrantIndex === 3) {
        node.x = dadX - (dadCollideRadius + node.nth * nodeCollideRadius * 2 + nodeCollideRadius)
        node.y = dadY - nodeCollideRadius / 2
      }
    })
  }

  force.initialize = (_: TextPlaceholdingCircleSimulationNode[]) => nodes = _

  return force
}
