import { Hero } from "@/components/hero";
import {
  HowItWorksSection,
  BadgeExamplesSection,
  TechStackSection,
  CTASection,
} from "@/components/sections";

// import {
//   exampleGetAddressSummary,
//   exampleGetNetWorth,
//   exampleGetNFTs,
//   exampleGetTopHoldings,
// } from "@/lib/blockscout-example";

export default async function Home() {
  //   console.log("topHoldings", await exampleGetTopHoldings());
  //   console.log("nftHoldings", await exampleGetNFTs());
  //   console.log("netWorth", await exampleGetNetWorth());
  //   console.log("addressSummary", await exampleGetAddressSummary());

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-16 px-4 sm:px-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="py-12 lg:py-20">
            <Hero />
          </section>

          {/* How It Works Section */}
          <HowItWorksSection />

          {/* Badge Examples Section */}
          <BadgeExamplesSection />

          {/* Tech Stack Section */}
          <TechStackSection />

          {/* CTA Section */}
          <CTASection />
        </div>
      </div>
    </main>
  );
}
