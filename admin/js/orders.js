
export async function fetchOrders() {
     try {
          const response = await fetch('http://localhost:3000/orders?_embed=product&_embed=user', {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const orders = await response.json();

          const orderTable = document.querySelector('#orderTable');
          orderTable.innerHTML = `
               <thead>
                    <tr>
                         <th>Order ID</th>
                         <th>User ID</th>
                         <th>Product ID</th>
                         <th>Status</th>
                         <th>Actions</th>
                    </tr>
               </thead>
               <tbody></tbody>
          `;

          const tableBody = orderTable.querySelector('tbody');
          orders.forEach((order) => {
               if (order.productId == null) {
                    return;
               }
               const row = document.createElement('tr');
               row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.userId}</td>
                    <td>${order.productId}</td>
                    <td>${order.status}</td>
                    <td>
                         <button class="edit-btn" data-id="${order.id}">Edit</button>
                         <button class="delete-btn" data-id="${order.id}">Delete</button>
                    </td>
               `;
               tableBody.appendChild(row);
          });

          orderTable.addEventListener('click', handleTableActions);
     } catch (error) {
          console.error('Error fetching orders:', error);
     }
}


export function handleTableActions(event) {
     const target = event.target;
     const orderId = target.getAttribute('data-id');

     if (target.classList.contains('edit-btn')) {
          handleEditOrder(orderId);
     }

     if (target.classList.contains('delete-btn')) {
          handleDeleteOrder(orderId);
     }
}


export async function handleEditOrder(orderId) {
     const newStatus = prompt('Enter new status for the order (e.g., "new", "processing", "shipped", "delivered"):');
     if (!newStatus) {
          alert('Edit canceled.');
          return;
     }

     try {

          const currentOrderResponse = await fetch(`http://localhost:3000/orders/${orderId}`);
          if (!currentOrderResponse.ok) throw new Error(`Failed to fetch current order. Status: ${currentOrderResponse.status}`);

          const currentOrder = await currentOrderResponse.json();


          const updatedOrder = { ...currentOrder, status: newStatus };

          const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(updatedOrder),
          });

          if (!response.ok) throw new Error(`Failed to update order. Status: ${response.status}`);

          alert('Order updated successfully!');
          fetchOrders();
     } catch (error) {
          console.error('Error updating order:', error);
          alert('Failed to update the order.');
     }
}


export async function handleDeleteOrder(orderId) {
     const confirmDelete = confirm('Are you sure you want to delete this order?');
     if (!confirmDelete) {
          return;
     }

     try {
          const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
               method: 'DELETE',
               headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error(`Failed to delete order. Status: ${response.status}`);

          alert('Order deleted successfully!');
          fetchOrders();
     } catch (error) {
          console.error('Error deleting order:', error);
          alert('Failed to delete the order.');
     }
}


fetchOrders();
