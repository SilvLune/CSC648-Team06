import Link from 'next/link';
import styles from "../../styles/Home.module.css";

const paragraph = 'As a front end  lead, my primary responsibilities revolve around communication and management of the appearance of the website. I am here to lead my team sub-team to the finish line by organizing development of the front-end along with the project-lead  '

export default function AlexanderDetails(){
    return (
        <div className={styles.main}>
            <Link className={styles.description} href='/aboutHome'>Back</Link>
            <h1 className={styles.title}>Alexander Griffin</h1>
            <img src='/portrates/Alexander.png' alt="Alexander Griffin" width="250" height="300"></img>
            <p classname={styles.description}>Email: agriffi1@mail.sfsu.edu</p>
            <p classname={styles.description}>{paragraph}</p>
        </div>
    )
}