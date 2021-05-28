import { Paper } from '@material-ui/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabListContainer from './TabListContainer';
import './styles.css';
import { createTabListContainerWithTabList, selectTabListContainerList } from './tab.slice';

export default function App() {
  const dispatch = useDispatch();
  const tabListContainerList = useSelector(selectTabListContainerList);

  useEffect(() => {
    if (tabListContainerList.length === 0) {
      dispatch(createTabListContainerWithTabList());
    }
  }, [tabListContainerList, dispatch]);

  return (
    <Paper
      style={{
        height: '800px',
        width: '800px',
        backgroundColor: 'gray',
        display: 'flex',
      }}
    >
      {tabListContainerList.map((tlc, index, array) => (
        <TabListContainer
          key={tlc}
          tabListContainerId={tlc}
          width={100 / array.length}
          height={100}
          index={index}
          parentTabListDirection='horizontal'
          parentChildrenLength={array.length}
        />
      ))}
    </Paper>
  );
}
