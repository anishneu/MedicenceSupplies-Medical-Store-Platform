<%-- 
    Document   : register
    Created on : Dec 8, 2024, 2:15:48 AM
    Author     : anishkuila
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Medshop</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 400px;
                margin: 50px auto;
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                color: #333;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #555;
            }
            input[type="text"], input[type="password"], select {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            button {
                width: 100%;
                padding: 12px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background-color: #218838;
            }
            .error {
                color: red;
                text-align: center;
            }
            .link {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Register</h1>
            <form action="register" method="post">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br>

                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br>

                <label for="rolename">Role:</label>
                <select id="rolename" name="rolename" required>
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="SUPPLIER">Supplier</option>
                </select><br>

                <button type="submit">Register</button>
            </form>

            <p class="error">${error}</p>
            <p class="link">
                Already have an account? <a href="login">Login here</a>.
            </p>
        </div>
    </body>
</html>
