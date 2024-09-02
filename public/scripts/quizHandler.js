const QUIZ_HISTORY = [];

let currentQuizId = '';
let currentQuestionIndex = 0;

/* Choice Object Structure
  {
    id: uuid,
    identifier: 'A' | 'B' | 'C' | 'D',
    text: string,
    status: "correct" | "wrong" | "unknown" // initially "unknown"
  };
*/

const generateChoiceObject = ({ identifier, text }) => {
  const choiceId = crypto.randomUUID();

  return {
    id: choiceId,
    identifier,
    text,
    status: CHOICE_STATUS.UNKNOWN
  };
};

/* Answer Object Structure
  {
    id: uuid,
    choiceId: uuid,
    status: "correct" | "wrong" | "unknown" // initially "unknown"
  }; 
*/

const generateAnswerObject = ({ choiceId }) => {
  const answerId = crypto.randomUUID();

  return {
    id: answerId,
    choiceId,
    status: CHOICE_STATUS.UNKNOWN
  };
};

/* Question Object Structure
  {
    id: uuid,
    question: string,
    choices: Choice[],
    answer: Answer | null // initially null,
    status: "correct" | "wrong" | "unknown" // initially "unknown"
  };
*/

const generateQuestionObject = ({ body, title }) => {
  const questionId = crypto.randomUUID();

  const [A, B, C, ...D] = body.split(' ');

  return {
    id: questionId,
    question: title,
    choices: [
      { identifier: 'A', text: A },
      { identifier: 'B', text: B },
      { identifier: 'C', text: C },
      { identifier: 'D', text: D.join(' ') }
    ].map(generateChoiceObject),
    answer: null,
    status: QUESTION_STATUS.UNKNOWN
  };
};

/* Quiz Object Structure
  {
    id: uuid,
    title: string,
    questions: Question[],
    result: number | null, // initially null
    correctAnswerCount: number | null, // initially null
    emptyAnswerCount: number | null, // initially null
    wrongAnswerCount: number | null // initially null
  }; 
*/

const generateQuizObject = () => {
  const quizId = crypto.randomUUID();

  return {
    id: quizId,
    title: `Quiz - ${quizId}`,
    questions: [],
    result: null,
    correctAnswerCount: null,
    emptyAnswerCount: null,
    wrongAnswerCount: null
  };
};

const updatTimerProgressBar = (remeaningTime) => {
  const progressBar = document.getElementById(
    'question-title-timer-progressbar'
  );
  if (!progressBar) return;

  let progress = Math.min(100, (remeaningTime / QUESTION_DURATION) * 100);
  progressBar.style.width = progress + '%';
};

const enableChoices = () => {
  console.log('10 seconds have passed. Enabling the choices and next button');

  const choices = getChoiceButtons();
  choices.forEach((choiceButton) => (choiceButton.disabled = false));

  const nextButton = document.querySelector('div.question-container + button');
  nextButton.disabled = false;

  return true;
};

const startQuiz = async (event) => {
  // Prevent bug when clicks multiple times
  event.target.disabled = true;

  try {
    const Quiz = generateQuizObject();
    QUIZ_HISTORY.push(Quiz);

    currentQuizId = Quiz.id;

    const questionSource = await fetch(API_URL).then((response) =>
      response.json()
    );

    // Random question generation with random index logic
    for (let index = 0; index < QUESTION_COUNT; index++) {
      let randomIndex = generateRandomNumber(0, 99);
      let question = questionSource[randomIndex];

      while (isNaN(randomIndex) || !question) {
        randomIndex = generateRandomNumber(0, 99);
        question = questionSource[randomIndex];
      }

      Quiz.questions.push(generateQuestionObject(question));
    }

    await questionPageHandler();

    return true;
  } catch (error) {
    console.error(error);
  }
};

