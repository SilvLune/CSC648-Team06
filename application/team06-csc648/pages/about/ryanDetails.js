import Link from 'next/link';
import styles from "../../styles/Home.module.css";

const paragraph = "I'm the GitHub Master, in charge of keeping the code neat, cohesive, and organized for release."

export default function RyanDetails() {
    return (
        <div className={styles.main}>
            <Link className={styles.description} href='/aboutHome'>Back</Link>
            <h1 className={styles.title}>Ryan Scott</h1>
            <img src='/portrates/Ryan_Portrait.jpg' alt="Ryan Scott" width="250" height="300"></img>
            <p classname={styles.description}>Email: rscott10@sfsu.edu</p>
            <p classname={styles.description}>{paragraph}</p>
        </div>
    )
}