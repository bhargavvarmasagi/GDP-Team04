let stores = [];
let editIndex = null;

const form = document.getElementById('storeForm');
const productTable = document.getElementById('storeTable').getElementsByTagName('tbody')[0];
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

  if (!formObj.StoreName) {
    showError('nameError', 'Store name is required.');
    isValid = false;
  } else hideError('nameError');

  if (!formObj.Location ) {
    showError('locationError', 'Please enter a valid price.');
    isValid = false;
  } else hideError('locationError');

  if (!formObj.InventoryStatus) {
    showError('statusError', 'Inventory Status is required.');
    isValid = false;
  } else hideError('statusError');

  if (!formObj.ContactPhone) {
    showError('phoneError', 'Please enter a valid store contact phone.');
    isValid = false;
  } else hideError('phoneError');

  if (!formObj.ContactEmail) {
    showError('emailError', 'Email is required.');
    isValid = false;
  } else hideError('emailError');


  if (!isValid) {
    submitButton.disabled = false;
    return;
  }

  try {
    const store = {
      id: document.getElementById('storeId').value || null,
      StoreName : formObj.StoreName,
      Location : formObj.Location,
      InventoryStatus : formObj.InventoryStatus,
      ContactPhone : formObj.ContactPhone,
      ContactEmail: formObj.ContactEmail
    };

    console.log('stores ', store);

    if (editIndex !== null) {
      await axios.put(`${API_BASE_URL}/updateStore/${stores[editIndex].StoreID}`, JSON.stringify(store),  {
        headers: {
            'Content-Type': 'application/json'
        },
    });
      stores[editIndex] = store;
      editIndex = null;
    } else {
      const response = await axios.post(`${API_BASE_URL}/addStore`, store, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
      stores.push(response.data);
    }

    await renderStores();
    resetForm();
  } catch (error) {
    console.error('Failed to save store:', error);
    alert('An error occurred while saving the store. Please try again.');
  } finally {
    submitButton.disabled = false;
  }
});

async function renderStores() {
  try {
    const response = await axios.get(`${API_BASE_URL}/getStores`);
    stores = response.data;
    productTable.innerHTML = '';
    if(stores.length == 0){
        return alert("Empty stores")
    }
    stores.forEach((store, index) => {
      const row = productTable.insertRow();
      row.innerHTML = `
        <td>${store.StoreName}</td>
        <td>${store.Location}</td>
        <td>${store.InventoryStatus}</td>
        <td>${store.ContactPhone}</td>
        <td>${store.ContactEmail}</td>
        <td>5</td>
        <td>10</td>
        <td class="actions">
          <button onclick="editStore(${index})">Edit</button>
          <button onclick="deleteStore(${index})">Delete</button>
        </td>
      `;
    });
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    alert('An error occurred while fetching the stores. Please try again.');
  }
}

function editStore(index) {
  const store = stores[index];
  document.getElementById('storeId').value = store.StoreID;
  document.getElementById('name').value = store.StoreName;
  document.getElementById('location').value = store.Location;
  document.getElementById('status').value = store.InventoryStatus;
  document.getElementById('phone').value = store.ContactPhone;
  document.getElementById('email').value = store.ContactEmail;
  
  editIndex = index;
}

async function deleteStore(index) {
  const confirmDelete = confirm("Are you sure you want to delete this store?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/deleteStore/${stores[index].StoreID}`);
    stores.splice(index, 1);
    await renderStores();
    alert("Store deleted successfully.");
  } catch (error) {
    alert('An error occurred while deleting the store. Please try again.');
  }
}

function resetForm() {
  form.reset();
  editIndex = null;
  document.getElementById('storeId').value = '';
  ['nameError', 'locationError', 'statusError', 'phoneError', 'emailError']
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
  await renderStores();
});
