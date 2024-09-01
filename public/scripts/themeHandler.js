let currentTheme = '';

// Resets all transitions for soft theme change
const resetTransitions = () => {
  const allElements = document.querySelectorAll('*');

  allElements.forEach((element) => {
    element.style.transition = 'none';
  });

  return true;
};

// Restoring all transitions for after theme change
const restoreTransitions = () => {
  const allElements = document.querySelectorAll('*');

  allElements.forEach((element) => {
    element.style.transition = '';
  });

  return true;
};

const setLocalStorageTheme = (theme) => {
  if (currentTheme === theme) return;

  localStorage.setItem('theme', theme);

  return true;
};

const getLocalStorageTheme = () => {
  let localStorageTheme = localStorage.getItem('theme');
  if (
    localStorageTheme &&
    (localStorageTheme === 'dark' || localStorageTheme === 'light')
  ) {
    return localStorageTheme;
  }

  return null;
};

const updateDataThemeAttribute = (theme) => {
  if (currentTheme === theme) return;

  resetTransitions();
  document.documentElement.setAttribute('data-theme', theme);
  setTimeout(() => {
    restoreTransitions();
  }, 100);

  return true;
};

const updateActiveThemeButton = (theme) => {
  if (currentTheme === theme) return;

  const lightThemeButton = document.getElementById('light-theme-button');
  const darkThemeButton = document.getElementById('dark-theme-button');

  switch (theme) {
    case 'light':
      darkThemeButton.classList.remove('active');
      lightThemeButton.classList.add('active');
      break;

    case 'dark':
      lightThemeButton.classList.remove('active');
      darkThemeButton.classList.add('active');
      break;
  }

  return true;
};

const updateTheme = (theme) => {
  setLocalStorageTheme(theme);

  updateDataThemeAttribute(theme);

  updateActiveThemeButton(theme);
  currentTheme = theme;

  return true;
};

const themeBootstrap = () => {
  let preferedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  let localStorageTheme = getLocalStorageTheme();
  if (
    localStorageTheme &&
    (localStorageTheme === 'dark' || localStorageTheme === 'light')
  ) {
    preferedTheme = localStorageTheme;
  }

  updateTheme(preferedTheme);

  return true;
};

document.addEventListener('DOMContentLoaded', themeBootstrap);
