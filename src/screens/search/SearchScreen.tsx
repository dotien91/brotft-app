import React, { useMemo } from "react";
import { View } from "react-native";
import createStyles from "./SearchScreen.style";
import { useTheme } from "@react-navigation/native";
import Text from "@shared-components/text-wrapper/TextWrapper";
import {translations} from "../../shared/localization";

const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text h1 color={colors.text}>
        {translations.search || 'Search'}
      </Text>
    </View>
  );
};

export default SearchScreen;
