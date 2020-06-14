const INPUT_LINE = document.getElementById("input-line");

document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("login-button").addEventListener("click", login);

function login(event) {
    event.preventDefault();    
    sessionStorage.setItem('name', INPUT_LINE.value);
    window.location.replace("../mainPage/main.html");
}