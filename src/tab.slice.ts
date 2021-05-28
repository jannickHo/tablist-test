import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { cleanupTabListContainer } from './utils';

export type Direction = 'right' | 'left' | 'up' | 'down';
export type DirectionAxis = 'horizontal' | 'vertical' | 'none';

export interface TabListContainer {
  id: string;
  parentTabListContainerId: string | undefined;
  tabListId: string | null;
  direction: DirectionAxis;
  tabListContainer: string[];
}

export interface TabListContainerData {
  [key: string]: TabListContainer;
}

export interface TabList {
  id: string;
  tabs: string[];
}

export interface TabListData {
  [key: string]: TabList;
}

// Define a type for the slice state
export interface TabState {
  tabListContainerData: TabListContainerData;
  tabListData: TabListData;
  tabListContainerList: string[];
}

// Define the initial state using that type
const initialState: TabState = {
  tabListContainerData: {},
  tabListData: {},
  tabListContainerList: [],
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    createTabListContainerWithTabList: (state) => {
      const tabListId = uuidv4();
      const tabListContainerId = uuidv4();

      state.tabListContainerData = {
        ...state.tabListContainerData,
        [tabListContainerId]: {
          id: tabListContainerId,
          parentTabListContainerId: undefined,
          tabListId,
          direction: 'none',
          tabListContainer: [],
        },
      };
      state.tabListData = {
        ...state.tabListData,
        [tabListId]: {
          id: tabListId,
          tabs: ['tab1', 'tab2'],
        },
      };
      state.tabListContainerList = [...state.tabListContainerList, tabListContainerId];
    },
    splitTabListContainerToParent: (
      state,
      action: PayloadAction<{
        parentTabListContainerId?: string;
        tabListContainerId: string;
        index: number;
        direction: Direction;
        tabId: string;
      }>
    ) => {
      const tabListId = uuidv4();
      const tabListContainerId = uuidv4();

      const directionIndex = action.payload.direction === 'right' || action.payload.direction === 'down' ? action.payload.index + 1 : action.payload.index;

      const newTabList: TabList = {
        id: tabListId,
        tabs: [action.payload.tabId],
      };
      const newTabListContainer: TabListContainer = {
        tabListId,
        id: tabListContainerId,
        parentTabListContainerId: action.payload.parentTabListContainerId,
        direction: 'none',
        tabListContainer: [],
      };

      state.tabListContainerData = {
        ...state.tabListContainerData,
        [tabListContainerId]: newTabListContainer,
      };
      state.tabListData = { ...state.tabListData, [tabListId]: newTabList };

      //if no parent then just add to "root" list
      if (!action.payload.parentTabListContainerId) {
        const newTabListContainerList = _.cloneDeep(state.tabListContainerList);
        newTabListContainerList.splice(directionIndex, 0, tabListContainerId);
        state.tabListContainerList = newTabListContainerList;
        //if parent then just add
      } else {
        const newTabListContainerParent = _.cloneDeep(state.tabListContainerData[action.payload.parentTabListContainerId]);
        newTabListContainerParent.tabListContainer.splice(directionIndex, 0, tabListContainerId);

        state.tabListContainerData = { ...state.tabListContainerData, [newTabListContainerParent.id]: newTabListContainerParent };

        console.log('test');
      }
    },
    splitTabListContainerToNewTabListContainer: (
      state,
      action: PayloadAction<{
        parentTabListContainerId?: string;
        tabListContainerId: string;
        index: number;
        direction: Direction;
        tabId: string;
      }>
    ) => {
      const tabListId = uuidv4();
      const tabListContainerNewTabListId = uuidv4();
      const tabListContainerId = uuidv4();

      const newTabList: TabList = {
        id: tabListId,
        tabs: [action.payload.tabId],
      };
      const newTabListContainerNewTablist: TabListContainer = {
        tabListId,
        id: tabListContainerNewTabListId,
        parentTabListContainerId: tabListContainerId,
        direction: 'none',
        tabListContainer: [],
      };

      const newTabListContainer: TabListContainer = {
        tabListId: null,
        id: tabListContainerId,
        parentTabListContainerId: action.payload.parentTabListContainerId,
        direction: action.payload.direction === 'left' || action.payload.direction === 'right' ? 'horizontal' : 'vertical',
        tabListContainer:
          action.payload.direction === 'left' || action.payload.direction === 'up'
            ? [tabListContainerNewTabListId, action.payload.tabListContainerId]
            : [action.payload.tabListContainerId, tabListContainerNewTabListId],
      };

      state.tabListContainerData = {
        ...state.tabListContainerData,
        [tabListContainerId]: newTabListContainer,
        [tabListContainerNewTabListId]: newTabListContainerNewTablist,
        [action.payload.tabListContainerId]: { ...state.tabListContainerData[action.payload.tabListContainerId], parentTabListContainerId: tabListContainerId },
      };

      state.tabListData = { ...state.tabListData, [tabListId]: newTabList };

      //if no parent then just add to "root" list
      if (!action.payload.parentTabListContainerId) {
        const newTabListContainerList = _.cloneDeep(state.tabListContainerList);
        newTabListContainerList.splice(action.payload.index, 1, tabListContainerId);
        state.tabListContainerList = newTabListContainerList;
        //if parent then just add
      } else {
        const newTabListContainerParent = _.cloneDeep(state.tabListContainerData[action.payload.parentTabListContainerId]);
        newTabListContainerParent.tabListContainer.splice(action.payload.index, 1, tabListContainerId);
        state.tabListContainerData = { ...state.tabListContainerData, [newTabListContainerParent.id]: newTabListContainerParent };
      }
    },
    removeTab: (state, action: PayloadAction<{ tabId: string; tabListId: string; tabListContainerId: string }>) => {
      const newTabList = _.cloneDeep(state.tabListData[action.payload.tabListId]);
      newTabList.tabs = newTabList.tabs.filter((tab) => tab !== action.payload.tabId);

      if (newTabList.tabs.length !== 0) {
        state.tabListData = { ...state.tabListData, [action.payload.tabListId]: newTabList };
      } else {
        const newTabListData = _.cloneDeep(state.tabListData);
        delete newTabListData[newTabList.id];
        state.tabListData = newTabListData;

        const newData = cleanupTabListContainer(state.tabListContainerData, action.payload.tabListContainerId, state.tabListContainerList);
        console.log(newData);

        state.tabListContainerList = newData.tabListContainerList;
        state.tabListContainerData = newData.tabListContainerData;
      }
    },
  },
});

export const { createTabListContainerWithTabList, splitTabListContainerToParent, splitTabListContainerToNewTabListContainer, removeTab } = tabSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTabListContainerList = (state: RootState) => state.tab.tabListContainerList;

export const selectTabListContainerData = (id: string) => (state: RootState) => state.tab.tabListContainerData[id];
export const selectTabListData = (id: string) => (state: RootState) => state.tab.tabListData[id];

export default tabSlice.reducer;
