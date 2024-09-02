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

const ChoiceComponentGenerator = (
  { id, identifier, text },
  isHistory = false
) => {
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
  if (!isHistory) {
    button.addEventListener('click', function (event) {
      if (button.classList.contains('selected')) {
        button.classList.remove('selected');
      } else {
        button.classList.add('selected');
      }
    });
  }

  return button;
};

const QuestionComponentGenerator = (
  { id, question, choices },
  isHistory = false,
  index = 1
) => {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'question-container';

  const questionContent = document.createElement('div');
  questionContent.className = 'question-content';
  questionContent.textContent = isHistory ? `Q${index}: ${question}` : question;
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

  if (!isHistory) {
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
  }

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
  button.onclick = (event) => nextQuestion(event);

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
      step.style.backgroundColor = 'var(--primary-color)';
    }

    if (index === currentQuestionIndex) {
      step.style.backgroundColor = 'var(--progressbar-color)';
    }

    container.appendChild(step);
  }

  return container;
};

const StartButtonComponentGenerator = () => {
  const startButtonContainer = document.createElement('div');
  startButtonContainer.className = 'start-button-container content-container';
  startButtonContainer.innerHTML = `<button onclick="return startQuiz(event);" style="">Start Quiz <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style=""><path d="M5 12h14" style=""></path><path d="m12 5 7 7-7 7" style=""></path></svg></button>`;

  return startButtonContainer;
};

const GuideComponentGenerator = () => {
  const guideContainer = document.createElement('div');
  guideContainer.id = 'guide-container';
  guideContainer.className = 'content-container';

  guideContainer.innerHTML = `
    <h2 style=""><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style=""><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" style=""></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" style=""></path></svg> Guide</h2>
    <ol type="1" style="">
      <li style=""><span style="">Start the Quiz: </span>Begin with randomly selected questions from our question bank.</li>
      <li style=""><span style="">Answer Questions: </span>Choose the correct multiple-choice option by clicking on it.</li>
      <li style=""><span style="">Check Your Score: </span>After submitting all the answers check your final score for further improvisation.</li>
    </ol>`;

  return guideContainer;
};

const DrawerContentGenerator = (quizHistory) => {
  const drawer = openDrawer();

  const drawerTitleComponent = document.createElement('div');
  drawerTitleComponent.className = 'history-quiz-result-container';
  drawerTitleComponent.innerHTML = `
    <h1>${quizHistory.title}</h1>
    <button onclick="closeDrawer()">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6 6 18" ></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>
  `;

  const drawerQuestionListAndNavigationContainer =
    document.createElement('div');
  drawerQuestionListAndNavigationContainer.className = 'history-quiz-drawer';

  const drawerQuestionListContainer = document.createElement('div');
  drawerQuestionListContainer.className = 'history-question-container';

  const questionComponents = quizHistory.questions.map((q, i) =>
    QuestionComponentGenerator(q, true, i + 1)
  );

  questionComponents.forEach((questionElement) => {
    const question = quizHistory.questions.find(
      (q) => q.id === questionElement.id
    );

    const corretChoice = question.choices.find(
      (c) => c.status === CHOICE_STATUS.CORRECT
    );

    questionElement
      .querySelector(`[id='${corretChoice.id}']`)
      .classList.add('correct');

    if (question.status === QUESTION_STATUS.WRONG) {
      if (question.answer) {
        const userChoice = question.choices.find(
          (c) => c.id === question.answer.choiceId
        );

        questionElement
          .querySelector(`[id='${userChoice.id}']`)
          .classList.add('wrong');
      } else {
        questionElement
          .querySelector(`[id='${corretChoice.id}']`)
          .classList.add('empty');

        questionElement
          .querySelector(`[id='${corretChoice.id}']`)
          .classList.remove('correct');
      }
    }

    drawerQuestionListContainer.appendChild(questionElement);
  });

  const drawerQuestionBottomNavigationContainer = document.createElement('div');
  drawerQuestionBottomNavigationContainer.className =
    'history-quiz-question-navigation-container';

  drawerQuestionListAndNavigationContainer.appendChild(
    drawerQuestionListContainer
  );
  drawerQuestionListAndNavigationContainer.appendChild(
    drawerQuestionBottomNavigationContainer
  );

  const questionNavigation = quizHistory.questions
    .map((q, i) => {
      return `<div class="navigation-item ${
        q.status === QUESTION_STATUS.WRONG
          ? q.answer
            ? QUESTION_STATUS.WRONG
            : 'empty'
          : QUESTION_STATUS.CORRECT
      }" onclick="(()=>{document.getElementById('${
        q.id
      }').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' }); console.log('gere');})()">Q${
        i + 1
      }</div>`;
    })
    .join('');

  drawerQuestionBottomNavigationContainer.innerHTML = questionNavigation;

  drawer.appendChild(drawerTitleComponent);
  drawer.appendChild(drawerQuestionListAndNavigationContainer);
};

const HistoryContentGenerator = (quizHistory) => {
  const mainContainer = document.createElement('div');

  const resultContainer = document.createElement('div');
  resultContainer.className = 'history-quiz-result-container card';

  const quizTitle = document.createElement('h3');
  quizTitle.className = 'history-quiz-title';
  quizTitle.textContent = `Quiz - ${quizHistory.id}`;

  const quizResult = document.createElement('h3');
  quizResult.className = 'history-quiz-result';
  quizResult.textContent = quizHistory.result;

  resultContainer.appendChild(quizTitle);
  resultContainer.appendChild(quizResult);

  mainContainer.appendChild(resultContainer);

  mainContainer.addEventListener('click', () => {
    DrawerContentGenerator(quizHistory);
  });

  return mainContainer;
};

const HistoryComponentGenerator = () => {
  const historyContainer = document.createElement('div');
  historyContainer.id = 'history-container';
  historyContainer.className = 'content-container';
  historyContainer.innerHTML = `<h2><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg> History</h2>`;

  QUIZ_HISTORY.forEach((quiz) => {
    historyContainer.appendChild(HistoryContentGenerator(quiz));
  });

  return historyContainer;
};
