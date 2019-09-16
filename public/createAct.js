const createAct = function(e){
    const input1 = document.querySelector('#usernameInput');
    const input2 = document.querySelector('#passwordInput');

    fetch('/createAct', {
        method: 'POST',
        body: JSON.stringify({username: input1.value,
            password: input2.value,
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {window.location.href = 'index.html'})
};


window.onload = function() {
    const button1 = document.querySelector( '#createButton' );
    button1.onclick = createAct;
};