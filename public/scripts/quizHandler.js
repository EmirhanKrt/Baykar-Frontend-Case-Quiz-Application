let currentQuestionIndex = 0;

/* Question Object Structure
  {
    id: 1
    question: 'mock question content',
    choices: [
      { identifier: 'A', text: 'Choice A' },
      { identifier: 'B', text: 'Choice B' },
      { identifier: 'C', text: 'Choice C' },
      { identifier: 'D', text: 'Choice D' }
    ]
  }; 
*/

const QUESTIONS = [];

const enableChoices = () => {
  console.log('10 seconds have passed. Enabling the choices and next button');

  const choices = document.querySelectorAll(
    'div.question-choice-container > button.choice-button'
  );

  Array.from(choices).forEach(
    (choiceButton) => (choiceButton.disabled = false)
  );

  const nextButton = document.querySelector('div.question-container + button');
  nextButton.disabled = false;

  return true;
};

const forceNextQuestion = () => {
  console.log('30 seconds have passed');

  nextQuestion();
};

const startQuiz = async () => {
  try {
    const questionSource = await fetch(API_URL).then((response) =>
      response.json()
    );

    const randomIndexes = [];

    for (let index = 0; index < QUESTION_COUNT; index++) {
      let randomIndex = generateRandomNumber();

      while (isNaN(randomIndex) || !questionSource[randomIndex]) {
        randomIndex = generateRandomNumber();
      }

      randomIndexes.push(randomIndex);
    }

    randomIndexes.forEach((randomIndex) => {
      const question = questionSource[randomIndex];
      if (!question) return;

      const [A, B, C, ...D] = question.body.split(' ');

      QUESTIONS.push({
        id: question.id,
        question: question.title,
        choices: [
          { identifier: 'A', text: A },
          { identifier: 'B', text: B },
          { identifier: 'C', text: C },
          { identifier: 'D', text: D.join(' ') }
        ]
      });
    });

    await questionPageHandler();

    return true;
  } catch (error) {
    console.error(error);
  }
};

const questionPageHandler = async () => {
  if (currentQuestionIndex === QUESTION_COUNT) {
    // todo; render result page
    return;
  }

  stopTimer();

  await removePageContentAnimationHandler();

  console.log('remove completed');

  const titleComponent = QuestionPageTitleComponentGenerator();
  await insertPageContentAnimationHandler(titleComponent);

  const questionComponent = QuestionComponentGenerator(
    QUESTIONS[currentQuestionIndex]
  );
  await insertPageContentAnimationHandler(questionComponent);

  const nextButtonComponent = NextButtonComponentGenerator();
  await insertPageContentAnimationHandler(nextButtonComponent);

  console.log('insert completed');
};

const generateRandomNumber = () => Math.floor(Math.random() * 99);

const nextQuestion = () => {
  console.log('next question');

  currentQuestionIndex++;

  questionPageHandler();
};
