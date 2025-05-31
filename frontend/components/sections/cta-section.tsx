import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-12 text-center">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 lg:p-12 text-primary-foreground shadow-lg">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready to Show Your True Identity?
        </h2>
        <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join the revolution of verified Web3 identity on Twitter. No more
          anonymous handles, just authentic proof of your on-chain achievements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-muted"
            asChild
          >
            <Link href="/login">Try Now</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary hover:bg-primary-foreground/50"
          >
            Install Extension
          </Button>
        </div>
      </div>
    </section>
  );
}
