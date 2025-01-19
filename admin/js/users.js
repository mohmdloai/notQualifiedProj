
let users = [];
export async function fetchUsers() {
     try {
          const response = await fetch('http://localhost:3000/users?_embed=role', {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          users = await response.json();

          const userTableBody = document.querySelector('#userTableBody');
          userTableBody.innerHTML = '';





          users.forEach(user => {
               if (user.is_deleted) {
                    return;
               }
               const row = document.createElement('tr');
               const roleName = user.role.name;
               let actionsBtns = user.roleId !== "1" ? `
               <td>
                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
               </td>
          ` : '';

               row.innerHTML = `
               <td>${user.id}</td>
               <td>${user.name}</td>
               <td>${user.email}</td>
               <td>${roleName}</td>
               ${actionsBtns}
          `;
               userTableBody.appendChild(row);
          });

          addEventListeners();
     } catch (error) {
          console.error('Error fetching users:', error);
     }
}


function addEventListeners() {
     const userTableBody = document.querySelector('#userTableBody');

     userTableBody.addEventListener('click', async (event) => {
          const target = event.target;
          const userId = target.getAttribute('data-id');

          if (target.classList.contains('edit-btn')) {
               handleEdit(target, userId);
          } else if (target.classList.contains('delete-btn')) {
               await handleDelete(userId);
          }
     });
}


function handleEdit(target, userId) {
     const row = target.closest('tr');
     let originalData = users.find((user) => user.id == target.getAttribute('data-id'));



     row.innerHTML = `
     <td>${originalData.id}</td>
     <td><input type="text" value="${originalData.name}" /></td>
     <td><input type="email" value="${originalData.email}" /></td>
     <td>
          <select>
               <option value="2" ${originalData.roleId === "2" ? 'selected' : ''}>seller</option>
               <option value="3" ${originalData.roleId === "3" ? 'selected' : ''}>customer</option>
          </select>
     </td>
     <td>
          <button class="save-btn" data-id="${userId}">Save</button>
          <button class="cancel-btn" data-id="${userId}">Cancel</button>
     </td>
     `;


     const saveBtn = row.querySelector('.save-btn');
     const cancelBtn = row.querySelector('.cancel-btn');

     saveBtn.addEventListener('click', async () => {
          const inputs = row.querySelectorAll('input, select');
          let userData = users.find((user) => user.id == saveBtn.getAttribute('data-id'));
          delete userData.role;


          userData.name = inputs[0].value;
          userData.email = inputs[1].value;
          userData.roleId = parseInt(inputs[2].value).toString();

          try {
               await fetch(`http://localhost:3000/users/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
               });

               alert('User updated successfully!');
               fetchUsers();
          } catch (error) {
               console.error('Error updating user:', error);
          }
     });

     cancelBtn.addEventListener('click', () => {
          fetchUsers();
     });
}


async function handleDelete(userId) {
     const confirmDelete = confirm(`Are you sure you want to delete user ID: ${userId}?`);
     if (!confirmDelete) return;
     let userData = users.find(user => user.id == userId);
     userData.is_deleted = true;
     try {
          await fetch(`http://localhost:3000/users/${userId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(userData),
          });

          alert('User deleted successfully!');
          fetchUsers();
     } catch (error) {
          console.error('Error deleting user:', error);
     }
}


fetchUsers();
