import React from 'react';
import Header from '../components/Header';
import MicIcon from '../components/MicIcon';
import ChatIcon from '../components/ChatIcon';
import Social from '../components/Social';
import landingsettings from '../landingsettings.json';
const styles = await import(landingsettings.app === 'travel' ? './travel-home.module.scss' : './events-home.module.scss');

export default function Landing() {
  return (
    <div className={styles.landing}>
      <div className={styles.root}>
        <Header />
        <div className={styles.container}>
          <h1>{landingsettings.app_header.map((line: string, idx: number) => (
            <React.Fragment key={idx}>
              {line}
              {idx < landingsettings.app_header.length - 1 && <br />}
            </React.Fragment>
          ))}</h1>
          <p>{landingsettings.app_description}</p>
        </div>
        <a href="/app">
            <div className={styles.micContainer}>
            {landingsettings.app_icon === 'chat' ? (
              <ChatIcon
              className={styles.micIcon}
              role="button"
              aria-label="Start chat"
              tabIndex={0}
              />
            ) : (
              <MicIcon
              className={styles.micIcon}
              role="button"
              aria-label="Start recording"
              tabIndex={0}
              />
            )}
            </div>
        </a>
        <Social />
      </div>
    </div>
  );
}
