function SrsCard(question, answer, intervalIndex, nextReview = 0) {
  this.question = question;
  this.answer = answer;
  this.intervalIndex = intervalIndex;
  if (nextReview === 0) {
    this.nextReview = this.calculateNextReview();
  } else {
    this.nextReview = nextReview;
  }
  SrsCard.allCards.push(this);
}

SrsCard.allCards = [];

SrsCard.prototype.calculateNextReview = function () {
  const intervals = [
    1, // Review after 1 minute
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
  if (isCorrect && this.intervalIndex <= 8) {
    // this.intervalIndex = Math.min(this.intervalIndex + 1, 9);
    this.intervalIndex++;
  } else {
    this.intervalIndex = 0;
  }
  this.nextReview = this.calculateNextReview();
  localStorage.setItem("allQuestions", JSON.stringify(SrsCard.allCards));
};

// get SrsCards from localStorage if they already exist
if (localStorage.getItem("allQuestions") != null) {
  const everyCard = JSON.parse(localStorage.getItem("allQuestions"));

  console.log(everyCard);

  for (let i = 0; i < everyCard.length; i++) {
    new SrsCard(
      everyCard[i].question,
      everyCard[i].answer,
      everyCard[i].intervalIndex,
      everyCard[i].nextReview
    );
  }
}

function renderSrsCard() {}

const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let questionInput = event.target.question.value;
  let answerInput = event.target.answer.value;

  new SrsCard(questionInput, answerInput, 0);
  console.log(SrsCard.allCards);

  localStorage.setItem("allQuestions", JSON.stringify(SrsCard.allCards));

  form.reset();
  //temporary fix to get displayQuestionsFromLocalStorage to run
  location.reload();
});
console.log(form);

function displayQuestionsFromLocalStorage() {
  if (SrsCard.allCards && SrsCard.allCards.length > 0) {
    SrsCard.allCards.forEach((qa) => {
      console.log("next review:  ", qa.nextReview);
      console.log("check what the time is   ", new Date());
      if (new Date(qa.nextReview).getTime() < new Date().getTime()) {
        actuallyAskTheQuestion(qa);
      } else {
        let timeDiff = new Date(qa.nextReview).getTime() - new Date().getTime();

        console.log(timeDiff);
        setTimeout(function () {
          actuallyAskTheQuestion(qa);
          showNotification();
        }, timeDiff);
        const timeLeftToAnswer = document.createElement("h2");
        let timeLeft = Math.ceil(timeDiff / 1000); // calculate time left in seconds and round up
        timeLeftToAnswer.textContent = formatTime(timeLeft); // format time as MM:SS or HH:MM:SS if longer than an hour
        form.appendChild(timeLeftToAnswer);

        // update countdown every second
        const intervalId = setInterval(() => {
          timeLeft--;
          if (timeLeft <= 0) {
            clearInterval(intervalId);
          } else {
            timeLeftToAnswer.textContent = formatTime(timeLeft);
          }
        }, 1000);

        // function to format time as MM:SS or HH:MM:SS if longer than an hour
        function formatTime(timeInSeconds) {
          const hours = Math.floor(timeInSeconds / 3600);
          const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
          const seconds = timeInSeconds - hours * 3600 - minutes * 60;
          if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          } else {
            return `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`;
          }
        }
      }
    });
  }
}

function actuallyAskTheQuestion(qa) {
  const questionsContainer = document.getElementById("textbox-answers");
  const form = document.createElement("form");
  const questionEl = document.createElement("h2");
  questionEl.textContent = qa.question;
  form.appendChild(questionEl);

  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.name = "answer";
  form.appendChild(answerInput);

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.setAttribute("type", "submit");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.target.answer.value.toLowerCase() === qa.answer.toLowerCase()) {
      qa.scheduleNextReview(true);
      location.reload();
      console.log("you got it right");
    } else {
      qa.scheduleNextReview(false);
      location.reload();
      console.log("you got it wrong");
    }
    localStorage.setItem("allQuestions", JSON.stringify(SrsCard.allCards));
  });
  form.appendChild(submitBtn);
  questionsContainer.appendChild(form);
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

let permission = Notification.permission;
if (permission === "granted") {
  showNotification();
} else if (permission === "default") {
  requestAndShowPermission();
} else {
  alert("Use normal alert");
}
function showNotification() {
  if (document.visibilityState === "visible") {
    return;
  }
  var title = "Questions";
  var body = "Time to review your questions";
  var notification = new Notification("Questions", { body });
  notification.onclick = () => {
    notification.close();
    window.parent.focus();
  };
}
function requestAndShowPermission() {
  Notification.requestPermission(function (permission) {
    if (permission === "granted") {
      showNotification();
    }
  });
}
