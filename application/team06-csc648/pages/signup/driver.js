import {useState, useRef, useEffect} from "react";
import NavBar from '../components/navBar';
import styles from '@/styles/Signup.module.css'
import axios from "axios";
import passwordUtil from '../utils/passwordUtils'

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phone, setPhone] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [license, setLicense] = useState('');
    const [insurance, setInsurance] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    const [validName, setValidName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validPassword2, setValidPassword2] = useState(false);
    const [validPhone, setValidPhone] = useState(false);
    const [validLicense, setValidLicense] = useState(false);
    const [validInsurance, setValidInsurance] = useState(false);
    
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
    const licenseMessage = useRef();
    const insuranceMessage = useRef();

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

        let emailPattern = /^([^\s])+@([^\s]+\.)*([^\s]+)\.([a-zA-Z]+)$/;

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

    const validateLicense = () => {
        licenseMessage.current.style.display = 'none';
        setValidLicense(false);

        if (license == ''){
            licenseMessage.current.style.display = 'block';
        } else{
            setValidLicense(true);
        }
    }

    const validateInsurance = () => {
        insuranceMessage.current.style.display = 'none';
        setValidInsurance(false);

        if (insurance == ''){
            insuranceMessage.current.style.display = 'block';
        } else{
            setValidInsurance(true);
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

    const getLicense = async (e) => {
        if(e.target.files[0] == undefined){
            return;
        }
        let file = e.target.files[0];
        const blob = await fetch(URL.createObjectURL(file)).then(r => r.blob());
        let licenseArray = new Uint8Array(await blob.arrayBuffer())

        setLicense(licenseArray)
        //console.log(license)
    }

    const getInsurance = async (e) => {
        if(e.target.files[0] == undefined){
            return;
        }
        let file = e.target.files[0];
        const blob = await fetch(URL.createObjectURL(file)).then(r => r.blob());
        let insuranceArray = new Uint8Array(await blob.arrayBuffer())

        setInsurance(insuranceArray)
        //console.log(insurance)
    }

    const signup = async (e) => {
        //console.log(validEmail, validPassword, validName, validPhone, agreement, validPassword2, validLicense, validInsurance)
        if((validEmail == true) && (validPassword == true) && (validName == true) && (validPhone == true)
            && (agreement == true) && (validPassword2 == true) && (validLicense == true) && (validInsurance == true)){
            // Handle sign up
            if(license.length > 65535){
                setSignupMessage("License picture cannot be larger than 64kB");
                return
            }
            if(insurance.length > 65535){
                setSignupMessage("Insurance picture cannot be larger than 64kB");
                return
            }

            try {
                const res = await axios.post('/api/drivers', {
                    name: name,
                    email: email,
                    phone: phone,
                    password: password,
                    license: license,
                    licenseSize: license.length,
                    insurance: insurance,
                    insuranceSize: insurance.length,
                    });
                setSignupMessage("Your account has been successfully created");
            } catch(error) {
                console.log(error.response.data);
                setSignupMessage("An error occurred while creating your account");
            }
        } else{
            validateEmail();
            validatePassword();
            validatePassword2();
            validateName();
            validatePhone();
            validateLicense();
            validateInsurance();
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

    useEffect(() => {
        validateLicense()
      }, [license])

    useEffect(() => {
        validateInsurance()
      }, [insurance])
  
    return (
        <div>
            <NavBar/>
            <div className={styles.form}>
                <h1>Gateway Driver Signup</h1>
                <div>
                    <input className={styles.floating}
                        id={styles.name}
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
                        value={email} placeholder='Email'
                        onChange={e => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        ref={emailInput}
                        required/>
                    <div id={styles.emailMessage} ref={emailMessage}>Please enter a valid email</div>
                </div>
                <div>
                    <input className={styles.floating}
                        id={styles.phone}
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
                        type="password" placeholder='Confirm password'
                        value={password2} 
                        onChange={e => setPassword2(e.target.value)}
                        onBlur={validatePassword2}
                        ref={password2Input}
                        required/>
                    <div id={styles.password2Message} ref={password2Message}>Confirm your password by entering it again</div>
                </div>
                <div>
                    <label for="license">Upload your driver's license</label>
                    <input className={styles.button}
                        type="file" 
                        name="license" 
                        onChange={e => getLicense(e)}
                        accept="image/*" 
                        required/>
                    <div id={styles.licenseMessage} ref={licenseMessage}>Please add your driver's license</div>
                </div>
                <div>
                    <label for="insurance">Upload your proof of insurance</label>
                    <input className={styles.button}
                        type="file" 
                        name="insurance" 
                        onChange={e => getInsurance(e)}
                        accept="image/*" 
                        required/>
                    <div id={styles.insuranceMessage} ref={insuranceMessage}>Please add your proof of insurance</div>
                </div>
                <div>
                    <input className={styles.button} type="checkbox" 
                    name="agreement" 
                    value={agreement}
                    onClick={agree}
                    required/>
                    <label for="agreement">I agree to the terms and services</label>
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