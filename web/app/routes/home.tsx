import Header from '../components/Header';
import MicIcon from '../components/MicIcon';
import Social from '../components/Social';
import styles from './home.module.scss';

export default function Landing() {
  return (
    <div className={styles.landing}>
      <div className={styles.root}>
        <Header />
        <div className={styles.container}>
          <h1>What can we<br />start working on?</h1>
          <p>Talk through your ideas and let's make them reality.</p>
        </div>
        <a href="/app">
          <div className={styles.micContainer}>
            <MicIcon 
              className={styles.micIcon}
              role="button"
              aria-label="Start recording"
              tabIndex={0}
            />
          </div>
        </a>
        <Social />
      </div>
      
      <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2>How Build Events Works</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Voice-Guided Planning</h3>
              <p>Speak your event details, AI guides you through planning.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Smart Recommendations</h3>
              <p>Personalized suggestions for venues, vendors, and more.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>End-to-End Support</h3>
              <p>Help from concept to final execution.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
