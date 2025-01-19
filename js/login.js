import { redirectLoggedInUser } from "./script.js";

const signInButton = document.querySelector('#sign_in');
const messageContainer = document.getElementById('message-container');

const showMessage = (message, type = 'error') => {
     messageContainer.innerHTML = `<p class="message ${type}">${message}</p>`;
};

redirectLoggedInUser();

signInButton.addEventListener('click', (event) => {
     event.preventDefault();

     const usrmail = document.querySelector('#usrmail');
     const usrpass = document.querySelector('#usrpass');

     if (usrmail.value === '' || usrpass.value === '') {
          showMessage('Please fill in all fields.', 'error');
          return;
     }

     const url = new URL('http://localhost:3000/users');
     url.searchParams.append('email', usrmail.value);
     url.searchParams.append('password', usrpass.value);

     fetch(url, {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json',
          },
     })
          .then(response => {
               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }
               return response.json();
          })
          .then(data => {
               if (!data.length) {
                    showMessage('Wrong User Credentials.', 'error');
                    return;
               }
               const user = data[0];
               sessionStorage.setItem('user', JSON.stringify({ id: user.id, roleId: user.roleId }));
               redirectLoggedInUser();
          })
          .catch(error => {
               console.error('Error:', error);
               showMessage('An error occurred. Please try again later.', 'error');
          });
});