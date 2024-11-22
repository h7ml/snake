import { ref, computed } from 'vue'

const translations = {
  en: {
    title: 'Snake Game',
    startGame: 'Start Game',
    endGame: 'End Game',
    restart: 'Restart',
    changeLanguage: 'Change Language',
    score: 'Score',
    level: 'Level',
    gameOver: 'Game Over!',
    finalScore: 'Your final score',
    finalLevel: 'Your final level',
    playAgain: 'Play Again'
  },
  zh: {
    title: '贪吃蛇游戏',
    startGame: '开始游戏',
    endGame: '结束游戏',
    restart: '重新开始',
    changeLanguage: '切换语言',
    score: '得分',
    level: '等级',
    gameOver: '游戏结束！',
    finalScore: '最终得分',
    finalLevel: '最终等级',
    playAgain: '再玩一次'
  }
}

export default function useI18n() {
  const currentLanguage = ref('en')

  const t = computed(() => (key) => translations[currentLanguage.value][key])

  const toggleLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'en' ? 'zh' : 'en'
  }

  return {
    t,
    toggleLanguage
  }
}
