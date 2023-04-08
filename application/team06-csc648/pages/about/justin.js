 import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Justin(){
    return (
        <Link className={styles.card} href='/about/justinDetails'>
            <Image src='/portrates/Self_Portrate.PNG' alt="Justin Shin" width="250" height="300"></Image>
            <h1>Justin Shin</h1>
            <h3>Group Lead</h3>
        </Link>
    )
}