import { printOrderForm } from "./printOrderForm.js";

function getProducts(){
    let products = JSON.parse(sessionStorage.getItem('cart'));
    products.forEach(element => {
        printProducts(element.namn, element.bild, element.amount,);
    });
}

function printProducts(namn, bild, amount){
    let product = document.createElement("div");

    product.classList.add("productAllInfo","row");
    product.id = `${namn.replace(/\s+/g, '')}`;

    product.innerHTML = `
    <img src="${bild}" alt="" style="width: 100px;">
    <p>${namn}</p>
    <div class="row">
        <button class="minus">-</button>
        <input type="number" value="${amount}" max="50" min="1">
        <button class="plus">+</button>
    </div>
    <p class="productsPrice"></p>
    <button class="removeItem red">x</button>
    `

    product.querySelector(".plus").addEventListener("click", ()=>{plus(product,namn)})
    product.querySelector(".minus").addEventListener("click", ()=>{minus(product,namn)})
    
    const input = product.querySelector("input");
    
    // Hantera både change och input events
    input.addEventListener("input", function(e) {
        // Tillåt endast siffror
        let value = this.value.replace(/[^\d]/g, '');
        
        // Om värdet är ogiltigt (tomt eller 0), sätt det till 1
        if (!value || parseInt(value) === 0) {
            value = '1';
        }
        
        // Om värdet är över max, sätt det till max
        if (parseInt(value) > 50) {
            value = '50';
            alert("Max antal per vara är 50 st");
        }
        
        // Uppdatera input-fältet
        this.value = value;
        
        // Uppdatera varukorgen
        updateFromInput(product, namn);
    });

    product.querySelector(".removeItem").addEventListener("click", ()=>{removeProduct(namn)});

    countProductPrice(product, namn);

    document.querySelector("#productsWrap").append(product);
}

function updateAmount(product, namn, change) {
    // Find item
    let products = JSON.parse(sessionStorage.getItem("cart"));
    let productToUpdate = products.find(p => p.namn === namn);
    
    // Update the amount in local storage
    productToUpdate.amount += change;

    // Do not let go below 1
    if (productToUpdate.amount < 1) {
        productToUpdate.amount = 1;
    }

    if (productToUpdate.amount > 50) {
        alert("Max tillåtna köp på denna vara är 50 st");
        productToUpdate.amount = 50;
    }

    sessionStorage.setItem('cart', JSON.stringify(products));

    // Update input field
    product.querySelector("input").value = productToUpdate.amount;
}

function plus(product, namn) {
    updateAmount(product, namn, 1);
    countProducts();
    countProductPrice(product, namn);
    countTotalPrice();
}

function minus(product, namn) {
    updateAmount(product, namn, -1);
    countProducts();
    countProductPrice(product, namn);
    countTotalPrice();
}

function updateFromInput(product, namn){
    let input = product.querySelector("input");
    let value = input.value.replace(/[^\d]/g, ''); // Ta bort alla icke-siffror
    
    // Konvertera till nummer och validera
    value = parseInt(value) || 1; // Om parsing misslyckas, använd 1
    
    if (value < 1) value = 1;
    if (value > 50) {
        value = 50;
        alert("Max antal per vara är 50 st");
    }
    
    // Update the amount in sessionStorage
    let products = JSON.parse(sessionStorage.getItem("cart"));
    let productToUpdate = products.find(p => p.namn === namn);

    // Update the amount
    productToUpdate.amount = value;
    sessionStorage.setItem('cart', JSON.stringify(products));

    // Update the input field to show the new amount
    input.value = value;
    countProducts();
    countProductPrice(product, namn);
    countTotalPrice();
}


function countProducts(){
    let products = JSON.parse(sessionStorage.getItem("cart"));
    let productAmount = 0;

    products.forEach(product => {
        productAmount += product.amount;
    });
 
    document.querySelector("#productAmount").innerHTML = `${productAmount} varor`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2,
    }).format(amount);
}

function countProductPrice(product, namn) {
    let priceElement = product.querySelector(".productsPrice");

    let products = JSON.parse(sessionStorage.getItem("cart"));
    let foundProduct = products.find(p => p.namn === namn);

    let totalPrice = foundProduct.pris * foundProduct.amount;
    
    priceElement.innerHTML = formatCurrency(totalPrice);
}

function removeProduct(namn){
    let products = JSON.parse(sessionStorage.getItem("cart"));
    let index = products.findIndex(p => p.namn === namn);

    products.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(products));
    document.querySelector(`#${namn.replace(/\s+/g, '')}`).remove();

    countProducts()
    countTotalPrice();
}

function countTotalPrice(){
    let products = JSON.parse(sessionStorage.getItem("cart"));
    let totalPrice = 0;

    products.forEach(element => {
        totalPrice += element.pris * element.amount;
    });

    document.querySelector("#totalPrice").innerHTML = formatCurrency(totalPrice);
}

getProducts();
countProducts();
countTotalPrice();

document.querySelector("#toBuy").addEventListener("click", ()=>{
    printOrderForm();
})