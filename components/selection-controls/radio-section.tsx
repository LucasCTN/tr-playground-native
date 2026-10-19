import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

// Same labels and order as the web playground's /radioButtons page
const PAYMENT_METHODS = [
  { key: 'paypal', label: 'PayPal' },
  { key: 'credit-card', label: 'Credit card' },
  { key: 'debit-card', label: 'Debit card' },
  { key: 'bank-transfer', label: 'Bank transfer' },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number];

function RadioItem({
  label,
  selected,
  disabled,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`flex-row items-center py-3 ${disabled ? 'opacity-50' : ''}`}
    >
      <View
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
          selected
            ? 'border-blue-500'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
        }`}
      >
        {selected && <View className="w-3 h-3 rounded-full bg-blue-500" />}
      </View>
      <Text className="text-base text-gray-700 dark:text-gray-300">{label}</Text>
    </Pressable>
  );
}

export function RadioSection() {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [paying, setPaying] = useState(false);

  // The web page lets Next run with nothing picked and shows "Paying with " —
  // here Next waits for a choice so the confirmed state always names a method
  const canProceed = selected !== null && !paying;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700">
      <Text className="text-lg font-semibold text-black dark:text-white mb-4">
        Select a payment method
      </Text>

      <View accessibilityRole="radiogroup" className="mb-6">
        {PAYMENT_METHODS.map((method) => (
          <RadioItem
            key={method.key}
            testID={`radio-${method.key}`}
            label={method.label}
            selected={selected?.key === method.key}
            disabled={paying}
            onPress={() => setSelected(method)}
          />
        ))}
      </View>

      {paying ? (
        <View
          testID="radio-paying-with"
          accessibilityLabel={`Paying with ${selected?.label}`}
          accessibilityState={{ disabled: true }}
          className="bg-gray-400 dark:bg-gray-600 rounded-xl py-3 px-6 items-center mb-3"
        >
          <Text className="text-white font-semibold">Paying with {selected?.label}</Text>
        </View>
      ) : (
        <Pressable
          testID="radio-next-button"
          accessibilityLabel="Next"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canProceed }}
          disabled={!canProceed}
          onPress={() => setPaying(true)}
          className={`rounded-xl py-3 px-6 items-center mb-3 ${
            canProceed ? 'bg-blue-500 active:bg-blue-600' : 'bg-blue-300 dark:bg-blue-900'
          }`}
        >
          <Text className="text-white font-semibold">Next</Text>
        </Pressable>
      )}

      {/* Cancel keeps the chosen method and unlocks the radios again, as on the web */}
      <Pressable
        testID="radio-cancel-button"
        accessibilityLabel="Cancel"
        accessibilityRole="button"
        accessibilityState={{ disabled: !paying }}
        disabled={!paying}
        onPress={() => setPaying(false)}
        className={`rounded-xl py-3 px-6 items-center ${
          paying ? 'bg-gray-800 dark:bg-gray-950 active:bg-gray-900' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <Text
          className={`font-semibold ${paying ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}
        >
          Cancel
        </Text>
      </Pressable>
    </View>
  );
}
