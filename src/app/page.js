'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('access_token');
    if (userData) {
      router.push('/dashboard');
    }
  }, [router])

  return (
    <main>
      <App />
    </main>
  );
}

function App() {
  return (
    <section className={styles.main}>
      <h1>CANDYPAINT</h1>
      <h2>GEOSOCIAL EXPERIENTIAL ECONOMY</h2>
      <h2>GLITZ TYPE SYNC</h2>
      <div className={styles.tab_container}>
        <Link href='/signup' legacyBehavior>
          <a className={styles.tab_button}>Sign Up</a>
        </Link>
        <Link href='/login' legacyBehavior>
          <a className={styles.tab_button}>Login</a>
        </Link>
      </div>
    </section>
  );
}

