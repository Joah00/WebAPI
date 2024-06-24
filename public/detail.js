document.addEventListener('DOMContentLoaded', function() {
    const recipeDetail = document.getElementById('recipe-detail');

    // Function to get query parameter
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const recipeId = getQueryParameter('id');

    if (recipeId) {
        fetch(`/api/recipes/${recipeId}`)
            .then(response => response.json())
            .then(data => {
                displayRecipeDetail(data);
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
                recipeDetail.innerHTML = '<p>Failed to load recipe details.</p>';
            });
    } else {
        recipeDetail.innerHTML = '<p>No recipe ID provided.</p>';
    }

// Function to display recipe details
function displayRecipeDetail(recipe) {
    const ingredientsList = recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
    
    // Handle method steps
    let methodList = '';
    if (recipe.method && recipe.method.length > 0) {
        recipe.method.forEach((step, index) => {
            if (step && typeof step === 'object' && Object.keys(step).length === 1) {
                const stepKey = Object.keys(step)[0];
                const stepDescription = step[stepKey];
                methodList += `<li>Step ${index + 1}: ${stepDescription}</li>`;
            }
        });
    } else {
        console.warn('Recipe method array is empty or invalid.');
    }

    // Display the recipe details in the recipe-detail element
    const recipeDetailElement = document.getElementById('recipe-detail');
    if (recipeDetailElement) {
        recipeDetailElement.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            <p><strong>Portion:</strong> ${recipe.portion}</p>
            <p><strong>Time:</strong> ${recipe.time}</p>
            <p><strong>Description:</strong> ${recipe.description}</p>
            <h3>Ingredients</h3>
            <ul>${ingredientsList}</ul>
            <h3>Method</h3>
            <ol>${methodList}</ol>
        `;
    } else {
        console.error('Recipe detail container not found. Make sure the element with id="recipe-detail" exists in your HTML.');
    }
}

    // Back button functionality
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', function() {
        window.location.href = 'homepage.html';
    });
});
