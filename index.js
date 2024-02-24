const wordContainer = document.querySelector('.word-input-container');

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

  const inputChar = e.key;
  if (!currentWord.includes(inputChar)) {
    figures[0].classList.remove('figure-part');
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
