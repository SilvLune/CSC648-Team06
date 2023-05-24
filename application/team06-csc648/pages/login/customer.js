/**
 * CSC 648 Spring 2023 - Team 6
 * File: customer.js
 * Author: Konnor Nishimura, Jack Lee, Justin Shin
 * 
 * Description: Generates HTML for customer login page. Validates login
 */

import {useState, useRef, useEffect} from "react";
import Link from 'next/link';
import NavBar from '../components/navBar';
import passwordUtil from '../utils/passwordUtils'
import styles from '@/styles/Login.module.css'
import axios from "axios";
import {useRouter} from 'next/router'

export default function CustomerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const emailInput = useRef();
    const emailMessage = useRef();
    const passwordInput = useRef();
    const passwordMessage = useRef();
    const router = useRouter()

    useEffect(() => {
        async function getSession(){
          try{
            let tempSession = await axios.get(`/api/get-user`)
            if(tempSession.data.user == undefined){
              return
            }
            //console.log(JSON.stringify(tempSession))
      
            if(tempSession.data.user.customer_id != undefined){
                window.location.href = `/`;
                return
            }
            if(tempSession.data.user.restaurant_id != undefined){
              window.location.href = `/home/restaurant/${tempSession.data.user.restaurant_id}`;
              return
            }
            if(tempSession.data.user.driver_id != undefined){
              window.location.href = `/home/driver/${tempSession.data.user.driver_id}`;
              return
            }
          }catch(err){
              console.log(err)
          }
        }
        
        getSession()
    }, [])

    const validateEmail = () =>{
        emailMessage.current.style.display = 'none';
        emailInput.current.style.border ='black 1px solid';
        setValidEmail(false);

        let emailPattern = /^([^\s])+@([^\s]+\.)*sfsu\.edu$/;

        if (email.match(emailPattern) == null){
            emailMessage.current.style.display = 'block';
            emailInput.current.style.border ='red 2px solid';
        } else{
            setValidEmail(true);
        }
    }

    const validatePassword = () => {
        passwordMessage.current.style.display = 'none';
        passwordInput.current.style.border ='black 1px solid';
        setValidPassword(false);

        let passwordPattern = /^\S{4,20}$/;

        if (password.match(passwordPattern) == null){
            passwordInput.current.style.border ='red 2px solid';
            passwordMessage.current.style.display = 'block';
        } else{
            setValidPassword(true);
        }
    }
    const testSession = async() =>{
        try{
            const response = await axios.get(`/api/test_sessions`)
            console.log("test session response: " + JSON.stringify(response))
        }catch(err){
            console.log(err)
        }
    }

    const login = async () => {
        if((validEmail == true) && (validPassword == true)){
            // Handle login
            try{
                const response = await axios.get(`/api/customers_get_email?email=${email}`)
                const user = response.data[0]
                console.log("user: " + JSON.stringify(user))
                const valid = passwordUtil.validPassword(password, user.hash, user.salt)
                if(valid){
                    try{
                        const response = await axios.get(`/api/customer_login?customer_id=${user.customer_id}&email=${user.email}`)
                        console.log("login response: "+JSON.stringify(response))
                        router.push(`/`)
                    }catch(error){
                        console.log(error)
                    }
                }else{
                    console.log('*login* not valid')
                }
            }catch(error){
                console.log(error)
            }
        } else{
            validateEmail();
            validatePassword();
        }
    }
  
    return (
        <div>
            <NavBar/>
            <div className={styles.form}>
                <h1>Gateway Login</h1>
                <div >
                    <input className={styles.floating}
                        id={styles.email}
                        value={email} placeholder='Email'
                        onChange={e => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        ref={emailInput}
                        required/>
                    <div id={styles.emailMessage} ref={emailMessage}>Please enter a valid SFSU email</div>
                </div>
                <div >
                    <input className={styles.floating}
                        id={styles.password}
                        type="password" placeholder='Password'
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        ref={passwordInput}
                        required/>
                    <div id={styles.passwordMessage} ref={passwordMessage}>Password must be 4-20 characters</div>
                </div>
                <Link href=''><p>Forgot Password?</p></Link>
                <div>
                    <button className={styles.signInUpButton} onClick={login}>Login</button>
                </div>
                <div>
                    <p>Don't have an account?</p>
                    <Link href='../../signup/customer'><button className={styles.signInUpButton}>Sign up</button></Link>
                </div>
            </div>
        </div>
    )
}