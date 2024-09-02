const QUIZ_HISTORY = {};

let currentQuizId = '';
let currentQuestionIndex = 0;

/* Choice Object Structure
  {
    id: 1,
    identifier: 'A',
    text: 'Choice A'
  }; 
*/

const generateChoiceObject = ({ identifier, text }) => {
  const choiceId = crypto.randomUUID();

  return {
    id: choiceId,
    identifier,
    text
  };
};

/* Answer Object Structure
  {
    id: 1,
    choiceId: 1
  }; 
*/

const generateAnswerObject = ({ choiceId }) => {
  const answerId = crypto.randomUUID();

  return {
    id: answerId,
    choiceId
  };
};

/* Question Object Structure
  {
    id: 1,
    question: 'mock question content',
    choices: Choice[],
    answer: Answer | null // initially null
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
    answer: null
  };
};

/* Quiz Object Structure
  {
    id: 1,
    title: 'mock quiz title',
    questions: Question[]
  }; 
*/

const generateQuizObject = () => {
  const quizId = crypto.randomUUID();

  return {
    id: quizId,
    title: `Quiz - ${quizId}`,
    questions: []
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

const startQuiz = async () => {
  try {
    const Quiz = generateQuizObject();
    QUIZ_HISTORY[Quiz.id] = Quiz;

    currentQuizId = Quiz.id;

    const questionSource = await fetch(API_URL).then((response) =>
      response.json()
    );

    // Random question generation with random index logic
    for (let index = 0; index < QUESTION_COUNT; index++) {
      let randomIndex = generateRandomNumber();
      let question = questionSource[randomIndex];

      while (isNaN(randomIndex) || !question) {
        randomIndex = generateRandomNumber();
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

const questionPageHandler = async () => {
  stopTimer();

  if (currentQuestionIndex >= QUESTION_COUNT) {
    console.log('quiz finished');

    updateHeaderTitle('QUIZ APPLICATION');

    // todo; render result page

    currentQuizId = '';
    currentQuestionIndex = 0;
    return;
  }

  if (currentQuestionIndex === 0) {
    updateHeaderTitle(QUIZ_HISTORY[currentQuizId].title);
  }

  await removePageContentAnimationHandler();

  console.log('remove completed');

  const titleComponent = QuestionPageTitleComponentGenerator();
  await insertPageContentAnimationHandler(titleComponent);

  const questionComponent = QuestionComponentGenerator(
    QUIZ_HISTORY[currentQuizId].questions[currentQuestionIndex]
  );
  await insertPageContentAnimationHandler(questionComponent);

  const nextButtonComponent = NextButtonComponentGenerator();
  await insertPageContentAnimationHandler(nextButtonComponent);

  const stepComponent = StepComponentGenerator();
  await insertPageContentAnimationHandler(stepComponent);

  console.log('insert completed');
};

const nextQuestion = () => {
  console.log('next question');

  // Assuming sending POST HTTP request to related API Path.
  // Also can use wss connection for send answer

  // await fetch(API_URL, { method: "POST", body: JSON.Stringify(AnswerObject)... })

  const selectedChoice = getChoiceButtons().find((choice) =>
    choice.classList.contains('selected')
  );

  if (selectedChoice) {
    QUIZ_HISTORY[currentQuizId].questions[currentQuestionIndex].answer =
      generateAnswerObject({ choiceId: selectedChoice.id });
  }

  currentQuestionIndex++;

  questionPageHandler();
};
