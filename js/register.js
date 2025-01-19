const formContainer = document.querySelector('#formContainer');


const form = document.createElement('form');
form.setAttribute('autocomplete', 'off');
form.setAttribute('class', 'appForm clearfix');
form.setAttribute('id', 'registerform');
form.setAttribute('method', 'post');
form.setAttribute('enctype', 'application/x-www-form-urlencoded');


const fieldset = document.createElement('fieldset');
form.appendChild(fieldset);


const legend = document.createElement('legend');
legend.textContent = ` Sign Up Time Is Now!! `;
fieldset.appendChild(legend);

function createInputWrapper(labelText, inputType, inputId, maxLength = '', wrapperClass = 'input_wrapper') {
     const wrapper = document.createElement('div');
     wrapper.className = `${wrapperClass} n20 border padding`;

     const label = document.createElement('label');
     label.textContent = labelText;
     wrapper.appendChild(label);

     const input = document.createElement('input');
     input.setAttribute('required', '');
     input.setAttribute('type', inputType);
     input.setAttribute('id', inputId);
     input.setAttribute('name', inputId);
     if (maxLength) input.setAttribute('maxlength', maxLength);
     wrapper.appendChild(input);

     return wrapper;
}

fieldset.appendChild(createInputWrapper('Username', 'text', 'username', 30));
fieldset.appendChild(createInputWrapper('Email', 'email', 'usrmail', 40));
fieldset.appendChild(createInputWrapper('Phone Number', 'text', 'usrphone'));
fieldset.appendChild(createInputWrapper('Password', 'password', 'usrpass'));

const selectWrapper = document.createElement('div');
selectWrapper.className = 'input_wrapper_other padding n20 select';

const select = document.createElement('select');
select.setAttribute('required', '');
select.setAttribute('name', 'role');
select.setAttribute('id', 'role');

const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = 'Select Role';
select.appendChild(defaultOption);

const roles = [
     { value: '3', text: 'Customer' },
     { value: '2', text: 'Seller' }
];
roles.forEach(role => {
     const option = document.createElement('option');
     option.value = role.value;
     option.textContent = role.text;
     select.appendChild(option);
});

selectWrapper.appendChild(select);
fieldset.appendChild(selectWrapper);

const submitButton = document.createElement('input');
submitButton.className = 'no_float';
submitButton.setAttribute('type', 'submit');
submitButton.setAttribute('id', 'sign_up');
submitButton.setAttribute('value', 'Sign Up');
fieldset.appendChild(submitButton);

formContainer.appendChild(form);

form.addEventListener('submit', (event) => {
     event.preventDefault();

     const username = document.querySelector('#username');
     const usrmail = document.querySelector('#usrmail');
     const usrpass = document.querySelector('#usrpass');
     const usrrole = document.querySelector('#role');
     const usrphone = document.querySelector('#usrphone');

     let roleId = parseInt(usrrole?.value, 10);
     if (roleId !== 3 && roleId !== 2) {
          roleId = 3;
     }

     if (username.value === '' || usrmail.value === '' || usrpass.value === '') {
          alert('no way to pass!!');
          return;
     }

     const postData = {
          name: username.value,
          email: usrmail.value,
          password: usrpass.value,
          phoneNumber: usrphone.value.toString(),
          is_deleted: false,
          roleId: roleId.toString(),
     };

     fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
     })
          .then(response => {
               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }
               return response.json();
          })
          .then(data => {
               console.log('Success:', data);
               window.location = '/login.html';
          })
          .catch(error => {
               console.error('Error:', error);
          });
});
