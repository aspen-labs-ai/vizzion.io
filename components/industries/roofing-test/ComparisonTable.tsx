import { CircleCheck, CircleX } from 'lucide-react';

const oldWay = [
  'Buy shared roofing leads and race other contractors to call first',
  'Use sample boards and ask customers to imagine the full roof',
  'Start estimating before design confidence is built',
  'Lose momentum during color and style indecision',
  'Get little signal about what each prospect actually wants',
];

const withVizzion = [
  'Generate exclusive roofing contractor leads from your own visitors',
  'Show real roof previews on each homeowner photo',
  'Move quote conversations directly into selected options',
  'Shorten sales cycles with pre-made design decisions',
  'Capture material preference with every lead submission',
];

function ComparisonColumn({
  title,
  items,
  positive,
}: {
  title: string;
  items: string[];
  positive: boolean;
}) {
  const Icon = positive ? CircleCheck : CircleX;

  return (
    <div className="rounded-2xl border border-border-default bg-bg-primary/70 p-7">
      <h3 className="mb-6 text-2xl font-semibold text-text-primary">{title}</h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-text-secondary">
            <Icon className={`mt-1 h-4 w-4 flex-shrink-0 ${positive ? 'text-accent' : 'text-red-400'}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComparisonTable() {
  return (
    <section className="bg-bg-secondary px-6 py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            Old Way vs With Vizzion
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Roofing lead generation should improve margins and close rate. Here is where the workflow shifts.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ComparisonColumn title="Old Way" items={oldWay} positive={false} />
          <ComparisonColumn title="With Vizzion" items={withVizzion} positive={true} />
        </div>
      </div>
    </section>
  );
}
