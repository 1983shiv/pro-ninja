import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col container mx-auto py-20">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI ReviewSense
        </h1>
        <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
          Transform customer reviews into actionable insights with AI-powered analysis and automated responses.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="p-20 grid md:grid-cols-3 gap-8 mt-20">
        <div className="text-center p-6 border rounded-lg">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
          <p className="text-muted-foreground">
            Leverage advanced AI models from OpenAI, Anthropic, Google, and Groq
          </p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Automated</h3>
          <p className="text-muted-foreground">
            Auto-analyze reviews and generate personalized responses instantly
          </p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground">
            Track sentiment trends and customer satisfaction over time
          </p>
        </div>
      </div>
    </div>
  )
}