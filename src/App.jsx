import { RouterProvider, createBrowserRouter, useLocation, useNavigate, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import React, { Children, useEffect, useState } from "react";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db, dbAuth } from "./DataBase/Firebase.Config";
import PhotoViewer from "./components/PhotoViewer/PhotoViewer";

function App() {
    // useEffect(() => {
    //   if (location.pathname === "/") {
    //     setLoading(true)
    //     let checkLocalStorageWithUserUid = localStorage.getItem("_user-uid");
    //     let q = query(collection(db, "users"), where("uid", "==", checkLocalStorageWithUserUid))
    //     getDocs(q).then(res => {
    //       if (res.docs.length === 0) {
    //         navigate('/')
    //         setLoading(false)
    //       } else {
    //         navigate("/home")
    //         setLoading(false)
    //       }
    //     })
    //   }
    //   else if (location.pathname === "/home") {
    //     setLoading(true)
    //   }
    // }, [location.pathname])
    const auth = localStorage.getItem('auth')
    const router = createBrowserRouter([{
        path: '/', element: <Navigate to={auth && auth === "true" ? '/home' : '/login'} />
    }, {
        path: '/login', element: <Login />,
    }, {
        path: '/register', element: <Register />
    }, {
        path: '/home', element: (<Home />), children: [
            {
                path: '/home/photo_viewer', element: <PhotoViewer />
            }
        ]
    }])
    return (<RouterProvider router={router} />);
}

export default App;
