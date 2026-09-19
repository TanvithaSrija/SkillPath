import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });


    // REGISTER
    const register = async (userData) => {
        const data = await authService.register(userData);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };


    // LOGIN
    const login = async (email, password) => {
        const data = await authService.login(email, password);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };


    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };


    // UPDATE PROFILE
    const updateProfile = async (userData) => {
        const data = await authService.updateProfile(
            token,
            userData
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        setUser(data.user);

        return data;
    };


    const value = {
        user,
        token,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!token
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};