let categoryText
let url
let categories = [
  'history',
  'music',
  'general_knowledge',
  'science',
  'film_and_tv',
  'food_and_drink'
]


let used_categories = [

]

import {_dom} from '/variables.js'
let cell

// create main game table
const game_table = document.createElement('table')

// set game table attributes and add eventlister that is looking for clicks. this will show then hide the questions & play timer-bar animation
game_table.setAttribute('id', 'main_table')
game_table.setAttribute('class', 'main_table')

game_table.addEventListener('click', function(event) {
    if(event.target.hasAttribute('data-question')) {
        let clicked_question = event.target.children[0]
        let question_timer = clicked_question.children[2].children[0]
        let main_table = document.getElementById('main_table')
        
        question_timer.setAttribute('id', "play-timer-animation")
        document.getElementById('play-timer-animation').style.animationDuration = _dom.question_length / 1000 + "s"
        main_table.style.visibility = "hidden"
        clicked_question.style.visibility = "visible"
        clicked_question.style.right = "0px"
        clicked_question.style.left = "0px"
        clicked_question.style.top = "0px"

        setTimeout(function() {
            clicked_question.style.visibility = "hidden"
            main_table.style.visibility = "visible"
            question_timer.removeAttribute('id', 'play-timer-animation')
        }, _dom.question_length)
    }
})

//start setting up the game table 5 deep 
for (let i = 0; i < 5; i++) {
    let rows = game_table.insertRow(i)
    rows.id = `${i + 1}r${i + 1}c`
    
    //setting up the cells 4 wide 
    for(let y = 0; y < 4; y++) {

        cell = rows.insertCell(y)
        cell.id = `r${i}c${y}`
        cell.innerText = cell.id 
        cell.setAttribute('class', 'boxes')
        cell.setAttribute('data-question', 'box')

        // creating the elements that will be "inside" each sell 
        const question = document.createElement('div')
        const question_p = document.createElement('p')
        const choices = document.createElement('div')
        const timer_container = document.createElement('div')
        const timer_bar = document.createElement('div')

        // creating the choices and options
        for(let k = 0; k < 3; k++) {
            const choices_option = document.createElement('p')
            choices_option.innerHTML = `${k}`   
            choices.setAttribute('data-choice', 'choice')
            choices.appendChild(choices_option)
        }

        // setting attributes for styling
        timer_bar.setAttribute('class', "timer-bar")
        timer_container.setAttribute('class', "timer-container")
        choices.setAttribute('class', "choices")
        question_p.setAttribute('class', "question-color")
        question.setAttribute('class', "questions")

        // glueing everything together 
        timer_container.appendChild(timer_bar)
        question.appendChild(question_p)    
        question.appendChild(choices)
        question.appendChild(timer_container)
        cell.appendChild(question)

    }
} document.body.appendChild(game_table) //added it all to the document body

// create and add the header section to the game table 
let headers = game_table.insertRow(0)
headers.setAttribute('class', 'headers')
for(let i = 0; i < 4; i++) {
    headers.insertCell()
}

// variables to be used in the foreach loops 
let choices = document.querySelectorAll('[data-choice="choice"]')
let cells = document.querySelectorAll('.boxes')
let test = document.querySelectorAll('.boxes')
let questions = document.querySelectorAll('.questions')
let questions_text = document.querySelectorAll('.question-color')

//set id for each question. this will be used later 
questions.forEach((element, index) => {
    element.id = `q${index + 1}`
})

console.table("Original \n", categories)
for(let i = 0; i <= 4; i++) {
  pickRandomCategory(i)
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
    for(let i = 0; i < 4; i++) {
      headers.children[col].innerHTML = info[i].category
    }

    cells.forEach((element, index) => {
      element.childNodes[1].textContent = info[index].question
    })

    for(let i = 0; i < info.length; i++) {
      console.log(info[i].category)
      console.log(info[i].question)
      // console.log(info[i].correctAnswer)
      // console.log(info[i].incorrectAnswers)   
    }
  })


  categories.splice(categories.indexOf(pickedCategory), 1)
  console.log(categories)
  console.log(used_categories)

}

function getRandomOptionSlot(element, index, option, json) {
  let pickedSlot = element.children[pickRadomElement(3)]
  let pickedValidSlot = false
  do {
      if(pickedSlot.hasAttribute('data-choices', 'correct') || pickedSlot.hasAttribute('data-choices', 'wrong_1')) {
          pickedSlot = element.children[pickRadomElement(3)] // run function again until a spot has been found
      } else {
          pickedValidSlot = true
          pickedSlot.innerHTML = json['questions'][index][`${option}`]
          //if a question is only True/False we want to remove a third option that will be undefined
          if(pickedSlot.innerHTML === "undefined") {
              pickedSlot.remove()
          }
          pickedSlot.setAttribute('data-choices', `${option}`)
      }
  }
  while (pickedValidSlot == false)
}


//random gen function
function pickRadomElement(max) {
  return Math.floor(Math.random() * max)
}   

function pickRandomNumber(max) {
  return Math.floor(Math.random() * max)
}