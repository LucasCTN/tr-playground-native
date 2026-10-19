import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';

// Copy matches the web playground's /mouseHover page
const BUTTONS = ['Button 1', 'Button 2', 'Button 3'] as const;
const IDLE_TEXT = 'Hover over a button to reveal the text.';

/*
  Hover on mobile: a finger cannot hover. A touch screen only senses a finger
  once it is in contact, so there is no "pointer above the element" state to
  report. Hover does exist for pointers that are tracked before contact:

    - a stylus sensed above the screen (Samsung S Pen, Apple Pencil on recent iPads)
    - a mouse or trackpad (Android with a mouse, iPad pointer, Samsung DeX, ChromeOS)

  Those raise HOVER_ENTER / HOVER_EXIT, which Pressable exposes as
  onHoverIn / onHoverOut: the text shows while the pointer is over a button and
  hides when it leaves, as on the web.

  For a finger, a touch reveals the text and leaves it shown until another
  button is touched — the way mobile browsers keep :hover after a tap. Hiding it
  on release would make the text vanish before a test could read it.

  Only the touch path is verified (Maestro, Android emulator). Maestro cannot
  generate hover events, so the stylus/mouse path is untested.
*/
export function HoverSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
      {BUTTONS.map((button, index) => (
        <Pressable
          key={button}
          testID={`hover-button-${index + 1}`}
          /* All three read "Hover here", as on the web; the index tells them apart */
          accessibilityLabel="Hover here"
          accessibilityRole="button"
          onHoverIn={() => setHovered(button)}
          onHoverOut={() => setHovered((current) => (current === button ? null : current))}
          onPressIn={() => setHovered(button)}
          className={`rounded-xl py-4 px-6 items-center mb-3 ${
            hovered === button ? 'bg-blue-700' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white font-semibold text-lg">Hover here</Text>
        </Pressable>
      ))}

      <Text className="text-lg text-center text-black dark:text-white mt-3 mb-2">Hidden text:</Text>
      <View
        className={`rounded-xl p-4 border ${
          hovered
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
        }`}
      >
        <Text testID="hover-status" className="text-base text-center text-black dark:text-white">
          {hovered ? `${hovered}: This text is now visible!` : IDLE_TEXT}
        </Text>
      </View>
    </View>
  );
}
