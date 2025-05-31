interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Connect Accounts",
    description:
      "Link your Twitter and wallet with Privy's secure authentication",
  },
  {
    number: 2,
    title: "Analyze Holdings",
    description:
      "We scan your wallet using Blockscout to find your achievements",
  },
  {
    number: 3,
    title: "Choose Badges",
    description:
      "Select which on-chain achievements you want to display publicly",
  },
  {
    number: 4,
    title: "Mint & Display",
    description:
      "Install our extension and your badges appear beside every tweet",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          How Persona Works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Four simple steps to transform your Twitter presence with verified
          Web3 identity
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.number} className="text-center space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-sm ${
                index % 2 === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {step.number}
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
