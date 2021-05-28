import { TabListContainerData } from './tab.slice';
import _ from 'lodash';

export const cleanupTabListContainer = (
  tabListContainerData: TabListContainerData,
  tabListContainerId: string,
  tabListContainerList: string[]
): { tabListContainerData: TabListContainerData; tabListContainerList: string[] } => {
  let newTabListContainerData = _.cloneDeep(tabListContainerData);
  let newTabListContainerList = _.cloneDeep(tabListContainerList);

  const parentTabListContainerId = newTabListContainerData[tabListContainerId].parentTabListContainerId;
  delete newTabListContainerData[tabListContainerId];

  if (parentTabListContainerId) {
    const newParentTabListContainerObject = _.cloneDeep(tabListContainerData[parentTabListContainerId]);
    newParentTabListContainerObject.tabListContainer = newParentTabListContainerObject.tabListContainer.filter((tlc) => tlc !== tabListContainerId);

    if (newParentTabListContainerObject.tabListContainer.length === 0) {
      const response = cleanupTabListContainer(newTabListContainerData, parentTabListContainerId, tabListContainerList);
      newTabListContainerData = response.tabListContainerData;
      newTabListContainerList = response.tabListContainerList;
    } else {
      newTabListContainerData[parentTabListContainerId] = newParentTabListContainerObject;
    }
  } else {
    newTabListContainerList = newTabListContainerList.filter((tl) => tl !== tabListContainerId);
  }

  return { tabListContainerData: newTabListContainerData, tabListContainerList: newTabListContainerList };
};
