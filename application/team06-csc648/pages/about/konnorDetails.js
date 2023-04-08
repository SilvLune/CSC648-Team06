import Link from 'next/link';
import styles from "../../styles/Home.module.css";

const paragraph = 'As the front end support, I am responsible for using React to build a framework for our website. My purpose is to make sure the front end of our website functions properly.'

export default function KonnorDetails(){
    return (
        <div className={styles.main}>
            <Link className={styles.description} href='/aboutHome'>Back</Link>
            <h1 className={styles.title}>Konnor Nishimura</h1>
            <Image src='/portrates/Konnor.jpg' alt="Konnor Nishimura" width="250" height="300"></Image>
            <p classname={styles.description}>Email: knishimura@mail.sfsu.edu</p>
            <p classname={styles.description}>{paragraph}</p>
        </div>
    )
}