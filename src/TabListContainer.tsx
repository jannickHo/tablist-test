import { Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import TabList from "./TabList";
import "./styles.css";
import {
  Direction,
  DirectionAxis,
  selectTabListContainerData,
  splitTabListContainerToParent,
  splitTabListContainerToNewTabListContainer
} from "./tab.slice";

export interface TabListContainerProps {
  parentTabListDirection: DirectionAxis;
  parentTabListContainerId?: string;
  index: number;
  tabListContainerId: string;
  width: number;
  height: number;
}

export default function TabListContainer({
  parentTabListDirection,
  parentTabListContainerId,
  index,
  tabListContainerId,
  width,
  height
}: TabListContainerProps) {
  const dispatch = useDispatch();
  const tabListContainerObject = useSelector(
    selectTabListContainerData(tabListContainerId)
  );

  const split = (direction: Direction, tabId: string) => {
    if (
      ((direction === "left" || direction === "right") &&
        parentTabListDirection === "horizontal") ||
      ((direction === "up" || direction === "down") &&
        parentTabListDirection === "vertical")
    ) {
      console.log("papa", direction, tabId);
      dispatch(
        splitTabListContainerToParent({
          parentTabListContainerId,
          index,
          direction,
          tabId,
          tabListContainerId
        })
      );
    } else {
      console.log("new", direction, tabId);
      dispatch(
        splitTabListContainerToNewTabListContainer({
          parentTabListContainerId,
          tabListContainerId,
          index,
          direction,
          tabId
        })
      );
    }
  };

  const renderContent = () => {
    if (tabListContainerObject.tabListId) {
      return (
        <TabList
          tabListContainerId={tabListContainerId}
          tabListId={tabListContainerObject.tabListId}
          split={split}
        />
      );
    } else {
      return tabListContainerObject.tabListContainer.map(
        (tabListContainerMapId, index, array) => (
          <TabListContainer
            parentTabListDirection={tabListContainerObject.direction}
            parentTabListContainerId={tabListContainerObject.id}
            tabListContainerId={tabListContainerMapId}
            index={index}
            height={
              tabListContainerObject.direction === "vertical"
                ? 100 / array.length
                : 100
            }
            width={
              tabListContainerObject.direction === "horizontal"
                ? 100 / array.length
                : 100
            }
          />
        )
      );
    }
  };

  return (
    <Box
      key={tabListContainerId}
      style={{
        height: `${height}%`,
        width: `${width}%`,
        backgroundColor: "lightgray",
        marginRight: "8px",
        marginLeft: index === 0 ? "8px" : "0px"
      }}
    >
      {renderContent()}
    </Box>
  );
}
