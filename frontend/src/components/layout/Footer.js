import styles from "../layout/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        <span className="bold">Sopa</span> &copy; 2022
      </p>
    </footer>
  );
}

export default Footer;
