<%-- 
    Document   : customerBrowse
    Created on : Nov 25, 2024, 1:24:00?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Medshop</title>
    </head>
    <body>
        <h1>Browse Medications</h1>

        <!-- Navbar Section -->
        <nav>
            <a href="browse">View Medications</a> |
            <a href="cart">View Cart</a> |
            <a href="orders">View Order History</a> |
            <a href="/medshop/auth/logout">Logout</a>
        </nav>

        <br><br>

        <!-- Medications Table -->
        <table border="1">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="med" items="${medications}">
                    <tr>
                        <td>${med.name}</td>
                        <td>${med.category}</td>
                        <td>${med.price}</td>
                        <td>${med.stock}</td>
                        <td>
                            <form action="cart/add" method="post">
                                <input type="hidden" name="id" value="${med.id}">
                                <button type="submit">Add to Cart</button>
                            </form>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <br>

    </body>
</html>

