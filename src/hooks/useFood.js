import { ref } from 'vue'

export default function useFood() {
  const food = ref({ x: 5, y: 5 })

  const getRandomPosition = () => ({
    x: Math.floor(Math.random() * 16),
    y: Math.floor(Math.random() * 16)
  })

  const resetFood = () => {
    food.value = getRandomPosition()
  }

  return {
    food,
    resetFood
  }
}
