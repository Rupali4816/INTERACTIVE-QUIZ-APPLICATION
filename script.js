



let questions = [];
const quesElement = document.getElementById("ques");
const optElement = document.getElementById("opt");
const btnElement = document.getElementById("btn");
const scoreElement = document.getElementById("score");

async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10');
    if (!response.ok) {
      throw new Error(`Something went wrong!! Unable to fetch the data`);
    }
    const data = await response.json();
    questions = data.results;
    loadQues();
  } catch (error) {
    console.log(error);
    quesElement.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
  }
}

let currentQuestion = 0;
let score = 0;

function loadQues() {
  if (questions.length === 0) {
    quesElement.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
    return;
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    console.error("Invalid question data");
    return;
  }

//   const question = currentQuestionData.question
  const parser = new DOMParser();
  const question = parser.parseFromString(currentQuestionData.question, 'text/html').body.textContent;



  quesElement.innerText = question;

  optElement.innerHTML = "";
  const correctAnswer = currentQuestionData.correct_answer;
  const incorrectAnswers = currentQuestionData.incorrect_answers;
  const options = [correctAnswer, ...incorrectAnswers];
  options.sort(() => Math.random() - 0.5);

  options.forEach((option) => {
    const choicesDiv = document.createElement("div");
    const choice = document.createElement("input");
    const choiceLabel = document.createElement("label");
    choice.type = "radio";
    choice.name = "answer";
    choice.value = option;
    choiceLabel.textContent = option;
    choicesDiv.appendChild(choice);
    choicesDiv.appendChild(choiceLabel);
    optElement.appendChild(choicesDiv);
  });
}

function loadScore() {
  scoreElement.textContent = `You scored ${score} out of ${questions.length}`;
  scoreElement.innerHTML += "<h3>All Answers</h3>";
  questions.forEach((el, index) => {
    scoreElement.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
  });
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQues();
  } else {
    optElement.remove();
    quesElement.remove();
    btnElement.remove();
    loadScore();
  }
}

function checkAns() {
  const selectedAns = document.querySelector('input[name="answer"]:checked');
//   if (!selectedAns) {
//     alert("Please select an answer");
//     return;
//   }

  const correctAnswer = questions[currentQuestion].correct_answer;
  if (selectedAns.value === correctAnswer) {
    score++;
  }
  nextQuestion();
}

btnElement.addEventListener("click", checkAns);

fetchQuestions();



