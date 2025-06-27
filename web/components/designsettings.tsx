import { useLocalStorage } from "store/uselocalstorage";
import { useMediaDevices } from "store/usemediadevice";
import { GrPowerReset } from "react-icons/gr";
import styles from "./designsettings.module.scss";
import { VscNewFile, VscSave, VscStarEmpty } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";

const DesignSettings = () => {
  return (
    <>
      <div className={styles.toolbar}>
        <div>
          <select
            id="config"
            name="config"
            className={styles.selection}
            title="Select Configuration"
          >
            <option>one</option>
            <option>two</option>
            <option>three</option>
          </select>
        </div>
        <button className={styles.icon} title="New">
          <VscNewFile size={22} />
        </button>
        <button className={styles.icon} title="Save">
          <VscSave size={22} />
        </button>
        <button className={styles.icon} title="Set As Default">
          <VscStarEmpty size={22} />
        </button>
        <button className={styles.icon} title="Remove">
          <MdDeleteOutline size={22} />
        </button>
      </div>
      <div className={styles.settings}>
        <div className={styles.control}>
          <div className={styles.label}>Id:</div>
          <input
            id="id"
            name="id"
            type="text"
            title="Id"
            className={styles.textInput}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.label}>Logo:</div>
          <input
            id="logo"
            name="logo"
            type="text"
            title="Logo"
            className={styles.textInput}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.label}>Background Image:</div>
          <input
            id="backgroundImage"
            name="backgroundImage"
            type="text"
            title="Logo"
            className={styles.textInput}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.label}>Title:</div>
          <input
            id="title"
            name="title"
            type="text"
            title="Title"
            className={styles.textInput}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.label}>Sub Title:</div>
          <input
            id="subTitle"
            name="subTitle"
            type="text"
            title="Sub Title"
            className={styles.textInput}
          />
        </div>
        <div className={styles.grow}></div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.resetButton}
            title="Reset to default settings"
          >
            <GrPowerReset size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default DesignSettings;
