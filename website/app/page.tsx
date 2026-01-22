'use client'

import { Shield, GitBranch, Zap, CheckCircle2, XCircle, Terminal, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <span className="text-2xl font-bold">branch-guard</span>
        </div>
        <a href="https://github.com/yourusername/branch-guard" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </a>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm mb-6">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span>Prevent merge conflicts before they happen</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Stop wasting hours on<br />merge conflicts
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Single npm command that blocks dangerous git checkouts when branches have diverged too much.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8">
            <Terminal className="mr-2 h-5 w-5" />
            npx branch-guard init
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            View Docs
          </Button>
        </div>

        {/* Code Demo */}
        <Card className="max-w-3xl mx-auto text-left bg-slate-900 dark:bg-slate-950 border-slate-800">
          <CardContent className="p-6 font-mono text-sm">
            <div className="space-y-2">
              <div className="text-slate-400">$ git checkout main</div>
              <div className="text-slate-500"># main now 47 commits ahead</div>
              <div className="text-slate-400 mt-4">$ git checkout feature/login</div>
              <div className="flex items-center gap-2 text-red-400 mt-2">
                <XCircle className="h-4 w-4" />
                <span>❌ Blocked: main has 47 divergent commits!</span>
              </div>
              <div className="text-yellow-400 mt-2">💡 Recommendation:</div>
              <div className="text-slate-500 ml-4">git pull origin main</div>
              <div className="text-slate-500 ml-4">git rebase main</div>
              <div className="text-slate-400 mt-4">$ npx branch-guard sync</div>
              <div className="flex items-center gap-2 text-green-400 mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>✅ Branch synced successfully!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The Daily Dev Reality
          </h2>
          
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-400">Without branch-guard</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm space-y-2">
              <div>$ git checkout main <span className="text-slate-500"># main now 47 commits ahead</span></div>
              <div>$ git checkout feature/login <span className="text-slate-500"># divergent history created</span></div>
              <div className="text-slate-500">*2 days coding → 20 commits*</div>
              <div>$ git checkout main <span className="text-slate-500"># main now 52 commits ahead!</span></div>
              <div>$ git merge feature/login <span className="text-red-600"># 💥 15+ files conflict hell (2hrs wasted)</span></div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <GitBranch className="h-10 w-10 mb-4 text-blue-500" />
              <CardTitle>Divergence Detection</CardTitle>
              <CardDescription>
                Uses git rev-list to calculate exact commit divergence between branches
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-4 text-green-500" />
              <CardTitle>Smart Threshold</CardTitle>
              <CardDescription>
                Blocks switches when branches differ by more than 10 commits (configurable)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-4 text-yellow-500" />
              <CardTitle>Auto-Recovery</CardTitle>
              <CardDescription>
                Provides exact commands to fix divergence or auto-sync with one command
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Commands */}
      <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple Commands
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg">branch-guard init</CardTitle>
                <CardDescription>Install once, protected forever</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg">branch-guard safe &lt;branch&gt;</CardTitle>
                <CardDescription>Check if switching to a branch is safe</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg">branch-guard sync</CardTitle>
                <CardDescription>Auto-rebase current branch with main</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold mb-2">20+</div>
            <div className="text-slate-600 dark:text-slate-400">Branch switches/day</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">30%</div>
            <div className="text-slate-600 dark:text-slate-400">Conflict rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">2hrs</div>
            <div className="text-slate-600 dark:text-slate-400">Saved per week</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-slate-600 dark:text-slate-400">Teams affected</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto text-center bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-800 dark:to-slate-900 border-0">
          <CardHeader className="space-y-6 pb-8">
            <CardTitle className="text-3xl md:text-4xl text-white">
              Ready to stop wasting time?
            </CardTitle>
            <CardDescription className="text-slate-300 text-lg">
              Install branch-guard in 30 seconds and never deal with preventable merge conflicts again.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Terminal className="mr-2 h-5 w-5" />
                npm install -g branch-guard
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-600 dark:text-slate-400 border-t">
        <p>MIT License • Built for developers who value their time</p>
      </footer>
    </div>
  )
}
