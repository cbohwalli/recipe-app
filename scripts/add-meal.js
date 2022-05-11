const mealsContainer = document.getElementById('mealsContainer');

function addRandomMeal(mealData) {

    const mealContainer = document.createElement("div");
    mealContainer.classList.add("meal");
    mealContainer.innerHTML = `
        <div class='meal-image' id='image:${mealData.idMeal}'></div>
        <h2 class='meal-name' id=text:${mealData.idMeal}>${mealData.strMeal}</h2>
        <button class='meal-button' id="randomButton">Random Recipe</button>
        <button class='meal-button' id="saveButton:${mealData.idMeal}">
          <i class="${!!document.getElementById('saved:' + mealData.idMeal) ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>
    `;

    mealsContainer.innerHTML = "";
    mealsContainer.appendChild(mealContainer);

    const mealImageContainer = document.getElementById('image:' + mealData.idMeal);
    mealImageContainer.style.backgroundImage = "url('"+mealData.strMealThumb+"'), url('filler-image.jpg')"; 

    addEventListenerRandomButton('randomButton');
    addEventListenerSaveButton(mealData, 'saveButton:' + mealData.idMeal);
    addEventListenerOpenRecipe(mealData, 'image:' + mealData.idMeal);
}

async function addRecipe(mealData) {
    
    const mealContainer = document.createElement("div");
    mealContainer.classList.add("recipe"); 
    mealContainer.innerHTML = `
        <h2 class='recipe-heading'>${mealData.strMeal}</h2>

        <div class='ingredientsAndInstructions'>
            <h2>Ingredients</h2>
            <ul class='ingredientsAndInstructions-ingredents' id='ingredients'></ul>
        </div>
        
        <div class='ingredientsAndInstructions'>
            <h2>Instructions</h2>
            <p class='ingredientsAndInstructions-instructions' id='instructions'>${mealData.strInstructions}</p>
        </div>

        <div class='saveButtonContainer'>
            <button class='saveButtonContainer-saveButton' id="saveButton:${mealData.idMeal}">
                <i class="${!!document.getElementById('saved:' + mealData.idMeal) ? "fa-solid" : "fa-regular"} fa-heart fa-3x"></i>
            </button>
        </div>

        
    `;

    mealsContainer.innerHTML = "";
    mealsContainer.appendChild(mealContainer);

    addIngredienses(mealData);

    addEventListenerSaveButton(mealData, 'saveButton:' + mealData.idMeal);
}

async function addSearchedMeals(searchWord) {

    const mealsArray = await getMealsByCategory(searchWord);

    mealsContainer.innerHTML = "";

    mealsArray.forEach(element => {
        addSearchedMeal(element.idMeal);    
    });
}

async function addSearchedMeal(mealId) {

    const mealData = await getMealById(mealId); 

    const mealContainer = document.createElement('div');
    mealContainer.classList.add('meal'); 
    mealContainer.innerHTML = `
        <div class='meal-image' id='image:${mealData.idMeal}'></div>
        <h2 class='meal-name' id=text:${mealData.idMeal}>${mealData.strMeal}</h2>
        <button class='meal-button' id='saveButton:${mealData.idMeal}'>
            <i class='${!!document.getElementById('saved:' + mealData.idMeal) ? 'fa-solid' : 'fa-regular'}
            fa-heart'></i>
        </button>    
    `;

    mealsContainer.appendChild(mealContainer);

    const mealImageContainer = document.getElementById('image:' + mealData.idMeal);
    mealImageContainer.style.backgroundImage = "url('"+mealData.strMealThumb+"'), url('filler-image.jpg')"; 

    addEventListenerSaveButton(mealData, 'saveButton:' + mealData.idMeal);
    addEventListenerOpenRecipe(mealData, 'image:' + mealData.idMeal);    
}

function addIngredienses(mealData) {

    const ingrediensList = document.getElementById('ingredients');
    const ingredienses = getIngredienses(mealData);

    ingredienses.forEach(element => {
      let newIngredient = document.createElement("li");
      newIngredient.classList.add("ingredientsAndInstructions-ingrediens");
      newIngredient.innerHTML = element;
      ingrediensList.appendChild(newIngredient);
    });
}

