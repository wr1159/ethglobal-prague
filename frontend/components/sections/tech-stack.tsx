import { Card, CardContent } from "@/components/ui/card";

interface TechStackItem {
  emoji: string;
  name: string;
  description: string;
}

const techStack: TechStackItem[] = [
  {
    emoji: "🔐",
    name: "Privy",
    description: "Secure wallet & Twitter linking",
  },
  {
    emoji: "🔍",
    name: "Blockscout",
    description: "On-chain data & verification",
  },
  {
    emoji: "⚡",
    name: "vlayer",
    description: "TimeTravel proof verification",
  },
  {
    emoji: "🗄️",
    name: "Supabase",
    description: "Profile & badge storage",
  },
];

export function TechStackSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Built for ETHGlobal Prague
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Leveraging cutting-edge Web3 infrastructure for seamless identity
          verification
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {techStack.map((tech) => (
          <Card key={tech.name} className="text-center shadow-sm">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">{tech.emoji}</div>
              <h3 className="font-bold mb-2">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">
                {tech.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
