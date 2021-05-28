import { Paper, Box } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabListContainer from "./TabListContainer";
import "./styles.css";
import {
  createTabListContainerWithTabList,
  selectTabListContainerList
} from "./tab.slice";

export default function App() {
  const dispatch = useDispatch();
  const tabListContainerList = useSelector(selectTabListContainerList);

  useEffect(() => {
    if (tabListContainerList.length === 0) {
      dispatch(createTabListContainerWithTabList());
    }
  }, [tabListContainerList, dispatch]);

  return (
    <Box>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>left click on tab name = "split right"</span>
        <span>right click on tab name = "split down"</span>
        <span>
          click on "closing icon" = removing the tab (and also removing the
          tablist if empty)
        </span>

        <span>
          if no tablist is present, the initial tablist with "tab1" and "tab2"
          will be regenerated
        </span>
      </div>
      <Paper
        style={{
          height: "800px",
          width: "800px",
          backgroundColor: "gray",
          display: "flex"
        }}
      >
        {tabListContainerList.map((tlc, index, array) => (
          <TabListContainer
            key={tlc}
            tabListContainerId={tlc}
            width={100 / array.length}
            height={100}
            index={index}
            parentTabListDirection="horizontal"
            parentChildrenLength={array.length}
          />
        ))}
      </Paper>
    </Box>
  );
}
