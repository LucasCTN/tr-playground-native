import { AdvancedDropdownsSection } from '@/components/selection-controls/advanced-dropdowns-section';
import { CheckboxSection } from '@/components/selection-controls/checkbox-section';
import { DropdownsSection } from '@/components/selection-controls/dropdowns-section';
import { RadioSection } from '@/components/selection-controls/radio-section';
import { DemoTab, TabbedDemo } from '@/components/tabbed-demo';

// One tab per web playground page this screen absorbs
const TABS: readonly DemoTab[] = [
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
];

export default function SelectionControlsScreen() {
  return <TabbedDemo id="selection-controls" title="Selection Controls" tabs={TABS} />;
}
