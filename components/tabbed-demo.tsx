import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ComponentProps, ComponentType, useState } from 'react';

export type DemoTab = {
  key: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  /** Shown in the header card while this tab is active */
  description: string;
  Section: ComponentType;
};

/**
 * A demo screen that groups several web playground pages behind one home card,
 * one tab each. Tabs rather than one long scroll keep each section on a single
 * screen, so nothing sits below the fold by accident.
 *
 * `?tab=<key>` opens a tab directly, e.g. trplayground://demos/gestures?tab=hover
 */
export function TabbedDemo({
  id,
  title,
  tabs,
}: {
  /** Prefix for testIDs: `<id>-tab-<key>` and `<id>-description` */
  id: string;
  title: string;
  tabs: readonly DemoTab[];
}) {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [activeKey, setActiveKey] = useState(
    tabs.some((tab) => tab.key === tabParam) ? tabParam! : tabs[0].key,
  );

  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];
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
              <Text className="text-2xl font-bold text-black dark:text-white mb-1">{title}</Text>
            </View>
          </View>
          <Text
            testID={`${id}-description`}
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
          {tabs.map((tab) => {
            const selected = tab.key === activeKey;
            return (
              <Pressable
                key={tab.key}
                testID={`${id}-tab-${tab.key}`}
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
