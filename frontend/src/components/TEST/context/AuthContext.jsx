import { createContext, useEffect, useReducer, useContext } from "react";
import refreshToken from '../Utils/RefreshToken'
import { Link } from "react-router-dom";

const initial_state = {
    user: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : null,
    loading: false,
    error: null,
};

export const AuthContext = createContext(initial_state);

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                loading: true,
                error: null,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                error: null,
            }
        case "LOGIN_FAILURE":
            return{
                user: null,
                loading: false,
                error: action.payload,
            }
        case "REGISTER_SUCCESS":
            return {
                user: null,
                loading: false,
                error: null,
            }
        case "LOGOUT":
            return {
                user: null,
                loading: false,
                error: null,
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            }
        case "DELETE_USER":
            return {
                user: null,
                loading: false,
                error: null,
            }
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initial_state);

    const checkTokenExpiration = async () => {
        const user = JSON.parse(localStorage.getItem('users'));
        if (user && user.expiresAt) {
            const currentTime = new Date().getTime();
            if (currentTime > user.expiresAt) {
                const refreshed = await refreshToken();
                if (!refreshed) {
                    dispatch({ type: "LOGOUT" });
                    localStorage.removeItem('users');
                    Link('/login');
                }
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(checkTokenExpiration, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(state.user));
    }, [state.user]);

    return <AuthContext.Provider value={{
            user: state.user,
            loading: state.loading,
            error: state.error,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }

    return context;
};