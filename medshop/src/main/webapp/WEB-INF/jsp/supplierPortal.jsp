<%-- 
    Document   : supplierPortal
    Created on : Dec 10, 2024, 6:04:01?PM
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
            <a href="browse">View Medications</a> |
            <a href="view-requests">View Requests</a> |
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
                <c:forEach var="med" items="${medications}">
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
