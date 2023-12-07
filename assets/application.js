

// quiz logic

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


//  toggle quiz

function openPopup(event) {
  event.preventDefault(); 
  document.getElementById('popup-container').style.display = 'block';
  document.getElementById('pop-up-information').style.display = 'none';
}

function closePopup() {
  document.getElementById('popup-container').style.display = 'none';
  document.getElementById('pop-up-information').style.display = 'block';
}


// mega menu toggle 
function toggleAriaExpanded(elementId) {
  const element = document.getElementById(elementId);

  if (element) {
      const currentExpanded = element.getAttribute('aria-expanded') === 'true';
      element.setAttribute('aria-expanded', String(!currentExpanded));

      var test = document.getElementsByClassName('mega-menu')[0];
      test.style.display = currentExpanded ? 'none' : 'block';
  } else {
      console.error(`Element with id '${elementId}' not found.`);
  }
}

toggleAriaExpanded('toggle');



// add to cart - shopping section
document.addEventListener('DOMContentLoaded', function () {
  const amountContainers = document.querySelectorAll('.amount');
  const subtotalValue = document.getElementById('subtotal-value');
  const shippingValue = document.getElementById('shipping-value');
  const totalValue = document.getElementById('total-value');
  const selectedProductsContainer = document.querySelector('.selected-products');

  amountContainers.forEach(function (amountContainer) {
      const numberElement = amountContainer.querySelector('.number');
      const iconMinusElement = amountContainer.querySelector('.icon-minus');
      const iconPlusElement = amountContainer.querySelector('.icon-plus');

      if (numberElement && iconMinusElement && iconPlusElement) {
          iconMinusElement.addEventListener('click', function () {
              if (parseInt(numberElement.textContent) > 0) {
                  numberElement.textContent = parseInt(numberElement.textContent) - 1;
                  updateSubtotal();
                  updateSelectedProducts();
              }
          });

          iconPlusElement.addEventListener('click', function () {
              numberElement.textContent = parseInt(numberElement.textContent) + 1;
              updateSubtotal();
              updateSelectedProducts();
          });
      } 
  });

  function updateSubtotal() {
      let subtotal = 0;
      amountContainers.forEach(function (amountContainer) {
          const numberElement = amountContainer.querySelector('.number');
          const price = parseFloat(amountContainer.dataset.price);

          if (numberElement && price) {
              subtotal += parseInt(numberElement.textContent) * price;
          } 
      });


      subtotalValue.textContent = subtotal.toFixed(2);

      // Update total (subtotal + shipping)
      updateTotal(subtotal);
  }

  function updateTotal(subtotal) {
      const shipping = parseFloat(shippingValue.textContent);
      const total = subtotal + shipping;


      totalValue.textContent = total.toFixed(2);
  }

  function updateSelectedProducts() {
      // Tøm containeren og opbyg den igen
      selectedProductsContainer.innerHTML = '';

      amountContainers.forEach(function (amountContainer) {
          const numberElement = amountContainer.querySelector('.number');
          const productTitle = amountContainer.dataset.productTitle;

          if (numberElement && productTitle && parseInt(numberElement.textContent) > 0) {
              const selectedProduct = document.createElement('div');
              selectedProduct.textContent = `${productTitle} x ${numberElement.textContent}`;
              selectedProductsContainer.appendChild(selectedProduct);
          }
      });
  }
});



// slider

document.addEventListener('DOMContentLoaded', function () {


  const slider = document.querySelector('.slider');
  const slides = document.querySelector('.slides');
  const slideWidth = 460;
  let currentSlide = 0;

  function updateSlides() {
      slides.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
  }

  document.querySelector('.next').addEventListener('click', function () {
      currentSlide = Math.min(currentSlide + 1, slides.children.length - 2);
      updateSlides();
  });

  document.querySelector('.prev').addEventListener('click', function () {
      currentSlide = Math.max(currentSlide - 1, 0);
      updateSlides();
  });

  updateSlides();
});
