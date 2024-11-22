<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-4">{{ t('title') }}</h1>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <button @click="initGame" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
          {{ gameRunning ? t('restart') : t('startGame') }}
        </button>
        <button @click="toggleLanguage" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {{ t('changeLanguage') }}
        </button>
      </div>
      <div>
        <span class="text-xl mr-4">{{ t('score') }}: {{ score }}</span>
        <span class="text-xl">{{ t('level') }}: {{ level }}</span>
      </div>
    </div>
    <div ref="gameBoard" class="w-64 h-64 bg-gray-800 relative">
      <div v-for="(segment, index) in snake" :key="index" class="absolute w-4 h-4 bg-green-500" :style="{ left: `${segment.x * 16}px`, top: `${segment.y * 16}px` }"></div>
      <div class="absolute w-4 h-4 bg-red-500" :style="{ left: `${food.x * 16}px`, top: `${food.y * 16}px` }"></div>
    </div>
    <div v-if="gameOver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg text-black">
        <h2 class="text-2xl font-bold mb-4">{{ t('gameOver') }}</h2>
        <p class="mb-2">{{ t('finalScore') }}: {{ score }}</p>
        <p class="mb-4">{{ t('finalLevel') }}: {{ level }}</p>
        <button @click="initGame" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          {{ t('playAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { animate } from 'motion'
import useGameState from './hooks/useGameState'
import useSnake from './hooks/useSnake'
import useFood from './hooks/useFood'
import useI18n from './hooks/useI18n'

const gameBoard = ref(null)
const { score, level, gameOver, gameRunning, startGame, endGame, increaseScore, getGameSpeed } = useGameState()
const { snake, direction, resetSnake, moveSnake, growSnake, shrinkSnake, changeDirection } = useSnake()
const { food, resetFood } = useFood()
const { t, toggleLanguage } = useI18n()

let gameLoop = null

const initGame = () => {
  resetSnake()
  resetFood()
  startGame()
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(updateGame, getGameSpeed.value)
}

const updateGame = () => {
  const newHead = {
    x: snake.value[0].x + direction.x,
    y: snake.value[0].y + direction.y
  }

  if (checkCollision(newHead)) {
    endGame()
    clearInterval(gameLoop)
    return
  }

  moveSnake()

  if (newHead.x === food.value.x && newHead.y === food.value.y) {
    growSnake()
    resetFood()
    increaseScore()
    animate(gameBoard.value, { scale: [1, 1.05, 1] }, { duration: 0.2 })
  } else {
    shrinkSnake()
  }
}

const checkCollision = (head) => {
  if (head.x < 0 || head.x >= 16 || head.y < 0 || head.y >= 16) {
    return true
  }
  return snake.value.some(segment => segment.x === head.x && segment.y === head.y)
}

const handleKeydown = (e) => {
  if (!gameRunning.value) return

  switch (e.key) {
    case 'ArrowUp': changeDirection({ x: 0, y: -1 }); break
    case 'ArrowDown': changeDirection({ x: 0, y: 1 }); break
    case 'ArrowLeft': changeDirection({ x: -1, y: 0 }); break
    case 'ArrowRight': changeDirection({ x: 1, y: 0 }); break
  }
}

watch(getGameSpeed, (newSpeed) => {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = setInterval(updateGame, newSpeed)
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (gameLoop) clearInterval(gameLoop)
})
</script>
