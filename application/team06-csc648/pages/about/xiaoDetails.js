import Link from 'next/link';
import styles from "../../styles/Home.module.css";

const paragraph = 'As the backend support for our team, my responsibility is to manage the database for our website'

export default function XiaoDetails(){
    return (
        <div className={styles.main}>
            <Link className={styles.description} href='/aboutHome'>Back</Link>
            <h1 className={styles.title}>Xiao Deng</h1>
            <img src='/portrates/xiao.PNG' alt="Xiao Deng" width="250" height="300"></img>
            <p classname={styles.description}>Email: xdeng6@mail.sfsu.edu</p>
            <p classname={styles.description}>{paragraph}</p>
        </div>
    )
}