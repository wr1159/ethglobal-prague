export function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center text-center max-w-4xl mx-auto">
      {/* Logo/Brand Section */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Persona
          </h1>
          <div className="absolute -top-2 -right-8 text-2xl">🎭</div>
        </div>
        <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
          Wallet-Verified Badges for Twitter
        </p>
      </div>

      {/* Value Proposition */}
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
          Prove your{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            on-chain activity
          </span>
          <br />
          directly on Twitter
        </h2>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Link your wallet once, mint badges for your achievements, and let the
          world see your badges alongside every tweet{" "}
          <strong>WITHOUT revealing your address.</strong>
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-muted/50 rounded-2xl p-6 border">
        <p className="text-base lg:text-lg font-medium">
          <span className="font-bold">The Problem:</span> @handles on Twitter
          say all they want and nobody knows whether they are legit or not.
          <br />
          <span className="font-bold">The Solution:</span> Fewer larps, richer
          identity on Twitter. 🚀
        </p>
      </div>

      {/* Feature Preview */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="font-bold text-lg mb-2">Link Once</h3>
          <p className="text-sm text-muted-foreground">
            Connect your Twitter and wallet securely with Privy
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-bold text-lg mb-2">Choose Badges</h3>
          <p className="text-sm text-muted-foreground">
            Select which achievements to showcase publicly
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-bold text-lg mb-2">Mint & Show</h3>
          <p className="text-sm text-muted-foreground">
            Your badges appear beside every tweet automatically
          </p>
        </div>
      </div>
    </div>
  );
}
