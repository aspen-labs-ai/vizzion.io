import { Eye, Layers, UserCheck, Users } from 'lucide-react';
import BenefitSplit from './BenefitSplit';

const benefits = [
  {
    title: 'Exclusive Leads',
    description:
      'Keep every conversation in-house. Your roofing contractor leads come from your own traffic, not brokered lead lists.',
    bullets: [
      'No shared lists with competing contractors',
      'Lower cost per acquisition from existing sessions',
      'Lead context includes chosen roofing style',
    ],
    stat: '0 Shared Leads',
    icon: Users,
  },
  {
    title: 'Close the Visualization Gap',
    description:
      'Stop asking homeowners to make a 20-year decision from a tiny shingle sample. Show their full roof before you quote.',
    bullets: [
      'Render materials on their actual roofline',
      'Reduce hesitation and delayed callbacks',
      'Make quote conversations concrete and specific',
    ],
    stat: '1 Full Preview',
    icon: Eye,
  },
  {
    title: 'Material Comparison That Sells Upgrades',
    description:
      'Roof design tools make premium differences obvious. Homeowners can compare standard and premium materials side by side.',
    bullets: [
      'Highlight architectural vs. 3-tab appearance',
      'Support asphalt, metal, tile, and more',
      'Move premium decisions earlier in the funnel',
    ],
    stat: '2x Upgrade Visibility',
    icon: Layers,
  },
  {
    title: 'Self-Qualified Prospects',
    description:
      'People who upload a photo and test materials are not cold traffic. Your team starts with informed buyers, not blind callbacks.',
    bullets: [
      'Inbound leads arrive with intent already proven',
      'Follow-up starts from design preference, not guesswork',
      'Sales reps spend more time on ready-to-close jobs',
    ],
    stat: 'High-Intent Pipeline',
    icon: UserCheck,
  },
] as const;

export default function BenefitsSection() {
  return (
    <>
      {benefits.map((benefit, index) => (
        <BenefitSplit
          key={benefit.title}
          title={benefit.title}
          description={benefit.description}
          bullets={[...benefit.bullets]}
          stat={benefit.stat}
          icon={benefit.icon}
          reverse={index % 2 === 1}
          className={index % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-secondary'}
        />
      ))}
    </>
  );
}
