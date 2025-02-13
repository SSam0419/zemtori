import { CircleCheck } from "lucide-react";

function FeatureSection() {
  const features = [
    {
      title: "Professional Online Store Builder",
      description: "Launch your online store in minutes with our secure, user-friendly platform",
      items: [
        "Create and launch your store instantly with our simple product setup",
        "Accept payments securely worldwide with built-in Stripe integration",
        "Manage inventory, orders, and customers all in one place",
      ],
    },
    {
      title: "Storefront Experience",
      description: "Engage customers with a modern, responsive storefront that drives sales",
      items: [
        "Pre-built professional design that works on all devices",
        "Fast, secure checkout process that builds trust",
        "Automatic order management and instant payment processing",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start Selling Online in Minutes
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Everything you need to launch, run, and grow your online business — no technical
          experience required
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative rounded-2xl border p-8 transition-all hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
            <ul className="mt-6 list-none space-y-3">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="relative pl-6">
                  <CircleCheck color="#428ad7" className="absolute left-0 top-1 size-4" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureSection;
