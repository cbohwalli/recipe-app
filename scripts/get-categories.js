async function getCategories() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const respData = await resp.json();
    const mealData = await respData.categories;
    let categories = []
    mealData.forEach(element => {
      categories.push(element.strCategory);
    });
    return categories;
}

export default getCategories;