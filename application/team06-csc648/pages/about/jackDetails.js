import Link from 'next/link';
import styles from "../../styles/Home.module.css";

const paragraph = 'As a back end lead, I am responsible for routing and server client communication. I have to learn more about Learn express, next js and API requests.'

export default function JackDetails(){
    return (
        <div className={styles.main}>
            <Link className={styles.description} href='/aboutHome'>Back</Link>
            <h1 className={styles.title}>Jack Lee</h1>
            <img src='/portrates/Jack.jpg' alt="Jack Lee" width="250" height="300"></img>
            <p classname={styles.description}>Email: klee52@mail.sfsu.edu</p>
            <p classname={styles.description}>{paragraph}</p>
        </div>
    )
}