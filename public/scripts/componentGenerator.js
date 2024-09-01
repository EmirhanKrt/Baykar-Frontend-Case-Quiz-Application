const ChoiceComponentGenerator = (identifier, text) => {
  const button = document.createElement('button');
  button.className = 'choice-button';
  button.disabled = true;

  const choiceIdentifier = document.createElement('div');
  choiceIdentifier.className = 'choice-identifier';
  choiceIdentifier.textContent = identifier;

  const choiceText = document.createElement('div');
  choiceText.className = 'choice-text';
  choiceText.textContent = text;

  button.appendChild(choiceIdentifier);
  button.appendChild(choiceText);

  // When user clicks the choice button, this function toggles "selective" class.
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

  // When user clicks the choice button, this function handles current selected choice.
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

  // Setup MutationObserver to detect when the element is added to the DOM and visible (if opacity property is not exists in style)
  const observer = new MutationObserver((mutationsList, observer) => {
    const choiceButtons = container.querySelectorAll('.choice-button');

    const allHaveOpacity = Array.from(choiceButtons).every(
      (button) => button.style.opacity === ''
    );

    if (allHaveOpacity) {
      console.log('All elements are visible and inserted');

      setTimeout(() => enableButtonsAfter10Second(choiceButtons), 10 * 1000);

      setTimeout(forceNextQuestionAfter30Second, 30 * 1000);

      observer.disconnect();
    }
  });

  observer.observe(choiceContainer, {
    childList: true,
    subtree: true,
    attributes: true
  });

  return container;
};
