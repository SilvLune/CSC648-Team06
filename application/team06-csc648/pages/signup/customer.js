/**
 * CSC 648 Spring 2023 - Team 6
 * File: customer.js
 * Author: Konnor Nishimura, Xiao Deng
 * 
 * Description: customer registration page
 */

import {useState, useRef, useEffect} from "react";
import NavBar from '../components/navBar';
import styles from '@/styles/Signup.module.css'
import passwordUtils from '../utils/passwordUtils'
import axios from 'axios';

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phone, setPhone] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [signupMessage, setSignupMessage] = useState('');

    const [validName, setValidName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validPassword2, setValidPassword2] = useState(false);
    const [validPhone, setValidPhone] = useState(false);
    
    const emailInput = useRef();
    const passwordInput = useRef();
    const password2Input = useRef();
    const nameInput = useRef();
    const phoneInput = useRef();

    const emailMessage = useRef();
    const passwordMessage = useRef();
    const password2Message = useRef();
    const nameMessage = useRef();
    const phoneMessage = useRef();
    const agreementMessage = useRef();

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

    const validateName = () =>{
        nameMessage.current.style.display = 'none';
        nameInput.current.style.border ='black 1px solid';
        setValidName(false);

        let namePattern = /^([^\s])+([\s][^\s]+)*$/;

        if (name.match(namePattern) == null){
            nameMessage.current.style.display = 'block';
            nameInput.current.style.border ='red 2px solid';
        } else{
            setValidName(true);
        }
    }
    
    const validateEmail = () =>{
        emailMessage.current.style.display = 'none';
        emailInput.current.style.border ='black 1px solid';
        setValidEmail(false);

        let emailPattern = /^([^\s])+@([^\s]+\.)?sfsu\.edu$/;

        if (email.match(emailPattern) == null){
            emailMessage.current.style.display = 'block';
            emailInput.current.style.border ='red 2px solid';
        } else{
            setValidEmail(true);
        }
    }

    const validatePhone = () =>{
        phoneMessage.current.style.display = 'none';
        phoneInput.current.style.border ='black 1px solid';
        setValidPhone(false);

        let phonePattern = /^(\+[0-9])?(([0-9]{3}(-)?)|(\([0-9]{3}\)))[0-9]{3}(-)?[0-9]{4}$/;

        if (phone.match(phonePattern) == null){
            phoneMessage.current.style.display = 'block';
            phoneInput.current.style.border ='red 2px solid';
        } else{
            setValidPhone(true);
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

    const validatePassword2 = () => {
        password2Message.current.style.display = 'none';
        password2Input.current.style.border ='black 1px solid';
        setValidPassword2(false);

        if (password != password2){
        } else{
            setValidPassword2(true);
        }
    }

    const agree = () => {
        if(agreement == false){
            agreementMessage.current.style.display = 'none';
            setAgreement(true)
        } else{
            setAgreement(false)
        }
    }

    const signup = async (e) => {
        if((validEmail == true) && (validPassword == true) && (validName == true) && (validPhone == true)
            && (agreement == true) && (validPassword2 == true)){
            // Handle sign up
            const saltHash = passwordUtils.genPassword(password)
            const salt = saltHash.salt
            const hash = saltHash.hash

            e.preventDefault();
            try {
                console.log('*signup* full_name: ' + name)
                console.log('*signup* email: ' + email)
                console.log('*signup* phone: ' + phone)
                console.log('*signup* hash: ' + hash)
                console.log('*signup* salt: ' + salt)
                const response = await axios.post('/api/customers_insert',{},{params:{
                    name,
                    email,
                    phone,
                    hash,
                    salt,
                }})

                console.log(response.data)
                setSignupMessage("Your account has been successfully created");

                try{
                    const response2 = await axios.get(`/api/customer_login?customer_id=${response.data.id}&email=${email}`)
                    window.location.href = `/`;
                } catch(error) {
                    console.log(error);
                }
            } catch (error) {
                console.log(error.response.data);
                setSignupMessage("An error occurred while creating your account");
            }
            
        } else{
            validateEmail();
            validatePassword();
            validatePassword2();
            validateName();
            validatePhone();
            if (password != password2){
                password2Input.current.style.border ='red 2px solid';
                password2Message.current.style.display = 'block';
            } else{
                setValidPassword2(true);
            }

            if(agreement == false){
                agreementMessage.current.style.display = 'block';
            }
        }
    }
  
    return (
        <div>
            <NavBar/>
            <div className={styles.form} >
                <h1>Gateway Signup</h1>
                <div>
                    <input className={styles.floating}
                        id={styles.name}
                        maxLength={50}
                        value={name} placeholder='Name'
                        onChange={e => setName(e.target.value)}
                        onBlur={validateName}
                        ref={nameInput}
                        required/>
                    <div id={styles.nameMessage} ref={nameMessage}>Please enter a real name</div>
                </div>
                <div>
                    <input className={styles.floating}
                        id={styles.email}
                        maxLength={50}
                        value={email} placeholder='Email'
                        onChange={e => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        ref={emailInput}
                        required/>
                    <div id={styles.emailMessage} ref={emailMessage}>Please enter a valid SFSU email</div>
                </div>
                <div>
                    <input className={styles.floating}
                        id={styles.phone}
                        maxLength={20}
                        value={phone} placeholder='Phone Number'
                        onChange={e => setPhone(e.target.value)}
                        onBlur={validatePhone}
                        ref={phoneInput}
                        required/>
                    <div id={styles.phoneMessage} ref={phoneMessage}>Please enter a valid phone number</div>
                </div>
                <div>
                    <input className={styles.floating}
                        id={styles.password}
                        maxLength={20}
                        type="password" placeholder='Password'
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        ref={passwordInput}
                        required/>
                    <div id={styles.passwordMessage} ref={passwordMessage}>Password must be 4-20 characters</div>
                </div>
                <div>
                    <input className={styles.floating}
                        id={styles.password2}
                        maxLength={20}
                        type="password" placeholder='Confirm password'
                        value={password2} 
                        onChange={e => setPassword2(e.target.value)}
                        onBlur={validatePassword2}
                        ref={password2Input}
                        required/>
                    <div id={styles.password2Message} ref={password2Message}>Confirm your password by entering it again</div>
                </div>
                <div>
                    <input type="checkbox" 
                    name="agreement" 
                    value={agreement}
                    onClick={agree}
                    required/>
                    <label>I agree to the terms and services</label>
                    <div id={styles.agreementMessage} ref={agreementMessage}>Please agree to the terms and services</div>
                </div>
                <div>
                    <button className={styles.button} onClick={signup}>Sign up</button>
                </div>
                <div>
                  {signupMessage}
                </div>
            </div>
        </div>
    )
}