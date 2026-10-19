import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

/** Two taps closer together than this count as one double tap */
const DOUBLE_TAP_MS = 300;

/*
  Stands in for the web's /rightClick page: a touch screen has no right button,
  and double tap is the secondary gesture a phone actually offers. The shape is
  the same — the button rewrites its own label and colour once the gesture lands.
*/
export function DoubleTapSection() {
  const [doubleTapped, setDoubleTapped] = useState(false);
  const [singleTapHint, setSingleTapHint] = useState(false);
  const lastTapAt = useRef<number | null>(null);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
  }, []);

  const handlePress = () => {
    const now = Date.now();
    if (lastTapAt.current !== null && now - lastTapAt.current < DOUBLE_TAP_MS) {
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
      lastTapAt.current = null;
      setSingleTapHint(false);
      setDoubleTapped(true);
      return;
    }
    lastTapAt.current = now;
    // Only call it a single tap once the window for a second tap has closed
    singleTapTimer.current = setTimeout(() => {
      lastTapAt.current = null;
      setSingleTapHint(true);
    }, DOUBLE_TAP_MS);
  };

  const label = doubleTapped ? 'The button was double tapped' : 'Double tap here';

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
      <Pressable
        testID="double-tap-button"
        accessibilityLabel={label}
        accessibilityRole="button"
        onPress={handlePress}
        className={`rounded-xl py-4 px-6 items-center ${
          doubleTapped ? 'bg-gray-500 active:bg-gray-600' : 'bg-blue-500 active:bg-blue-600'
        }`}
      >
        <Text className="text-white font-semibold text-lg">{label}</Text>
      </Pressable>

      {singleTapHint && !doubleTapped && (
        <Text
          testID="double-tap-single-hint"
          className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4"
        >
          That was a single tap. Tap twice quickly.
        </Text>
      )}
    </View>
  );
}
