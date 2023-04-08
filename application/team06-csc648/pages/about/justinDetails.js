import Link from 'next/link';
import styles from "../../styles/Home.module.css";

const paragraph = 'As a group lead, my primary responsibilities revolve around communication and management.  I am here to lead my team to the finish line by organizing development flow, establishing a healthy relationship with the customer, and to pull my teammates together into one unified powerhouse.  '

export default function JustinDetails(){
    return (
        <div className={styles.main}>
            <Link className={styles.description} href='/aboutHome'>Back</Link>
            <h1 className={styles.title}>Justin Shin</h1>
            <Image src='/portrates/Self_Portrate.PNG' alt="Justin Shin" width="250" height="300"></Image>
            <p classname={styles.description}>Email: jshin7@mail.sfsu.edu</p>
            <p classname={styles.description}>{paragraph}</p>
        </div>
    )
}