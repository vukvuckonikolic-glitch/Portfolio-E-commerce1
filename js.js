if(!localStorage.getItem("user")){
    window.location.href="login.html";
}


let allProducts=[];
let filteredProducts=[];
let currentPage=1;
const perPage=10;



const productList=document.querySelector("#product-list");
const category=document.querySelector("#categoryFilters");
const sortSelect=document.querySelector("#sortSelect");
const pretraga=document.querySelector("#pretraga");
const prethodna=document.querySelector(".prethodna");
const sledeca=document.querySelector(".sledeca");
const pageInfo=document.querySelector("#page-info");
const firstPage=document.querySelector("#firstPage");
const lastPage=document.querySelector("#lastPage");
const spinner=document.querySelector(".spinner");
const korpa=document.querySelector(".cart-link");
const lgout=document.querySelector(".lgout");

korpa.addEventListener("drop",function(event){
    drop(event);
})
korpa.addEventListener("dragover",function(event){
    allowDrop(event);
})


document.addEventListener("DOMContentLoaded",()=>{

    fetchProduct();
    fetchCategories();
    updateCart(); 

    pretraga.addEventListener("keyup",function(){
        applyFilters();
    });
    sortSelect.addEventListener("change",function(){

        applyFilters();

    })
    sledeca.addEventListener("click",function(){
        currentPage++;
        renderProducts();
        updatePagination();
    })
    prethodna.addEventListener("click", function(){
        currentPage--;
        renderProducts();
        updatePagination();
    })
    firstPage.addEventListener("click",function(){
        currentPage=1;
        renderProducts();
        updatePagination();
    })
    lastPage.addEventListener("click",function(){
        currentPage=Math.ceil(filteredProducts.length/perPage);
        renderProducts();
        updatePagination();
    
})
})

lgout.addEventListener("click",function(){
    localStorage.removeItem("user");
    window.location.href="login.html";
})
function fetchProduct(){
    let xhr=new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function(){

        if(this.readyState==4 && this.status==200){
            const obj=JSON.parse(this.responseText);
            allProducts=obj.products;
            applyFilters();
        }
    })
    xhr.open("GET","https://dummyjson.com/products?limit=100")
    xhr.send();
}

function updatePagination(){
    const totalPages=Math.ceil(filteredProducts.length/perPage);
    pageInfo.textContent=`${currentPage} / ${totalPages}`;
    prethodna.disabled=currentPage===1 || totalPages===0;
    sledeca.disabled=currentPage===totalPages || totalPages===0;

    renderPagenNumber();
}

function renderPagenNumber(){

    pageInfo.innerHTML="";
    const totalPages=Math.ceil(filteredProducts.length/perPage);
    for(let i=1; i<=totalPages; i++){
        const button=document.createElement("button");
        button.textContent=i;
        button.className="page-btn";

        if(i==currentPage){
            button.classList.add("active");

        }
        button.addEventListener("click",function(){

            currentPage=i;
            renderProducts();
            updatePagination();
        })
        pageInfo.appendChild(button);
    }
}
function applyFilters(){
    
    let temp=[...allProducts];

    temp=filterSearch(temp);
    temp=filterCategories(temp);
    temp=sortProduct(temp);
    filteredProducts=temp;
    currentPage=1;

    renderProducts();
}

