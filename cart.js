 const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

renderCart();

function renderCart() {
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Korpa je prazna</p>";
  } else {
    cartList.innerHTML = ``;

    let total = 0;

    cart.forEach((element) => {
      total += element.price * element.quantity;

      cartList.innerHTML += `
        
        <div class="cart-item">
        
        <img src="${element.thumbnail}" alt="${element.title}">

        <p><strong>${element.title}</strong></p>
        <p> Cena: ${element.price}</p>
        <div> Kolicina: <button data-id="${element.id}" class="minus">-</button>
        <input type="text" class="qty" value="${element.quantity}">
        <button data-id="${element.id}" class="plus">+</button>
        <button class="remove" data-id="${element.id}"> Delete</button>
        </div>
        </div>
        <hr>
        `;
    });

    const plusBtn = document.querySelectorAll(".plus");
    for (let elem of plusBtn) {
      elem.addEventListener("click", function () {
        let id = elem.dataset.id;

        changeQty(id, 1);
      });
    }

    const minusBtn = document.querySelectorAll(".minus");
    for (let elem of minusBtn) {
      elem.addEventListener("click", function () {
        let id = elem.dataset.id;

        changeQty(id, -1);
      });
    }

    const deleteBtn = document.querySelectorAll(".remove");
    for (let elem of deleteBtn) {
      elem.addEventListener("click", function () {
        let id = elem.dataset.id;
        cart = cart.filter((p) => p.id != id);
        saveCart();
      });
    }

    cartTotal.innerHTML = `Ukupna cena je <strong> ${total.toFixed(
      2
    )} $</strong> <button class="btnRmv">Remove All</button>`;

    document.querySelector(".btnRmv").addEventListener("click", function () {
      localStorage.removeItem("cart");
      cart=[];
      cartTotal.innerHTML=``;
      renderCart();
    });
  }
}

function changeQty(id, delta) {
  const item = cart.find((p) => p.id == id);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((p) => p.id != id);
  }

  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}













































































































































































































































































