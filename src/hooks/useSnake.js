import { ref, reactive } from 'vue'

export default function useSnake() {
  const snake = ref([{ x: 0, y: 0 }])
  const direction = reactive({ x: 1, y: 0 })

  const resetSnake = () => {
    snake.value = [{ x: 0, y: 0 }]
    direction.x = 1
    direction.y = 0
  }

  const moveSnake = () => {
    const newHead = {
      x: snake.value[0].x + direction.x,
      y: snake.value[0].y + direction.y
    }
    snake.value.unshift(newHead)
  }

  const growSnake = () => {
    // The snake grows by not removing the tail in moveSnake
  }

  const shrinkSnake = () => {
    snake.value.pop()
  }

  const changeDirection = (newDirection) => {
    if (newDirection.x === -direction.x || newDirection.y === -direction.y) {
      return // Prevent 180-degree turns
    }
    direction.x = newDirection.x
    direction.y = newDirection.y
  }

  return {
    snake,
    direction,
    resetSnake,
    moveSnake,
    growSnake,
    shrinkSnake,
    changeDirection
  }
}
