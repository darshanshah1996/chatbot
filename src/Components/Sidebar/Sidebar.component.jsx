import { useContext, useState } from "react";

import { SettingsContext } from "../../Context/SettingsContext";
import styles from "./Sidebar.module.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import ModelDropdown from "./ModelDropdown/ModelDropdown.component";

export default function Sidebar() {
  const { updateShowSidebar } = useContext(SettingsContext);
  const [tabValue, setTabValue] = useState("LLM");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderSelectedTab = () => {
    switch (tabValue) {
      case "LLM":
        return <ModelDropdown />;
      case "AI Tab":
        return <p>AI Tab</p>;
      default:
        return <ModelDropdown />;
    }
  };

  return (
    <div className={`${styles.container} settings-sidebar`}>
      <button
        onClick={() => updateShowSidebar(false)}
        className={styles.closeSidebar}
      >
        X
      </button>
      <h1 className={`${styles.title}`}>Settings</h1>
      <p>Configure app behavior</p>
      <Box sx={{ width: "100%", typography: "body1", marginTop: "1rem" }}>
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiButtonBase-root": {
                color: "#c4bfbf !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#c4bfbf",
              },
            }}
          >
            <TabList onChange={handleChange} aria-label="Settings Tab">
              <Tab label="LLM" value="LLM" />
              <Tab label="AI Tab" value="AI Tab" />
            </TabList>
          </Box>
        </TabContext>
        {renderSelectedTab()}
      </Box>
    </div>
  );
}
