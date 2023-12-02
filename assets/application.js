


let currentQuestion = 0;
const answers = {};

function answerQuestion(question, answer) {
  answers[question] = answer;
  showResult();
}

function showResult() {
  const resultSection = document.getElementById('result');
  const resultText = document.getElementById('result-text');


  const result = calculateResult(answers);

  resultText.textContent = result;
  resultSection.style.display = 'block';
}


function calculateResult(answers) {
  const q1Answer = answers['Q1'] || '';
  const q2Answer = answers['Q2'] || '';

  const packageOne = document.getElementById('package_1');
  const packageTwo = document.getElementById('package_2');
  const packageThree = document.getElementById('package_3');
  
  // Nulstil grænser for alle pakker
  packageOne.style.border = "none";
  packageTwo.style.border = "none";
  packageThree.style.border = "none";
  
  let selectedPackage;
  
  switch (true) {
    case q1Answer === 'Mulighed 1' && q2Answer === 'Mulighed A':
      selectedPackage = packageOne;
      break;
    case q1Answer === 'Mulighed 2' && q2Answer === 'Mulighed B':
      selectedPackage = packageTwo;
      break;
    case q1Answer === 'Mulighed 3' && q2Answer === 'Mulighed C':
      selectedPackage = packageThree;
      break;
    default:
      selectedPackage = null;
  }
  
  if (selectedPackage) {
    selectedPackage.style.border = "2px solid var(--text-color)";
  }
  

  if (selectedPackage === packageOne) {
    return 'Pakkeløsning A';
  } else if (selectedPackage === packageTwo) {
    return 'Pakkeløsning B';
  } else if (selectedPackage === packageThree) {
    return 'Standard Pakkeløsning';
  } else {
    return 'Standard Pakkeløsning';
  }
}




function openPopup() {
  document.getElementById('popup-container').style.display = 'block';
  
}

function closePopup() {
  document.getElementById('popup-container').style.display = 'none';
}


