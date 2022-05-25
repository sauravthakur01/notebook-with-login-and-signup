import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {

    const [credentials , setCredentials] = useState({name:"" , email:"" , password:"" ,cpassword:""})
    let navigate = useNavigate(); //// for redirecting 
    const {name ,email , password } = credentials ;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
         
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name , email , password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
             // Save the auth token and redirect
          localStorage.setItem("token", json.token);
          navigate("/"); // for redirecting
          props.showAlert("Welcome","success")

        } 
        
      };

   const onChange = (e)=>{
       setCredentials({...credentials , [e.target.name]: e.target.value});
   }
  return (
    <div className ="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label" >
            Your name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            aria-describedby="emailHelp"
            name="name"
            onChange={onChange}
            required
            autoComplete="off"
          />
          
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
            aria-describedby="emailHelp"
            required
          />
          
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            required
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            required
            minLength={5}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
