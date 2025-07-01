import React from "react";
import styles from "./title.module.scss";
import { type User } from "store/useuser";
import { TbUser } from "react-icons/tb";

type Props = {
  text: string;
  subtitle?: string;
  version: string;
  logo?: string;
  user?: User;
};

const Title: React.FC<Props> = ({ text, subtitle, version, logo, user }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {logo && <img src={logo} alt="Logo" className={styles.logoImage} />}
        {!logo && (
          <div className={styles.title}>
            <span className={styles.maintitle} title={version}>
              {text}
            </span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
        )}
      </div>
      <div className={styles.grow} />
      {user && (
        <div className={styles.user}>
          <div>
            <div className={styles.name}>{user.name}</div>
          </div>
          {user.avatar && (
            <img alt={user.name} className={styles.avatar} src={user.avatar} />
          )}
          {!user.avatar && (
            <div className={styles.userIcon}>
              <TbUser size={32} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Title;
