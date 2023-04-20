import SearchBar from './searchBar.js';
import Link from 'next/link';
import styles from '@/styles/NavBar.module.css';


const NavBar = () => {
  
    return(
        <div className={styles.navBar}key="key1">
          <Link className={styles.logo} href='/'><h1>Gateway</h1></Link>
          <div className={styles.center}>
            <p className={styles.title}>CSC648/848 Spring 2023 Team06</p>
            <SearchBar/>
          </div>
          <div className={styles.buttons}>
            <Link href='/entrance/login'>Login</Link>
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