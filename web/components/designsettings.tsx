import { GrPowerReset } from "react-icons/gr";
import styles from "./designsettings.module.scss";
import { MdDeleteOutline } from "react-icons/md";
import { VscNewFile, VscSave, VscStarEmpty } from "react-icons/vsc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DesignConfiguration, type Design } from "store/design";

const DesignSettings = () => {
  const queryClient = useQueryClient();
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedDesignId, setSelectedDesignId] = useState<string>("");

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["designs"],
    queryFn: async () => {
      const designConfiguration = new DesignConfiguration();
      // Fetch designs from the server
      const designs = await designConfiguration.fetchDesigns();
      if (selectedDesignId === "" && designs.length > 0) {
        const defaultDesign = designs.find((design) => design.default);
        if (defaultDesign) {
          // Set the default design as selected if none is selected
          setSelectedDesignId(defaultDesign.id);
        } else {
          // If no default design, set the first design as selected
          setSelectedDesignId(designs[0].id);
        }
      }
      return designs;
    },
  });

  useEffect(() => {
    if (data && selectedDesignId !== "") {
      const config = data.find((config) => config.id === selectedDesignId);
      setSelectedDesign(config || null);
    }
  }, [data, selectedDesignId]);

  const saveMutation = useMutation({
    mutationFn: async (design: Design) => {
      const designConfiguration = new DesignConfiguration();
      if (design.id === "default") design.id = "default-" + generateUUID();
      if (selectedDesignId && selectedDesignId !== "") {
        // Update existing design
        console.log("Updating design", selectedDesignId, design);
        return await designConfiguration.updateDesign(selectedDesignId, design);
      } else {
        // Create new design
        console.log("Creating new design", design);
        return await designConfiguration.createDesign(design);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
      setSelectedDesignId(data.id);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (designId: string) => {
      const designConfiguration = new DesignConfiguration();
      await designConfiguration.deleteDesign(designId);
      setSelectedDesignId(data?.[0]?.id || ""); // Reset to first design or empty
      setSelectedDesign(data?.[0] || null); // Reset selected design
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (designId: string) => {
      const designConfiguration = new DesignConfiguration();
      await designConfiguration.setDefaultDesign(designId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const handleSave = async () => {
    if (selectedDesign) {
      saveMutation.mutate(selectedDesign);
    }
  };

  const handleRemove = async () => {
    const accept = confirm(
      "Are you sure you want to remove this configuration?"
    );
    if (!accept) return;
    await removeMutation.mutateAsync(selectedDesignId);
  };

  const handleSetDefault = async () => {
    //console.log("Set as default configuration:", selectedConfig);
    if (selectedDesignId === "") {
      return;
    }
    await setDefaultMutation.mutateAsync(selectedDesignId);
  };

  const handleNew = async () => {
    const newDesign: Design = {
      id: `${generateUUID()}`, // Generate a unique ID
      background: "/images/background.jpg",
      default: false,
      logo: "",
      title: "BuildEvents",
      sub_title: "by Contoso",
      description: "",
    };
    setSelectedDesignId("");
    setSelectedDesign(newDesign);
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div>
          <select
            id="design"
            name="design"
            className={styles.selection}
            value={selectedDesignId}
            title="Select Design"
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedDesignId(selectedId);
              if (data) {
                const selectedDesign = data.find(
                  (design) => design.id === selectedId
                );
                setSelectedDesign(selectedDesign || null);
              }
            }}
          >
            {isPending && <option>Loading...</option>}
            {isError && <option>Error: {error.message}</option>}
            {data &&
              data.map((design) => (
                <option key={design.id} value={design.id}>
                  {design.title || design.id}
                  {design.default ? " (default)" : ""}
                </option>
              ))}
          </select>
        </div>
        <button className={styles.icon} title="New" onClick={handleNew}>
          <VscNewFile size={22} />
        </button>
        <button className={styles.icon} title="Save" onClick={handleSave}>
          <VscSave size={22} />
        </button>
        <button
          className={styles.icon}
          title="Set As Default"
          onClick={handleSetDefault}
        >
          <VscStarEmpty size={22} />
        </button>
        <button className={styles.icon} title="Remove" onClick={handleRemove}>
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
            value={selectedDesign?.id || ""}
            onChange={(e) => {
              if (selectedDesign) {
                setSelectedDesign({ ...selectedDesign, id: e.target.value });
              }
            }}
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
            value={selectedDesign?.background || ""}
            onChange={(e) => {
              if (selectedDesign) {
                setSelectedDesign({
                  ...selectedDesign,
                  background: e.target.value,
                });
              }
            }}
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
            value={selectedDesign?.logo || ""}
            onChange={(e) => {
              if (selectedDesign) {
                setSelectedDesign({ ...selectedDesign, logo: e.target.value });
              }
            }}
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
            value={selectedDesign?.title || ""}
            onChange={(e) => {
              if (selectedDesign) {
                setSelectedDesign({ ...selectedDesign, title: e.target.value });
              }
            }}
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
            value={selectedDesign?.sub_title || ""}
            onChange={(e) => {
              if (selectedDesign) {
                setSelectedDesign({
                  ...selectedDesign,
                  sub_title: e.target.value,
                });
              }
            }}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.label}>Description:</div>
          <input
            id="description"
            name="description"
            type="text"
            title="Description"
            className={styles.textInput}
            value={selectedDesign?.description || ""}
            onChange={(e) => {
              if (selectedDesign) {
                setSelectedDesign({
                  ...selectedDesign,
                  description: e.target.value,
                });
              }
            }}
          />
        </div>
        <div className={styles.grow}></div>
      </div>
    </>
  );
};

export default DesignSettings;