function getIngredienses(mealData) {

    let ingredienses = [];

    for (let index = 1; index < 21; index++) {
        let ingredient = 'strIngredient' + index;

        if (mealData[ingredient].length == 0) { 
            return ingredienses; 
        }

        ingredienses.push(mealData[ingredient]);
    }
}

function addEventListenerRandomButton(randomButtonId) {

    const randomButton = document.getElementById(randomButtonId);
    
    randomButton.addEventListener('click', async () => {
        const mealData = await getRandomMeal();
        addRandomMeal(mealData);
    });
}

async function getRandomMeal() {

    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = await respData.meals[0];

    return randomMeal;
}

function addEventListenerSaveButton(mealData, saveButtonId) {

    const saveButton = document.getElementById(saveButtonId);
    const heartIcon = saveButton.childNodes[1];

    saveButton.addEventListener('click', (e) => {
        e.stopPropagation();  // prevents parent events from triggering
        toggleSave(heartIcon, mealData)
    });
}

function saveMeal(mealData) {

    const savedMeal = document.createElement('div');

    savedMeal.classList.add('savedMeal');
    savedMeal.setAttribute('id', 'savedMeal:' + mealData.idMeal);
    savedMeal.innerHTML = `
        <img class='savedMeal-img' src='${mealData.strMealThumb}'>
        <h3 class='savedMeal-name'>${mealData.strMeal}</h3>
        <button class='savedMeal-delete' id='deleteButton:${mealData.idMeal}'>
            <i class='fa-solid fa-x'></i>
        </button>
    `;

    const savedMealsContainer = document.getElementById('savedMeals')
    savedMealsContainer.appendChild(savedMeal);

    addDeleteSavedMealHandler(mealData);
    addSavedMealHandler(savedMeal, mealData);

    addToLocalStorage(mealData, 'savedMeal:' + mealData.idMeal);
}

function addToLocalStorage(mealValue, mealKey) {
    localStorage.setItem(mealKey, JSON.stringify(mealValue));
}

function toggleSave(heartIcon, mealData) {

    heartIcon.classList.toggle("fa-solid"); 
    heartIcon.classList.toggle("fa-regular");

    if (heartIcon.classList.contains('fa-solid')) {
        saveMeal(mealData);
    } else if (heartIcon.classList.contains('fa-regular')) {
        removeMeal(mealData);
    }
}

function removeMeal(mealData) {
    const selectedMeal = document.getElementById('savedMeal:' + mealData.idMeal);
    selectedMeal.remove(); 
    removeFromLocalStorage('savedMeal:' + mealData.idMeal);
}

function removeFromLocalStorage(mealKey) {
    localStorage.removeItem(mealKey);
}

function addEventListenerOpenRecipe(mealData, imageContainerId) {
    
    const imageContainer = document.getElementById(imageContainerId); 
    imageContainer.addEventListener('click', () => {
        addRecipe(mealData);
    }); 
}

async function getMealsByCategory(category) {

    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category);
    const respData = await resp.json();
    const mealData = await respData.meals;
    return mealData;
}

async function getMealsFromLocalStorage() {
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = await localStorage.key(i);
        const mealData = await localStorage.getItem(key);
        saveMeal(JSON.parse(mealData));
    }
}

function addDeleteSavedMealHandler(mealData) {
    const deleteButton = document.getElementById('deleteButton:' + mealData.idMeal);
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();  // prevents parent events from triggering
        removeMeal(mealData);
    });
}

function addSavedMealHandler(savedMeal, mealData) {
    savedMeal.addEventListener('click', () => {
        addRecipe(mealData);
    });
}

function addSearchHandler() {
    const searchButton = document.getElementById('searchButton');
    const inputField = document.getElementById('inputField');

    searchButton.addEventListener('click', () => {
        addSearchedMeals(inputField.value);
    });

    inputField.addEventListener('keydown', (e) => {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            e.preventDefault();
            addSearchedMeals(inputField.value);
        }
    });
}

async function getMealById(mealId) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId);
    const respData = await resp.json();
    const mealData = await respData.meals[0];
    return mealData;
}

export {addRandomMeal, getRandomMeal, addSearchHandler, getMealsFromLocalStorage};