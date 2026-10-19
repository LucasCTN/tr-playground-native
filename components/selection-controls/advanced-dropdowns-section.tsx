import { useState } from 'react';
import { Text, View } from 'react-native';

import { CustomSelect } from './custom-select';

/*
  The web page names its dropdowns after the web libraries they imitate (Angular
  Material, Select2, ng-select...). None of those exist on native, so each one
  here is named for the behaviour it exercises instead. Animated and Delayed keep
  their web names, options and placeholders, and share the same "Option 1..4"
  labels on purpose: two menus with identical items is a locator test in itself.
*/
const SEARCHABLE_OPTIONS = ['Apple', 'Banana', 'Cherry', 'Grape'] as const;
const CLEARABLE_OPTIONS = ['Red', 'Green', 'Blue', 'Yellow'] as const;
const SHARED_OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4'] as const;

export function AdvancedDropdownsSection() {
  const [searchable, setSearchable] = useState<string | null>(null);
  const [clearable, setClearable] = useState<string | null>(null);
  const [animated, setAnimated] = useState<string | null>(null);
  const [delayed, setDelayed] = useState<string | null>(null);

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
      <Text className="text-lg font-semibold text-black dark:text-white mb-6">
        Dropdown implementations
      </Text>

      <CustomSelect
        testID="searchable-select"
        label="Searchable Select"
        options={SEARCHABLE_OPTIONS}
        value={searchable}
        onChange={setSearchable}
        placeholder="Select an option"
        searchable
      />

      <CustomSelect
        testID="clearable-select"
        label="Clearable Select"
        options={CLEARABLE_OPTIONS}
        value={clearable}
        onChange={setClearable}
        placeholder="Select a color"
        clearable
      />

      <CustomSelect
        testID="animated-dropdown"
        label="Animated Dropdown"
        options={SHARED_OPTIONS}
        value={animated}
        onChange={setAnimated}
        placeholder="Choose something..."
        animated
      />

      <CustomSelect
        testID="delayed-dropdown"
        label="Delayed Dropdown"
        options={SHARED_OPTIONS}
        value={delayed}
        onChange={setDelayed}
        placeholder="Select an option"
        animated
        loadingDelayMs={2000}
      />
    </View>
  );
}
