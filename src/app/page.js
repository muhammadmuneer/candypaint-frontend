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
      <p className={styles.headingMain}>CANDYPAINT</p>
      <p className={styles.heading1}>GEOSOCIAL </p>
      <p className={styles.heading2}>EXPERIENTIAL ECONOMY</p>
      <p className={styles.heading3}>GLITZ TYPE SYNC</p>
      <div className={styles.tab_container}>
        <div>
          <p className={styles.mobileS}>New fam new revenue new clout </p>
          <p className={styles.mobileSS}>access platform experience with same url on mobile</p>
        </div>
        <div>
          <Link href='/signup' legacyBehavior>
            <a className={styles.tab_button}>Sign Up</a>
          </Link>
          <Link href='/login' legacyBehavior>
            <a className={styles.tab_button}>Login</a>
          </Link>
        </div>
      </div>
    </section>
  );
}

