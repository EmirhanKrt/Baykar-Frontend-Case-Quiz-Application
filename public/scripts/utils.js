const getChoiceButtons = () =>
  Array.from(
    document.querySelectorAll(
      'div.question-choice-container > button.choice-button'
    )
  );

const generateRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const updateHeaderTitle = (title) =>
  (document.querySelector('header h1').textContent = title);

const openDrawer = () => {
  const container = document.getElementById('drawer-container');

  const overlay = container.querySelector('#overlay');
  overlay.classList.add('overlay-open');

  const drawer = container.querySelector('#drawer');
  drawer.classList.remove('drawer-hidden');
  drawer.classList.add('drawer-animate');

  return drawer;
};

const closeDrawer = () => {
  const container = document.getElementById('drawer-container');

  const drawer = container.querySelector('#drawer');
  drawer.classList.remove('drawer-animate');
  drawer.classList.add('drawer-hidden');
  drawer.innerHTML = '';

  const overlay = container.querySelector('#overlay');
  overlay.classList.remove('overlay-open');

  return drawer;
};

const getCurrentQuiz = () => {
  const currentQuiz = QUIZ_HISTORY.find((quiz) => quiz.id === currentQuizId);

  if (!currentQuiz) throw new Error('Current quiz not found');

  return currentQuiz;
};
