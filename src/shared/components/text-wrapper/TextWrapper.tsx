import React from "react";
import fonts from "@fonts";
import type { IRNTextProps } from "@freakycoder/react-native-custom-text";
import { Text } from "react-native";

interface ITextWrapperProps extends IRNTextProps {
  fontFamily?: string;
  children?: React.ReactNode;
}

const TextWrapper: React.FC<ITextWrapperProps> = ({
  fontFamily = fonts.montserrat.regular,
  children,
  ...rest
}) => {
  return (
    <Text {...rest}>
      {children}
    </Text>
  );
};

export default TextWrapper;
