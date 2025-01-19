export const getLoggedInUser = () => {
     return JSON.parse(sessionStorage.getItem('user'));

}
export const logout = () => {
     sessionStorage.removeItem('user');
     window.location = '/login.html';
}


export const redirectLoggedInUser = () => {
     const loggedInUser = getLoggedInUser();
     if (!loggedInUser) {
          return;
     }
     if (loggedInUser.roleId === "1") {
          window.location = '/admin';
          return;
     }
     if (loggedInUser.roleId === "2") {
          window.location = '/seller';
          return;
     }
     if (loggedInUser.roleId === "3") {
          window.location = '/customer';
          return;
     }
};
// Guards and Gates for authorization and authentication:
export const guard = (role) => {
     const loggedInUser = getLoggedInUser();
     if (!loggedInUser) {
          window.location = '/login.html';
          return;
     }
     if (role === "admin") {
          if (loggedInUser.roleId !== "1") {
               logout();
               return;

          }
          return;
     }
     if (role === "seller") {
          if (loggedInUser.roleId !== "2") {
               logout();
               return;

          }
          return;
     }
     if (role === "customer") {
          if (loggedInUser.roleId !== "3") {
               logout();
               return;

          }
          return;
     }
}


// some testing code 
