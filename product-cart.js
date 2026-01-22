const productDetails=document.querySelector("#product-details");
const params=new URLSearchParams(window.location.search);

const id=params.get("id");


if(!id){
    productDetails.innerHTML=`<p>Proizvod nije nadjen!!!</p>`;
}else{

    fetchProduct(id)
}


function fetchProduct(id){

    
    let xhr=new XMLHttpRequest();


    xhr.addEventListener("readystatechange",function(){

try{
if(this.readyState==4 && this.status==200){
        let obj=JSON.parse(this.responseText);
        allProducts=obj.products;
        renderProducts(obj);
        console.log(allProducts)
}
}catch(err) {
    console.log("err" + err)
}
    })
 
    xhr.open("GET",`https://dummyjson.com/products/${id}`)
    xhr.send();

}

function renderProducts(elem){

        const oldPrice=(
            elem.price * (1 + elem.discountPercentage / 100)
        ).toFixed(2);
        productDetails.innerHTML=`
        <img class="slika1" src="${elem.thumbnail}" alt="${elem.title}">
        <p class="naslov">${elem.title}</p>
        <p class="ocena">Rating:⭐${elem.rating}</p>
        <p class="oldprice">Oldprice${oldPrice}</p>
        <p class="cena">Price now:${elem.price}$</p>
          <p class="dostava">ShippingInformation: ${elem.shippingInformation}</p>
        <p class="popust">${elem.discountPercentage} %</p>
        <p class="description-product">${elem.description}</p>
        <p class="garancija">Warranty:${elem.warrantyInformation}</p>

       
        `
        
}