'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user data is in local storage
    const userData = localStorage.getItem('userData');

    if (userData) {
      // If userData exists, redirect to the dashboard
      router.push('/dashboard');
    }
    // If no userData, do nothing and stay on this page
  }, [router]); // Dependency array includes router to prevent unnecessary re-renders

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

