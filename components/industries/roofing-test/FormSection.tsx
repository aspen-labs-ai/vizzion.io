import SignupSection from '@/components/SignupSection';

export default function FormSection() {
  return (
    <>
      <section className="bg-bg-primary px-6 py-20">
        <div className="mx-auto w-full max-w-[800px] text-left">
          <h2 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            Start Generating Roofing Contractor Leads From Traffic You Already Own
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Keep the existing form flow, but on a full-width background with no container clipping or footer gap.
          </p>
        </div>
      </section>

      <SignupSection defaultIndustry="Roofing" />
    </>
  );
}
