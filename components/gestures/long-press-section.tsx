import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Copy matches the web playground's /longClick page, "click" wording included
const BUTTONS = ['Button 1', 'Button 2', 'Button 3'] as const;
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const TICK_MS = 10;

type Press = { button: string; heldSeconds: number; long: boolean };

export function LongPressSection() {
  const [threshold, setThreshold] = useState(1);
  const [holding, setHolding] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [lastPress, setLastPress] = useState<Press | null>(null);
  const startedAt = useRef<number | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pickerColors = {
    color: isDark ? '#FFFFFF' : '#000000',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  };

  useEffect(() => {
    if (!holding) return;
    const timer = setInterval(() => {
      if (startedAt.current !== null) setElapsed((Date.now() - startedAt.current) / 1000);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [holding]);

  const pressIn = (button: string) => {
    startedAt.current = Date.now();
    setElapsed(0);
    setHolding(button);
  };

  // Also fires when the finger slides off the button, like the web's mouseleave
  const pressOut = () => {
    if (startedAt.current === null || !holding) return;
    const heldSeconds = (Date.now() - startedAt.current) / 1000;
    startedAt.current = null;
    setLastPress({ button: holding, heldSeconds, long: heldSeconds >= threshold });
    setHolding(null);
  };

  const status = !lastPress
    ? `Press and hold a button for at least ${threshold} second${threshold === 1 ? '' : 's'}.`
    : `${lastPress.button}: ${lastPress.long ? 'long click!' : 'quick press.'} You held for ${lastPress.heldSeconds.toFixed(2)}s.`;

  const statusClassName = !lastPress
    ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
    : lastPress.long
      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
      <Text className="text-base font-medium text-black dark:text-white mb-2 text-center">
        Select long click duration (seconds):
      </Text>
      <View className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-6">
        <Picker
          testID="long-press-duration-picker"
          accessibilityLabel="Select long click duration"
          selectedValue={threshold}
          onValueChange={(value) => setThreshold(Number(value))}
          /* Renders an android.widget.Spinner instead of the iOS-style wheel */
          mode="dropdown"
          dropdownIconColor={pickerColors.color}
          style={pickerColors}
        >
          {DURATIONS.map((seconds) => (
            <Picker.Item key={seconds} label={String(seconds)} value={seconds} style={pickerColors} />
          ))}
        </Picker>
      </View>

      {BUTTONS.map((button, index) => {
        const label = holding === button ? `Keep holding... ${elapsed.toFixed(2)}s` : 'Click here';
        return (
          <Pressable
            key={button}
            testID={`long-press-button-${index + 1}`}
            /* All three read "Click here", as on the web; the index tells them apart */
            accessibilityLabel={label}
            accessibilityRole="button"
            onPressIn={() => pressIn(button)}
            onPressOut={pressOut}
            className="bg-blue-500 rounded-xl py-4 px-6 items-center mb-3 active:bg-blue-700"
          >
            <Text className="text-white font-semibold text-lg">{label}</Text>
          </Pressable>
        );
      })}

      <Text className="text-lg text-center text-black dark:text-white mt-3 mb-2">Click time:</Text>
      <View className={`rounded-xl p-4 border ${statusClassName}`}>
        <Text testID="long-press-status" className="text-base text-center text-black dark:text-white">
          {status}
        </Text>
      </View>
    </View>
  );
}
