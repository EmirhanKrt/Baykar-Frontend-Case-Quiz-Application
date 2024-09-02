const getChoiceButtons = () =>
  Array.from(
    document.querySelectorAll(
      'div.question-choice-container > button.choice-button'
    )
  );

const generateRandomNumber = () => Math.floor(Math.random() * 99);

const updateHeaderTitle = (title) =>
  (document.querySelector('header h1').textContent = title);
