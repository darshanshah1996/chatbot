import { useContext, useState } from "react";

import { SettingsContext } from "../../Context/SettingsContext";
import styles from "./Sidebar.module.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import ModelDropdown from "./ModelDropdown/ModelDropdown.component";
import NetworkPermission from "./NetworkPermission/NetworkPermission.component";

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
      case "Network Access":
        return <NetworkPermission />;
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
      <p className={`${styles.description}`}>Configure app behavior</p>
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
              {window?.electronAPI?.getSystemIPAddress && (
                <Tab label="Network Access" value="Network Access" />
              )}
            </TabList>
          </Box>
        </TabContext>
        {renderSelectedTab()}
      </Box>
    </div>
  );
}
