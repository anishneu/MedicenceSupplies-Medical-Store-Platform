<%-- 
    Document   : lowStockMeds
    Created on : Nov 24, 2024, 1:30:04?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Medshop</title>
    </head>
    <body>
        <h1>Low Stock Medications</h1>

        <!-- Navbar Section -->
        <nav>
            <a href="medications">View Medications</a> |
            <a href="/medshop/auth/logout">Logout</a>
        </nav>

        <br>
        
        <table border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Request Stock</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="med" items="${lowStockMeds}">
                    <tr>
                        <td>${med.id}</td>
                        <td>${med.name}</td>
                        <td>${med.category}</td>
                        <td>${med.price}</td>
                        <td>${med.stock}</td>
                        <td>
                            <!-- Stock Request Form -->
                            <form action="/medshop/admin/medications/request-stock" method="POST">
                                <input type="hidden" name="medId" value="${med.id}">
                                <input type="number" name="quantity" placeholder="Quantity" required>
                                <button type="submit">Request Stock</button>
                            </form>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
        
        <br>
        
        <c:if test="${not empty message}">
            <p style="color: green;">${message}</p>
        </c:if>

    </body>
</html>

