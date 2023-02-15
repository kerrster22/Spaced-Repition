function SrsCard(question, answer) {
  this.question = question;
  this.answer = answer;
  this.intervalIndex = 0;
  this.nextReview = this.calculateNextReview();
  SrsCard.allCards.push(this);
}

SrsCard.allCards = [];

SrsCard.prototype.calculateNextReview = function () {
  const intervals = [
    5, // Review after 5 minutes
    10, // Review after 10 minutes
    60, // Review after 1 hour
    120, // Review after 2 hours
    240, // Review after 4 hours
    480, // Review after 8 hours
    960, // Review after 16 hours
    1920, // Review after 32 hours
    3840, // Review after 64 hours
    7680, // Review after 128 hours
  ];

  const interval = intervals[this.intervalIndex];
  const currentDate = new Date();
  const nextReviewDate = new Date(currentDate.getTime() + interval * 60 * 1000);
  return nextReviewDate;
};

SrsCard.prototype.scheduleNextReview = function (isCorrect) {
  if (isCorrect) {
    this.intervalIndex = Math.min(this.intervalIndex + 1, 9);
  } else {
    this.intervalIndex = 0;
  }
  this.nextReview = this.calculateNextReview();
};

SrsCard.prototype.ask = function () {
  const card = this;
  const answer = prompt(card.question);
  if (answer === card.answer) {
    console.log("Correct!");
    card.scheduleNextReview(true);
    return true;
  } else {
    console.log("Incorrect!");
    card.scheduleNextReview(false);
    return false;
  }
};

/*SrsCard.prototype.ask = function () {
  for (let i = 0; i < SrsCard.allCards.length; i++) {
    let q = SrsCard.allCards[i].question;
    console.log(q);
  }
};*/

function showAllQuestions() {
  const now = new Date();
  const container = document.getElementById("questions-container");
  SrsCard.allCards.forEach((card) => {
    const timeUntilNextReview = card.nextReview - now;
    const minutesUntilNextReview = Math.floor(timeUntilNextReview / 60000);
    const secondsUntilNextReview = Math.floor(
      (timeUntilNextReview % 60000) / 1000
    );
    const questionEl = document.createElement("div");
    questionEl.innerText = `${card.question} (Next review in ${minutesUntilNextReview} minutes and ${secondsUntilNextReview} seconds)`;
    container.appendChild(questionEl);
  });
  console.log(card);
}
showAllQuestions();

//function showAllQuestions() {
// loop through SrsCard.allCards to show each question, and a countdown timer (countdown timer last please) to when the question is going to be ask
//SrsCard.allCards.forEach((val) => console.log(val));
//}
//document.getElementById("allCards1").innerHTML = `${q}`;
//showAllQuestions();

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

function renderSrsCard() {}

// make a form that has a question and answer input
// when submitted (l;ook at cookie stand) fun the new SrsCard function with the inputs of the form as parameters

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

function displayQuestionsFromLocalStorage() {
  const questionsContainer = document.getElementById("questions-container");

  // Retrieve questions and answers from local storage
  const questionsAndAnswers = JSON.parse(localStorage.getItem("allQuestions"));

  if (questionsAndAnswers && questionsAndAnswers.length > 0) {
    questionsAndAnswers.forEach((qa) => {
      const questionEl = document.createElement("h2");
      questionEl.textContent = qa.question;
      questionsContainer.appendChild(questionEl);

      const answerInput = document.createElement("input");
      answerInput.type = "text";
      questionsContainer.appendChild(answerInput);

      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Submit";
      submitBtn.addEventListener("click", () => {
        if (answerInput.value === qa.answer) {
          qa.scheduleNextReview(true);
        } else {
          qa.scheduleNextReview(false);
        }
        localStorage.setItem("allQuestions", JSON.stringify(SrsCard.allCards));
      });
      questionsContainer.appendChild(submitBtn);
    });
  }
}
window.onload = function () {
  displayQuestionsFromLocalStorage();
};

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
