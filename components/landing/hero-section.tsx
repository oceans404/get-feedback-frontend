"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { PersonaSwitcher } from "@/components/landing/persona-switcher"

export function HeroSection() {
  return (
    <div className="text-center">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <PersonaSwitcher />
        <h2 className="text-2xl md:text-3xl font-bold">need to get feedback</h2>
      </div>

      <div className="mt-12 mb-12">
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg lg:text-xl mb-8">
          Collect user feedback effortlessly by adding a no-code customizable feedback widget to your product
        </p>
        <Button asChild size="lg">
          <Link href="/login">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
