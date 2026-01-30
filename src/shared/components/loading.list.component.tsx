import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import SkeletonPlaceholder from "./skeleton";

const LoadingList = ({
  numberItem = 1,
}: {
  numberItem?: number;
  hideAvatar?: boolean;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  
  const skeletonColors = useMemo(
    () => ({
      backgroundColor: theme.dark ? colors.separator : colors.highlight,
      highlightColor: theme.dark ? colors.highlight : colors.card,
    }),
    [theme.dark, colors.separator, colors.highlight, colors.card]
  );
  const array = Array.from(Array(numberItem - 1).keys());

  return (
    <SkeletonPlaceholder
      backgroundColor={skeletonColors.backgroundColor}
      highlightColor={skeletonColors.highlightColor}
    >
      <>
        {array.map((item) => (
          <View key={item} style={{ width: "100%", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginVertical: 14,
              }}
            >
              <View
                style={{
                  width: 36,
                  marginLeft: 20,
                  height: 36,
                  borderRadius: 50,
                }}
              />
              <View style={{ marginLeft: 20 }}>
                <View
                  style={{ width: 120, height: 16, borderRadius: 4 }}
                />
                <View
                  style={{
                    marginTop: 6,
                    width: 80,
                    height: 4,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>
        ))}
        <View style={{ width: "100%", alignSelf: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
                marginVertical: 14,
            }}
          >
            <View
              style={{
                  width: 30,
                  marginLeft: 20,
                  height: 30,
                  borderRadius: 50,
              }}
            />
              <View style={{ marginLeft: 20 }}>
                <View
                  style={{ width: 120, height: 16, borderRadius: 4 }}
                />
                <View
                  style={{
                    marginTop: 6,
                    width: 80,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
            </View>
          </View>
        </View>
      </>
    </SkeletonPlaceholder>
  );
};

export default LoadingList;
