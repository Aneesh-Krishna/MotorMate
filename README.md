# MotorMate

MotorMate is a full-stack web application designed to help users track their vehicles and associated expenses, providing a clear overview of maintenance costs.

## Features

*   **User Authentication:** Secure user registration and login system.
*   **Vehicle Management:** Add, view, update, and delete your vehicles.
*   **Expense Tracking:** Record and categorize expenses for each vehicle (e.g., fuel, maintenance, insurance).
*   **Dashboard:** A central dashboard to visualize vehicle information and recent expenses.
*   **Responsive Design:** A clean and intuitive user interface that works on various devices.

## Tech Stack

### Frontend

*   **Framework:** [React](https://reactjs.org/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Ant Design](https://ant.design/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

### Backend

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
*   **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://www.npmjs.com/package/bcryptjs)
*   **Middleware:** [CORS](https://www.npmjs.com/package/cors), [Morgan](https://www.npmjs.com/package/morgan), [express-session](https://www.npmjs.com/package/express-session)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following software installed on your machine:

*   [Node.js](https://nodejs.org/en/download/) (which includes npm)
*   [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd motormate
    ```

2.  **Install Backend Dependencies:**
    Navigate to the `server` directory and install the required packages.
    ```sh
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate to the `client` directory and install the required packages.
    ```sh
    cd ../client
    npm install
    ```

4.  **Environment Variables:**
    In the `server` directory, create a `.env` file and add the necessary environment variables, such as your MongoDB connection string and JWT secret.
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the `server` directory, run the development server. The server will typically start on `http://localhost:5000`.
    ```sh
    npm run dev
    ```

2.  **Start the Frontend Application:**
    In a new terminal, navigate to the `client` directory and run the start script. The React app will open in your browser at `http://localhost:3000`.
    ```sh
    npm start
    ```

You should now have the MotorMate application running locally.
