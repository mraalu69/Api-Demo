const apiStatsTable = document.getElementById('api-stats-table');
const apiStatsTbody = document.getElementById('api-stats-tbody');
const searchBox = document.getElementById('search-box');
const popup = document.getElementById('popup');
const closePopupButton = document.getElementById('close-popup');
const cartCountDiv = document.getElementById('cart-count');
const cartList = document.getElementById('cart-list');
let cartItems = [];
let popupOpen = false; // Flag to track if popup is open

// Fetch API stats from the API service
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(products => {
    displayApiStats(products);
    addEventListeners(products);
  })
  .catch(error => console.log(error));

// Display API stats in the table
function displayApiStats(products) {
  products.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.title}</td>
      <td>${product.price}</td>
      <td>${product.category}</td>
      <td>${product.rating.rate}</td>
      <td><button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button></td>
    `;
    row.onclick = () => {
      showPopup(product);
    };
    apiStatsTbody.appendChild(row);
  });
}

// Add event listeners
function addEventListeners(products) {
  searchBox.addEventListener('input', searchProducts);
  closePopupButton.addEventListener('click', closePopup);
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-product-id');
      const product = products.find((product) => product.id === parseInt(productId));
      
      // Check if popup is open before adding to cart
      if (!popupOpen) {
        cartItems.push(product);
        updateCart();
      }
    });
  });
}

// Search products
function searchProducts(event) {
  const searchTerm = event.target.value.toLowerCase();
  const rows = apiStatsTbody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    const match = Array.from(cells).some((cell) => {
      return cell.textContent.toLowerCase().includes(searchTerm);
    });

    if (match) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}

// Show popup
function showPopup(product) {
  popupOpen = true; // Set popup open flag
  popup.style.display = 'block';
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-description').textContent = product.description;

  // Disable all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.disabled = true;
  });
}

// Close popup
function closePopup() {
  popupOpen = false; // Reset popup open flag
  popup.style.display = 'none';

  // Enable all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.disabled = false;
  });
}

// Update cart
function updateCart() {
  cartCountDiv.textContent = `Cart (${cartItems.length})`;
  cartList.innerHTML = ''; // clear the cart list
  cartItems.forEach((item) => {
    const cartItem = document.createElement('li');
    cartItem.textContent = `${item.title} - ${item.price}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      const index = cartItems.indexOf(item);
      if (index!== -1) {
        cartItems.splice(index, 1);
        updateCart();
      }
    });
    cartItem.appendChild(removeButton);
    cartList.appendChild(cartItem);
  });
}
