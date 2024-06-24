# WebAPI
# Recipe Web Application

This is a simple web application that provides recipes when you click on a button. The application is built using Node.js, Express, MongoDB, and Mongoose, and uses Axios for API calls. 

## Setup

To run this project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/Joah00/WebAPI.git
    ```

2. Navigate to the project directory:
    ```bash
    cd WebAPI
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory with your MongoDB connection string and API keys:
    ```env
    MONGODB_URI=your_mongodb_uri
    API_KEY=your_api_key
    ```

5. Start the development server:
    ```bash
    npm run dev
    ```

## File Structure
/node_modules

/public
|
--/detail.js
--/homepage.html
--/recipeDetail.html
--/scripts.js
--/styles.css
--/login.js
--/login.css
--/login.html
--/register.html
--/register.css
--/register.js
--/history.js
--/history.html
--/history.css
(All the above are inside the directory "public")

/package-lock.json
/package.json
/server.js

/models
|
--/User.js
--/UserHistory.js

