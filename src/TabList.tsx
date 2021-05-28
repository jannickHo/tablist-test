import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import { Direction, removeTab, selectTabListData } from './tab.slice';
import { CloseOutlined } from '@material-ui/icons';

export interface TabListProps {
  tabListId: string;
  tabListContainerId: string;
  split: (direction: Direction, tabId: string) => void;
}

export default function TabList({ tabListId, tabListContainerId, split }: TabListProps) {
  const tabList = useSelector(selectTabListData(tabListId));
  const dispatch = useDispatch();

  const handleClick = (tabId: string) => () => {
    split('right', tabId);
  };

  const handleContextClick = (tabId: string) => (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    split('down', tabId);
  };

  const handleCloseTab = (tabId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('close tab', tabId);
    dispatch(removeTab({ tabId, tabListId, tabListContainerId }));
  };

  return (
    <Box
      key={tabListContainerId}
      style={{
        height: '100%',
        width: '100%',
        border: '1px solid black',
      }}
    >
      <Box
        id='tabListToolBar'
        style={{
          height: '64px',
          width: '100%',
          backgroundColor: 'blue',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        {tabList.tabs.map((tab) => (
          <div key={`${tabListId}-${tab}`} style={{ height: '100%', display: 'flex', alignItems: 'center', borderRight: '1px solid darkBlue' }}>
            <span style={{ marginLeft: '8px' }} onClick={handleClick(tab)} onContextMenu={handleContextClick(tab)}>
              {tab}
            </span>
            <IconButton onClick={handleCloseTab(tab)} style={{ color: 'white' }}>
              <CloseOutlined />
            </IconButton>
          </div>
        ))}
      </Box>
    </Box>
  );
}
