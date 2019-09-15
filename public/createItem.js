const createEntry = function(e){
    const input1 = document.querySelector('#itemName');
    const input2 = document.querySelector('#itemQuantity');
    const input3 = document.querySelector('#itemID');
    const input4 = document.querySelector('#itemDescription');

    fetch('/createItem', {
        method: 'POST',
        body: JSON.stringify({itemName: input1.value,
                                    itemQuantity: input2.value,
                                    itemID: input3.value,
                                    itemDescription: input4.value}),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {window.location.href = 'main.html'})
};


window.onload = function() {
    const button1 = document.querySelector( '#createButton' );
    button1.onclick = createEntry;
};