const ChoiceComponentGenerator = (identifier, text) => {
  const button = document.createElement('button');
  button.className = 'choice-button';

  const choiceIdentifier = document.createElement('div');
  choiceIdentifier.className = 'choice-identifier';
  choiceIdentifier.textContent = identifier;

  const choiceText = document.createElement('div');
  choiceText.className = 'choice-text';
  choiceText.textContent = text;

  button.appendChild(choiceIdentifier);
  button.appendChild(choiceText);

  button.addEventListener('click', function () {
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
    } else {
      button.classList.add('selected');
    }
  });

  return button;
};

const QuestionComponentGenerator = ({ question, choices }) => {
  const container = document.createElement('div');
  container.className = 'question-container';

  const questionContent = document.createElement('div');
  questionContent.className = 'question-content';
  questionContent.textContent = question;
  container.appendChild(questionContent);

  const choiceContainer = document.createElement('div');
  choiceContainer.className = 'question-choice-container';

  const choiceButtons = [];
  choices.forEach((choice) => {
    const button = ChoiceComponentGenerator(choice.identifier, choice.text);
    choiceContainer.appendChild(button);
    choiceButtons.push(button);
  });

  container.appendChild(choiceContainer);

  choiceContainer.addEventListener('click', function (event) {
    if (event.target.closest('.choice-button')) {
      const clickedButton = event.target.closest('.choice-button');

      choiceButtons.forEach((button) => {
        if (button !== clickedButton) {
          button.classList.remove('selected');
        }
      });
    }
  });

  // Setup MutationObserver to detect when the element is added to the DOM
  // TODO

  return container;
};
