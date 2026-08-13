<%-- 
    Document   : customerCart
    Created on : Nov 25, 2024, 1:24:15?PM
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
        <h1>Your Cart</h1>

        <c:if test="${not empty error}">
            <p style="color: red;">${error}</p>
        </c:if>
        <c:if test="${not empty message}">
            <p style="color: green;">${message}</p>
        </c:if>

        <c:if test="${empty cart}">
            <p>Your cart is empty. <a href="browse">Browse medications</a> to add items.</p>
        </c:if>

        <c:if test="${not empty cart}">
            <table border="1">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="med" items="${cart}">
                        <tr>
                            <td>${med.id}</td>
                            <td>${med.name}</td>
                            <td>${med.category}</td>
                            <td>${med.price}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>

            <form action="order/place" method="post">
                <input type="hidden" name="userId" value="${user.getId()}">
                <button type="submit">Place Order</button>
            </form>
        </c:if>

        <a href="browse">Continue Shopping</a> <!--Just changed back to /customer/browse-->
    </body>
</html>



