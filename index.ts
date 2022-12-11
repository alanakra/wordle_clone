import './style.css'

const NUMBER_OF_GUESSES = 6
let guessesRemaining: number = NUMBER_OF_GUESSES
let currentGuess: string[] = []
let nextLetter = 0
const rightGuessString = 'WORDLE'
const rightLength: number = rightGuessString.length
const arrRightGuessSubstring: string[] = [...rightGuessString]
const keyboardCont = document.getElementById("keyboard-cont")
const keyboardBox: Element = keyboardCont!

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

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
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
    const row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    const rowBox: Element = row!
    let guessString = ''
    const rightGuess: string[] = [...rightGuessString]

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != rightLength) {
        console.error("Not enough letters!")
        return
    }
    
    for (let i = 0; i < rightLength; i++) {
        let letterColor = ''
        const box = rowBox.children[i] as HTMLElement
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
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        console.log("You guessed right! Game over!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if (guessesRemaining === 0) {
            console.error("You've run out of guesses! Game over!")
            console.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

function fillTable (letter: string, position: number) {
    console.warn(`Letter: ${letter}. ArrRightGuessSubstring: ${arrRightGuessSubstring[position]}. Type: ${typeof(arrRightGuessSubstring[position]!)}. Index: ${arrRightGuessSubstring.indexOf(arrRightGuessSubstring[position]!)}`)
    const row = document.getElementsByClassName('letter-row') as HTMLCollectionOf<Element>
    if (arrRightGuessSubstring.includes(letter)) {
        if (letter === arrRightGuessSubstring[position]) {
            console.log(`Check position: ${position} ${arrRightGuessSubstring.indexOf(arrRightGuessSubstring[position]!)}`)
            console.info('GOOD POSITION !!!')
            console.log(row[6 - guessesRemaining]!.childNodes[position])
            row[6 - guessesRemaining]!.childNodes[position]!.style.backgroundColor = "#a0ce87"
        } else {
            console.info('NO GOOD POSITION !!')
            console.log(row[6 - guessesRemaining]!.childNodes[position])
            console.log(position)
            row[6 - guessesRemaining]!.childNodes[position]!.style.backgroundColor = "#fdeec6"
        }
    } else {
        console.info('NO !!')
        console.log(row[6 - guessesRemaining]!.childNodes[position])
        row[6 - guessesRemaining]!.childNodes[position]!.style.backgroundColor = "#d2d2d2"
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
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

initBoard()