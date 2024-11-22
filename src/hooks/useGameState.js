import { ref, computed } from 'vue'

export default function useGameState() {
  const score = ref(0)
  const level = ref(1)
  const gameOver = ref(false)
  const gameRunning = ref(false)

  const startGame = (selectedLevel) => {
    score.value = 0
    level.value = selectedLevel
    gameOver.value = false
    gameRunning.value = true
  }

  const endGame = () => {
    gameOver.value = true
    gameRunning.value = false
  }

  const increaseScore = () => {
    score.value++
    if (score.value % 10 === 0) {
      level.value++
    }
  }

  const getGameSpeed = computed(() => {
    return Math.max(50, 200 - (level.value - 1) * 25)
  })

  const getDifficulty = computed(() => {
    return Math.min(0.9, 0.5 + (level.value - 1) * 0.05)
  })

  return {
    score,
    level,
    gameOver,
    gameRunning,
    startGame,
    endGame,
    increaseScore,
    getGameSpeed,
    getDifficulty
  }
}
