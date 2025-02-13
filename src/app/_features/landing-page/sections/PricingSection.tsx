import { Button } from "@/app/_shared/components/ui/button";

function PricingSection() {
  const plans = [
    // {
    //   name: "Starter",
    //   price: "29",
    //   description: "Perfect for new businesses starting their online journey",
    //   features: [
    //     "Single shop",
    //     "Basic templates",
    //     "Product management",
    //     "Basic analytics",
    //     "Email support",
    //   ],
    //   cta: "Start Free Trial",
    // },
    {
      name: "Free Trails",
      price: "Free",
      description: "Start Now !",
      features: ["Single shop", "Basic templates", "Product management"],
      cta: "Get Started",
      popular: true,
    },
    // {
    //   name: "Enterprise",
    //   price: "199",
    //   description: "Custom solutions for large-scale operations",
    //   features: [
    //     "Unlimited shops",
    //     "Custom development",
    //     "Dedicated support",
    //     "SLA guarantee",
    //     "White-label option",
    //   ],
    //   cta: "Contact Sales",
    // },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Choose the perfect plan for your business needs
        </p>
      </div>

      <div className="mt-20 flex items-center justify-center gap-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border p-8 transition-all hover:shadow-lg ${plan.popular ? "border-blue-500 ring-2 ring-blue-500" : ""}`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm text-white">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-600 dark:text-gray-300">/month</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`mt-8 w-full ${plan.popular ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingSection;
