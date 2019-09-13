const login = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault();

    const input1 = document.querySelector('#usernameInput');
    const input2 = document.querySelector('#passwordInput');

    console.log("memes");
  
    fetch( '/login', {
      method:'POST',
      body:JSON.stringify({ username: input1.value, password: input2.value }),
      headers: { 'Content-Type': 'application/json' } 
     })
    .then( res => res.json() )
    .then( response => {
      if(response.message === "user not found"){
        document.getElementById('errorLabel').className = "errorLabelVisible";
        document.getElementById('errorLabel').innerHTML = response.message;
      } else if(response.message === "incorrect password"){
        document.getElementById('errorLabel').className = "errorLabelVisible";
        document.getElementById('errorLabel').innerHTML = response.message;
      }else{
        document.getElementById('errorLabel').className = "errorLabelHidden";
        document.getElementById('errorLabel').innerHTML = "";
        console.log(response);
      }
    });
    
    return false;
};

window.onload = function() {
    const button1 = document.querySelector( '#loginButton' );
    button1.onclick = login;
  }