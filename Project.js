document.addEventListener("DOMContentLoaded", () => {

    let guessedWords = [[]];

    let availableSpace = 1;

    let guessedWordCount = 0;

    let restart = false;

    let ready = true;

    const possibleWords = ["robot", "clamp", "cable", "laser", "wires", "today"]

    const word = possibleWords[Math.floor(lerp(0, possibleWords.length, random()))]

    const keys = document.querySelectorAll(".keyboard-row button");

    document.getElementById("open-donation").onclick = openDonation;

    document.getElementById("close-donation").onclick = closeDonation;

    document.getElementById("close-info").onclick = closeInfo;

    createSquares();

    loadLocalStorage()

    function loadLocalStorage() {
        guessedWordCount = Number(window.localStorage.getItem("guessedWordCount")) || guessedWordCount
        availableSpace = Number(window.localStorage.getItem("availableSpace")) || availableSpace
        guessedWords = JSON.parse(window.localStorage.getItem("guessedWords")) || guessedWords

        const storedBoardContainer = window.localStorage.getItem("boardContainer")

        if (storedBoardContainer) {
            document.getElementById("board-container").innerHTML = storedBoardContainer
        }
    }

    function updateTotalGames() {
        const totalGames = window.localStorage.getItem("totalGames") || 0
        window.localStorage.setItem("totalGames", Number(totalGames) + 1)

    }

    function preserveGameState() {
        window.localStorage.setItem("guessedWords", JSON.stringify(guessedWords))

        const boardContainer = document.getElementById("board-container")
        window.localStorage.setItem("boardContainer", boardContainer.innerHTML)
    }

    function resetGameState() {
        window.localStorage.removeItem("guessedWordCount")
        window.localStorage.removeItem("availableSpace")
        window.localStorage.removeItem("guessedWords")
        window.localStorage.removeItem("boardContainer")

        document.getElementById("board").innerHTML = "";

        createSquares()

        guessedWords = [[]];

        availableSpace = 1;
    
        guessedWordCount = 0;
    }

    function getCurrentWordArray() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWords(letter) {
        const currentWordArray = getCurrentWordArray()

        if (currentWordArray && currentWordArray.length < 5) {
            currentWordArray.push(letter);

            const availableSpaceElement = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1

            availableSpaceElement.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if (!isCorrectLetter) {
            return "rgb(58,58,60)"
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrentPosition = letter === letterInThatPosition

        if (isCorrentPosition) {
            return "rgb(83,141,78)"
        }

        return "rgb(181,141,78)"
    }

    function handleSubmitWord() {

        const currentWordArray = getCurrentWordArray()

        if (currentWordArray.length !== 5) {
            openInfo();
            return
        }

        ready = false

        const currentWord = currentWordArray.join("")

        if (currentWord == word) {
            const totalWins = window.localStorage.getItem("totalWins") || 0
            window.localStorage.setItem("totalWins", Number(totalWins) + 1)

            const currentStreak = window.localStorage.getItem("currentStreak") || 0
            window.localStorage.setItem("currentStreak", Number(currentStreak) + 1)
            updateTotalGames()
        }
        else if (guessedWords.length == 6) {
            window.localStorage.setItem("currentStreak", 0)
            updateTotalGames()
        }

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 250;
        currentWordArray.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterElement = document.getElementById(letterId)
                letterElement.style = `background-color:${tileColor};border-color:${tileColor}`;

                if (index == 4) {
                    setTimeout(() => {

                        guessedWordCount += 1;

                        window.localStorage.setItem("availableSpace", availableSpace)
                        window.localStorage.setItem("guessedWordCount", guessedWordCount)

                        if (currentWord == word) {
                            restart = window.alert("Congratulations!");
                            resetGameState()
                            ready = true;
                            return
                        }
                        else if (guessedWords.length == 6) {
                            restart = window.alert(`Sorry, no luck this time! The word was ${word}`);                         
                            resetGameState()
                            ready = true;
                            return
                        }
                        ready = true;

                        guessedWords.push([])

                        preserveGameState()
                    }, 250)
                }
            }, interval * index)
        });
    }

    function handleDelete() {
        const currentWordArray = getCurrentWordArray()
        const removedLetter = currentWordArray.pop()

        if (removedLetter) {
            guessedWords[guessedWords.length - 1] = currentWordArray;

            const letterElement = document.getElementById(String(availableSpace - 1))

            letterElement.textContent = ""
            availableSpace = availableSpace - 1
        }
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    for (let index = 0; index < keys.length; index++) {
        keys[index].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key")

            if (ready) {
                if (letter == "enter") {
                    handleSubmitWord()
                    return;
                }
                if (letter == "del") {
                    handleDelete()
                    return;
                }

                updateGuessedWords(letter)
            }
        }
    }

    function openInfo() {
        document.getElementById("info").classList.add("open-info");
        document.getElementById("info").classList.remove("close-info");

        for (const button of document.getElementsByClassName("keys")) {
            button.disabled = true;
        }
    }

    function closeInfo() {
        document.getElementById("info").classList.add("close-info");
        document.getElementById("info").classList.remove("open-info");

        for (const button of document.getElementsByClassName("keys")) {
            button.disabled = false;
        }
    }

    function openDonation() {
        document.getElementById("donation").classList.add("open-donation");
        document.getElementById("donation").classList.remove("close-donation");

        for (const button of document.getElementsByClassName("keys")) {
            button.disabled = true;
        }
    }

    function closeDonation() {
        document.getElementById("donation").classList.add("close-donation");
        document.getElementById("donation").classList.remove("open-donation");

        for (const button of document.getElementsByClassName("keys")) {
            button.disabled = false;
        }
    }

    function random() {
        var today = new Date();

        const dd = String(today.getDate());
        const mm = String(today.getMonth() + 1);
        const yyyy = today.getFullYear();

        today = dd + mm + yyyy;

        var x = Math.sin(today) * 10000;

        return x - Math.floor(x);
    }

    function lerp(value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }
});

function Distance(latitude1, longitude1, latitude2, longitude2) {
    var a = 0.5 - Math.cos((latitude2 - latitude1) * (Math.PI / 180)) / 2 + Math.cos(latitude1 * (Math.PI / 180)) * Math.cos(latitude2 * (Math.PI / 180)) * (1 - Math.cos((longitude2 - longitude1) * (Math.PI / 180))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function Direction(x1, y1, x2, y2) {
    var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    if (angle >= 45 && angle <= 135) {
        console.log("▴");
    }
    else if (angle <= 45 && angle >= -45) {
        console.log("▸");
    }
    else if (angle < -45 && angle >= -135) {
        console.log("▾");
    }
    else if (angle <= -135 || angle >= 135) {
        console.log("◂");
    }

    return angle
}

function Vector2(x, y) {
    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
}

Vector2.prototype = {
    add: function (vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    },

    subtract: function (vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    },
}

function GetDate() {
    var today = new Date();
    var date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    return date;
}

function GetTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
}