import { createElement } from './utils.js';

/**
 * Rend un quiz QCM simple.
 * @param {HTMLElement} target
 * @param {{ question: string, choices: Array<{label: string, correct: boolean, explanation: string}> }} quiz
 */
export function renderQuiz(target, quiz) {
  const wrapper = createElement('div', { className: 'quiz' });
  const question = createElement('p', { className: 'quiz-question', text: quiz.question });
  const form = createElement('form', { className: 'quiz-form' });
  const result = createElement('p', { className: 'quiz-result' });

  const choiceName = `quiz-${Math.random().toString(36).slice(2)}`;

  quiz.choices.forEach((choice, index) => {
    const optionLabel = createElement('label', { className: 'quiz-option' });
    const input = createElement('input', {
      attrs: {
        type: 'radio',
        name: choiceName,
        value: String(index),
      },
    });

    optionLabel.append(input, ` ${choice.label}`);
    form.append(optionLabel);
  });

  const submitButton = createElement('button', {
    className: 'btn btn-secondary',
    attrs: { type: 'submit' },
    text: 'Vérifier',
  });

  form.append(submitButton);
  wrapper.append(question, form, result);
  target.append(wrapper);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedIndex = Number(new FormData(form).get(choiceName));

    if (!Number.isInteger(selectedIndex)) {
      result.textContent = 'Choisis une réponse avant de valider.';
      result.className = 'quiz-result quiz-result-neutral';
      return;
    }

    const selectedChoice = quiz.choices[selectedIndex];
    result.textContent = selectedChoice.explanation;
    result.className = selectedChoice.correct ? 'quiz-result quiz-result-ok' : 'quiz-result quiz-result-ko';
  });
}
