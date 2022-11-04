document.addEventListener("DOMContentLoaded", () => {
    CreateSquares();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word = "aaaaa"

    let restart = false;

    let win = false;

    let waitDone = false;

    //#region Clock

    var clock = new Date().getMinutes();

    if (clock < 10) {
        word = "quack"
    }
    else if (clock < 20) {
        word = "horse"
    }
    else if (clock < 30) {
        word = "juice"
    }
    else if (clock < 40) {
        word = "table"
    }
    else if (clock < 50) {
        word = "clamp"
    }
    else {
        word = "robot"
    }
    //#endregion

    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    document.getElementById("Buy-me-coffee").onclick = function () { window.alert("Thank you! :)") };

    function GetCurrentWordArray() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1]
    }

    function UpdateGuessedWords(letter) {
        const currentWordArray = GetCurrentWordArray()

        if (currentWordArray && currentWordArray.length < 5) {
            currentWordArray.push(letter);

            const availableSpaceElement = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1

            availableSpaceElement.textContent = letter;
        }
    }

    function GetTileColor(letter, index) {
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

    function HandleSubmitWord() {
        const currentWordArray = GetCurrentWordArray()
        if (currentWordArray.length !== 5) {
            window.alert("Word requires 5 letters!");
            return
        }

        const currentWord = currentWordArray.join("")

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArray.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = GetTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterElement = document.getElementById(letterId)
                letterElement.style = `background-color:${tileColor};border-color:${tileColor}`;

                if (index == 4 && currentWord == word) {
                    setTimeout(() => {
                        restart = window.confirm("Congratulations! Play again?");
                        if (restart) {
                            location.reload();
                        }
                    }, 1000)
                }
            }, interval * index)
        });

        guessedWordCount += 1;

        if (guessedWords.length == 6 && currentWord != word) {
            restart = window.confirm(`Sorry, no luck this time! The word was ${word}`)
            if (restart) {
                location.reload();
            }
        }

        guessedWords.push([])
    }

    function CreateSquares() {
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
            const letter = target.getAttribute("data-key");

            if (letter == "enter") {
                HandleSubmitWord();

                return;
            }
            if (letter == "del") {

                return;
            }
            UpdateGuessedWords(letter);
        };
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