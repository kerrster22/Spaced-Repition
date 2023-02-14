function SrsCard(question, answer) {
  this.question = question;
  this.answer = answer;
  this.nextReview = new Date();
  SrsCard.allCards.push(this);
}

SrsCard.allCards = [];

SrsCard.prototype.ask = function () {
  // look at the question and ask it
  for (let i = 0; i < SrsCard.allCards.length; i++) {
    let q = SrsCard.allCards[i].question;
    console.log(q);
  }
};

if (localStorage.getItem("allQuestions") != null) {
  const everyCard = JSON.parse(localStorage.getItem("allQuestions"));

  console.log(everyCard);

  for (let i = 0; i < everyCard.length; i++) {
    new SrsCard(everyCard[i].question, everyCard[i].answer);
  }
}

function getCard() {
  const card = new SrsCard(question, answer);
  this.allCards.push(card);
}

function getQuestion() {
  let a = getCard;
  console.log(getCard);
}

function renderSrsCard() {}

/*reviewCards() {
    const time = new Date();
    this.cards.forEach((card) => {
      if (card.nextReview <= time) {
        console.log(`Question: ${card.question}`);
        console.log(`Answer: ${card.answer}`);
        console.log("Was the answer correct? (yes/no)");

        const userAnswer = prompt(card.question);
        if (userAnswer === card.answer) {
          card.nextReview = new Date(time.getTime() + 10000 * 2);
        
        } else {
          card.nextReview = new Date(time.getTime() + 5000);        
        }
      }
    });
  }
*/

// make a form that has a questiopn and asnswer input
// when submitted (l;ook at cookie stand) fun the new SrsCard function with the inputs of the form as paramters

const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let questionInput = event.target.question.value;
  let answerInput = event.target.answer.value;

  new SrsCard(questionInput, answerInput);
  console.log(SrsCard.allCards);

  localStorage.setItem("allQuestions", JSON.stringify(SrsCard.allCards));

  form.reset();
});

//this was from text pile

function currentTime() {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if (hh == 0) {
    hh = 12;
  }
  if (hh > 12) {
    hh = hh - 12;
    session = "PM";
  }

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;

  let time = hh + ":" + mm + ":" + ss + " " + session;

  document.getElementById("clock").innerText = time;
  let t = setTimeout(function () {
    currentTime();
  }, 1000);
}
currentTime();
