'use client'

import { useState } from 'react'
import { Shield, Copy, Check, Terminal, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const installCommand = 'npm install -g branchguard'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm text-blue-600 mb-6">
              <Shield className="h-4 w-4" />
              <span>Prevent merge conflicts</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 leading-tight">
              The CLI That Actually
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Prevents Conflicts
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Smart Git workflow protection that blocks dangerous branch switches before they cause merge conflicts
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.npmjs.com/package/branchguard" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  <Terminal className="mr-2 h-5 w-5" />
                  View on npm
                </Button>
              </a>
              <a 
                href="https://github.com/uvenkatateja/branchguard" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </a>
            </div>
          </div>

          {/* Right Side - Install Command Box */}
          <div className="lg:pl-12">
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 p-8 md:p-10">
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-3 block">
                  Install globally
                </label>
                <div className="relative group">
                  <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between border-2 border-slate-800 hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Terminal className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <code className="text-base md:text-lg text-white font-mono truncate">
                        {installCommand}
                      </code>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="sm"
                      className="ml-3 text-slate-400 hover:text-white hover:bg-slate-800 flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="text-sm font-semibold text-slate-700 mb-3 block">
                  Quick start
                </label>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <code className="text-sm text-slate-700 font-mono">
                      branchguard init
                    </code>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <code className="text-sm text-slate-700 font-mono">
                      branchguard safe main
                    </code>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <code className="text-sm text-slate-700 font-mono">
                      branchguard sync
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
