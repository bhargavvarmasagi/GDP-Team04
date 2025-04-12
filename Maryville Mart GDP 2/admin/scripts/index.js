let products = [];
let stores = [];
let editIndex = null;

const form = document.getElementById('productForm');
const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
const API_BASE_URL = '/api/admin';

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const Form = new FormData(e.target);
    const formObj = {};
    Form.forEach((value, key) => {
        formObj[key] = value
    });
    console.log(formObj);

  let isValid = true;

  if (!formObj.ProductName) {
    showError('nameError', 'Product name is required.');
    isValid = false;
  } else hideError('nameError');

  if (!formObj.image && editIndex === null) {
    showError('imageError', 'Product image is required.');
    isValid = false;
  } else hideError('imageError');

  if (!formObj.Price || isNaN(formObj.Price) || parseFloat(formObj.Price) <= 0) {
    showError('priceError', 'Please enter a valid price.');
    isValid = false;
  } else hideError('priceError');

  if (!formObj.StoreID) {
    showError('storeIdError', 'Store ID is required.');
    isValid = false;
  } else hideError('storeIdError');

  if (!formObj.StockQuantity || isNaN(formObj.StockQuantity) || parseInt(formObj.StockQuantity) < 0) {
    showError('stockError', 'Please enter a valid stock quantity.');
    isValid = false;
  } else hideError('stockError');

  if (!formObj.Category) {
    showError('categoryError', 'Category is required.');
    isValid = false;
  } else hideError('categoryError');

  if (!formObj.Description) {
    showError('descriptionError', 'Description is required.');
    isValid = false;
  } else hideError('descriptionError');

  if (!isValid) {
    submitButton.disabled = false;
    return;
  }

  try {
    const product = {
      id: document.getElementById('productId').value || null,
      ProductName : formObj.ProductName,
      Price: parseFloat(formObj.Price),
      StoreID : formObj.StoreID,
      StockQuantity: parseInt(formObj.StockQuantity),
      Category : formObj.Category,
      Description : formObj.Description,
      image: formObj.image
    };

    console.log('products ', product);

    if (editIndex !== null) {
      await axios.put(`${API_BASE_URL}/updateProduct/${products[editIndex].ProductID}`, JSON.stringify(product),  {
        headers: {
            'Content-Type': 'application/json'
        },
    });
      products[editIndex] = product;
      editIndex = null;
    } else {
      const response = await axios.post(`${API_BASE_URL}/addProduct`, product, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
      products.push(response.data);
    }

    await renderProducts();
   // await renderStores();
    resetForm();
  } catch (error) {
    console.error('Failed to save product:', error);
    alert('An error occurred while saving the product. Please try again.');
  } finally {
    submitButton.disabled = false;
  }
});

async function renderProducts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProducts`);
    products = response.data;
    productTable.innerHTML = '';

    products.forEach((product, index) => {
      const row = productTable.insertRow();
      row.innerHTML = `
        <td>${product.ProductName}</td>
        <td><img src="${product.ImgUrl}" alt="${product.ProductName}" class="product-image"></td>
        <td>$ ${product.Price}</td>
        <td>${product.StoreID}</td>
        <td>${product.StockQuantity}</td>
        <td>${product.Category}</td>
        <td>${product.Description}</td>
        <td class="actions">
          <button onclick="editProduct(${index})">Edit</button>
          <button onclick="deleteProduct(${index})">Delete</button>
        </td>
      `;
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    alert('An error occurred while fetching the products. Please try again.');
  }
}

function editProduct(index) {
  const product = products[index];
  const storeSelect = document.getElementById('store-options');
  
  document.getElementById('productId').value = product.ProductID;
  document.getElementById('name').value = product.ProductName;
  document.getElementById('price').value = product.Price;
  document.getElementById('stock').value = product.StockQuantity;
  document.getElementById('category').value = product.Category;
  document.getElementById('description').value = product.Description;

  if (product.StoreID) {
    storeSelect.value = product.StoreID;
  } else {
    storeSelect.value = "";
  }

  editIndex = index;
}


async function deleteProduct(index) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/deleteProduct/${products[index].ProductID}`);
    products.splice(index, 1);
    await renderProducts();
    alert("Product deleted successfully.");
  } catch (error) {
    alert('An error occurred while deleting the product. Please try again.');
  }
}

async function convertImageToBase64(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(imageFile);
  });
}

function resetForm() {
  form.reset();
  editIndex = null;
  document.getElementById('productId').value = '';
  ['nameError', 'imageError', 'priceError', 'storeIdError', 'stockError', 'categoryError', 'descriptionError']
    .forEach(hideError);
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', async () => {
  console.log("Loaded");
  await renderProducts();
  await renderStores();
});


async function renderStores() {
  try {
    const response = await axios.get(`${API_BASE_URL}/getStores`);
    if (response.data.length === 0) {
      return alert("No stores available");
    }
    stores = response.data;
    updateStore();
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    alert('An error occurred while fetching the stores. Please try again.');
  }
}

function updateStore() {
  const storeSelect = document.getElementById('store-options');
  storeSelect.innerHTML = '<option value="">Select a store</option>';

  stores.forEach(store => {
    const option = document.createElement('option');
    option.value = store.StoreID;
    option.textContent = store.StoreName;
    storeSelect.appendChild(option);
  });
}