import React from "react";
import Title from "../components/title";
import styles from "./travellayout.module.scss";
import { type User } from "../store/useuser";

type LayoutProps = {
  children: React.ReactNode;
  version: string;
  user?: User;
};

const Layout: React.FC<LayoutProps> = ({ children, version, user }) => (
  <div className={styles.layout}>
    <Title text="Vibe Travel" version={version} user={user} />
    <main className={styles.main}>{children}</main>
  </div>
);

export default Layout;
