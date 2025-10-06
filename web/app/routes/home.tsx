import { DesignConfiguration, type Design } from "store/design";
import MicIcon from "../../components/micicon";
import styles from "./home.module.scss";
import { useState, useEffect } from "react";

export function meta() {
  return [
    { title: "BuildEvents by Contoso" },
    { name: "description", content: "Making Things Happen since 1935" },
  ];
}

const defaultDesign: Design = {
  id: "default",
  background: "/images/background.jpg",
  default: true,
  logo: "",
  title: "BuildEvents",
  sub_title: "by Contoso",
  description: "Making Things Happen since 1935",
};

export default function Home() {
  const [design, setDesign] = useState<Design>(defaultDesign);

  useEffect(() => {
    const fetchDesign = async () => {
      const designConfig = new DesignConfiguration();
      try {
        const defaultDesign = await designConfig.fetchDefaultDesign();
        setDesign(defaultDesign);
      } catch (error) {
        console.error("Error fetching default design:", error);
      }
    };

    fetchDesign();
  }, []);

  const { background, logo, title, sub_title, description } = design;


  return (
    <div
      className={styles.landing}
      style={{ backgroundImage: `url('${background}')` }}
    >
      <div className={styles.root}>
        <div className={styles.container}>
          <h1>
            What can we
            <br />
            start working on?
          </h1>
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
      </div>
    </div>
  );
}
