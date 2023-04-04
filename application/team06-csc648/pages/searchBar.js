import React from 'react';
import styles from '@/styles/NavBar.module.css';

const SearchBar = () => {
    const [search, setSearch] = React.useState('');
    return(
        <div className={styles.search}>
            <input value={search} className={styles.searchBar} onChange={e => setSearch(e.target.value)}/>
            <button className={styles.searchButton}>Search</button>
        </div>
    );
}

export default SearchBar;