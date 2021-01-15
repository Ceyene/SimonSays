const lightBlue = document.getElementById("lightBlue");
const violet = document.getElementById("violet");
const orange = document.getElementById("orange");
const green = document.getElementById("green");
const startBtn = document.getElementById("startBtn");
const lastLevel = 10;

class Game {
  constructor() {
    this.inicialize();
    //with bind we maintain the reference to "this"
    //this = Game
    //if we don't bind it, when we work with functions after the game is over: this = Window
    this.inicialize = this.inicialize.bind(this);
    this.generateSequence();
    setTimeout(this.nextLevel, 1200);
  }

  //it hides start button once its clicked
  //it establishes the first level of the game
  //it saves the existent colors in variables
  inicialize() {
    this.toggleStartBtn();
    this.level = 1;
    this.colors = {
      lightBlue,
      violet,
      orange,
      green,
    };
    //with bind we maintain the reference to "this"
    //this = Game
    //if we don't bind it, when we work with events: this = each target button
    this.chooseColor = this.chooseColor.bind(this);
    //if we don't bind it, when we work with setTimeout: this = Window object
    //setTimeout delegates taks to the browser, so "this" is the Windows object unless we bind it
    this.nextLevel = this.nextLevel.bind(this);
  }

  //depending of previous state of the button,
  //it adds or removes "hide" css class to it
  toggleStartBtn() {
    if (startBtn.classList.contains("hide")) {
      startBtn.classList.remove("hide");
    } else {
      startBtn.classList.add("hide");
    }
  }

  //it generates an array of ten aleatory numbers
  //this will change every time we initialize a new game
  generateSequence() {
    this.sequence = new Array(10)
      //initially, its going to be filled with zeros
      .fill(0)
      //then, it replaces each zero by a random number between 0 and 3
      .map((n) => Math.floor(Math.random() * 4));
  }

  //when user gets to the next level
  nextLevel() {
    //initialize a sublevel in zero
    this.sublevel = 0;
    //it calls the light up sequence
    this.lightUpSequence();
    //it adds click events to each button
    this.addClickEvents();
  }

  //it assigns a color to each number
  fromNumberToColor(number) {
    switch (number) {
      case 0:
        return "lightBlue";
      case 1:
        return "violet";
      case 2:
        return "orange";
      case 3:
        return "green";
    }
  }

  //it assigns a number to each color
  fromColorToNumber(color) {
    switch (color) {
      case "lightBlue":
        return 0;
      case "violet":
        return 1;
      case "orange":
        return 2;
      case "green":
        return 3;
    }
  }

  //it gets the color to enlighten
  lightUpSequence() {
    //it transforms each number of the sequence to a color
    for (let i = 0; i < this.level; i++) {
      const color = this.fromNumberToColor(this.sequence[i]);
      //it calls the enlightening function to do it every one second
      setTimeout(() => this.lightUpColor(color), 1000 * i);
    }
  }

  //it adds the "light" css class to the button when its clicked
  //only during 350ms
  lightUpColor(color) {
    this.colors[color].classList.add("light");
    setTimeout(() => this.lightDownColor(color), 500);
  }

  //it removes the "light" css class to the button
  lightDownColor(color) {
    this.colors[color].classList.remove("light");
  }

  //it adds click events to each button
  addClickEvents() {
    this.colors.lightBlue.addEventListener("click", this.chooseColor);
    this.colors.violet.addEventListener("click", this.chooseColor);
    this.colors.orange.addEventListener("click", this.chooseColor);
    this.colors.green.addEventListener("click", this.chooseColor);
  }

  //it removes click events from each button
  removeClickEvents() {
    this.colors.lightBlue.removeEventListener("click", this.chooseColor);
    this.colors.violet.removeEventListener("click", this.chooseColor);
    this.colors.orange.removeEventListener("click", this.chooseColor);
    this.colors.green.removeEventListener("click", this.chooseColor);
  }

  //it gets the name of the color, which is inside the dataset attribute of the target
  //in the HTML, we wrote it in the data-color attribute, so we have a color attribute inside dataset.
  chooseColor(ev) {
    const colorName = ev.target.dataset.color;
    const colorNumber = this.fromColorToNumber(colorName);
    this.lightUpColor(colorName);
    //if user chooses the right color, it adds a sublevel
    if (colorNumber === this.sequence[this.sublevel]) {
      this.sublevel++;
      //if sublevel is equal to the current level, user goes to the next level
      if (this.sublevel === this.level) {
        //first, it validates if the current level surpass the last level of the game or not
        if (this.level === lastLevel) {
          //user wins
          this.winGame();
        } else {
          swal("Next Level", "You completed this level!", "info").then(() => {
            this.level++;
            //then, current click events are removed
            this.removeClickEvents();
            //it calls the next level function after 2 seconds
            setTimeout(this.nextLevel, 2000);
          });
        }
      }
      //if user doesn't choose the right color
    } else {
      //game over: user looses
      this.looseGame();
    }
  }

  //it shows a notification when user wins the game
  winGame() {
    swal("You win", "Congrats, you completed the game!", "success")
      //after user clicks the "ok" button, it initializes the game again
      .then(() => {
        this.inicialize();
      });
  }

  //it shows a notification when user looses the game
  looseGame() {
    swal("Game Over", "But don't worry, you can try it again", "error")
      //after user clicks the "ok" button, it removes click events from buttons and initializes the game again
      .then(() => {
        this.removeClickEvents();
        this.inicialize();
      });
  }
}

//function added to the onclick event of the start button
function startGame() {
  window.game = new Game();
}
