import { Card, CardContent } from "@/components/ui/card";

interface Badge {
  emoji: string;
  title: string;
  description: string;
  requirement: string;
}

const badges: Badge[] = [
  {
    emoji: "🐋",
    title: "Crypto Whale",
    description: "Portfolio worth over $100k",
    requirement: "VERIFIED VIA BLOCKSCOUT",
  },
  {
    emoji: "🎨",
    title: "NFT Collector",
    description: "Owns 5+ unique NFTs",
    requirement: "VERIFIED VIA BLOCKSCOUT",
  },
  {
    emoji: "⚡",
    title: "Active Trader",
    description: "100+ on-chain transactions",
    requirement: "VERIFIED VIA BLOCKSCOUT",
  },
  {
    emoji: "🔷",
    title: "ETH Maximalist",
    description: "Holds 10+ ETH",
    requirement: "VERIFIED VIA BLOCKSCOUT",
  },
  {
    emoji: "🦄",
    title: "DeFi Pioneer",
    description: "Significant UNI holdings",
    requirement: "VERIFIED VIA BLOCKSCOUT",
  },
  {
    emoji: "🚀",
    title: "Power User",
    description: "1000+ transactions",
    requirement: "VERIFIED VIA BLOCKSCOUT",
  },
];

export function BadgeExamplesSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Available Badge Types
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Showcase different aspects of your Web3 journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card key={badge.title} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{badge.emoji}</div>
                <h3 className="text-lg font-bold">{badge.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {badge.description}
              </p>
              <div className="text-xs text-primary font-medium">
                {badge.requirement}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
