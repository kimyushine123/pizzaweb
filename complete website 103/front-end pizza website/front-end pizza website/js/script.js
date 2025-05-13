// Cart functionality for Pizza Shop
document.addEventListener('DOMContentLoaded', function() {
  // Cart state management
  let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
  
  // DOM elements
  const elements = {
    navbar: document.querySelector('.header .flex .navbar'),
    menuBtn: document.querySelector('#menu-btn'),
    
    userAccount: document.querySelector('.user-account'),
    userBtn: document.querySelector('#user-btn'),
    closeAccount: document.querySelector('#close-account'),
    
    myOrders: document.querySelector('.my-orders'),
    orderBtn: document.querySelector('#order-btn'),
    closeOrders: document.querySelector('#close-orders'),
    
    cart: document.querySelector('.shopping-cart'),
    cartBtn: document.querySelector('#cart-btn'),
    closeCart: document.querySelector('#close-cart'),
    cartContent: document.querySelector('.shopping-cart section'),
    cartCount: document.querySelector('#cart-btn span'),
    
    slides: document.querySelectorAll('.home-bg .home .slide-container .slide'),
    accordions: document.querySelectorAll('.faq .accordion-container .accordion'),
    
    // Add to cart forms
    addToCartForms: document.querySelectorAll('.menu .box form'),
    
    // Order display sections
    orderDisplaySections: document.querySelectorAll('.display-orders')
  };
  
  // Initialize UI
  updateCartUI();
  
  // Toggle navigation menu
  elements.menuBtn.addEventListener('click', () => {
    elements.navbar.classList.toggle('active');
  });

  // User account panel
  elements.userBtn.addEventListener('click', () => {
    elements.userAccount.classList.add('active');
  });

  elements.closeAccount.addEventListener('click', () => {
    elements.userAccount.classList.remove('active');
  });

  // Orders panel
  elements.orderBtn.addEventListener('click', () => {
    elements.myOrders.classList.add('active');
  });

  elements.closeOrders.addEventListener('click', () => {
    elements.myOrders.classList.remove('active');
  });

  // Shopping cart panel
  elements.cartBtn.addEventListener('click', () => {
    elements.cart.classList.add('active');
  });

  elements.closeCart.addEventListener('click', () => {
    elements.cart.classList.remove('active');
  });

  // Close all panels on scroll
  window.addEventListener('scroll', () => {
    elements.navbar.classList.remove('active');
    elements.myOrders.classList.remove('active');
    elements.cart.classList.remove('active');
    elements.userAccount.classList.remove('active');
  });

  // Slider functionality
  let currentSlideIndex = 0;

  function nextSlide() {
    elements.slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % elements.slides.length;
    elements.slides[currentSlideIndex].classList.add('active');
  }

  function prevSlide() {
    elements.slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex - 1 + elements.slides.length) % elements.slides.length;
    elements.slides[currentSlideIndex].classList.add('active');
  }

  // Set up slider controls if they exist
  const nextButtons = document.querySelectorAll('.fas.fa-angle-right');
  const prevButtons = document.querySelectorAll('.fas.fa-angle-left');

  nextButtons.forEach(button => {
    button.addEventListener('click', nextSlide);
  });

  prevButtons.forEach(button => {
    button.addEventListener('click', prevSlide);
  });

  // Accordion functionality
  elements.accordions.forEach(accordion => {
    accordion.addEventListener('click', () => {
      elements.accordions.forEach(item => item.classList.remove('active'));
      accordion.classList.add('active');
    });
  });

  // Add to cart functionality
  if (elements.addToCartForms) {
    elements.addToCartForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get parent box to access product info
        const productBox = this.closest('.box');
        const productName = productBox.querySelector('.name').innerText;
        const productPrice = productBox.querySelector('.price').innerText.match(/\$(\d+)/)[1];
        const productImage = productBox.querySelector('img').src;
        const quantity = parseInt(this.querySelector('.qty').value);
        
        // Add to cart
        addToCart(productName, productPrice, productImage, quantity);
      });
    });
  }
  
  // Remove from cart functionality - delegated event for dynamically created elements
  if (elements.cartContent) {
    elements.cartContent.addEventListener('click', function(e) {
      if (e.target.classList.contains('fa-times')) {
        e.preventDefault();
        const productBox = e.target.closest('.box');
        const productName = productBox.querySelector('.content p').innerText.split(' (')[0];
        removeFromCart(productName);
      }
    });
  }
  
  // Update quantity in cart
  if (elements.cartContent) {
    elements.cartContent.addEventListener('submit', function(e) {
      if (e.target.closest('.box')) {
        e.preventDefault();
        const productBox = e.target.closest('.box');
        const productName = productBox.querySelector('.content p').innerText.split(' (')[0];
        const newQuantity = parseInt(e.target.querySelector('.qty').value);
        updateCartItemQuantity(productName, newQuantity);
      }
    });
  }
  
  // Cart functions
  function addToCart(name, price, image, qty) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex].qty += qty;
    } else {
      // Add new item if it doesn't exist
      cart.push({
        name,
        price,
        image,
        qty
      });
    }
    
    // Save to localStorage and update UI
    saveCart();
    updateCartUI();
    
    // Show cart to user
    elements.cart.classList.add('active');
    
    // Show confirmation message
    showToast(`${name} added to cart!`);
  }
  
  function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
    showToast('Item removed from cart!');
  }
  
  function updateCartItemQuantity(name, newQty) {
    const itemIndex = cart.findIndex(item => item.name === name);
    
    if (itemIndex !== -1) {
      if (newQty <= 0) {
        // Remove item if quantity is zero or negative
        removeFromCart(name);
      } else {
        // Update quantity
        cart[itemIndex].qty = newQty;
        saveCart();
        updateCartUI();
        showToast('Cart updated!');
      }
    }
  }
  
  function saveCart() {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
  }
  
  function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    elements.cartCount.innerText = `(${totalItems})`;
    
    // Update cart content
    if (elements.cartContent) {
      // Keep the close button and clear other content
      let cartHTML = `<div id="close-cart"><span>close</span></div>`;
      
      // Add items to cart
      cart.forEach(item => {
        cartHTML += `
          <div class="box">
            <a href="#" class="fas fa-times"></a>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
              <p>${item.name} <span>( $${item.price}/- x ${item.qty} )</span></p>
              <form action="" method="post">
                <input type="number" class="qty" name="qty" min="1" value="${item.qty}" max="100">
                <button type="submit" class="fas fa-edit" name="update_qty"></button>
              </form>
            </div>
          </div>
        `;
      });
      
      // Add order button if items exist
      if (totalItems > 0) {
        cartHTML += `<a href="#order" class="btn">order now</a>`;
      } else {
        cartHTML += `<p style="text-align: center; font-size: 2rem; margin: 2rem 0;">Your cart is empty</p>`;
      }
      
      elements.cartContent.innerHTML = cartHTML;
      
      // Reattach event listener for close button
      document.querySelector('#close-cart').addEventListener('click', () => {
        elements.cart.classList.remove('active');
      });
    }
    
    // Update order display sections
    if (elements.orderDisplaySections) {
      elements.orderDisplaySections.forEach(section => {
        section.innerHTML = '';
        
        cart.forEach(item => {
          const orderItem = document.createElement('p');
          orderItem.innerHTML = `${item.name} <span>( $${item.price}/- x ${item.qty} )</span>`;
          section.appendChild(orderItem);
        });
        
        if (cart.length === 0) {
          const emptyMessage = document.createElement('p');
          emptyMessage.innerHTML = 'Your cart is empty';
          section.appendChild(emptyMessage);
        }
      });
    }
    
    // Calculate and update total price in order form
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    const totalElement = document.createElement('p');
    totalElement.classList.add('total-price');
    totalElement.innerHTML = `Total: <span>$${totalPrice}/-</span>`;
    
    // Add total price to order display sections if they exist
    if (elements.orderDisplaySections && cart.length > 0) {
      elements.orderDisplaySections.forEach(section => {
        // Remove existing total if present
        const existingTotal = section.querySelector('.total-price');
        if (existingTotal) {
          existingTotal.remove();
        }
        section.appendChild(totalElement.cloneNode(true));
      });
    }
  }
  
  // Create a toast notification system
  function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
      
      // Add CSS for toast
      const style = document.createElement('style');
      style.textContent = `
        .toast-notification {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--black);
          color: var(--white);
          padding: 1rem 2rem;
          border-radius: 5px;
          font-size: 1.6rem;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .toast-notification.show {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Add form validation
  const orderForm = document.querySelector('.order form');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      // Basic validation
      const nameInput = orderForm.querySelector('input[name="name"]');
      const phoneInput = orderForm.querySelector('input[name="number"]');
      const pinInput = orderForm.querySelector('input[name="pin_code"]');
      
      let isValid = true;
      let errorMessage = '';
      
      if (cart.length === 0) {
        isValid = false;
        errorMessage = 'Your cart is empty. Please add items before ordering.';
      }
      
      if (nameInput && nameInput.value.trim() === '') {
        isValid = false;
        errorMessage = 'Please enter your name.';
      }
      
      if (phoneInput && phoneInput.value.length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
      
      if (pinInput && pinInput.value.length < 5) {
        isValid = false;
        errorMessage = 'Please enter a valid PIN code.';
      }
      
      if (!isValid) {
        e.preventDefault();
        showToast(errorMessage);
      } else {
        // Successful order - clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Show success message (this would normally happen after form submission)
        e.preventDefault(); // Remove this in production when you actually submit the form
        showToast('Order placed successfully!');
        
        // Add the order to my-orders section
        addToMyOrders(orderForm);
      }
    });
  }
  
  // Function to add the current order to my-orders section
  function addToMyOrders(orderForm) {
    const myOrdersSection = document.querySelector('.my-orders section');
    if (!myOrdersSection) return;
    
    const orderBox = document.createElement('div');
    orderBox.className = 'box';
    
    // Get current date
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    
    // Get form values
    const name = orderForm.querySelector('input[name="name"]').value;
    const number = orderForm.querySelector('input[name="number"]').value;
    const method = orderForm.querySelector('select[name="method"]').value;
    const flat = orderForm.querySelector('input[name="flat"]').value;
    const street = orderForm.querySelector('input[name="street"]').value;
    const pinCode = orderForm.querySelector('input[name="pin_code"]').value;
    
    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    
    // Create order items string
    const orderItems = cart.map(item => `${item.name} $${item.price}/- x ${item.qty}`).join(', ');
    
    // Create order HTML
    orderBox.innerHTML = `
      <p>placed on : <span>${dateStr}</span></p>
      <p>name : <span>${name}</span></p>
      <p>number : <span>${number}</span></p>
      <p>address : <span>${flat}, ${street}, ${pinCode}</span></p>
      <p>payment method : <span>${method}</span></p>
      <p>your orders : <span>${orderItems}</span></p>
      <p>total price : <span>$${totalPrice}/-</span></p>
      <p>payment status : <span style="color: var(--red);">pending</span></p>
    `;
    
    // Insert at the top, after the close button and title
    const closeBtn = myOrdersSection.querySelector('#close-orders');
    const title = myOrdersSection.querySelector('.title');
    
    if (title) {
      myOrdersSection.insertBefore(orderBox, title.nextSibling);
    } else if (closeBtn) {
      myOrdersSection.insertBefore(orderBox, closeBtn.nextSibling);
    } else {
      myOrdersSection.appendChild(orderBox);
    }
  }
});