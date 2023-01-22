import {_dom} from '/variables.js'

const  headers = document.querySelector('.headers')
const cells = document.querySelectorAll('.boxes')
const choices = document.querySelectorAll('[data-choice="choice"]')
const choiceContainer = document.querySelectorAll('.choices')

let used_categories = []
let categories = [
  'history',
  'music',
  'general_knowledge',
  'science',
  'film_and_tv',
  'food_and_drink',
  'sports',
  'geography',
  'arts_and_literature',
  'society_and_culture'
]

console.table("Original \n", categories)
for(let col = 0; col <= 3; col++) {
  pickRandomCategory(col)
  console.table(used_categories)
}

let pickedUsedCategory = pickUsedCategory()

function pickUsedCategory() {
  console.log(used_categories.length)
  for(let i = 0; i < used_categories.length; i++) {
    let pickedCategory = used_categories
    console.log(used_categories[i])
    return pickedCategory
  }
}
pickQuestions()

function pickQuestions() {
  fetch(`https://the-trivia-api.com/api/questions?categories=${pickedUsedCategory}&limit=20&difficulty=easy `, {
  headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((response) => response.json())
  .then((info) => {
    for(let i = 0; i < info.length; i++) {
      // console.log(JSON.stringify(info, null, 4))
      //console.log(info[i].category)
      // console.log(`| Question | ${info[i].question} | Category | ${info[i].category} | q${i}`)
      // console.log('Correct', info[i].correctAnswer)
      // console.log(info[i].incorrectAnswers)   
    }

    cells.forEach((element, index) => {
      element.childNodes[1].children[0].innerHTML = info[index].question
    })

    choices.forEach((element, index) => {
      getRandomOptionSlot(element, 'correct', info[index].correctAnswer)
      getRandomOptionSlot(element, 'wrong_1', info[index].incorrectAnswers[0])
      getRandomOptionSlot(element, 'wrong_2', info[index].incorrectAnswers[1])
      getRandomOptionSlot(element, 'wrong_3', info[index].incorrectAnswers[2])
    })
    
  })
}

function pickRandomCategory(col) {
  let catLength = categories.length
  let pickedCategory = categories[pickRandomNumber(catLength)]

  fetch(`https://the-trivia-api.com/api/questions?categories=${pickedCategory}&limit=5&difficulty=easy`, {
  headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((response) => response.json())
  .then((info) => {
    for(let i = 0; i < 3; i++) {
      headers.children[col].innerHTML = info[i].category
      headers.children[col].setAttribute("data-category", pickedCategory)
      headers.children[col].id = `c${col}`
    }
  })
  categories.splice(categories.indexOf(pickedCategory), 1)
  used_categories.push(pickedCategory)
}

function getRandomOptionSlot(element, option, json) {
  let pickedSlot = element.children[pickRandomNumber(4)]
  let pickedValidSlot = false
  do {
      if(pickedSlot.hasAttribute('data-choices', 'wrong_1') || pickedSlot.hasAttribute('data-choices', 'wrong_2') || pickedSlot.hasAttribute('data-choices', 'wrong_3') || pickedSlot.hasAttribute('data-choices', 'correct')) {
        pickedSlot = element.children[pickRandomNumber(4)] 
      } else {
        pickedValidSlot = true
        pickedSlot.innerHTML = json

      if(pickedSlot.innerHTML === "undefined") {
        pickedSlot.remove()
      }
      pickedSlot.setAttribute('data-choices', `${option}`)
      }
  }
  while (pickedValidSlot == false)
}

function pickRandomNumber(max) {
  return  Math.floor(Math.random() * max)
}