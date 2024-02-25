const wordContainer = document.querySelector('.word-input-container');
const wrongCharsContainer = document.querySelector('.wrong-chars-container-text');
const modalWindow = document.querySelector('dialog');

let currentWord = '';

document.addEventListener('DOMContentLoaded', async () => {
  await retrieveRandomWord();
  createInputElementForEachCharacter();
});

document.addEventListener('keydown', (e) => {
  // exclude non-character keys
  if (e.code !== `Key${e.key.toUpperCase()}`) {
    return;
  }

  const figures = document.querySelectorAll('.figure-part');
  if (!figures.length) {
    modalWindow.showModal();
    return;
  }

  const inputChar = e.key;
  if (!currentWord.includes(inputChar) && !wrongCharsContainer.textContent.includes(inputChar)) {
    figures[0].classList.remove('figure-part');
    figures[0].classList.add('figure-part-visible');
    displayWrongGuessedCharacter(inputChar);

    if (figures.length === 1) {
      modalWindow.showModal();
    }

    return;
  }

  putCharacterInEachFoundInput(inputChar);
});

async function retrieveRandomWord() {
  return fetch('https://random-word-api.herokuapp.com/word')
    .then((res) => res.json())
    .then((data) => {
      currentWord = data[0];
    })
    .catch((err) => console.log(err));
}

function createInputElementForEachCharacter() {
  if (!currentWord) {
    return;
  }

  for (let i = 0; i < currentWord.length; i++) {
    const charInput = document.createElement('input');
    charInput.type = 'text';
    charInput.maxLength = 1;
    charInput.disabled = true; // do not allow the user to type/edit manually into the input

    charInput.classList.add('char-input');

    wordContainer.appendChild(charInput);
  }
}

function putCharacterInEachFoundInput(inputChar) {
  if (typeof inputChar !== 'string') {
    return;
  }

  for (let i = 0; i < currentWord.length; i++) {
    const char = currentWord.charAt(i);
    if (char !== inputChar) {
      continue;
    }

    const inputOfChar = wordContainer.children[i];
    inputOfChar.value = char;
  }
}

function displayWrongGuessedCharacter(inputChar) {
  if (wrongCharsContainer.textContent.includes(inputChar)) {
    return;
  }

  const wrongCharsText = document.createElement('p');
  if (wrongCharsContainer.querySelectorAll('p').length > 0) {
    wrongCharsText.textContent += `, ${inputChar}`;
  } else {
    wrongCharsText.textContent += inputChar;
  }

  wrongCharsContainer.appendChild(wrongCharsText);
}

function closeModal() {
  modalWindow.close();
}

async function restartGame() {
  await retrieveRandomWord();

  clearInputs();
  clearWrongCharacters();

  createInputElementForEachCharacter();

  const figures = document.querySelectorAll('.figure-part-visible');
  figures.forEach((figure) => {
    figure.classList.remove('figure-part-visible');
    figure.classList.add('figure-part');
  });

  modalWindow.close();
}

function clearInputs() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.remove();
  });
}

function clearWrongCharacters() {
  wrongCharsContainer.querySelectorAll('p').forEach((el) => {
    el.remove();
  });
}
