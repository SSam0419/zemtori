import BeamAction from "../actions/BeamAction";

function HeroSection() {
  return (
    <div className="relative h-full w-full">
      <div className="pt-8">
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-center text-3xl font-medium text-gray-900 dark:text-gray-50 sm:text-6xl">
            Build & Manage Your Online Shop with{" "}
            <span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
              Ease and Speed
            </span>
          </h2>
          <p className="mb-2 mt-6 text-center text-lg leading-6 text-gray-600 dark:text-gray-200">
            Launch your online store, manage products, and start selling — all in one place. No
            coding needed, just easy setup and customization.
          </p>
          <BeamAction />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
