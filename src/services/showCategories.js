import { sortProducts } from "./sortProducts.js";


// export  async function showCategories(productsPromise) {
export  async function showCategories(products) {
    // const products = await productsPromise;

    const categoryContainer = document.querySelector('#categoryContainer');
    if (!categoryContainer) return;
    
    // Rensa existerande kategorier först
    categoryContainer.innerHTML = '';
    
    // Lägg till "Alla Kategorier" överst
    const allCategoriesLi = document.createElement('li');
    const allCategoriesLink = document.createElement('a');
    allCategoriesLink.href = 'index.html';
    allCategoriesLink.textContent = 'Alla Kategorier';
    allCategoriesLink.classList.add('all-categories');
    
    allCategoriesLi.appendChild(allCategoriesLink);
    categoryContainer.appendChild(allCategoriesLi);
    
    // Flatten all categories from all products
    const allCategories = products.flatMap(product => product.kategorier);

    //filter out duplicates by 'namn'
    //findIndex() finds and keeps only the first example of a cat
    const uniqueCategories = allCategories.filter(
        (categories, index, self) =>
            index === self.findIndex(c => c.namn === categories.namn)
    );

    uniqueCategories.forEach(category => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = category.namn;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            sortProducts(category.namn);
        });
        
        li.appendChild(link);
        categoryContainer.appendChild(li);
    });
}