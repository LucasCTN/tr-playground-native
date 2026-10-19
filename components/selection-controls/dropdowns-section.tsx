import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Copy, items and initial labels match the web playground's /dropdowns page
const MENU_ITEMS = ['Action', 'Another action', 'Something else here'] as const;
const SEPARATED_ITEM = 'Separated link';
const SELECT_PLACEHOLDER = 'Open this select menu';
const SELECT_ITEMS = ['One', 'Two', 'Three'] as const;
const LIST_ITEMS = ['One', 'Two', 'Three', 'Four'] as const;

function SectionTitle({ children }: { children: string }) {
  return <Text className="text-lg font-bold text-black dark:text-white mb-3">{children}</Text>;
}

function MenuItems({
  testID,
  items,
  separatedItem,
  onSelect,
}: {
  testID: string;
  items: readonly string[];
  separatedItem?: string;
  onSelect: (item: string) => void;
}) {
  const renderItem = (item: string, index: number) => (
    <Pressable
      key={item}
      testID={`${testID}-item-${index + 1}`}
      accessibilityLabel={item}
      accessibilityRole="menuitem"
      onPress={() => onSelect(item)}
      className="px-4 py-3 active:bg-gray-100 dark:active:bg-gray-600"
    >
      <Text className="text-base text-black dark:text-white">{item}</Text>
    </Pressable>
  );

  return (
    <View
      testID={`${testID}-menu`}
      className="mt-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-hidden"
    >
      {items.map(renderItem)}
      {separatedItem && (
        <>
          <View className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
          {renderItem(separatedItem, items.length)}
        </>
      )}
    </View>
  );
}

function SimpleDropdown({ title, onSelect }: { title: string; onSelect: (item: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-8">
      <SectionTitle>Simple dropdown</SectionTitle>
      <Pressable
        testID="simple-dropdown-button"
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((prev) => !prev)}
        className="self-start flex-row items-center bg-gray-500 rounded-lg px-4 py-3 active:bg-gray-600"
      >
        <Text className="text-white font-semibold mr-2">{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="white" />
      </Pressable>
      {open && (
        <MenuItems
          testID="simple-dropdown"
          items={MENU_ITEMS}
          onSelect={(item) => {
            onSelect(item);
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

function SplitDropdown({ title, onSelect }: { title: string; onSelect: (item: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-8">
      <SectionTitle>Split dropdown</SectionTitle>
      <View className="self-start flex-row rounded-lg overflow-hidden">
        {/* The main half does nothing on the web either — only the toggle opens the menu */}
        <Pressable
          testID="split-dropdown-button"
          accessibilityLabel={title}
          accessibilityRole="button"
          className="bg-blue-500 px-4 py-3 active:bg-blue-600"
        >
          <Text className="text-white font-semibold">{title}</Text>
        </Pressable>
        <Pressable
          testID="split-dropdown-toggle"
          accessibilityLabel="Toggle Dropdown"
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen((prev) => !prev)}
          className="bg-blue-600 px-3 justify-center border-l border-blue-400 active:bg-blue-700"
        >
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="white" />
        </Pressable>
      </View>
      {open && (
        <MenuItems
          testID="split-dropdown"
          items={MENU_ITEMS}
          separatedItem={SEPARATED_ITEM}
          onSelect={(item) => {
            onSelect(item);
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

function ListOption({
  testID,
  label,
  selected,
  onPress,
}: {
  testID: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="menuitem"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`px-4 py-3 border-b border-gray-100 dark:border-gray-600 ${
        selected ? 'bg-blue-500' : 'active:bg-gray-100 dark:active:bg-gray-600'
      }`}
    >
      <Text className={selected ? 'text-base text-white' : 'text-base text-black dark:text-white'}>
        {label}
      </Text>
    </Pressable>
  );
}

export function DropdownsSection() {
  const [simpleDropdown, setSimpleDropdown] = useState('Dropdown button');
  const [splitDropdown, setSplitDropdown] = useState('Split dropdown button');
  const [simpleSelect, setSimpleSelect] = useState<string>(SELECT_PLACEHOLDER);
  const [singleList, setSingleList] = useState('');
  const [multipleList, setMultipleList] = useState<string[]>([]);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pickerColors = {
    color: isDark ? '#FFFFFF' : '#000000',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  };

  const toggleMultiple = (item: string) => {
    setMultipleList((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item],
    );
  };

  // Listed in option order, like the web <select multiple>, not in tap order
  const multipleSummary = LIST_ITEMS.filter((item) => multipleList.includes(item)).join(', ');

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
      <SimpleDropdown title={simpleDropdown} onSelect={setSimpleDropdown} />
      <SplitDropdown title={splitDropdown} onSelect={setSplitDropdown} />

      <View className="mb-8">
        <SectionTitle>Simple select</SectionTitle>
        <View className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <Picker
            testID="simple-select-picker"
            accessibilityLabel="Simple select"
            selectedValue={simpleSelect}
            onValueChange={(value) => setSimpleSelect(String(value))}
            /* Renders an android.widget.Spinner instead of the iOS-style wheel */
            mode="dropdown"
            dropdownIconColor={pickerColors.color}
            style={pickerColors}
          >
            {/* Rows set their own background: the popup follows the OS theme, not the in-app toggle */}
            {[SELECT_PLACEHOLDER, ...SELECT_ITEMS].map((item) => (
              <Picker.Item key={item} label={item} value={item} style={pickerColors} />
            ))}
          </Picker>
        </View>
      </View>

      <View className="mb-8">
        <SectionTitle>Single list select</SectionTitle>
        <View className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          {LIST_ITEMS.map((item, index) => (
            <ListOption
              key={item}
              testID={`single-list-option-${index + 1}`}
              label={item}
              selected={singleList === item}
              onPress={() => setSingleList(item)}
            />
          ))}
        </View>
      </View>

      <View className="mb-8">
        <SectionTitle>Multiple list select</SectionTitle>
        {/* Web: "Hold ctrl while clicking..." — there is no ctrl key on a phone */}
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Tap an option to select or deselect it. Several options can be selected at once.
        </Text>
        <View className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          {LIST_ITEMS.map((item, index) => (
            <ListOption
              key={item}
              testID={`multiple-list-option-${index + 1}`}
              label={item}
              selected={multipleList.includes(item)}
              onPress={() => toggleMultiple(item)}
            />
          ))}
        </View>
      </View>

      <View className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-bold text-black dark:text-white mb-2">Selected options</Text>
        <Text testID="selected-simple-dropdown" className="text-base text-gray-700 dark:text-gray-300">
          • Simple dropdown: {simpleDropdown}
        </Text>
        <Text testID="selected-split-dropdown" className="text-base text-gray-700 dark:text-gray-300">
          • Split dropdown: {splitDropdown}
        </Text>
        <Text testID="selected-simple-select" className="text-base text-gray-700 dark:text-gray-300">
          • Simple select: {simpleSelect}
        </Text>
        <Text testID="selected-single-list" className="text-base text-gray-700 dark:text-gray-300">
          • Single list select: {singleList}
        </Text>
        <Text testID="selected-multiple-list" className="text-base text-gray-700 dark:text-gray-300">
          • Multiple list select: {multipleSummary}
        </Text>
      </View>
    </View>
  );
}
