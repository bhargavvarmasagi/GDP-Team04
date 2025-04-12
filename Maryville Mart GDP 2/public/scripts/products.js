const productContainer = document.getElementById('productsContainer');
const categoryDropdown = document.querySelector(".search-category");
const cartDropdown = document.querySelector(".cart-dropdown");
var products = [], stores = [];
var categories = [];
var cart = JSON.parse(localStorage.getItem("cart")) || []; 
var likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
var inWishlistView = false;
var reviews;


document.querySelector(".cart-button").addEventListener("click", toggleCart);

function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("open");
}

function sortProducts(criteria) {
    let sortedProducts = [...products];

    switch (criteria) {
        case "Name (A - Z)":
            sortedProducts.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
            break;
        case "Name (Z - A)":
            sortedProducts.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
            break;
        case "Price (Low > High)":
            sortedProducts.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
            break;
        case "Price (High > Low)":
            sortedProducts.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
            break;
        case "Rating (Highest)":
            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case "Rating (Lowest)":
            sortedProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
            break;
        default:
            break;
    }

    renderProducts(sortedProducts);
}

async function getProducts() {
    try {
        const response = await fetch(`/api/public/getProducts`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const productData = await response.json();

        console.log(productData.products);
        products = productData.products;

        if (Array.isArray(products) && products.length > 0) {
            renderProducts(products);

            categoryDropdown.innerHTML = `<option value="">All Categories</option>`;
            [...new Set(products.map(product => product.Category))].forEach(category => {
                categoryDropdown.innerHTML += `<option value="${category}">${category}</option>`;
            });
        } else {
            productContainer.innerHTML = "<p>No products available.</p>";
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

async function getReviews(productId, productName) {
    try {
        const response = await fetch(`/api/public/getReviews?ProductID=${productId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const reviewData = await response.json();

        console.log(reviewData);
        reviews = reviewData;
        renderReviews(productName, reviews); 
        if (Array.isArray(reviews) && reviews.length > 0) {
           console.log("ok")
        } else {
          //  productContainer.innerHTML = "<p>No products available.</p>";
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

function renderProducts(filteredProducts) {
    productContainer.innerHTML = "";

    filteredProducts.forEach(prod => {
        const isLiked = likedProducts.includes(prod.ProductID);
        const store = stores.find(store => store.StoreID === prod.StoreID);
        const storeName = store ? store.StoreName : 'Unknown Store';

        productContainer.innerHTML += `
                    <div class="product-card" >
                        <img src="${prod.ImgUrl || 'https://via.placeholder.com/150'}" alt="${prod.Category || 'Product'}">
                        <div class="product-details">
                            <p class="category">${prod.Category || 'Category'}</p>
                            <p class="name">${prod.ProductName || 'Product Name'}</p>
                            <div class="rating">
                                ${generateStars(prod.rating || 4)}
                            </div>
                            <p class="price">$${prod.Price || '0.00'}</p>
                            <p class="store">${storeName}</p>
                        </div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${prod.ProductID}"><i class="fas fa-cart-plus"></i> Add Cart</button>
                        <button class="like-button" data-id="${prod.ProductID}">
                            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="reviews-button" onclick="getReviews('${prod.ProductID}', '${prod.ProductName}')">
                            <i class="fas fa-comments"></i> Reviews
                        </button>
                    </div>
        `;
    });
    attachLikeEventListeners();
    attachAddToCartListeners();
}

function renderReviews(productName, reviews) {
    // Create or reuse modal element
    let modal = document.getElementById('reviewsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reviewsModal';
        modal.className = 'reviews-modal';
        modal.innerHTML = `
            <div class="reviews-modal-content">
                <div class="reviews-modal-header">
                    <h2>Reviews for ${productName}</h2>
                    <span class="reviews-close">&times;</span>
                </div>
                <div class="reviews-list"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.reviews-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    const reviewsList = modal.querySelector('.reviews-list');
   // console.log(reviews, Array.isArray(reviews))
    reviewsList.innerHTML = !Array.isArray(reviews)
        ? '<div class="no-reviews">No reviews yet. Be the first to review this product!</div>'
        : reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-rating">
                        ${Array(5).fill().map((_, i) => `
                            <i class="fas fa-star${i < Math.floor(review.Rating) ? '' : '-half-alt'}${i < review.Rating ? ' active' : ''}"></i>
                        `).join('')}
                    </div>
                    <div class="review-meta">
                        <span class="review-customer">Customer ${review.CustomerID}</span>
                        <span class="review-date">${new Date(review.ReviewDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="review-body">
                    <p>${review.ReviewText || 'No review text provided'}</p>
                </div>
            </div>
        `).join('');

    modal.style.display = 'block';
}

function attachLikeEventListeners() {
    document.querySelectorAll(".like-button").forEach(button => {
        button.addEventListener("click", function () {
            const productId = parseInt(this.getAttribute("data-id"));
            const icon = this.querySelector("i");
            if (likedProducts.includes(productId)) {
                likedProducts = likedProducts.filter(id => id !== productId);
                icon.classList.replace("fas", "far");
                if (inWishlistView) {
                    renderProducts(products.filter(product => likedProducts.includes(product.ProductID)));
                }
            } else {
                likedProducts.push(productId);
                icon.classList.replace("far", "fas");
            }
            localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
        });
    });
}

function attachAddToCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productId = parseInt(this.getAttribute("data-id"));
            const product = products.find(prod => prod.ProductID === productId);

            if (product) {
                addToCart(product);
            }
        });
    });
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.ProductID === product.ProductID);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.ProductID !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotalElement = document.querySelector(".cart-total");
    const cartTaxElement = document.querySelector(".cart-tax");
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            const price = parseFloat(item.Price);
            totalPrice += price * parseFloat(item.quantity);
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.ImgUrl}" alt="${item.ProductName}">
                <span>${item.ProductName}</span>
                <span>$${price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${item.ProductID})"><i class="fas fa-times"></i></button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    } else {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
    let tax = totalPrice * 0.1;
    cartTaxElement.textContent = `Tax (10%): $${tax.toFixed(2)}`;
    cartTotalElement.textContent = `Total: $${(totalPrice + tax).toFixed(2)}`;
}

function emptyCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}


document.querySelector(".search-button").addEventListener("click", function () {
    inWishlistView = false;
    const searchQuery = document.querySelector(".search-input").value.toLowerCase().trim();
    const selectedCategory = categoryDropdown.value;
    
    const filteredProducts = products.filter(product => {
        const matchesName = searchQuery ? product.ProductName.toLowerCase().includes(searchQuery) : true;
        const matchesCategory = selectedCategory ? product.Category === selectedCategory : true;
        return matchesName && matchesCategory;
    });

    renderProducts(filteredProducts);
});

document.getElementById("wishlist").addEventListener("click", function () {
    inWishlistView = true;
    renderProducts(products.filter(product => likedProducts.includes(product.ProductID)));
});

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<ion-icon name="${i <= rating ? 'star' : 'star-outline'}"></ion-icon>`;
    }
    return stars;
}


async function getStores() {
    try {
        const response = await fetch(`/api/public/getStores`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const storeData = await response.json();
        stores = storeData
       // console.log(storeData)
        return storeData;
    } catch (error) {
        console.error('Error fetching stores:', error);
        return [];
    }
}

function renderStores(stores) {
    const storeContainer = document.getElementById('storeContainer');
    storeContainer.innerHTML = "";

    stores.forEach(store => {
        const storeCard = document.createElement('div');
        storeCard.classList.add('store-card');
        storeCard.innerHTML = `
            <h3 class="store-name">${store.StoreName}</h3>
            <p class="store-location">${store.Location}</p>
            <p class="store-status">${store.InventoryStatus}</p>
        `;
        storeCard.addEventListener('click', () => filterProductsByStore(store.StoreID));
        storeContainer.appendChild(storeCard);
    });
}

function filterProductsByStore(storeId) {
    const filteredProducts = products.filter(product => product.StoreID === storeId);
    renderProducts(filteredProducts);
}


document.addEventListener('DOMContentLoaded', async function () {
    const stores = await getStores();
   // console.log(stores);
    renderStores(stores);
    await getProducts();
    updateCartDisplay();
    document.querySelector(".sort-by select").addEventListener("change", function () {
        const selectedSort = this.value;
        sortProducts(selectedSort);
    });
});

