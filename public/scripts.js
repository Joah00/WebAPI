document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#recipe-table tbody');
    let allRecipes = [];

    // Fetch data from API and populate the table
    fetch('/api/recipes')
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            populateTable(allRecipes);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Function to populate table
    function populateTable(recipes) {
        tableBody.innerHTML = '';
        recipes.forEach(recipe => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipe.id}</td>
                <td>${recipe.title}</td>
                <td>${recipe.difficulty}</td>
                <td><img src="${recipe.image}" alt="${recipe.title}" width="100"></td>
            `;
            row.addEventListener('click', () => {
                saveToHistory(recipe);
                window.location.href = `recipeDetail.html?id=${recipe.id}`;
            });
            tableBody.appendChild(row);
        });
    }

    // Function to save clicked recipe to history
    function saveToHistory(recipe) {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        console.log('Retrieved userId from localStorage:', userId); // Log the userId

        if (!userId) {
            console.error('User ID not found in localStorage');
            alert('User ID not found. Please log in again.');
            return; // Prevent saving history if userId is not found
        }

        const historyData = {
            userId,
            recipeId: recipe.id,
            title: recipe.title,
            difficulty: recipe.difficulty,
            image: recipe.image
        };

        console.log('Saving to history:', historyData); // Log the data being sent

        fetch('/api/saveHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(historyData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error saving history:', error);
        });
    }

    // Search functionality
    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredRecipes = allRecipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchTerm) ||
                recipe.difficulty.toLowerCase().includes(searchTerm)
            );
            populateTable(filteredRecipes);
        }
    });

    // Reset functionality
    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', function() {
        searchInput.value = '';
        populateTable(allRecipes);
    });

    // Logout functionality
    const logoutButton = document.querySelector('#logout-button');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('userId'); // Clear userId from localStorage
        window.location.href = '/login.html';
    });

    // History functionality
    const historyButton = document.querySelector('#history-button');
    historyButton.addEventListener('click', function() {
        window.location.href = '/history.html';
    });
});
