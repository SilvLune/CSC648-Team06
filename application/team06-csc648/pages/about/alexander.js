import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Alexander(){
    return (
        <Link className={styles.card} href='/about/alexanderDetails'>
            <Image src='/portrates/Alexander.png' alt="Alexander Griffin" width="250" height="300"></Image>
            <h1>Alexander Scott Griffin</h1>
            <h3>Front End Lead</h3>
        </Link>
    )
}