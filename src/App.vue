<template>
  <div class="container mx-auto px-4 py-8" @keydown="handleKeydown" tabindex="0" ref="gameContainer">
    <h1 class="text-4xl font-bold mb-4">{{ t('title') }}</h1>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <button v-if="!gameRunning" @click="initGame" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
          {{ t('startGame') }}
        </button>
        <button v-else @click="togglePause" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2">
          {{ isPaused ? t('resume') : t('pause') }}
        </button>
        <button @click="stopGame" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">
          {{ t('endGame') }}
        </button>
        <button @click="toggleLanguage" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
          {{ t('changeLanguage') }}
        </button>
        <select v-model="selectedLevel" :disabled="gameRunning" class="bg-gray-700 text-white py-2 px-4 rounded">
          <option v-for="l in 10" :key="l" :value="l">{{ t('level') }} {{ l }}</option>
        </select>
      </div>
      <div>
        <span class="text-xl mr-4">{{ t('score') }}: {{ score }}</span>
        <span class="text-xl">{{ t('level') }}: {{ level }}</span>
      </div>
    </div>
    <div ref="gameBoard" class="w-96 h-96 bg-gray-800 relative overflow-hidden">
      <div v-for="(segment, index) in snake" :key="index" class="absolute w-6 h-6 bg-green-500" :style="{ left: `${segment.x * 24}px`, top: `${segment.y * 24}px` }"></div>
      <div ref="foodElement" class="absolute w-6 h-6 bg-red-500" :style="{ left: `${food.x * 24}px`, top: `${food.y * 24}px` }"></div>
      <div v-if="showEatEffect" ref="eatEffect" class="absolute w-12 h-12 bg-yellow-400 rounded-full opacity-0" :style="{ left: `${(food.x * 24) - 12}px`, top: `${(food.y * 24) - 12}px` }"></div>
      <div v-if="isPaused" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <p class="text-white text-4xl font-bold">{{ t('paused') }}</p>
      </div>
    </div>
    <div v-if="gameOver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg text-black">
        <h2 class="text-2xl font-bold mb-4">{{ t('gameOver') }}</h2>
        <p class="mb-2">{{ t('finalScore') }}: {{ score }}</p>
        <p class="mb-4">{{ t('finalLevel') }}: {{ level }}</p>
        <button @click="resetGame" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          {{ t('playAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { animate, spring } from 'motion'
import useGameState from './hooks/useGameState'
import useSnake from './hooks/useSnake'
import useFood from './hooks/useFood'
import useI18n from './hooks/useI18n'

const gameBoard = ref(null)
const foodElement = ref(null)
const eatEffect = ref(null)
const gameContainer = ref(null)
const { score, level, gameOver, gameRunning, startGame, endGame, increaseScore, getGameSpeed, getDifficulty } = useGameState()
const { snake, direction, resetSnake, moveSnake, growSnake, shrinkSnake, changeDirection } = useSnake()
const { food, resetFood } = useFood()
const { t, toggleLanguage } = useI18n()

const selectedLevel = ref(1)
const showEatEffect = ref(false)
const isPaused = ref(false)
let gameLoop = null

const initGame = () => {
  resetSnake()
  resetFood()
  startGame(selectedLevel.value)
  isPaused.value = false
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(updateGame, getGameSpeed.value)
  nextTick(() => {
    gameContainer.value.focus()
  })
}

const stopGame = () => {
  endGame()
  clearInterval(gameLoop)
  gameLoop = null
  isPaused.value = false
}

const resetGame = () => {
  stopGame()
  selectedLevel.value = 1
  gameOver.value = false
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    clearInterval(gameLoop)
  } else {
    gameLoop = setInterval(updateGame, getGameSpeed.value)
  }
}

const updateGame = () => {
  if (isPaused.value) return

  const newHead = {
    x: snake.value[0].x + direction.x,
    y: snake.value[0].y + direction.y
  }

  if (checkCollision(newHead)) {
    stopGame()
    return
  }

  moveSnake()

  if (newHead.x === food.value.x && newHead.y === food.value.y) {
    growSnake()
    increaseScore()
    playEatAnimation()
    resetFood()
    
    // Update game speed
    clearInterval(gameLoop)
    gameLoop = setInterval(updateGame, getGameSpeed.value)
  } else {
    shrinkSnake()
  }
}

const playEatAnimation = () => {
  showEatEffect.value = true
  
  // Animate the eat effect
  animate(
    eatEffect.value,
    { opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] },
    { duration: 0.5, easing: spring() }
  )

  // Animate the food
  animate(
    foodElement.value,
    { scale: [1, 1.5, 1] },
    { duration: 0.5, easing: spring() }
  )

  // Animate the game board
  animate(
    gameBoard.value,
    { scale: [1, 1.05, 1] },
    { duration: 0.5, easing: spring() }
  )

  setTimeout(() => {
    showEatEffect.value = false
  }, 500)
}

const checkCollision = (head) => {
  if (head.x < 0 || head.x >= 16 || head.y < 0 || head.y >= 16) {
    return true
  }
  return snake.value.some(segment => segment.x === head.x && segment.y === head.y)
}

const handleKeydown = (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    if (gameRunning.value) {
      togglePause()
    } else {
      initGame()
    }
    return
  }

  if (!gameRunning.value || isPaused.value) return

  switch (e.key) {
    case 'ArrowUp': 
      e.preventDefault()
      changeDirection({ x: 0, y: -1 })
      break
    case 'ArrowDown': 
      e.preventDefault()
      changeDirection({ x: 0, y: 1 })
      break
    case 'ArrowLeft': 
      e.preventDefault()
      changeDirection({ x: -1, y: 0 })
      break
    case 'ArrowRight': 
      e.preventDefault()
      changeDirection({ x: 1, y: 0 })
      break
  }
}

watch([getGameSpeed, getDifficulty], ([newSpeed, newDifficulty]) => {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = setInterval(updateGame, newSpeed)
  }
  // You can use newDifficulty to adjust other game parameters if needed
})

onMounted(() => {
  nextTick(() => {
    gameContainer.value.focus()
  })
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
})
</script>

<style scoped>
.container:focus {
  outline: none;
}
</style>
