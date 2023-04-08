import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Jack(){
    return (
        <Link className={styles.card} href='/about/jackDetails'>
            <Image src='/portrates/Jack.jpg' alt="Jack Lee" width="250" height="300"></Image>
            <h1>Jack Lee</h1>
            <h3>Back End Lead</h3>
        </Link>
    )
}