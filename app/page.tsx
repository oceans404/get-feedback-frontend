import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { MessageSquare, ExternalLink, Zap, RefreshCw, Users, Code } from "lucide-react"
import { HeroSection } from "@/components/landing/hero-section"
import { ConfigurableWidgetDemo } from "@/components/landing/configurable-widget-demo"
import type { WidgetConfig } from "@/components/landing/config-panel"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  // Default configuration
  const defaultConfig: WidgetConfig = {
    title: "Feedback",
    successMessage: "Thanks for providing feedback to improve our product!",
    buttonText: "Submit",
    buttonStyle: "dark",
    showRating: true,
    ratingQuestion: "Do you like this product?",
    requireEmail: false,
    emailPlaceholder: "your@email.com",
    messagePlaceholder: "Tell us how we can improve",
    highlightColor: "#0070f3",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="max-w-screen-xl mx-auto w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-xl font-bold">
            <MessageSquare className="h-5 w-5 mr-2" />
            Get Feedback
          </div>
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <HeroSection />
          </div>
        </section>

        {/* Demo Section with distinct styling */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-muted/60 border-y">
          <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Demo: Customize a Feedback Widget</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                All user feedback data is securely stored in{" "}
                <a
                  href="https://docs.nillion.com/build/secret-vault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Nillion SecretVault
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </div>

            {/* Demo Section with Split Panel */}
            <ConfigurableWidgetDemo defaultConfig={defaultConfig} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Get Feedback?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform makes it easy to collect, analyze, and act on user feedback.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature Card 1 */}
              <div className="group bg-background rounded-xl border border-border/50 p-2 transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-1">
                <div className="h-full flex flex-col p-4">
                  <div className="bg-muted rounded-lg p-4 mb-4 w-14 h-14 flex items-center justify-center group-hover:bg-primary/10">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Rapid Iteration</h3>
                  <p className="text-muted-foreground flex-grow">
                    Collect feedback instantly and iterate on your product faster than ever before.
                  </p>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group bg-background rounded-xl border border-border/50 p-2 transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-1">
                <div className="h-full flex flex-col p-4">
                  <div className="bg-muted rounded-lg p-4 mb-4 w-14 h-14 flex items-center justify-center group-hover:bg-primary/10">
                    <RefreshCw className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Continuous Improvement</h3>
                  <p className="text-muted-foreground flex-grow">
                    Use real user feedback to continuously improve your product experience.
                  </p>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group bg-background rounded-xl border border-border/50 p-2 transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-1">
                <div className="h-full flex flex-col p-4">
                  <div className="bg-muted rounded-lg p-4 mb-4 w-14 h-14 flex items-center justify-center group-hover:bg-primary/10">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">User-Centered Design</h3>
                  <p className="text-muted-foreground flex-grow">
                    Build products your users actually want by listening to their feedback.
                  </p>
                </div>
              </div>

              {/* Feature Card 4 */}
              <div className="group bg-background rounded-xl border border-border/50 p-2 transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-1">
                <div className="h-full flex flex-col p-4">
                  <div className="bg-muted rounded-lg p-4 mb-4 w-14 h-14 flex items-center justify-center group-hover:bg-primary/10">
                    <Code className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No-Code Configuration</h3>
                  <p className="text-muted-foreground flex-grow">
                    Add your own feedback widget by pasting in 1 snippet of code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
