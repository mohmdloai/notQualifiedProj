export function fadeIn(element, duration) {
     element.style.display = 'block';
     element.style.opacity = 0;

     let opacity = 0;
     const step = 100 / duration;
     const interval = setInterval(() => {
          opacity += step;
          element.style.opacity = opacity / 100;
          if (opacity >= 100) {
               clearInterval(interval);
          }
     }, 10);
}
export function fadeOut(element, duration) {
     let opacity = 100;
     const step = 100 / duration;
     const interval = setInterval(() => {
          opacity -= step;
          element.style.opacity = opacity / 100;
          if (opacity <= 0) {
               clearInterval(interval);
               element.style.display = 'none';
          }
     }, 10);
}


window.addEventListener('load', () => {
     fadeIn(formContainer, 1000);
});

form.addEventListener('submit', (event) => {
     event.preventDefault();
     fadeOut(formContainer, 1000);
});

window.addEventListener('load', () => {
     fadeIn(logInContainer, 1000);
});


