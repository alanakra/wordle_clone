import './style.css'
import Toastr from 'toastr2'
import './node_modules/toastr2/dist/toastr.min.css'

const NUMBER_OF_GUESSES = 6
let guessesRemaining: number = NUMBER_OF_GUESSES
let currentGuess: string[] = []
let nextLetter = 0
const rightGuessString = 'WORDLE'
const rightLength: number = rightGuessString.length
const arrRightGuessSubstring: string[] = [...rightGuessString]
const keyboardCont = document.getElementById("keyboard-cont")
const keyboardBox: Element = keyboardCont!
const toastr = new Toastr()
toastr.options.closeButton = true

console.log(rightGuessString)

function initBoard() {
    const board = document.getElementById("game-board")
    const boardBox: Element = board!

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        const row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < rightLength; j++) {
            const box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        boardBox.appendChild(row)
    }
}

function colorKeyboard(letter: string, color: string) {
    const keyBoard = document.getElementsByClassName("keyboard-button") as HTMLCollectionOf<HTMLElement>
    for (const elem of keyBoard) {
        if (elem.textContent === letter) {
            const oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function insertLetter (pressedKey: string) {
    if (nextLetter === rightLength) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    const row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    const rowBox: Element = row!
    const box = rowBox.children[nextLetter];
    const boxText: Element = box!
    boxText.textContent = pressedKey
    boxText.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter () {
    const row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    const rowBox: Element = row!
    const box = rowBox.children[nextLetter - 1]
    const boxText: Element = box!
    boxText.textContent = ""
    boxText.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let guessString = ''
    const rightGuess: string[] = [...rightGuessString]
    
    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != rightLength) {
        toastr.warning(`Not enough letters!`)
        return
    }
    
    for (let i = 0; i < rightLength; i++) {
        let letterColor = ''
        const letter = currentGuess[i]!
        
        const letterPosition: number = rightGuess.indexOf(currentGuess[i]!)
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green'
            } else {
                // shade box yellow
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        fillTable(letter.toUpperCase(), i)

        const delay: number = 250 * i
        setTimeout(()=> {
            colorKeyboard(letter, letterColor)
        }, delay)
    }

    if (guessString.toUpperCase() === rightGuessString) {
        console.warn(guessString, rightGuessString)
        toastr.info(`You guessed right! Game over!`)
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if (guessesRemaining === 0) {
            toastr.error(`You've run out of guesses! Game over! <br>
            The right word was: "${rightGuessString}"`)
        }
    }
}

function fillTable (letter: string, position: number) {
    const row = document.getElementsByClassName('letter-row') as HTMLCollectionOf<Element>
    const targetNode = row[6 - guessesRemaining]?.childNodes[position];

    if (targetNode instanceof HTMLElement) {
        targetNode.style.color = "black";

        if (arrRightGuessSubstring.includes(letter)) {
            if (letter === arrRightGuessSubstring[position]) {
                targetNode.style.backgroundColor = "#a0ce87";
            } else {
                targetNode.style.backgroundColor = "#fdeec6";
            }
        } else {
            targetNode.style.backgroundColor = "#d2d2d2";
        }
    }
}

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    const pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    const found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

keyboardBox.addEventListener("click", (e) => {
    const target = e.target as Element
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key: string = target.textContent!

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

initBoard()