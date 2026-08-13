/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/SpringFramework/AbstractController.java to edit this template
 */
package com.csye6220.medshop.controller;

import com.csye6220.medshop.model.User;
import com.csye6220.medshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

@Controller
@RequestMapping("/auth")
@SessionAttributes("user") // To store the user in session after successful login
public class UserController {

    @Autowired
    private UserService userService;

    // Show the login page
    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    // Handle login
    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Model model) {
        User user = userService.findByName(username);

        if (user != null && user.getPassword().equals(password)) {
            // Store the user in session when login is successful
            model.addAttribute("user", user);
            model.addAttribute("message", "Welcome, " + user.getUsername());
            model.addAttribute("role", user.getRolename());

            // Redirect based on user role
            if (user.getRolename().equalsIgnoreCase("ADMIN")) {
                return "redirect:/admin/medications"; // Redirect to admin's URL
            } else if (user.getRolename().equalsIgnoreCase("CUSTOMER")) {
                return "redirect:/customer/browse"; // Redirect to customer's URL
            } else if (user.getRolename().equalsIgnoreCase("SUPPLIER")) {
                return "redirect:/supplier/browse"; // Redirect to supplier's URL
            } else {
                model.addAttribute("error", "Invalid role! Access denied.");
                return "login";
            }
        } else {
            // Handle failed login by showing an error message
            model.addAttribute("error", "Login Failed. Try Again."); // Error message for failed login

            // Clear the user attribute from session if login failed
            model.addAttribute("user", new User()); // This will set a new empty user object to avoid session issues
            return "login"; // Stay on the same page with error message
        }
    }

    // Show the registration page
    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // Handle registration
    @PostMapping("/register")
    public String register(@ModelAttribute("user") User user, Model model) {
        if (userService.findByName(user.getUsername()) != null) {
            model.addAttribute("error", "Username already exists!");
            return "register";
        }
        userService.persist(user);
        model.addAttribute("message", "Registration successful! Please login.");
        return "redirect:/auth/login";
    }

    // Handle Logout
    @GetMapping("/logout")
    public String logout(SessionStatus sessionStatus, Model model) {
        sessionStatus.setComplete(); // Invalidate the session
        model.addAttribute("message", "You have successfully logged out.");
        return "redirect:/auth/login"; // Redirect to login page
    }
}




