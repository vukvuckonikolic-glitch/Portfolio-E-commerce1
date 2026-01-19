 const email = document.querySelector("#email");
const password = document.querySelector("#password");
const msg = document.querySelector("#msg");
const form = document.querySelector("#loginForm");
 
let users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const em = email.value.trim();
    const ps = password.value.trim();

     
    const user = users.find(u => u.email === em && u.password === ps);

    if (user) {
        localStorage.setItem("user", JSON.stringify(user)); 
        window.location.href = "home.html";
    } else {
        msg.textContent = "Pogrešan email ili password";
        msg.style.color = "red";
    }
});
