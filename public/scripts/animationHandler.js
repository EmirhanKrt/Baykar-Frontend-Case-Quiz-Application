const removePageContentAnimationHandler = () => {
  return new Promise((resolve, reject) => {
    const children = document.querySelector('.app-container').children;
    if (!children) {
      return reject(new Error('No children found'));
    }

    let previusElementIndex = children.length - 1;

    const removeContent = () => {
      if (previusElementIndex < 0) {
        return resolve();
      }

      const element = children[previusElementIndex];
      if (!element) {
        return reject(new Error('Element not found'));
      }

      element.classList.add('remove-animation');
      element.addEventListener(
        'animationend',
        () => {
          element.remove();

          previusElementIndex--;
          removeContent();
        },
        { once: true }
      );
    };

    removeContent();
  });
};

const insertPageContentAnimationHandler = (component) => {
  return new Promise((resolve, reject) => {
    if (!component.children) {
      return reject(new Error('No children found'));
    }

    const willBeAnimatedChildList = [];

    // Setting opacity 0 for fade-in animation initially
    const setOpacityPropertyOfChildren = (component) => {
      for (const childElement of component.children) {
        if (childElement.classList.contains('question-choice-container')) {
          setOpacityPropertyOfChildren(childElement);
        } else {
          willBeAnimatedChildList.push(childElement);
          childElement.style.opacity = 0;
        }
      }
    };

    setOpacityPropertyOfChildren(component);

    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
      return reject(new Error('No app container found'));
    }

    appContainer.append(component);

    let nextElementIndex = 0;

    const appendContent = () => {
      if (nextElementIndex >= willBeAnimatedChildList.length) {
        return resolve();
      }

      const element = willBeAnimatedChildList[nextElementIndex];
      if (!element) {
        return reject(new Error('Element not found'));
      }

      element.classList.add('append-animation');
      element.addEventListener(
        'animationend',
        () => {
          element.style.removeProperty('opacity');
          element.classList.remove('append-animation');

          nextElementIndex++;
          appendContent();
        },
        { once: true }
      );
    };

    appendContent();
  });
};
