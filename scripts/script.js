
//button click handler

const searchClickHandler = () => {
    document.getElementById('search-btn').addEventListener('click', () => {
        const findFood = document.getElementById('search-input').value;
        document.getElementById('search-input').value = "";
        document.getElementById('result-section').innerHTML = "";
        if (findFood.length == 1) {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${findFood}`)
                .then(res => res.json())
                .then(data => displayData(data.meals))
                .catch(error => resultNotFound('Food Not Founds'))
        }
        else {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${findFood}`)
                .then(res => res.json())
                .then(data => displayData(data.meals))
                .catch(error => resultNotFound('Food Not Founds'))
        }
    })
}

searchClickHandler();

const keypress = document.getElementById("search-input");
const buttonClick = document.getElementById("search-btn");

keypress.addEventListener("keypress", function(event) {
    //event.preventDefault();
    if (event.keyCode == 13)
    buttonClick.click();
});


const resultNotFound = error => {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = error;

}


const displayData = foods => {
    foods.forEach(food => {
        const resultSection = document.getElementById('result-section');
        document.getElementById('error-message').innerHTML = "";
        const foodDiv = document.createElement('div');
        foodDiv.className = 'food-section';

        const divContent = `
        <img class="thumb-img" src="${food.strMealThumb}">
        <h3 class="food-title">${food.strMeal}</h3>
        `;
        foodDiv.innerHTML = divContent;
        resultSection.appendChild(foodDiv);
    });

    foodClickHandler();
}

const foodClickHandler = () => {
    const allFood = document.getElementById('result-section');
    allFood.addEventListener('click', (event) => {
        if (event.target.tagName == 'IMG' || event.target.tagName == 'H3') {
            const clickedFoodDiv = event.target.parentNode;
            const clickedFood = clickedFoodDiv.querySelector('h3').innerText;
            loadingIngredient(clickedFood);
        }
        else if (event.target.tagName == 'DIV') {
            const clickedFoodDiv = event.target;
            const clickedFood = clickedFoodDiv.querySelector('h3').innerText;
            loadIngredients(clickedFood);
        }

    })
}

const loadingIngredient = (clickedFood) =>{
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('search-div').style.display = 'none';
    document.getElementById('detail-section').style.display = 'block';
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${clickedFood}`)
                .then(res => res.json())
                .then(data => displayIngredients(data,clickedFood))
}

const displayIngredients = (data,clickedFood) =>{
    //console.log(data);
    data.meals.forEach(element => {
        if(element.strMeal==clickedFood){
            //console.log(element.strMeal);
            document.getElementById('detail-image').setAttribute('src',element.strMealThumb);
            document.getElementById('detail-header').innerText = clickedFood;
            for (let i = 1; i < 21; i++){
                const list = document.createElement('li');
                const measure = element['strMeasure'+i];
                const ingredient = element['strIngredient'+i];
                if(measure == ''||ingredient==null){
                    break;
                }
                const listContent = `${measure} ${ingredient}`;
                list.innerText = listContent;
                document.getElementById('ingredients-ul').appendChild(list);
1               
            }
            document.getElementById('ingredient-title').innerText ="Ingredients";
        }
    });
}