import { ref, computed } from 'vue'

export default function useGameState() {
  const score = ref(0)
  const level = ref(1)
  const gameOver = ref(false)
  const gameRunning = ref(false)

  const startGame = () => {
    score.value = 0
    level.value = 1
    gameOver.value = false
    gameRunning.value = true
  }

  const endGame = () => {
    gameOver.value = true
    gameRunning.value = false
  }

  const increaseScore = () => {
    score.value++
    if (score.value % 5 === 0) {
      level.value++
    }
  }

  const getGameSpeed = computed(() => {
    return Math.max(50, 200 - (level.value - 1) * 20)
  })

  return {
    score,
    level,
    gameOver,
    gameRunning,
    startGame,
    endGame,
    increaseScore,
    getGameSpeed
  }
}
