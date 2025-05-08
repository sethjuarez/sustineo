import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">Build Events by Contoso</a>
      </div>
      <div className={styles.navWrapper}>
        <nav className={styles.nav}>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
          <a href="/reviews">Reviews</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
