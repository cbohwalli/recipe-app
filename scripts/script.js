import dragBar from './dragbar.js';
import {addRandomMeal, getRandomMeal, addSearchHandler, getMealsFromLocalStorage} from './add-meal.js';
import {addRefreshHandler} from './add-refresh-handler.js';
import autocomplete from './autocomplete.js';
import getCategories from './get-categories.js';

async function initializeSite() {
    const inputField = document.getElementById('inputField');
    const categories = await getCategories();

    dragBar.addMouseHandlers();
    addRefreshHandler();
    addSearchHandler();

    autocomplete(inputField, categories);

    getMealsFromLocalStorage(); 

    const mealData = await getRandomMeal();
    addRandomMeal(mealData);
} 

initializeSite();