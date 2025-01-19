// Import necessary modules
import { getLoggedInUser, guard } from "../js/script.js";

// Restrict access to sellers
guard('seller');

// Array to hold products
let products = [];

// Fetch products associated with the logged-in seller
export async function fetchProducts() {
     let loggedInSeller = getLoggedInUser();

     try {
          const response = await fetch(`http://localhost:3000/products?userId=${loggedInSeller.id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          products = await response.json();
          renderProductsTable();
     } catch (error) {
          console.error('Error fetching products:', error);
     }
}

// Render the products table
function renderProductsTable() {
     const productTable = document.querySelector('#productTable');
     productTable.innerHTML = `
     <thead>
          <tr>
               <th>ID</th>
               <th>Image</th>
               <th>Name</th>
               <th>Approved</th>
               <th>Price</th>
               <th>Category</th>
               <th>Actions</th>
          </tr>
     </thead>
     <tbody>
          ${products
               .filter(product => !product.is_deleted && product.userId)
               .map(product => `
               <tr>
                    <td>${product.id}</td>
                    <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
                    <td>${product.name}</td>
                    <td>${product.isApproved ? 'Yes' : 'No'}</td>
                    <td>${product.price}</td>
                    <td>${product.category}</td>
                    <td>
                         <button class="edit-btn" data-id="${product.id}">Edit</button>
                         <button class="delete-btn" data-id="${product.id}">Delete</button>
                    </td>
               </tr>
               `).join('')}
     </tbody>
`;
}

// Add a new product
document.querySelector('#addProductBtn').addEventListener('click', () => {
     if (document.querySelector('.new-product-row')) return; // Prevent multiple new rows

     const newRow = document.createElement('tr');
     newRow.classList.add('new-product-row');
     newRow.innerHTML = `
     <td>--</td>
     <td><input type="text" placeholder="Image Path (e.g., /resourcesandassets/images/example.png)" id="newImage" /></td>
     <td><input type="text" placeholder="Product Name" id="newName" /></td>
     <td></td>
     <td><input type="number" placeholder="Price" id="newPrice" /></td>
     <td><input type="text" placeholder="Category" id="newCategory" /></td>
     <td>
          <button class="save-new-btn">Save</button>
          <button class="cancel-new-btn">Cancel</button>
     </td>
`;

     const tableBody = document.querySelector('#productTable tbody');
     tableBody.insertBefore(newRow, tableBody.firstChild);

     newRow.querySelector('.save-new-btn').addEventListener('click', saveNewProduct);
     newRow.querySelector('.cancel-new-btn').addEventListener('click', () => newRow.remove());
});

// Save new product
async function saveNewProduct() {
     const name = document.querySelector('#newName').value.trim();
     const image = document.querySelector('#newImage').value.trim();
     const price = parseFloat(document.querySelector('#newPrice').value);
     const category = document.querySelector('#newCategory').value.trim();

     if (!name || isNaN(price) || !category || !image) {
          alert('All fields are required!');
          return;
     }

     try {
          const newProduct = {
               image,
               name,
               isApproved: false,
               price,
               category,
               userId: getLoggedInUser().id,
          };

          const response = await fetch(`http://localhost:3000/products`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(newProduct),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          products.push(await response.json());
          alert('Product added successfully!');
          renderProductsTable();
     } catch (error) {
          console.error('Error adding product:', error);
     }
}

// Handle table actions
document.querySelector('#productTable').addEventListener('click', async event => {
     const target = event.target;
     const productId = target.getAttribute('data-id');
     const productData = products.find(product => product.id == productId);

     if (target.classList.contains('delete-btn')) {
          const confirmDelete = confirm('Are you sure you want to delete this product?');
          if (!confirmDelete) return;

          try {
               productData.is_deleted = true;
               await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
               });

               alert('Product deleted successfully!');
               renderProductsTable();
          } catch (error) {
               console.error('Error deleting product:', error);
          }
     }

     if (target.classList.contains('edit-btn')) {
          const row = target.closest('tr');
          row.innerHTML = `
          <td>${productData.id}</td>
          <td><input type="text" value="${productData.image}" /></td>
          <td><input type="text" value="${productData.name}" /></td>
          <td></td>
          <td><input type="number" value="${productData.price}" /></td>
          <td><input type="text" value="${productData.category}" /></td>
          <td>
               <button class="save-btn" data-id="${productId}">Save</button>
               <button class="cancel-btn" data-id="${productId}">Cancel</button>
          </td>
     `;
     }

     if (target.classList.contains('save-btn')) {
          const row = target.closest('tr');
          const inputs = row.querySelectorAll('input');

          productData.image = inputs[0].value;
          productData.name = inputs[1].value;
          productData.price = parseFloat(inputs[2].value);
          productData.category = inputs[3].value;

          try {
               await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
               });

               alert('Product updated successfully!');
               renderProductsTable();
          } catch (error) {
               console.error('Error updating product:', error);
          }
     }

     if (target.classList.contains('cancel-btn')) {
          renderProductsTable(); // Reload original table row
     }
});

// Initial fetch of products
fetchProducts();
