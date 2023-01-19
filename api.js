import {_dom} from '/variables.js'

const  headers = document.querySelector('.headers')
const cells = document.querySelectorAll('.boxes')
const choices = document.querySelectorAll('[data-choice="choice"]')
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
console.log(pickedUsedCategory[0])

function pickUsedCategory() {
  console.log(used_categories.length)
  for(let i = 0; i < used_categories.length; i++) {
    let pickedCategory = used_categories
    console.log(pickedCategory[i])
    return pickedCategory
  }
}
pickQuestions()


function pickQuestions() {
  fetch(`https://the-trivia-api.com/api/questions?categories=${pickedUsedCategory}&limit=20&difficulty=easy`, {
  headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((response) => response.json())
  .then((info) => {
    for(let i = 0; i < info.length; i++) {
      // console.log(JSON.stringify(info, null, 4))
      // console.log(info[i].category)
      console.log(`| Question | ${info[i].question} | Category | ${info[i].category} ${i}`)
      // console.log(info[i].correctAnswer)
      // console.log(info[i].incorrectAnswers)   
    }

    cells.forEach((element, index) => {
      element.childNodes[1].children[0].innerHTML = info[index].question
    })

    choices.forEach((element, index) => {
      element.children[pickRandomNumber(3)].innerHTML = info[index].incorrectAnswers[1]
      element.children[pickRandomNumber(3)].innerHTML = info[index].incorrectAnswers[2]
      element.children[pickRandomNumber(3)].innerHTML = info[index].correctAnswer
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

function getRandomOptionSlot(element, index, option, json) {
  let pickedSlot = element.children[pickRadomElement(3)]
  let pickedValidSlot = false
  do {
      if(pickedSlot.hasAttribute('data-choices', 'correct') || pickedSlot.hasAttribute('data-choices', 'wrong_1')) {
          pickedSlot = element.children[pickRadomElement(3)] 
      } else {
          pickedValidSlot = true
          pickedSlot.innerHTML = json['questions'][index][`${option}`]

          if(pickedSlot.innerHTML === "undefined") {
              pickedSlot.remove()
          }
          pickedSlot.setAttribute('data-choices', `${option}`)
      }
  }
  while (pickedValidSlot == false)
}

function pickRandomNumber(max) {
  return Math.floor(Math.random() * max)
}