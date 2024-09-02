# Baykar Frontend Case - Quiz Application

In the project directory, use [Live Server](https://www.npmjs.com/package/live-server)'s `live-server` command for run the project. 

## Technologies

Pure Html, Css and Javascript. No third-party style or script imported.

## Features
- [x] Storing Quiz History on Local Storage
- [x] Detailed Quiz Result Page
- [x] Dark & Light Theme Support
- [x] Soft Animations

## Data Models

```
Choice Object Structure
{
  id: uuid,
  identifier: 'A' | 'B' | 'C' | 'D',
  text: string,
  status: "correct" | "wrong" | "unknown" // initially unknown
};

Answer Object Structure
{
  id: uuid,
  choiceId: uuid,
  status: "correct" | "wrong" | "unknown" // initially unknown
}; 

Question Object Structure
{
  id: uuid,
  question: string,
  choices: Choice[],
  answer: Answer | null // initially null,
  status: "correct" | "wrong" | "unknown" // initially unknown
};

Quiz Object Structure
{
  id: uuid,
  title: string,
  questions: Question[],
  result: number | null, // initially null
  correctAnswerCount: number | null, // initially null
  emptyAnswerCount: number | null, // initially null
  wrongAnswerCount: number | null // initially null
}; 
```

## Work Flow

When the page is loaded, Theme and Quiz History are first restored to the page content from “local storage”

When user clicks the "Start Quiz" button;the main "Quiz Loop Algorithm" starts working and works until quiz ends. 

When question rendered succesfully, main thread sends start to "Timer Worker", which runs requestAnimationFrame for countdown process. 

Timer Worker sends signals back to main thread for case "Time Updated", "10 Second Passed" and "30 Second Passed";
"Time Updated" signal is rendering the progress bar in the main screen which meaning the remaining time.
"10 Second Passed" signal is enabling the choices and next button.
"30 Second Passed" signal is forcing the next question.

If user clicks next button or forced from the timer worker; program stops timer, submits the answer to backend, updates Quiz object and increases the currentQuestionIndex.

When Current Question Index >= Max Question Count - 1 it means quiz is fully finished  

When Quiz is fully finished the mapped correct choices and questions received from backend with ```{ questionId : corretChoiceId }``` format.
After that Choice status, Answer status, Question status, Quiz result, Quiz correctAnswerCount, Quiz emptyAnswerCount, Quiz wrongAnswerCount fields are updated. 

Resets the variable and renders the main screen with dynamic history component. Then algorithm ends

![Quiz Loop Algorithm](https://github.com/user-attachments/assets/503fb544-d313-4b4b-a9c7-199f588fa6fa)

When user clicks the cards on the "History Section", the Quiz details will be rendered on the drawer component.

## User Interface

### Main Menu Page

User can start the quiz or inspect quiz details from the history section.

![desktop-main-menu-page](https://github.com/user-attachments/assets/ebd65201-ed0f-4d5c-b185-3a9fe23854f5)

### Question Page

User can pass or finish the question using next or finish button, see timer countdown progress bar and can see the stepper.

First 10 seconds; choice and next button is disabled.
![desktop-first-question-page](https://github.com/user-attachments/assets/bd65daa1-e51f-42d5-bbae-8d5ae9958c4a)
![desktop-final-question-page](https://github.com/user-attachments/assets/1b3d685f-3e2b-4be3-9ccf-c555288c29c7)

### Details Page

User can inspect quiz, for example user can see result of quiz, status of the question (correct, empty, wrong) and the correct answers of questions...

This page is rendered as a "drawer".

![desktop-details-page](https://github.com/user-attachments/assets/ff032bde-cc7f-41f9-ba32-0bbe6da746d8)
![desktop-details-page-bottom](https://github.com/user-attachments/assets/cbe7252e-18dd-459e-a7f4-b2f0a075b6de)
