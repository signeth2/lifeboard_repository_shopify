

// ------------- quiz logic -------------

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

  if (element) {
      const currentExpanded = element.getAttribute('aria-expanded') === 'true';
      element.setAttribute('aria-expanded', String(!currentExpanded));

      var test = document.getElementsByClassName('mega-menu')[0];
      test.style.display = currentExpanded ? 'none' : 'block';
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

          console.log('Selected product variant ID:', selectedVariantId);

          // Remove the 'selected' class from all packages
          document.querySelectorAll('.package').forEach(function (packageElement) {
              packageElement.classList.remove('selected');
          });

          // Add the 'selected' class to the parent .package element
          form.closest('.package').classList.add('selected');
      });
  });

  addToCartBtn.addEventListener('click', function () {
      if (selectedVariantId) {
          // Add selected product to cart
          fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({ id: selectedVariantId, quantity: 1 }).toString(),
          })
              .then(response => response.json())
              .then(data => {
                  console.log('Product added to cart:', data);

                  // Redirect to the cart page
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

// Remove the 'selected' class from all packages
document.querySelectorAll('.package').forEach(function (packageElement) {
  packageElement.classList.remove('selected');
});

// Add the 'selected' class to the parent .package element
form.closest('.package').classList.add('selected');