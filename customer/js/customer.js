document.addEventListener("DOMContentLoaded", () => {
     const cartItemsContainer = document.getElementById("cart-items");
     const totalElement = document.querySelector(".total");
     let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

     const renderCart = () => {
          cartItemsContainer.innerHTML = "";
          let total = 0;
          cart.forEach((item, index) => {
               const itemElement = document.createElement("div");
               itemElement.classList.add("cart-item");
               itemElement.innerHTML = `
                    <div>
                         <h3>${item.name}</h3>
                         <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button data-index="${index}">Remove</button>
               `;
               cartItemsContainer.appendChild(itemElement);
               total += item.price;
          });
          totalElement.textContent = `Total: $${total.toFixed(2)}`;
     };

     cartItemsContainer.addEventListener("click", (e) => {
          if (e.target.tagName === "BUTTON") {
               const index = e.target.dataset.index;
               cart.splice(index, 1);
               sessionStorage.setItem("cart", JSON.stringify(cart));
               renderCart();
          }
     });

     renderCart();
});
