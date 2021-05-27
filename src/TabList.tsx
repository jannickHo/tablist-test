import React from "react";
import { Box } from "@material-ui/core";
import { useSelector } from "react-redux";
import "./styles.css";
import { Direction, selectTabListData } from "./tab.slice";

export interface TabListProps {
  tabListId: string;
  tabListContainerId: string;
  split: (direction: Direction, tabId: string) => void;
}

export default function TabList({
  tabListId,
  tabListContainerId,
  split
}: TabListProps) {
  const tabList = useSelector(selectTabListData(tabListId));

  const handleClick = (tabId: string) => () => {
    split("right", tabId);
  };

  const handleContextClick = (tabId: string) => (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.preventDefault();
    split("down", tabId);
  };

  return (
    <Box
      key={tabListContainerId}
      style={{
        height: "100%",
        width: "100%"
      }}
    >
      <Box
        id="tabListToolBar"
        style={{
          height: "64px",
          width: "100%",
          backgroundColor: "blue",
          display: "flex",
          alignItems: "center",
          color: "white"
        }}
      >
        {tabList.tabs.map((tab) => (
          <span
            style={{ marginLeft: "8px" }}
            key={`${tabListId}-${tab}`}
            onClick={handleClick(tab)}
            onContextMenu={handleContextClick(tab)}
          >
            {tab}
          </span>
        ))}
      </Box>
    </Box>
  );
}
