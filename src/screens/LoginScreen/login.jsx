import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Student from "../../assets/Student.json";
import Lottie from "lottie-react";
import bgImage from "../../assets/5.jpg";
import logo from "../../assets/logo.png"
import "./login.css";
import { height, width } from '@mui/system';
import { jwtDecode } from "jwt-decode";
import Button from '../../components/button/button';
// import 


const login = () => {
    const [emaildata,Setemaildata]=useState("");
    const [password,Setpasssword]=useState("");
    const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

    const navigate = useNavigate()


const handleSubmit = async () => {
  if (!emaildata || !password) {
    setError("Please fill all fields above");
    return;
  }
// navigate("/teacherDashboard");
  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //  "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_name: emaildata,
          password: password
        })
      }
    );

    const token = await response.text(); // 👈 API returns token, not JSON

    if (!response.ok) {
      throw new Error(token || "Login failed");
    }

    if (!token) {
      throw new Error("No token received");
    }

    // Save token
    sessionStorage.setItem("key", token);
    

    // Decode token
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

    const role = decoded.role || decoded.user_role || decoded.type;

    // Redirect based on role
    
    if (role === "admin") {
      navigate("/adminDashboard");
    } else if (role === "teacher") {
      navigate("/teacherDashboard");
    } else if (role === "student") {
      navigate("/studentDashboard");
    } else {
      alert("Unknown role");
    }

  
  } catch (err) {
    console.error(err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"row"}}>
<div style={{width:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <div className="myBackgroundImage" >  
        <div className="welcomeText">Welcome To Student Sphere </div>       
        <Lottie animationData={Student}   className="lottieShow" loop={true} style={{height:"80vh",width:"50vw"}} />
</div>
</div>
<div className="myBlueShape"> 
    <div className="logintab">
        <img src={logo} alt='logo' style={{width:"3rem",height:"3rem"}}></img>
        <div style={{fontWeight:"bold",fontSize:"2rem"}}>Welcome Back</div>
        <div>Please Enter Your Details to Login</div>
        <div style={{width:"85%",display:"flex",gap:"1rem",flexDirection:"column",margin:"1rem"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"0.1rem"}}>
                <label className='label'>Email</label>
                <input className="input" value={emaildata} placeholder='Please Enter emaildata' onChange={(e)=>{
                    Setemaildata(e.target.value);
                }}></input>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.1rem"}}>
                <label className='label'>Password</label>
             <input className="input" type="password" value={password} placeholder='Please Enter Password'onChange={(e)=>{
                    Setpasssword(e.target.value);
                }} ></input>
             </div>
             
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

       
       <div style={{marginTop:"0.4rem"}}><Button data={loading ? "Logging in..." : "Login"} style={{width:"85%",outline:"none"}} onClick={()=>{

            handleSubmit()
        }} disabled={loading} /></div> 

        </div>
    </div>
    </div>
  )
}

export default login;

 