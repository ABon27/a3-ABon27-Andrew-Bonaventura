const login = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault();

    const input1 = document.querySelector('#usernameInput');
    const input2 = document.querySelector('#passwordInput');

  
    fetch( '/login', {
      method:'POST',
      body:JSON.stringify({ username: input1.value, password: input2.value }),
      headers: { 'Content-Type': 'application/json' } 
     })
        .then(res => {
            window.location.href = res.url;
        });

    
    return false;
};


const createAct = function(e){
    e.preventDefault();
    window.location.href = 'views/createAct.html';
}

window.onload = function() {
    const button1 = document.querySelector( '#loginButton' );
    const button2 = document.querySelector('#createActButton');
    button1.onclick = login;
    button2.onclick = createAct;
  };
