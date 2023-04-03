import SearchBar from './searchBar.js';
import Link from 'next/link';
import styles from '@/styles/NavBar.module.css';

const NavBar = () => {
    return(
        <div className={styles.navBar}>
          <Link className={styles.logo} href='/'><h1>Gateway</h1></Link>
          <SearchBar/>
          <div className={styles.buttons}>
            <button>Login</button>
            <button>Shopping cart</button>
          </div>
          <div className={styles.links}>
            <Link href='/aboutHome'>About us</Link>
            <Link href='/'>Driver</Link>
            <Link href='/'>Restaurant</Link>
          </div>
        </div>
    );
}

export default NavBar;