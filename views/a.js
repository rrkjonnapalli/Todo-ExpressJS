var details = [ {
    user: 'tommy',
    title: 'Hello',
    description: 'Tom',
    time: 'King' },
  { 
    user: 'tommy',
    title: 'king',
    description: 'Ali babu',
    time: 'Dubri' },
  { 
    user: 'tommy',
    title: 'king',
    description: 'tom',
    time: 'hello' },
  {
    user: 'tommy',
    title: 'one',
    description: 'three',
    time: 'two' },
  {
    user: 'tommy',
    title: 'four',
    description: 'six',
    time: 'five' } ];
console.log(details);

function myDetails(){
	return details;
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

getJSON('https://127.0.0.1:3000/gettasks', function(err, data) {
  if (err != null) {
    alert('Something went wrong: ' + err);
  } else {
    alert('Your Json result is:  ' + data.result);
    result.innerText = data.result;
    console.log(data.result);
  }
});
