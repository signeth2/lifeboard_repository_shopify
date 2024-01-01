

// ------------- quiz logic -------------

let currentQuestion = 0;
const answers = {};

function answerQuestion(question, answer) {
    answers[question] = answer;

    if (question === 'Q1') {
        showQuestion('Q2');
        hideQuestion('Q1');
    } else if (question === 'Q2') {
        showQuestion('Q3');
        hideQuestion('Q2');
    } else if (question === 'Q3') {
        showResult();
    }
}

function showQuestion(questionId) {
    const questionElement = document.querySelector(`.question[data-question="${questionId}"]`);
    questionElement.style.display = 'block';
    questionElement.offsetHeight;
    questionElement.style.opacity = '1';
}

function hideQuestion(questionId) {
    const questionElement = document.querySelector(`.question[data-question="${questionId}"]`);
    questionElement.style.opacity = '0';
    questionElement.style.display = 'none';
}

function calculateResult(answers) {
    const q1Answer = answers['Q1'] || '';
    const q2Answer = answers['Q2'] || '';
    const q3Answer = answers['Q3'] || '';

    const packageOne = document.getElementById('package_1');
    const packageTwo = document.getElementById('package_2');
    const packageThree = document.getElementById('package_3');

    packageOne.style.border = "none";
    packageTwo.style.border = "none";
    packageThree.style.border = "none";

    const distanceToPackageOne = calculateDistance(q1Answer, q2Answer, q3Answer, 'Mulighed 1', 'Mulighed A', 'Mulighed A');
    const distanceToPackageTwo = calculateDistance(q1Answer, q2Answer, q3Answer, 'Mulighed 2', 'Mulighed B', 'Mulighed B');
    const distanceToPackageThree = calculateDistance(q1Answer, q2Answer, q3Answer, 'Mulighed 3', 'Mulighed C', 'Mulighed C');

    const minDistance = Math.min(distanceToPackageOne, distanceToPackageTwo, distanceToPackageThree);

    let selectedPackage;

    if (minDistance === distanceToPackageOne) {
        selectedPackage = packageOne;
    } else if (minDistance === distanceToPackageTwo) {
        selectedPackage = packageTwo;
    } else {
        selectedPackage = packageThree;
    }

    if (selectedPackage) {
        selectedPackage.style.border = "2px solid var(--text-color)";
    }

    if (selectedPackage === packageOne) {
        return 'Pakkeløsning A';
    } else if (selectedPackage === packageTwo) {
        return 'Pakkeløsning B';
    } else {
        return 'Standard Pakkeløsning';
    }
}

function calculateDistance(q1Answer, q2Answer, q3Answer, target1, target2, target3) {
    const distanceToTarget1 = calculateAnswerDistance(q1Answer, target1) + calculateAnswerDistance(q2Answer, target2) + calculateAnswerDistance(q3Answer, target3);
    return distanceToTarget1;
}

function calculateAnswerDistance(answer, target) {
    if (answer === target) {
        return 0;
    } else {
        return 1;
    }
}

function retryTest() {
  answers['Q1'] = '';
  answers['Q2'] = '';
  answers['Q3'] = '';

  const packageOne = document.getElementById('package_1');
  const packageTwo = document.getElementById('package_2');
  const packageThree = document.getElementById('package_3');

  packageOne.style.border = "none";
  packageTwo.style.border = "none";
  packageThree.style.border = "none";

  hideQuestion('Q3');
  showQuestion('Q1');
  document.getElementById('result').style.display = 'none';
}

function showResult() {
    const resultSection = document.getElementById('result');
    const resultText = document.getElementById('result-text');

    const result = calculateResult(answers);

    resultText.textContent = result;
    resultSection.style.display = 'block';

    if (answers['Q1'] && answers['Q2'] && answers['Q3']) {
        closePopup();

        const popupHeight = document.querySelector('.pop-up').offsetHeight;

        smoothScroll(window.scrollY + popupHeight + 260);
    }
}

