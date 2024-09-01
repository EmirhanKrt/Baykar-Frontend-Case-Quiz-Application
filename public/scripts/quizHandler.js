let isQuizStarted;
let currentQuestionIndex = 0;

const MOCK_QUESTION = {
  question: 'mock question content',
  choices: [
    { identifier: 'A', text: 'Choice A' },
    { identifier: 'B', text: 'Choice B' },
    { identifier: 'C', text: 'Choice C' },
    { identifier: 'D', text: 'Choice D' }
  ]
};

const enableButtonsAfter10Second = (choiceButtons) => {
  Array.from(choiceButtons).forEach(
    (choiceButton) => (choiceButton.disabled = false)
  );

  return true;
};

const forceNextQuestionAfter30Second = () => {
  // todo; call next question function
};

const startQuiz = async () => {
  // assume that questions received with HTTP request

  await removePageContentAnimationHandler();

  console.log('remove completed');
  const questionComponent = QuestionComponentGenerator(MOCK_QUESTION);
  await insertPageContentAnimationHandler(questionComponent);

  console.log('insert completed');
};