const stopQuiz = async () => {
  const Quiz = getCurrentQuiz();

  // Assuming fetching { questionId : corretChoiceId } key - pair object with using HTTP GET method.
  const questionCorrectChoiseMapped = {};

  for (let index = 0; index < Quiz.questions.length; index++) {
    const question = Quiz.questions[index];

    // Mock random choice generation
    let randomCorrectChoiceIndex = generateRandomNumber(0, 3);

    // Setting choices which are not selected as wrong
    question.choices
      .filter((q, i) => i !== randomCorrectChoiceIndex)
      .forEach((q) => (q.status = CHOICE_STATUS.WRONG));

    question.choices[randomCorrectChoiceIndex].status = CHOICE_STATUS.CORRECT;

    // Setting choices which is selected as correct
    questionCorrectChoiseMapped[question.id] =
      question.choices[randomCorrectChoiceIndex].id;

    if (question.answer) {
      if (
        question.answer.choiceId ===
        question.choices[randomCorrectChoiceIndex].id
      ) {
        question.answer.status = ANSWER_STATUS.CORRECT;
        question.status = QUESTION_STATUS.CORRECT;
      } else {
        question.answer.status = ANSWER_STATUS.WRONG;
        question.status = QUESTION_STATUS.WRONG;
      }
    } else {
      question.status = QUESTION_STATUS.WRONG;
    }
  }

  let correctAnswerCount = 0;
  let emptyAnswerCount = 0;
  let wrongAnswerCount = 0;

  Quiz.questions.forEach((question) => {
    if (!question.answer) {
      emptyAnswerCount++;
    } else if (question.status === QUESTION_STATUS.WRONG) {
      wrongAnswerCount++;
    } else if (question.status === QUESTION_STATUS.CORRECT) {
      correctAnswerCount++;
    }
  });

  Quiz.correctAnswerCount = correctAnswerCount;
  Quiz.emptyAnswerCount = emptyAnswerCount;
  Quiz.wrongAnswerCount = wrongAnswerCount;
  Quiz.result = Math.round(
    (Quiz.correctAnswerCount / Quiz.questions.length) * 100
  );

  console.log(QUIZ_HISTORY);

  setLocalStorageQuizHistory();

  mainPageHandler();
};

const mainPageHandler = async () => {
  updateHeaderTitle('QUIZ APPLICATION');

  await removePageContentAnimationHandler();

  const guideComponent = GuideComponentGenerator();
  await insertPageContentAnimationHandler(guideComponent);

  const startButtonComponent = StartButtonComponentGenerator();
  await insertPageContentAnimationHandler(startButtonComponent);

  const historyComponent = HistoryComponentGenerator();
  await insertPageContentAnimationHandler(historyComponent);

  currentQuizId = '';
  currentQuestionIndex = 0;
};

const questionPageHandler = async () => {
  stopTimer();

  if (currentQuestionIndex >= QUESTION_COUNT) {
    stopQuiz();
    return;
  }

  if (currentQuestionIndex === 0) {
    updateHeaderTitle(getCurrentQuiz().title);
  }

  await removePageContentAnimationHandler();

  console.log('remove completed');

  const titleComponent = QuestionPageTitleComponentGenerator();
  await insertPageContentAnimationHandler(titleComponent);

  const questionComponent = QuestionComponentGenerator(
    getCurrentQuiz().questions[currentQuestionIndex]
  );
  await insertPageContentAnimationHandler(questionComponent);

  const nextButtonComponent = NextButtonComponentGenerator();
  await insertPageContentAnimationHandler(nextButtonComponent);

  const stepComponent = StepComponentGenerator();
  await insertPageContentAnimationHandler(stepComponent);

  console.log('insert completed');
};

const nextQuestion = (event = null) => {
  // Prevent bug when clicks multiple times
  if (event && event.target && event.target.closest('button')) {
    event.target.closest('button').disabled = true;
  }

  console.log('next question');

  // Assuming sending POST HTTP request to related API Path.
  // Also can use wss connection for send answer

  // await fetch(API_URL, { method: "POST", body: JSON.Stringify(AnswerObject)... })

  const selectedChoice = getChoiceButtons().find((choice) =>
    choice.classList.contains('selected')
  );

  if (selectedChoice) {
    getCurrentQuiz().questions[currentQuestionIndex].answer =
      generateAnswerObject({ choiceId: selectedChoice.id });
  }

  currentQuestionIndex++;

  questionPageHandler();
};
