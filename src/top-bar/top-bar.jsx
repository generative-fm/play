import React from 'react';
import AuthButton from '../user/auth-button';
import styles from './top-bar.module.scss';

const TopBar = () => {
  return (
    <header className={styles['top-bar']}>
      <div className={styles['top-bar__title']}>Generative.fm Play</div>
      <div className={styles['top-bar__auth']}>
        <AuthButton />
      </div>
    </header>
  );
};

export default TopBar;