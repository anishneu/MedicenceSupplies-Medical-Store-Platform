<%-- 
    Document   : addMed
    Created on : Nov 18, 2024, 8:36:04?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Medshop</title>
    </head>
    <body>
        <h1>Add or Update Medication</h1>
        <form action="${pageContext.request.contextPath}/admin/medications/add" method="post">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" value="${med.name}" required><br><br>

            <label for="category">Category:</label>
            <input type="text" id="category" name="category" value="${med.category}" required><br><br>

            <label for="price">Price:</label>
            <input type="number" id="price" name="price" step="0.01" value="${med.price}" required><br><br>

            <label for="stock">Stock:</label>
            <input type="number" id="stock" name="stock" value="${med.stock}" required><br><br>

            <button type="submit">Save</button>
        </form>
    </body>
</html>



