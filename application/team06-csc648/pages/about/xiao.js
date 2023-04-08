import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Xiao(){
    return (
        <Link className={styles.card} href='/about/xiaoDetails'>
            <Image src='/portrates/xiao.PNG' alt="Xiao Deng" width="250" height="300"></Image>
            <h1>Xiao Deng</h1>
            <h3>Backend Support</h3>
        </Link>
    )
}