import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useTheme} from '@react-navigation/native';

interface LoadingListProps {
  numberItem?: number;
}

const LoadingList: React.FC<LoadingListProps> = ({numberItem = 1}) => {
  const theme = useTheme();
  const {colors} = theme;

  return (
    <View
      style={{
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
};

export default LoadingList;


