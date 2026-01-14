import React,{ JSX, lazy,Suspense}from 'react'
import { RouteObject,useRoutes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute';


const HomeScreen = lazy(()=> import("../App"));
const LoginScreen = lazy(()=> import("../screens/LoginScreen/login"));
const AdminDashboard = lazy(()=> import("../screens/AdminScreens/adminDashboad"));
const StudentDashboard = lazy(()=> import("../screens/StudentScreens/studentDashboard"));



const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LoginScreen />
  },

  {
    path: "/",
    element: <HomeScreen />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "Admindashboard",
            element: <AdminDashboard />
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            path: "Studentdashboard",
            element: <StudentDashboard />
          }
        ]
      }
    ]
  },

  {
    path: "*",
    element: <h1>404</h1>
  }
];


const Navigation:React.Fc=(): JSX.Element=>{
    const element=useRoutes(mainRoutes);
    return <Suspense fallback={<div>loading ...</div>}>{element}</Suspense>;
};


export default Navigation;