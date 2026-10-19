import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';

type CustomSelectProps = {
  testID: string;
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  /** Filter field at the top of the open menu */
  searchable?: boolean;
  /** × button on the trigger that empties the selection */
  clearable?: boolean;
  /** Fades and slides the menu in and out instead of swapping it instantly */
  animated?: boolean;
  /** Shows "Loading..." for this long before the options appear */
  loadingDelayMs?: number;
};

const ANIMATION_MS = 150;

/**
 * A JS-drawn dropdown, as opposed to the OS picker. The menu opens inline and
 * pushes the content below it down, so every option is a real on-screen
 * element rather than a floating overlay.
 */
export function CustomSelect({
  testID,
  label,
  options,
  value,
  onChange,
  placeholder,
  searchable = false,
  clearable = false,
  animated = false,
  loadingDelayMs,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!open || !loadingDelayMs) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), loadingDelayMs);
    return () => clearTimeout(timer);
  }, [open, loadingDelayMs]);

  const openMenu = () => {
    setOpen(true);
    if (animated) {
      Animated.timing(progress, { toValue: 1, duration: ANIMATION_MS, useNativeDriver: true }).start();
    }
  };

  const closeMenu = () => {
    setQuery('');
    if (!animated) {
      setOpen(false);
      return;
    }
    // Stay mounted until the fade-out finishes, then drop the options from the tree
    Animated.timing(progress, { toValue: 0, duration: ANIMATION_MS, useNativeDriver: true }).start(
      () => setOpen(false),
    );
  };

  const select = (option: string) => {
    onChange(option);
    closeMenu();
  };

  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );

  const menuStyle = animated
    ? {
        opacity: progress,
        transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) }],
      }
    : undefined;

  const chevronStyle = animated
    ? {
        transform: [
          { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
        ],
      }
    : open
      ? { transform: [{ rotate: '180deg' }] }
      : undefined;

  return (
    <View className="mb-6">
      <Text className="text-base font-medium text-black dark:text-white mb-2">{label}</Text>

      <View className="flex-row items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        <Pressable
          testID={`${testID}-trigger`}
          accessibilityLabel={label}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityValue={{ text: value ?? placeholder }}
          onPress={open ? closeMenu : openMenu}
          className="flex-1 flex-row items-center justify-between px-3 py-3"
        >
          <Text
            className={value ? 'text-base text-black dark:text-white' : 'text-base text-gray-400'}
          >
            {value ?? placeholder}
          </Text>
          <Animated.View style={chevronStyle}>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </Animated.View>
        </Pressable>

        {clearable && value && (
          <Pressable
            testID={`${testID}-clear`}
            accessibilityLabel={`Clear ${label}`}
            accessibilityRole="button"
            onPress={() => onChange(null)}
            className="px-3 py-3"
          >
            <Text className="text-lg text-gray-500 dark:text-gray-400">×</Text>
          </Pressable>
        )}
      </View>

      {open && (
        <Animated.View testID={`${testID}-menu`} style={menuStyle}>
          <View className="mt-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-hidden">
            {searchable && (
              <View className="p-2 border-b border-gray-200 dark:border-gray-600">
                <TextInput
                  testID={`${testID}-search`}
                  accessibilityLabel={`Search ${label}`}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                  /* No autoFocus, unlike the web: the keyboard would cover the options below */
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-black dark:text-white"
                />
              </View>
            )}

            {loading ? (
              <Text testID={`${testID}-loading`} className="px-3 py-3 text-gray-500 dark:text-gray-400">
                Loading...
              </Text>
            ) : visibleOptions.length === 0 ? (
              <Text className="px-3 py-3 text-gray-500 dark:text-gray-400">No results</Text>
            ) : (
              visibleOptions.map((option) => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    testID={`${testID}-option-${options.indexOf(option) + 1}`}
                    accessibilityLabel={option}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected }}
                    onPress={() => select(option)}
                    className={`px-3 py-3 border-b border-gray-100 dark:border-gray-600 ${
                      selected ? 'bg-blue-50 dark:bg-blue-900/30' : 'active:bg-gray-100 dark:active:bg-gray-600'
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        selected ? 'font-semibold text-blue-700 dark:text-blue-300' : 'text-black dark:text-white'
                      }`}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>
        </Animated.View>
      )}

      <Text testID={`${testID}-value`} className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Value selected: <Text className="font-bold text-black dark:text-white">{value ?? ''}</Text>
      </Text>
    </View>
  );
}
