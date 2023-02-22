import Link from 'next/link';

export default function About(){
    return (
        <>
            <h2>
                <Link href='/'>Back to home</Link>
            </h2>
            <h1>Software Engineering class SFSU</h1>
            <h2>Spring, 2023</h2>
            <h2>Section 03</h2>
            <h2>Team 06</h2>
            <h2>
                <Link href='/about/justin'>Justin Shin, team lead</Link>
            </h2>
        </>
    )
}