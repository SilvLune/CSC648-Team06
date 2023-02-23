import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Justin(){
    return (
        <Link className={styles.card} href='/about/justinDetails'>
            <img src='/portrates/Self_Portrate.PNG' alt="Justin Shin" width="250" height="300"></img>
            <h1>Justin Shin</h1>
            <h3>Group Lead</h3>
        </Link>
    )
}