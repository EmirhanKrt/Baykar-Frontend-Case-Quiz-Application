const QuestionPageTitleComponentGenerator = () => {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'question-title-container';

  const questionDiv = document.createElement('h2');
  questionDiv.textContent = `Question ${currentQuestionIndex + 1}`;

  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'question-title-timer-progressbar-container';

  const progressBar = document.createElement('div');
  progressBar.id = 'question-title-timer-progressbar';

  progressBarContainer.appendChild(progressBar);

  containerDiv.appendChild(progressBarContainer);
  containerDiv.appendChild(questionDiv);

  return containerDiv;
};

const ChoiceComponentGenerator = ({ id, identifier, text }) => {
  const button = document.createElement('button');
  button.id = id;
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

const QuestionComponentGenerator = ({ id, question, choices }) => {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'question-container';

  const questionContent = document.createElement('div');
  questionContent.className = 'question-content';
  questionContent.textContent = question;
  container.appendChild(questionContent);

  const choiceContainer = document.createElement('div');
  choiceContainer.className = 'question-choice-container';

  const choiceButtons = [];
  choices.forEach((choice) => {
    const button = ChoiceComponentGenerator(choice);
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
      console.log('All elements are visible and inserted. Starting timer');

      startTimer();

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

const NextButtonComponentGenerator = () => {
  let buttonText = 'Next';
  let buttonIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>';

  if (currentQuestionIndex >= QUESTION_COUNT - 1) {
    buttonText = 'Finish';
    buttonIcon = null;
  }

  const container = document.createElement('div');

  const button = document.createElement('button');
  button.innerHTML = `${buttonText} ${buttonIcon ? buttonIcon : ''}`.trim();
  button.disabled = true;
  button.onclick = nextQuestion;

  container.appendChild(button);

  return button;
};

const StepComponentGenerator = () => {
  const container = document.createElement('div');
  container.className = 'step-container';

  for (let index = 0; index < QUESTION_COUNT; index++) {
    const step = document.createElement('div');
    step.className = 'step';

    if (index < currentQuestionIndex) {
      step.style.backgroundColor = 'var(--correct-answer-background-color)';
    }

    if (index === currentQuestionIndex) {
      step.style.backgroundColor = 'var(--primary-color)';
    }

    container.appendChild(step);
  }

  return container;
};
