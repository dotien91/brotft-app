import React, {useState} from 'react';
import {Image, ImageProps, ImageURISource} from 'react-native';

interface FallbackImageProps extends Omit<ImageProps, 'source' | 'defaultSource'> {
  sources: string[];
  defaultSource?: ImageURISource | number;
}

/**
 * Image component that tries multiple URLs in order and falls back to the next one on error
 */
const FallbackImage: React.FC<FallbackImageProps> = ({
  sources,
  defaultSource,
  ...imageProps
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const currentSource = sources[currentIndex];

  const handleError = () => {
    if (currentIndex < sources.length - 1) {
      // Try next URL
      setCurrentIndex(currentIndex + 1);
    } else {
      // All URLs failed
      setHasError(true);
    }
  };

  if (hasError && defaultSource) {
    return <Image {...imageProps} source={defaultSource} />;
  }

  if (hasError) {
    return null;
  }

  return (
    <Image
      {...imageProps}
      source={{uri: currentSource}}
      onError={handleError}
    />
  );
};

export default FallbackImage;

