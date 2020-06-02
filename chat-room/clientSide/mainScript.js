// fetch('http://example.com/movies.json')
//   .then(response => response.json())
//   .then(data => console.log(data));

document.getElementById("chat-form").addEventListener("submit", sendMessage);
const INPUT_LINE = document.getElementById("input-line");

function sendMessage(event) {
  event.preventDefault();
  console.log(INPUT_LINE.value);
  INPUT_LINE.value ='';
}