import { Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import TabList from './TabList';
import './styles.css';
import { Direction, DirectionAxis, selectTabListContainerData, splitTabListContainerToParent, splitTabListContainerToNewTabListContainer } from './tab.slice';

export interface TabListContainerProps {
  parentTabListDirection: DirectionAxis;
  parentTabListContainerId?: string;
  index: number;
  parentChildrenLength: number;
  tabListContainerId: string;
  width: number;
  height: number;
}

export default function TabListContainer({
  parentTabListDirection,
  parentTabListContainerId,
  index,
  parentChildrenLength,
  tabListContainerId,
  width,
  height,
}: TabListContainerProps) {
  const dispatch = useDispatch();
  const tabListContainerObject = useSelector(selectTabListContainerData(tabListContainerId));

  const split = (direction: Direction, tabId: string) => {
    if (
      ((direction === 'left' || direction === 'right') && parentTabListDirection === 'horizontal') ||
      ((direction === 'up' || direction === 'down') && parentTabListDirection === 'vertical')
    ) {
      dispatch(
        splitTabListContainerToParent({
          parentTabListContainerId,
          index,
          direction,
          tabId,
          tabListContainerId,
        })
      );
    } else {
      dispatch(
        splitTabListContainerToNewTabListContainer({
          parentTabListContainerId,
          tabListContainerId,
          index,
          direction,
          tabId,
        })
      );
    }
  };

  const renderContent = () => {
    if (tabListContainerObject.tabListId) {
      return <TabList tabListContainerId={tabListContainerId} tabListId={tabListContainerObject.tabListId} split={split} />;
    } else {
      return tabListContainerObject.tabListContainer.map((tabListContainerMapId, index, array) => (
        <TabListContainer
          key={tabListContainerMapId}
          parentTabListDirection={tabListContainerObject.direction}
          parentTabListContainerId={tabListContainerObject.id}
          tabListContainerId={tabListContainerMapId}
          index={index}
          parentChildrenLength={array.length}
          height={tabListContainerObject.direction === 'vertical' ? 100 / array.length : 100}
          width={tabListContainerObject.direction === 'horizontal' ? 100 / array.length : 100}
        />
      ));
    }
  };

  return (
    <Box
      id={`rootBox-TabListContainer-${tabListContainerId}`}
      key={tabListContainerId}
      style={{
        height: `${height}%`,
        width: `${width}%`,
        backgroundColor: tabListContainerObject.tabListId ? 'lightgray' : undefined,
        display: 'flex',
        flexDirection: tabListContainerObject.direction === 'vertical' ? 'column' : 'row',
      }}
    >
      {renderContent()}
    </Box>
  );
}
