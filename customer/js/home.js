document.addEventListener("DOMContentLoaded", () => {
     const cartCount = document.querySelector(".cart-count");
     const authLink = document.getElementById("auth-link");

     // Check if user is logged in
     const user = sessionStorage.getItem("user");
     if (user) {
          authLink.innerHTML = `<a href="../index.html">My Account</a>`;
     }

     // Update cart count
     const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
     cartCount.textContent = cart.length;

     // Add to Cart functionality
     document.querySelectorAll(".add-to-cart").forEach((button) => {
          button.addEventListener("click", () => {
               const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
               };
               cart.push(product);
               sessionStorage.setItem("cart", JSON.stringify(cart));
               cartCount.textContent = cart.length;
               alert(`${product.name} added to your cart!`);
          });
     });
});
