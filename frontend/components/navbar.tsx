"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePrivy } from "@privy-io/react-auth";

export function Navbar() {
  const { ready, authenticated, logout } = usePrivy();
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-4 sm:px-20 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Persona</Link>
        </div>
        <div className="flex gap-5 items-center">
          {ready && authenticated && (
            <Button>
              <Link href={"/dashboard"}>Visit your Dashboard</Link>
            </Button>
          )}
          {ready && authenticated ? (
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          ) : (
            <Link href={"/login"}>
              <Button size={"lg"}>Try Now</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