function smoothScroll(target) {
    const currentPosition = window.scrollY;
    const distance = Math.abs(target - currentPosition);
    const duration = 500;
    let startTime;

    function scrollStep(timestamp) {
        if (!startTime) startTime = timestamp;

        const progress = timestamp - startTime;
        const easeInOutCubic = progress / duration - 1;
        const eased = easeInOutCubic * easeInOutCubic * easeInOutCubic + 1;

        window.scrollTo(0, currentPosition + (target - currentPosition) * eased);

        if (progress < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}


// ------------- toggle quiz -------------

function openPopup(event) {
  event.preventDefault(); 
  document.getElementById('popup-container').style.display = 'block';
  document.getElementById('pop-up-information').style.display = 'none';
}

function closePopup() {
  document.getElementById('popup-container').style.display = 'none';
  document.getElementById('pop-up-information').style.display = 'block';
}


// ------------- mega menu toggle -------------
function toggleAriaExpanded(elementId) {
    const element = document.getElementById(elementId);
    const megaMenu = document.querySelector('.mega-menu');

    if (element && megaMenu) {
        const currentExpanded = element.getAttribute('aria-expanded') === 'true';
        element.setAttribute('aria-expanded', String(!currentExpanded));

        if (currentExpanded) {
            megaMenu.classList.remove('open');
        } else {
            megaMenu.classList.add('open');
        }
    }
}

toggleAriaExpanded('toggle');



//  -------------  shopping section - add to cart  -------------

document.addEventListener('DOMContentLoaded', function () {
  const amountContainers = document.querySelectorAll('.amount');
  const subtotalValue = document.getElementById('subtotal-value');
  const totalValue = document.getElementById('total-value');
  const selectedProductsContainer = document.querySelector('.selected-products');

  // Hent gemte produkter fra Local Storage
  function getSelectedProducts() {
    const savedProductsJSON = localStorage.getItem('selectedProducts');
    return JSON.parse(savedProductsJSON) || [];
  }

  // Gem valgte produkter i Local Storage
  function saveSelectedProductsToLocalStorage(selectedProducts) {
    const selectedProductsJSON = JSON.stringify(selectedProducts);
    localStorage.setItem('selectedProducts', selectedProductsJSON);
  }

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


    updateTotal(subtotal);
  }

  function updateTotal(subtotal) {
    totalValue.textContent = subtotal.toFixed(2);
  }

  function updateSelectedProducts() {
    const selectedProducts = [];

    amountContainers.forEach(function (amountContainer) {
      const numberElement = amountContainer.querySelector('.number');
      const productTitle = amountContainer.dataset.productTitle;
      const productId = amountContainer.dataset.productId;
      const productPrice = amountContainer.dataset.price;

      if (numberElement && productTitle && productId && productPrice) {
        const quantity = parseInt(numberElement.textContent);

        if (quantity > 0) {
          selectedProducts.push({
            id: productId,
            title: productTitle,
            quantity: quantity,
            price: parseFloat(productPrice),
          });
        }
      }
    });

    // Opdater valgte produkter og gem dem i Local Storage
    saveSelectedProductsToLocalStorage(selectedProducts);


    selectedProductsContainer.innerHTML = '';

    selectedProducts.forEach(function (selectedProduct) {
      const productInfo = `${selectedProduct.title} x ${selectedProduct.quantity}`;
      const selectedProductElement = document.createElement('div');
      selectedProductElement.textContent = productInfo;
      selectedProductsContainer.appendChild(selectedProductElement);
    });
  }

  // Hent gemte produkter, når siden indlæses
  const savedProducts = getSelectedProducts();

  savedProducts.forEach(function (savedProduct) {
    const selectedProductElement = document.createElement('div');
    selectedProductElement.textContent = `${savedProduct.title} x ${savedProduct.quantity}`;
    selectedProductsContainer.appendChild(selectedProductElement);
  });
});


// ------------- slider -------------

document.addEventListener('DOMContentLoaded', function () {
  const slidesContainer = document.querySelector('.slides');
  const slides = Array.from(slidesContainer.children);
  const slideWidth = slides[0].offsetWidth;
  const totalSlides = slides.length;
  const visibleSlides = 2; 
  let currentSlide = 0; 

 
  const cloneFirst = slides.slice(0, visibleSlides).map((slide) => slide.cloneNode(true));
  const cloneLast = slides.slice(totalSlides - visibleSlides, totalSlides).map((slide) => slide.cloneNode(true));

 
  cloneFirst.forEach((clone) => slidesContainer.appendChild(clone));
  cloneLast.forEach((clone) => slidesContainer.insertBefore(clone, slidesContainer.children[0]));

  function updateSlides() {
    const translateValue = -currentSlide * slideWidth;
    slidesContainer.style.transform = `translateX(${translateValue}px)`;
  }

  function nextSlide() {
    currentSlide++;
    const isLastClone = currentSlide >= totalSlides;
    if (isLastClone) {
      currentSlide = 0;
    }
    updateSlides();
  }

  function prevSlide() {
    currentSlide--;
    const isFirstClone = currentSlide < 0;
    if (isFirstClone) {
      currentSlide = totalSlides - visibleSlides;
    }
    updateSlides();
  }

  document.querySelector('.next').addEventListener('click', nextSlide);
  document.querySelector('.prev').addEventListener('click', prevSlide);

  window.addEventListener('resize', function () {
    currentSlide = Math.max(0, Math.min(currentSlide, totalSlides - visibleSlides));
    updateSlides();
  });

  updateSlides();
});

// add to cart 
document.addEventListener('DOMContentLoaded', function () {
  var productForms = document.querySelectorAll('.product-form');
  var selectedPackage = document.getElementById('selected-package');
  var addToCartBtn = document.getElementById('addToCartBtn');

  var selectedVariantId = null;

  productForms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
          event.preventDefault();

          var formData = new FormData(form);
          selectedVariantId = formData.get('variantId');

          // console.log('Selected product variant ID:', selectedVariantId);

         
          document.querySelectorAll('.package').forEach(function (packageElement) {
              packageElement.classList.remove('selected');
          });

        
          form.closest('.package').classList.add('selected');
      });
  });

  addToCartBtn.addEventListener('click', function () {
      if (selectedVariantId) {
         
          fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({ id: selectedVariantId, quantity: 1 }).toString(),
          })
              .then(response => response.json())
              .then(data => {
                  // console.log('Product added to cart:', data);

                 
                  window.location.href = '/cart';
              })
              .catch(error => {
                  console.error('Error adding product to cart:', error);
              });
      } else {
          console.warn('No product variant selected.');
      }
  });
});


document.querySelectorAll('.package').forEach(function (packageElement) {
  packageElement.classList.remove('selected');
});


form.closest('.package').classList.add('selected');