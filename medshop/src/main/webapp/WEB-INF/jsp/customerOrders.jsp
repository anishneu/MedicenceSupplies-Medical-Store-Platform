<%-- 
    Document   : customerOrders
    Created on : Nov 24, 2024, 1:29:45?PM
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
        <h1>Your Orders</h1>

        <c:if test="${not empty message}">
            <p style="color: green;">${message}</p>
        </c:if>

        <c:if test="${empty orders}">
            <p>You have no orders. <a href="browse">Browse medications</a> to place an order.</p>
        </c:if>

        <c:if test="${not empty orders}">
            <table border="1">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Medication ID</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="order" items="${orders}">
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.medicationId}</td>
                            <td>${order.quantity}</td>
                            <td>${order.orderDate}</td>
                            <td>${order.status}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </c:if>

        <a href="browse">Continue Browsing</a>
    </body>
</html>


