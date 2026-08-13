<%-- 
    Document   : removeMed.jsp
    Created on : Dec 10, 2024, 8:33:55?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Medshop</title>
</head>
<body>
    <h1>Remove Medication</h1>

    <!-- Navbar Section -->
    <nav>
        <a href="${pageContext.request.contextPath}/admin/medications">View Medications</a> |
        <a href="${pageContext.request.contextPath}/admin/medications/add">Add Medications</a> |
        <a href="${pageContext.request.contextPath}/admin/medications/remove">Remove Medications</a> |
        <a href="${pageContext.request.contextPath}/admin/orders">View Orders</a> |
        <a href="${pageContext.request.contextPath}/admin/low-stock">View Low Stock</a> |
        <a href="/medshop/auth/logout">Logout</a>
    </nav>

    <br>

    <!-- Medications Table -->
    <form method="post" action="remove">
        <table border="1">
            <thead>
                <tr>
                    <th>Select</th>
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
                        <td><input type="checkbox" name="medIds" value="${med.id}"></td>
                        <td>${med.id}</td>
                        <td>${med.name}</td>
                        <td>${med.category}</td>
                        <td>${med.price}</td>
                        <td>${med.stock}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
        <br>
        <button type="submit">Remove Selected Medications</button>
    </form>
</body>
</html>
