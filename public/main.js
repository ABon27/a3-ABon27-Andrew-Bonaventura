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
        html+="<td> <input class='button-primary'  type='button' value='View'></td>";
        html+="<td> <input class='button-primary'  type='button' value='Edit'></td>";
        html+="<td> <input class='button-primary'  type='button' value='Delete'></td>";

        html+="</tr>";

    }
    document.getElementById('tableBody').innerHTML = html;
};

window.onload = function() {
    const button1 = document.querySelector( '#addButton' );
    button1.onclick = addEntry;
    getTable();
};