import Link from 'next/link';
import styles from '../../styles/Home.module.css';
const paragraph = 'As a group lead, my primary responsibilities revolve around communication and management.  I am here to lead my team to the finish line by organizing development flow, establishing a healthy relationship with the customer, and to pull my teammates together into one unified powerhouse.  '

export default function Justin(){
    return (
        <div className={styles.card}>
            <img src='/portrates/Self_Portrate.PNG' alt="Justin Shin" width="250" height="300"></img>
            <h1>Justin Shin</h1>
            <p>Email: jshin7@mail.sfsu.edu</p>
            <h3>Group Lead</h3>
            <p>{paragraph}</p>
        </div>
    )
}