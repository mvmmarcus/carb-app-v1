import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useOrientation = () => {
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'));

  const onDimensionChange = (result) => setScreenInfo(result?.screen);

  useEffect(() => {
    const dimensionsSubscription = Dimensions.addEventListener(
      'change',
      onDimensionChange
    );

    return () => dimensionsSubscription?.remove();
  }, []);

  return {
    ...screenInfo,
    isMobile: screenInfo?.height > screenInfo?.width,
  };
};

export default useOrientation;
