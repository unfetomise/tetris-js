document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let random = 0
    let timerId = null
    let score = 0

    const COLORS = [
        "#645CBB",
        "#A084DC",
        "#BFACE2",
        "#EBC7E6",
        "#B9F3E4"
    ]

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    function createTetromino(position = 5) {
        let rotation = Math.floor(Math.random() * 4)
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)

        return {
            currentPosition: position,
            currentRotation: rotation,
            randomTet: random,
            current: theTetrominoes[random][rotation]
        };
    }

    let tetromino = createTetromino()

    // рисует  тетромино
    function draw() {
        tetromino.current.forEach(index => {
            squares[tetromino.currentPosition + index].classList.add('tetromino')
            squares[tetromino.currentPosition + index].style.backgroundColor = COLORS[random]
        })
    }

    // стирает тетромино
    function undraw() {
        tetromino.current.forEach(index => {
            squares[tetromino.currentPosition + index].classList.remove('tetromino')
            squares[tetromino.currentPosition + index].style.backgroundColor = ''
        })
    }

    // назначить функции клавишам
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //сдвинуть
    function moveDown() {
        undraw()
        tetromino.currentPosition += width
        draw()
        freeze()
    }

    function addTetramino() {
        tetromino = createTetromino()
        draw()
        displayShape()
        addScore()
        gameOver()
    }

    // заморозка тетромино
    function freeze() {
        if (tetromino.current.some(index => squares[tetromino.currentPosition + index + width].classList.contains('taken'))) {
            tetromino.current.forEach(index => squares[tetromino.currentPosition + index].classList.add('taken'))
            addTetramino()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = tetromino.current.some(index => (tetromino.currentPosition + index) % width === 0)
        if (!isAtLeftEdge) tetromino.currentPosition--
        if (tetromino.current.some(index => squares[tetromino.currentPosition + index].classList.contains('taken')))
            tetromino.currentPosition++
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = tetromino.current.some(index => (tetromino.currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) tetromino.currentPosition++
        if (tetromino.current.some(index => squares[tetromino.currentPosition + index].classList.contains('taken')))
            tetromino.currentPosition--
        draw()
    }

    // повернуть тетромино
    function rotate() {
        undraw()
        tetromino.currentRotation++
        if (tetromino.currentRotation === tetromino.current.length) tetromino.currentRotation = 0
        tetromino.current = theTetrominoes[tetromino.randomTet][tetromino.currentRotation]
        draw()
    }

    // показать следующий тетромино в мини-сетке
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    // тетромино без поворотов
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // L
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // Z
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // T
        [0, 1, displayWidth, displayWidth + 1], // O
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // I
    ]

    // отобразить фигуру в мини-сетке
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = COLORS[nextRandom]
        })
    }

    // добавление функционала кнопке
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if (tetromino.current.some(index => squares[tetromino.currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
            squares.forEach(index => {
                index.classList.remove('tetromino')
                index.classList.remove('taken')
                index.style.backgroundColor = ''
            })
            displaySquares.forEach(index => {
                index.classList.remove('tetromino')
                index.classList.remove('taken')
                index.style.backgroundColor = ''
            })
        }
    }
})