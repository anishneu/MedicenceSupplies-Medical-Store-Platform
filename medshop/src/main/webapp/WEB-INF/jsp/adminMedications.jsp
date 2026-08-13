<%-- 
    Document   : adminMedications
    Created on : Nov 24, 2024, 1:29:04?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Medshop</title>
    </head>
    <body>
        <h1>Medications</h1>

        <!-- Navbar Section -->
        <nav>
            <a href="medications">View Medications</a> |
            <a href="medications/add">Add Medications</a> |
            <a href="medications/remove">Remove Medications</a> |
            <a href="orders">View Orders</a> |
            <a href="low-stock">View Low Stock</a> |
            <a href="/medshop/auth/logout">Logout</a>
        </nav>

        <br>

        <!-- Medications Table -->
        <table border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="med" items="${meds}">
                    <tr>
                        <td>${med.id}</td>
                        <td>${med.name}</td>
                        <td>${med.category}</td>
                        <td>${med.price}</td>
                        <td>${med.stock}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </body>
</html>
