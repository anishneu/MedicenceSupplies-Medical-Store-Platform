<%-- 
    Document   : adminOrders
    Created on : Nov 24, 2024, 1:29:26?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
    <head>
        <title>Medshop</title>
    </head>
    <body>
        <h1>Orders</h1>
        
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
        
        <table border="1">
            <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Medication ID</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            <c:forEach var="order" items="${orders}">
                <tr>
                    <td>${order.id}</td>
                    <td>${order.userId}</td>
                    <td>${order.medicationId}</td>
                    <td>${order.quantity}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.status}</td>
                    <td>
                        <c:if test="${order.status != 'Processed'}">
                            <form action="<c:url value='/admin/orders/${order.id}/process' />" method="post">
                                <input type="hidden" name="id" value="${order.id}" />
                                <button type="submit">Process</button>
                            </form>
                        </c:if>
                    </td>
                </tr>
            </c:forEach>
        </table>
    </body>
</html>

