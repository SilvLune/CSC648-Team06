/**
 * CSC 648 Spring 2023 - Team 6
 * File: driver.js
 * Author: Justin Shin, Konnor Nishimura, Xiao Deng, Jack Lee, Ryan Scott, Alexander Griffin
 * 
 * Description: Generates HTML for about page. 
 */

import Link from 'next/link';
import Justin from './about/justin'
import Konnor from './about/konnor'
import Xiao from './about/xiao'
import Styles from '../styles/Home.module.css'
import Alexander from "@/pages/about/alexander";
import Jack from './about/jack';
import Ryan from './about/ryan';
import NavBar from './components/navBar';

export default function About(){
    return (
        <div className={Styles.main}>
            <NavBar/>
            <Link className={Styles.title} href='/'>Home</Link>
            <p classname={Styles.description}>Software Engineering class SFSU</p>
            <p classname={Styles.description}>Spring, 2023</p>
            <p classname={Styles.description}>Section 03</p>
            <p classname={Styles.description}>Team 06</p>
            
            <div className={Styles.grid}>
                <Justin></Justin>
                <Jack></Jack>
                <Konnor></Konnor>
                <Xiao></Xiao>
                <Ryan></Ryan>
                <Alexander></Alexander>
            </div>

        </div>
    )
}