export const createBoard = BOARD_SIZE => {
  let counter = 1
  const board = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    const currentRow = []
    for (let col = 0; col < BOARD_SIZE; col++) {
      currentRow.push(counter++)
    }
    board.push(currentRow)
  }
  return board
}
