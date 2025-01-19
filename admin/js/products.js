
let products = [];
export async function fetchProducts() {
     try {
          const response = await fetch('http://localhost:3000/products');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          products = await response.json();

          const productTable = document.querySelector('#productTable');
          productTable.innerHTML = `
          <thead>
               <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>User ID</th>
                    <th>Approved</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
               </tr>
          </thead>
          <tbody></tbody>
     `;

          const tableBody = productTable.querySelector('tbody');

          products.forEach((product) => {
               if (!product.userId || product.is_deleted) {
                    return;
               }

               const row = document.createElement('tr');
               row.innerHTML = `
               <td>${product.id}</td>
               <td>${product.name}</td>
               <td>${product.userId}</td>
               <td>${product.isApproved ? 'Yes' : 'No'}</td>
               <td>${product.price}</td>
               <td>${product.category}</td>
               <td>
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
               </td>
          `;
               tableBody.appendChild(row);
          });

          productTable.addEventListener('click', handleTableActions);
     } catch (error) {
          console.error('Error fetching products:', error);
     }
}


document.querySelector('#addProductBtn').addEventListener('click', () => {
     const tableBody = document.querySelector('#productTable tbody');


     if (document.querySelector('.new-product-row')) return;

     const newRow = document.createElement('tr');
     newRow.classList.add('new-product-row');
     newRow.innerHTML = `
     <td>--</td>
     <td><input type="text" placeholder="Product Name" id="newName" /></td>
     <td><input type="number" placeholder="User ID" id="newUserId" /></td>
     <td>
          <select id="newApproved">
               <option value="true">Yes</option>
               <option value="false">No</option>
          </select>
     </td>
     <td><input type="number" placeholder="Price" id="newPrice" /></td>
     <td><input type="text" placeholder="Category" id="newCategory" /></td>
     <td>
          <button class="save-new-btn">Save</button>
          <button class="cancel-new-btn">Cancel</button>
     </td>
`;
     tableBody.insertBefore(newRow, tableBody.firstChild);


     newRow.querySelector('.save-new-btn').addEventListener('click', saveNewProduct);
     newRow.querySelector('.cancel-new-btn').addEventListener('click', () => newRow.remove());
});


async function saveNewProduct() {
     const name = document.querySelector('#newName').value.trim();
     const userId = parseInt(document.querySelector('#newUserId').value, 10);
     const isApproved = document.querySelector('#newApproved').value === 'true';
     const price = (parseFloat(document.querySelector('#newPrice').value)).toString();
     const category = document.querySelector('#newCategory').value.trim();

     if (!name || isNaN(userId) || isNaN(price) || !category) {
          alert('All fields are required!');
          return;
     }

     try {
          const response = await fetch('http://localhost:3000/products', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ name, userId, isApproved: isApproved, price, category }),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          alert('Product added successfully!');
          fetchProducts();
     } catch (error) {
          console.error('Error adding product:', error);
     }
}


async function handleTableActions(event) {
     const target = event.target;
     const productId = target.getAttribute('data-id');
     let originalData = products.find(product => product.id == target.getAttribute('data-id'));


     if (target.classList.contains('edit-btn')) {
          const row = target.closest('tr');
          row.innerHTML = `
          <td>${originalData.id}</td>
          <td><input type="text" value="${originalData.name}" /></td>
          <td></td>
          <td>
               <select>
                    <option value="true" ${originalData.isApproved ? 'selected' : ''}>Yes</option>
                    <option value="false" ${!originalData.isApproved ? 'selected' : ''}>No</option>
               </select>
          </td>
          <td><input type="number" value="${originalData.price}" /></td>
          <td><input type="text" value="${originalData.category}" /></td>
          <td>
               <button class="save-btn" data-id="${target.getAttribute('data-id')}">Save</button>
               <button class="cancel-btn" data-id="${target.getAttribute('data-id')}">Cancel</button>
          </td>
     `;
     }

     if (target.classList.contains('save-btn')) {
          const row = target.closest('tr');
          const inputs = row.querySelectorAll('input, select');
          originalData.name = inputs[0].value;
          originalData.isApproved = inputs[1].value == 'true' ? true : false;

          originalData.price = parseFloat(inputs[2].value);
          originalData.category = inputs[3].value;

          try {
               await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(originalData),
               });

               alert('Product updated successfully!');
               fetchProducts();
          } catch (error) {
               console.error('Error updating product:', error);
          }
     }

     if (target.classList.contains('cancel-btn')) {
          fetchProducts();
     }

     if (target.classList.contains('delete-btn')) {
          const confirmDelete = confirm('Are you sure you want to delete this product?');
          if (!confirmDelete) return;
          try {
               if (confirmDelete) {

                    let productData = products.find(product => product.id == productId);
                    productData.is_deleted = true;
                    await fetch(`http://localhost:3000/products/${productId}`, {
                         method: 'PUT',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(productData),
                    });

                    alert('Product deleted successfully!');
                    fetchProducts();
               }
          } catch (error) {
               console.error('Error deleting product:', error);
          }
     }
}


fetchProducts();
