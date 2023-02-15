import React, { useEffect, useState } from "react"
import { randomIntFromInterval, reverseSnakeBody, useInterval } from "../utils/utils"
import { createBoard } from "./createBoard"
import { getCellClassName } from "./getCellClassName"
import { isOutOfBounds } from "./outOfBounds"
import { getDirections, Direction, getDirectionFromKey, getNextNodeDirection, getGrowthNodeCoords, getOppositeDirection } from "./getDirections"
import "./Board.css"

class SnakeBodyNode {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class SnakeBody {
  constructor(value) {
    const node = new SnakeBodyNode(value)
    this.head = node
    this.tail = node
  }
}

const BOARD_SIZE = 15
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = 0.3

const getStartingSnakeLLValue = board => {
  const rowSize = board.length
  const colSize = board[0].length
  const startingRow = Math.round(rowSize / 3)
  const startingCol = Math.round(colSize / 3)
  const startingCell = board[startingRow][startingCol]
  return {
    row: startingRow,
    col: startingCol,
    cell: startingCell
  }
}

const Board = () => {
  const [score, setScore] = useState(0)
  const [board] = useState(createBoard(BOARD_SIZE))
  const [snake, setSnake] = useState(new SnakeBody(getStartingSnakeLLValue(board)))
  const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value.cell]))
  // Naively set the starting food cell 5 cells away from the starting snake cell.
  const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5)
  const [direction, setDirection] = useState(Direction.RIGHT)
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(false)

  useEffect(() => {
    window.addEventListener("keypress", e => {
      handleKeydown(e)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useInterval(() => {
    moveSnake()
  }, 150)

  const handleKeydown = e => {
    const newDirection = getDirectionFromKey(e.key)
    const isValidDirection = newDirection !== ""
    if (!isValidDirection) return
    const snakeWillRunIntoItself = getOppositeDirection(newDirection) === direction && snakeCells.size > 1

    if (snakeWillRunIntoItself) return
    setDirection(newDirection)
  }

  const moveSnake = () => {
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col
    }

    const nextHeadCoords = getDirections(currentHeadCoords, direction)
    if (isOutOfBounds(nextHeadCoords, board)) {
      handleGameOver()
      return
    }
    const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col]
    if (snakeCells.has(nextHeadCell)) {
      handleGameOver()
      return
    }

    const newHead = new SnakeBodyNode({
      row: nextHeadCoords.row,
      col: nextHeadCoords.col,
      cell: nextHeadCell
    })
    const currentHead = snake.head
    snake.head = newHead
    currentHead.next = newHead

    const newSnakeCells = new Set(snakeCells)
    newSnakeCells.delete(snake.tail.value.cell)
    newSnakeCells.add(nextHeadCell)

    snake.tail = snake.tail.next
    if (snake.tail === null) snake.tail = snake.head

    const foodConsumed = nextHeadCell === foodCell
    if (foodConsumed) {
      // This function mutates newSnakeCells.
      growSnake(newSnakeCells)
      if (foodShouldReverseDirection) reverseSnake()
      handleFoodConsumption(newSnakeCells)
    }

    setSnakeCells(newSnakeCells)
  }

  // This function mutates newSnakeCells.
  const growSnake = newSnakeCells => {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction)
    if (isOutOfBounds(growthNodeCoords, board)) {
      // Snake is positioned such that it can't grow; don't do anything.
      return
    }
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col]
    const newTail = new SnakeBodyNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell
    })
    const currentTail = snake.tail
    snake.tail = newTail
    snake.tail.next = currentTail

    newSnakeCells.add(newTailCell)
  }

  const reverseSnake = () => {
    const tailNextNodeDirection = getNextNodeDirection(snake.tail, direction)
    const newDirection = getOppositeDirection(tailNextNodeDirection)
    setDirection(newDirection)

    // The tail of the snake is really the head of the snake body, which
    // is why we have to pass the snake's tail to `reverseSnakeBody`.
    reverseSnakeBody(snake.tail)
    const snakeHead = snake.head
    snake.head = snake.tail
    snake.tail = snakeHead
  }

  const handleFoodConsumption = newSnakeCells => {
    const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE
    let nextFoodCell

    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue)
      if (newSnakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue
      break
    }

    const nextFoodShouldReverseDirection = Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD

    setFoodCell(nextFoodCell)
    setFoodShouldReverseDirection(nextFoodShouldReverseDirection)
    setScore(score + 1)
  }

  const handleGameOver = () => {
    setScore(0)
    const snakeLLStartingValue = getStartingSnakeLLValue(board)
    setSnake(new SnakeBody(snakeLLStartingValue))
    setFoodCell(snakeLLStartingValue.cell + 5)
    setSnakeCells(new Set([snakeLLStartingValue.cell]))
    setDirection(Direction.RIGHT)
  }

  return (
    <>
      <h1>Score: {score}</h1>
      <div className="board">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellValue, cellIdx) => {
              const className = getCellClassName(cellValue, foodCell, foodShouldReverseDirection, snakeCells)
              return <div key={cellIdx} className={className}></div>
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default Board
