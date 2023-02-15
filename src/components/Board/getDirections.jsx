export const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT"
}
export const getDirections = (coords, direction) => {
  if (direction === Direction.UP) {
    return {
      row: coords.row - 1,
      col: coords.col
    }
  }
  if (direction === Direction.RIGHT) {
    return {
      row: coords.row,
      col: coords.col + 1
    }
  }
  if (direction === Direction.DOWN) {
    return {
      row: coords.row + 1,
      col: coords.col
    }
  }
  if (direction === Direction.LEFT) {
    return {
      row: coords.row,
      col: coords.col - 1
    }
  }
}

export const getDirectionFromKey = key => {
  if (key === "ArrowUp") return Direction.UP
  if (key === "ArrowRight") return Direction.RIGHT
  if (key === "ArrowDown") return Direction.DOWN
  if (key === "ArrowLeft") return Direction.LEFT
  return ""
}

export const getNextNodeDirection = (node, currentDirection) => {
  if (node.next === null) return currentDirection
  const { row: currentRow, col: currentCol } = node.value
  const { row: nextRow, col: nextCol } = node.next.value
  if (nextRow === currentRow && nextCol === currentCol + 1) {
    return Direction.RIGHT
  }
  if (nextRow === currentRow && nextCol === currentCol - 1) {
    return Direction.LEFT
  }
  if (nextCol === currentCol && nextRow === currentRow + 1) {
    return Direction.DOWN
  }
  if (nextCol === currentCol && nextRow === currentRow - 1) {
    return Direction.UP
  }
  return ""
}

export const getGrowthNodeCoords = (snakeTail, currentDirection) => {
  const tailNextNodeDirection = getNextNodeDirection(snakeTail, currentDirection)
  const growthDirection = getOppositeDirection(tailNextNodeDirection)
  const currentTailCoords = {
    row: snakeTail.value.row,
    col: snakeTail.value.col
  }
  const growthNodeCoords = getDirections(currentTailCoords, growthDirection)
  return growthNodeCoords
}

export const getOppositeDirection = direction => {
  if (direction === Direction.UP) return Direction.DOWN
  if (direction === Direction.RIGHT) return Direction.LEFT
  if (direction === Direction.DOWN) return Direction.UP
  if (direction === Direction.LEFT) return Direction.RIGHT
}
