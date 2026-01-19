 const form = document.querySelector("#registerForm");

let users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim(); // dodaj ime
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

     
    const exists = users.find(u => u.email === email);
    if (exists) {
        alert("Korisnik sa tim emailom već postoji!");
        return;
    }
    users.push({ name: name, email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Uspešna registracija!");
    window.location.href = "login.html";
});
