const setLocalStorageQuizHistory = () => {
  localStorage.setItem('quiz-history', JSON.stringify(QUIZ_HISTORY));

  return true;
};

const getLocalStorageQuizHistory = () => {
  let localStorageQuizHistory = localStorage.getItem('quiz-history');
  if (
    localStorageQuizHistory &&
    Array.isArray(JSON.parse(localStorageQuizHistory))
  ) {
    return JSON.parse(localStorageQuizHistory);
  }

  return null;
};

const quizHistoryBootstrap = () => {
  let localStorageQuizHistory = getLocalStorageQuizHistory();
  if (localStorageQuizHistory) {
    QUIZ_HISTORY.push(...localStorageQuizHistory);
  }

  mainPageHandler();

  return true;
};

document.addEventListener('DOMContentLoaded', quizHistoryBootstrap);
