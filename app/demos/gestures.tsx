import { DoubleTapSection } from '@/components/gestures/double-tap-section';
import { HoverSection } from '@/components/gestures/hover-section';
import { LongPressSection } from '@/components/gestures/long-press-section';
import { TapSection } from '@/components/gestures/tap-section';
import { DemoTab, TabbedDemo } from '@/components/tabbed-demo';

// One tab per web playground page this screen absorbs, mapped to its touch equivalent
const TABS: readonly DemoTab[] = [
  {
    key: 'tap',
    label: 'Tap',
    icon: 'hand-left-outline',
    description: 'Validate button click functionality',
    Section: TapSection,
  },
  {
    key: 'long-press',
    label: 'Long Press',
    icon: 'timer-outline',
    description:
      'The button below will say if it was clicked by a long click or a normal click depending on the setting.',
    Section: LongPressSection,
  },
  {
    key: 'double-tap',
    label: 'Double Tap',
    icon: 'finger-print-outline',
    description: 'The button below will change itself on a double tap.',
    Section: DoubleTapSection,
  },
  {
    key: 'hover',
    label: 'Hover',
    icon: 'eye-outline',
    description: 'Hover over or touch a button to reveal the hidden text.',
    Section: HoverSection,
  },
];

export default function GesturesScreen() {
  return <TabbedDemo id="gestures" title="Gestures" tabs={TABS} />;
}
