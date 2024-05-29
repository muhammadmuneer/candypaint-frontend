import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
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
    </main>
  )
}
