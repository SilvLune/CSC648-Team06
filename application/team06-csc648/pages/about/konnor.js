import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Konnor(){
    return (
        <Link className={styles.card} href='/about/konnorDetails'>
            <img src='/portrates/Konnor.jpg' alt="Konnor Nishimura" width="250" height="300"></img>
            <h1>Konnor Nishimura</h1>
            <h3>Front End Support</h3>
        </Link>
    )
}