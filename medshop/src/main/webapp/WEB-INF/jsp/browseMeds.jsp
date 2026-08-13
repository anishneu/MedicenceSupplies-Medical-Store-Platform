<%-- 
    Document   : browseMeds
    Created on : Nov 18, 2024, 8:35:44?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Medshop</title>
    </head>
    <body>
        <h1>Available Medications</h1>
        
        <!-- Navbar Section -->
        <nav>
            <a href="medications">View Medications</a>
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

