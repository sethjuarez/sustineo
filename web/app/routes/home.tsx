import { DesignConfiguration, type Design } from "store/design";
import MicIcon from "../../components/micicon";
import styles from "./home.module.scss";
import type { Route } from "../+types/root";

export async function loader({ params }: Route.LoaderArgs) {
  const designConfig = new DesignConfiguration();
  try {
    const defaultDesign = await designConfig.fetchDefaultDesign();
    return defaultDesign;
  } catch (error) {
    console.error("Error fetching default design:", error);
  }
  // You can perform any data fetching or initialization here
  // For example, you might want to fetch user data or initial settings
  const design: Design = {
    id: "default",
    background: "/images/background.jpg",
    default: true,
    logo: "",
    title: "BuildEvents",
    sub_title: "by Contoso",
    description: "Making Things Happen since 1935",
  };

  return design;
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "BuildEvents by Contoso" },
      { name: "description", content: "Making Things Happen since 1935" },
    ];
  }
  const title = `${data["title"] || "BuildEvents"} ${
    data["sub_title"] || "by Contoso"
  }`;
  const description = data["description"] || "Making Things Happen since 1935";
  return [{ title: title }, { name: "description", content: description }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { background, logo, title, sub_title, description } =
    loaderData as unknown as Design;


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
