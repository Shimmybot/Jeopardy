//generating categories
const boardTitle = document.getElementById("category");

let categories = []; //for storage
let clues = []; //used for clues
let catDrawn = false;
let valueDrawn = false;
function displayCategory() {
  //   boardTitle.innerHTML = "";
  if (clues.length === 6 && !catDrawn) {
    for (let i = 0; i < clues.length; i++) {
      const boardEl = document.createElement("li");
      boardEl.className = "board__title";
      const categoryName = document.createElement("h2");
      categoryName.className = "category__title";
      boardEl.innerHTML = clues[i][0];
      boardEl.append(categoryName);

      boardTitle.append(boardEl);
    } //need to specify the array object path
    catDrawn = true;
  }
  displayValues();
  //   categoryName.innerText = clues[item][0]; //need to specify the array object path
}

//generating the dollar amount boxes

const boardMain = document.getElementById("values");

let values = [];

function displayValues() {
  //   boardMain.innerHTML = "";
  if (clues.length === 6 && !valueDrawn) {
    for (let x = 0; x < clues.length; x++) {
      let valContainer = document.createElement("div");
      valContainer.className = "value__container";

      for (let y = 1; y < clues[x].length; y++) {
        const valueEl = document.createElement("li");
        valueEl.className = "value__card";

        const cardFront = document.createElement("div");
        cardFront.className = "card-front";
        valueEl.append(cardFront);

        const valueAmt = document.createElement("h2");
        valueAmt.innerText = clues[x][y].value; //need to specify the array object path
        valueAmt.className = "card__value";
        cardFront.append(valueAmt);

        const cardBack = document.createElement("div");
        cardBack.className = "card-back";
        cardBack.style.display = "none";
        valueEl.append(cardBack);

        const clue = document.createElement("p");
        const button = document.createElement("button");
        clue.innerText = clues[x][y].question; //need to specify the array object path
        clue.className = "card__clue";
        button.innerText = "ANSWER";
        button.addEventListener("click", () => {
          clue.innerText = clues[x][y].answer;
        });
        
        cardBack.append(clue);
        cardBack.append(button);

        valueEl.addEventListener("click", function () {
          cardFront.classList.toggle("closed");
          cardBack.style.display = "block";
        });

        cardBack.addEventListener("click", function (event) {
          //   event.preventDefault();
          cardBack.style.display = "none";
          cardFront.classList.toggle("closed");
        });
        valContainer.append(valueEl);
        boardMain.append(valContainer);
      }
    }
    valueDrawn = true;
  }
}

//axios

function getCategory() {
  let offset = Math.random() * 100;
  axios({
    method: "get",
    url: "https://jservice.io/api/categories?count=20&offset=" + offset,
  }).then((response) => {
    buildCategories(response);
  });
}

function getClues(cat) {
  axios({
    method: "get",
    url: "https://jservice.io/api/clues?category=" + cat.id,
  })
    .then((response) => {
      let cluesList = response.data;
      let usedClues = [];
      usedClues.push(cat.title);
      let counter = 1;
      for (let i = 0; i < cluesList.length; i++) {
        if (counter > 5) {
          clues.push(usedClues);
          return true;
        }
        if (cluesList[i].value === counter * 200) {
          usedClues.push(cluesList[i]);
          counter++;
        }
      }
      return false;
    })
    .finally(() => {
      displayCategory();
    });
}

function buildCategories(res) {
  let cat = res.data;
  let goodCategories = [];
  for (let i = 0; i < cat.length; i++) {
    if (cat[i].clues_count >= 12) {
      goodCategories.push(cat[i]);
    }
  }
  if (goodCategories.length < 6) {
    getCategory();
  } else {
    categories = goodCategories;
    buildClues();
  }
}

function buildClues() {
  let sucesses = 0;
  for (let i = 0; i < categories.length; i++) {
    if (sucesses === 6) {
      break;
    }
    if (getClues(categories[i])) {
      sucesses++;
    }
  }
}
getCategory();
//endpoint http://jservice.io/api/
