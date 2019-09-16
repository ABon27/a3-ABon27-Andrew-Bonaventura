const addEntry = function(e){
    e.preventDefault()
    window.location.href = 'createItem.html';
};

const getTable = function(){
  fetch('/getTable', {
      method: 'GET'
  })
      .then(function( response ) {
          response.json().then((responseData) => {
            console.log(responseData);
            makeTable(responseData);
          })
      })
};

const makeTable = function(data){
    console.log(data[0][1]);
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html+="<tr>";
        html+="<td>"+data[i][0]+"</td>";
        html+="<td>"+data[i][1]+"</td>";
        html+="<td>"+data[i][2]+"</td>";
        let des = {description: data[i][3].toString(), id: data[i][4]};
        des = JSON.stringify(des);
        html+="<td> <input class='button-primary'  type='button' value='View' onClick='viewDes(" + des + ")'></td>";
        html+="<td> <input class='button-primary'  type='button' value='Edit' onClick='editRec(" + des + ")'></td>";
        html+="<td> <input class='button-primary'  type='button' value='Delete' onClick='deleteRec(" + des + ")'></td>";

        html+="</tr>";

    }
    document.getElementById('tableBody').innerHTML = html;
};

const viewDes = function(des){
    alert(des.description);
};

const editRec = function(des){
    fetch('/editSwitch', {
        method: 'POST',
        body: JSON.stringify({id: des.id}),
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        window.location.href = 'editItem.html';
    });
};

const deleteRec = function(des){
    fetch('/deleteItem', {
        method: 'POST',
        body: JSON.stringify({id: des.id}),
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        window.location.href = 'main.html';
    });
};

window.onload = function() {
    const button1 = document.querySelector( '#addButton' );
    button1.onclick = addEntry;
    getTable();
};