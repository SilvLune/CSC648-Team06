import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Ryan() {
    return (
        <Link className={styles.card} href='/about/ryanDetails'>
            <img src='/portrates/Ryan_Portrait.jpg' alt="Ryan Scott" width="250" height="300"></img>
            <h1>Ryan Scott</h1>
            <h3>GitHub Master</h3>
        </Link>
    )
}