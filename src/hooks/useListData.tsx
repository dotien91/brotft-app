import React, {useCallback, useRef, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {palette} from '@theme/themes';
import lodash from 'lodash';
import LoadingList from '@shared-components/loading-list.component';

interface TypedUseListData<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  refreshing: boolean;
  isFirstLoading: boolean;
  isLoading: boolean;
  setListData: (newListData: T[]) => void;
  _requestData: (showRefreshing?: boolean) => void;
  initData: T[];
  renderFooterComponent: () => React.ReactElement;
  onEndReach: (data?: any) => void;
  refreshControl: any;
  noData: boolean;
  totalCount: number;
}

interface TypedStateListData<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  totalCount: number;
  isLoading: boolean;
  noData: boolean;
}

export function useListData<T>(
  params: any,
  requestData: (params: any) => Promise<any>,
  initData: T[] = [],
  dep?: any,
): TypedUseListData<T> {
  const [stateListData, setStateListData] = useState<TypedStateListData<T>>({
    listData: initData,
    nextPage: 1,
    isLastPage: false,
    totalCount: 0,
    isLoading: true,
    noData: false,
  });

  const [isLoadMore, setIsLoadmore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);

  useDeepCompareEffect(() => {
    _requestData(false);
  }, [params, dep]);

  const _requestData = (showRefreshing: boolean = true) => {
    isFetching.current = true;
    if (stateListData.nextPage > 1 && showRefreshing) setRefreshing(true);

    requestData({page: '1', ...params}).then((res: any) => {
      const newData = res.data;

      if (!res.isError && lodash.isArray(newData)) {
        isFetching.current = false;
        let isLastPage = false;
        let nextPage = 1;
        if (newData.length < params.limit) {
          isLastPage = true;
        } else {
          nextPage = 2;
        }

        setRefreshing(false);
        setStateListData(oldState => ({
          ...oldState,
          isLastPage,
          nextPage,
          listData: [...initData, ...newData],
          totalCount: res?.headers?.['x-total-count'] || 0,
          isLoading: false,
          noData: !newData.length,
        }));
      } else {
        setStateListData(oldState => ({
          ...oldState,
          isLoading: false,
          listData: initData,
          noData: true,
        }));
        setRefreshing(false);
        isFetching.current = false;
      }
    });
  };

  async function onEndReach({forceCallApi}: {forceCallApi?: boolean}) {
    if ((!stateListData.isLastPage && !isFetching.current) || forceCallApi) {
      isFetching.current = true;
      setIsLoadmore(true);
      await requestData({
        page: stateListData.nextPage + '',
        ...params,
      }).then((res: any) => {
        setIsLoadmore(false);
        const newData = res.data;
        isFetching.current = false;

        if (!res.isError && lodash.isArray(newData)) {
          let isLastPage = false;
          let {nextPage} = stateListData;
          if (newData.length < params.limit) {
            isLastPage = true;
          } else {
            nextPage = stateListData.nextPage + 1;
          }

          setStateListData(oldState => ({
            ...oldState,
            isLastPage,
            nextPage,
            listData: [...stateListData.listData, ...newData],
          }));
        } else {
          setStateListData(oldState => ({
            ...oldState,
          }));
        }
      });
    }
  }

  const setListData = useCallback((newListData: T[]) => {
    setStateListData(oldState => ({
      ...oldState,
      listData: newListData,
    }));
  }, []);

  const refreshControl = () => (
    <RefreshControl
      onRefresh={_requestData}
      refreshing={refreshing}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const renderFooterComponent = React.useCallback(() => {
    if (!isLoadMore) return <View />;
    return <LoadingList numberItem={1} />;
  }, [isLoadMore]);

  return {
    listData: stateListData.listData,
    nextPage: stateListData.nextPage,
    isLastPage: stateListData.isLastPage,
    totalCount: stateListData.totalCount,
    noData: stateListData.noData,
    onEndReach,
    refreshControl,
    _requestData,
    renderFooterComponent,
    setListData,
    refreshing,
    isLoading: stateListData.isLoading,
    isFirstLoading: false,
  };
}

