<%-- 
    Document   : viewRequests
    Created on : Dec 10, 2024, 11:01:07?PM
    Author     : anishkuila
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Medshop</title>
    </head>
    <body>
        <h1>View Stock Requests</h1>

        <nav>
            <a href="${pageContext.request.contextPath}/supplier/browse">View Medications</a> |
            <a href="${pageContext.request.contextPath}/supplier/view-requests">View Requests</a> |
            <a href="/medshop/auth/logout">Logout</a>
        </nav>
            
        <br>

        <table border="1">
            <thead>
                <tr>
                    <th>Request ID</th>
                    <th>Medication</th>
                    <th>Quantity</th>            
                    <th>Status</th>
                    <th>Action</th> <!-- New column for actions -->
                </tr>
            </thead>
            <tbody>
                <c:forEach var="request" items="${requests}">
                    <tr>
                        <td>${request.id}</td>
                        <td>${request.medId}</td>
                        <td>${request.requestedQuantity}</td>
                        <td>${request.status}</td>
                        <td>
                            <c:if test="${request.status == 'PENDING'}">
                                <!-- Buttons for Approve and Reject -->
                                <form action="${pageContext.request.contextPath}/supplier/requests/approve" method="post" style="display: inline;">
                                    <input type="hidden" name="requestId" value="${request.id}" />
                                    <button type="submit">Approve</button>
                                </form>
                                <form action="${pageContext.request.contextPath}/supplier/requests/reject" method="post" style="display: inline;">
                                    <input type="hidden" name="requestId" value="${request.id}" />
                                    <button type="submit">Reject</button>
                                </form>
                            </c:if>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
        
        <br>
        
         <!-- Success Message -->
        <c:if test="${not empty message}">
            <p style="color: green;">${message}</p>
        </c:if>
            
    </body>
</html>


