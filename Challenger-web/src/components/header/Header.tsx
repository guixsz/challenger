import { Link } from 'react-router-dom'; 
import styles from './Header.module.css'; 

export default function Header() {
  return (
 <header className={styles.header}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link to="/" className={styles.link}>Challenger</Link>
        </div>

        <nav className={styles.navLinks}>
          <Link to="/" className={styles.link}>
            Dashboard
          </Link>
          <Link to="/person" className={styles.link}>
            Cadastrar Pessoa
          </Link>
          <Link to="/transaction" className={styles.link}>
            Transações
          </Link>
        </nav>
      </div>
    </header>
  );
}