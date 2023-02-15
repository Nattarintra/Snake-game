export const isOutOfBounds = (coords, board) => {
  const { row, col } = coords
  if (row < 0 || col < 0) return true
  if (row >= board.length || col >= board[0].length) return true
  return false
}
