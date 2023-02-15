export const getCellClassName = (cellValue, foodCell, foodShouldReverseDirection, snakeCells) => {
  let className = "cell"
  if (cellValue === foodCell) {
    if (foodShouldReverseDirection) {
      className = "cell cell-purple"
    } else {
      className = "cell cell-red"
    }
  }
  if (snakeCells.has(cellValue)) className = "cell cell-green"

  return className
}
