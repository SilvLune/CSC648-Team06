import {useState, useRef} from "react";
import NavBar from '../components/navBar';
import styles from '@/styles/Signup.module.css'

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phone, setPhone] = useState('');
    const [agreement, setAgreement] = useState(false);

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
            password2Input.current.style.border ='red 2px solid';
            password2Message.current.style.display = 'block';
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

    const signup = () => {
        if((validEmail == true) && (validPassword == true) && (validName == true) && (validPhone == true)
            && (agreement == true) && (validPassword2 == true)){
            // Handle sign up
        } else{
            validateEmail();
            validatePassword();
            validatePassword2();
            validateName();
            validatePhone();

            if(agreement == false){
                agreementMessage.current.style.display = 'block';
            }
        }
    }
  
    return (
        <div>
            <NavBar/>
            <div>
                <h1>Gateway</h1>
                <div>
                    <input 
                        id={styles.name}
                        value={name} placeholder='Name'
                        onChange={e => setName(e.target.value)}
                        onBlur={validateName}
                        ref={nameInput}
                        required/>
                    <div id={styles.nameMessage} ref={nameMessage}>Please enter a real name</div>
                </div>
                <div>
                    <input 
                        id={styles.email}
                        value={email} placeholder='Email'
                        onChange={e => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        ref={emailInput}
                        required/>
                    <div id={styles.emailMessage} ref={emailMessage}>Please enter a valid SFSU email</div>
                </div>
                <div>
                    <input 
                        id={styles.phone}
                        value={phone} placeholder='Phone Number'
                        onChange={e => setPhone(e.target.value)}
                        onBlur={validatePhone}
                        ref={phoneInput}
                        required/>
                    <div id={styles.phoneMessage} ref={phoneMessage}>Please enter a valid phone number</div>
                </div>
                <div>
                    <input 
                        id={styles.password}
                        type="password" placeholder='Password'
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        ref={passwordInput}
                        required/>
                    <div id={styles.passwordMessage} ref={passwordMessage}>Password must be 4-20 characters</div>
                </div>
                <div>
                    <input 
                        id={styles.password2}
                        type="password" placeholder='Confirm password'
                        value={password2} 
                        onChange={e => setPassword2(e.target.value)}
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
                    <label for="agreement">I agree to the terms and services</label>
                    <div id={styles.agreementMessage} ref={agreementMessage}>Please agree to the terms and services</div>
                </div>
                <div>
                    <button onClick={signup}>Sign up</button>
                </div>
            </div>
        </div>
    )
}