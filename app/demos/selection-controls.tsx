import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ComponentProps, useState } from 'react';

import { AdvancedDropdownsSection } from '@/components/selection-controls/advanced-dropdowns-section';
import { CheckboxSection } from '@/components/selection-controls/checkbox-section';
import { DropdownsSection } from '@/components/selection-controls/dropdowns-section';
import { RadioSection } from '@/components/selection-controls/radio-section';

/*
  One tab per web playground page this screen absorbs. Tabs rather than one long
  scroll keep each control set on a single screen, so nothing sits below the
  fold by accident.
*/
const TABS = [
  {
    key: 'checkbox',
    label: 'Checkbox',
    icon: 'checkbox-outline',
    description: 'Validate checkbox selection and interaction functionality',
    Section: CheckboxSection,
  },
  {
    key: 'radio',
    label: 'Radio',
    icon: 'radio-button-on-outline',
    description: 'Select one of the payment methods below by checking the associated radio button.',
    Section: RadioSection,
  },
  {
    key: 'dropdowns',
    label: 'Dropdowns',
    icon: 'chevron-down-circle-outline',
    description:
      'You can click and select options on the different forms of dropdowns and selections, and check the selected options below.',
    Section: DropdownsSection,
  },
  {
    key: 'advanced',
    label: 'Advanced',
    icon: 'options-outline',
    description: 'A demonstration of different dropdown implementations.',
    Section: AdvancedDropdownsSection,
  },
] as const satisfies readonly {
  key: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  description: string;
  Section: () => React.JSX.Element;
}[];

type TabKey = (typeof TABS)[number]['key'];

const isTabKey = (value: unknown): value is TabKey => TABS.some((tab) => tab.key === value);

export default function SelectionControlsScreen() {
  // `?tab=dropdowns` opens a tab directly, e.g. trplayground://demos/selection-controls?tab=dropdowns
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [activeKey, setActiveKey] = useState<TabKey>(isTabKey(tabParam) ? tabParam : 'checkbox');

  const activeTab = TABS.find((tab) => tab.key === activeKey) ?? TABS[0];
  const { Section } = activeTab;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" keyboardShouldPersistTaps="handled">
      <View className="p-6">
        {/* Demo Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 mr-4">
              <Ionicons name={activeTab.icon} size={32} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black dark:text-white mb-1">
                Selection Controls
              </Text>
            </View>
          </View>
          <Text
            testID="selection-controls-description"
            className="text-base text-gray-600 dark:text-gray-400 leading-6"
          >
            {activeTab.description}
          </Text>
        </View>

        {/* Tabs */}
        <View
          accessibilityRole="tablist"
          className="flex-row bg-gray-200 dark:bg-gray-800 rounded-xl p-1 mb-6"
        >
          {TABS.map((tab) => {
            const selected = tab.key === activeKey;
            return (
              <Pressable
                key={tab.key}
                testID={`selection-tab-${tab.key}`}
                accessibilityLabel={tab.label}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setActiveKey(tab.key)}
                className={`flex-1 items-center py-2 rounded-lg ${
                  selected ? 'bg-white dark:bg-gray-600' : ''
                }`}
              >
                <Text
                  numberOfLines={1}
                  className={`text-sm font-semibold ${
                    selected ? 'text-blue-600 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Only the active section is mounted, so switching tabs resets its state */}
        <Section />
      </View>
    </ScrollView>
  );
}
