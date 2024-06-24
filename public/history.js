document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId');
    const tableBody = document.querySelector('#history-table tbody');
    let allHistory = [];

    if (!userId) {
        alert('User not logged in. Redirecting to login page.');
        window.location.href = '/login.html';
        return;
    }

    async function fetchHistory(userId) {
        try {
            const response = await fetch(`/api/history/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            const data = await response.json();
            populateTable(data);
        } catch (error) {
            console.error('Error fetching history:', error);
            alert('Failed to fetch history. Please try again later.');
        }
    }

    function populateTable(history) {
        tableBody.innerHTML = '';
        history.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.recipeId}</td>
                <td>${item.title}</td>
                <td>${item.difficulty}</td>
                <td><img src="${item.image}" alt="${item.title}" width="100"></td>
                <td><button class="delete-button" data-id="${item._id}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
        allHistory = history;

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async function() {
                const historyId = this.getAttribute('data-id');
                try {
                    const response = await fetch(`/api/history/${historyId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete history entry');
                    }
                    fetchHistory(userId); // Refresh history after deletion
                } catch (error) {
                    console.error('Error deleting history:', error);
                    alert('Failed to delete history. Please try again later.');
                }
            });
        });
    }

    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredHistory = allHistory.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.difficulty.toLowerCase().includes(searchTerm)
            );
            populateTable(filteredHistory);
        }
    });

    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', async function() {
        searchInput.value = ''; // Clear search input
        try {
            const response = await fetch(`/api/history/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            const data = await response.json();
            populateTable(data); // Populate table with all history entries
        } catch (error) {
            console.error('Error resetting history:', error);
            alert('Failed to reset history. Please try again later.');
        }
    });

    const homeButton = document.querySelector('#home-button');
    homeButton.addEventListener('click', function() {
        window.location.href = '/homepage.html';
    });

    const logoutButton = document.querySelector('#logout-button');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('userId');
        window.location.href = '/login.html';
    });

    fetchHistory(userId);
});