function renderProducts(){                        
    spinner.classList.remove("hidden");
    spinner.classList.add("show")

      if (filteredProducts == 0) {
    productList.textContent = "Nema artikla!!";
    return;
  }

    productList.classList.remove("show")
    productList.classList.add("hidden")
     

    productList.innerHTML=``;

   
requestAnimationFrame( ()=>{
    const startIndex=(currentPage-1) * perPage;

    
    const pagination=filteredProducts.slice(startIndex,startIndex+perPage);

if(currentPage > 1){
    prethodna.style.display="inline-block";
}else{
    prethodna.style.display="none";
}

    pagination.forEach((elem)=>{

        const productDiv=document.createElement("div");
        productDiv.classList.add("product");
productDiv.setAttribute("draggable", true);
productDiv.addEventListener("dragstart",function(e){ 
    drag(e,elem)
});

        productDiv.addEventListener("click",()=>{

            window.location.href=`productcart.html?id=${elem.id}`;
        })

        const oldPrice=(
            elem.price * (1 + elem.discountPercentage / 100)
        ).toFixed(2);
         productDiv.innerHTML = `
    <span class="ocena">⭐ ${elem.rating}</span>
    <span class="popust">-${elem.discountPercentage}%</span>

    <img src="${elem.thumbnail}" alt="${elem.title}">

    <p class="naslov">${elem.title}</p>

    <div class="ceneWrap">
        <span class="cena">${elem.price}$</span>
        <span class="oldCena">${oldPrice}$</span>
    </div>

    <p class="dostava">${elem.shippingInformation}</p>

    <button class="btnDodaj">Add to Cart</button>
`;
        productDiv.querySelector(".btnDodaj").addEventListener("click",function(e){
            e.stopPropagation();
            addToCart(elem);
        })
    productList.appendChild(productDiv)
    })
     setTimeout(() => {
      spinner.classList.remove("show");
      spinner.classList.add("hidden");
      productList.classList.remove("hidden");
      productList.classList.add("show");
      pagg.classList.remove("hidden");
      pagg.classList.add("show");
    }, 300);
})
}
function addToCart(elem){
    const cart=getCart();

    const exiting=cart.find(item=> item.id===elem.id);
    if(exiting){
        exiting.quantity++;
    }else{

        cart.push({

            id:elem.id,
            title:elem.title,
            price:elem.price,
            thumbnail:elem.thumbnail,
            quantity:1,

        })
    }
    setCart(cart);
    updateCart();
}

 function fetchCategories(){


    let xhr=new XMLHttpRequest();


    xhr.addEventListener("readystatechange",function(){

try{
if(this.readyState==4 && this.status==200){
        let obj=JSON.parse(this.responseText);
        allProducts=obj.products;
        renderCategory(obj);
        console.log(allProducts)
}
}catch(err) {
    console.log("err" + err)
}
    })
 
    xhr.open("GET","https://dummyjson.com/products/categories")
    xhr.send();

 }
 function renderCategory(data){
    data.forEach((elem)=>{
        const div=document.createElement("div");


        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.value=elem.slug;
        checkbox.classList.add("cheks")

        const label=document.createElement("label");
        label.classList="category-item";
        label.textContent=elem.name;

        div.appendChild(checkbox);
        div.appendChild(label);
        category.appendChild(div)

        checkbox.addEventListener("change",applyFilters)
    })
 }

 function filterCategories(data){
    const checkirani=document.querySelectorAll(".cheks:checked");

    if(checkirani.length > 0) {
    
        const selected=Array.from(checkirani).map(elem=>elem.value);

        data=data.filter(product=>selected.includes(product.category))


    } 
    return data;


 }
 
 function filterSearch(data){

    const searchValue=document.querySelector("#pretraga").value.trim();

    if(searchValue){

        const filter=data.filter(elem => elem.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        return filter;
    }
    return data
 }

 function sortProduct(data){
    
    const value=sortSelect.value;
    if(value=="1"){
        data.sort((a,b)=>a.price - b.price);
    }
    if(value=="2"){
        data.sort((a,b)=>b.price - a.price);
    }
    if(value=="3"){
        data.sort((a,b)=>b.rating - a.rating)
    }
    if(value=="4"){
        data.sort((a,b)=>b.discountPercentage - a.discountPercentage)
    }
    if(value=="5"){
        data.sort((a,b)=>a.discountPercentage - b.discountPercentage)
    }
    return data;
 }
 const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", function () {
  menu.classList.toggle("active");
});

 
function getCart(){

    return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart ){

    localStorage.setItem("cart",JSON.stringify(cart));
}

function updateCart(){

    const cart=getCart();
    const total=cart.length;
    document.querySelector("#cart-count").textContent=total;
}

function drag(event,product){

    const product1=JSON.stringify(product);
    event.dataTransfer.setData("product",product1)
}


function allowDrop(e){
    e.preventDefault();

}

function drop(e){
    e.preventDefault();

    let product=e.dataTransfer.geData("product");
    addToCart(JSON.parse(product));
}
 const toggleBtn = document.getElementById("catToggle");
const catBox = document.getElementById("categoryFilters");
 
toggleBtn.addEventListener("click", () => {
  catBox.classList.toggle("active");
});

const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#tel");
const messageInput = document.querySelector("#mess");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if(!name || !email || !message){
        alert("Molimo popunite sva obavezna polja!");
        return;
    }

    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({
        name, 
        email, 
        phone, 
        message, 
        date: new Date().toLocaleString()
    });
    localStorage.setItem("messages", JSON.stringify(messages));

    alert("Poruka uspešno poslata!");
    form.reset();
});

