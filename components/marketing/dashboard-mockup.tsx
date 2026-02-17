'use client';

import { 
  LayoutDashboard, 
  Star, 
  BarChart3, 
  Settings, 
  MessageSquare,
  RotateCw,
  Download,
  Brain,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export function DashboardMockup() {
  return (
    <div className="perspective-container relative max-w-6xl mx-auto px-4 sm:px-0">
      <div className="tilted-mockup rounded-xl bg-white border border-slate-200/60 p-2 sm:p-4">
        {/* Browser Chrome */}
        <div className="bg-slate-50 rounded-t-lg border-b border-slate-200 px-4 py-3 flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-md h-7 flex items-center justify-center text-xs text-slate-400">
            app.aireviewsense.com/dashboard
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-b-lg overflow-hidden min-h-[400px] md:min-h-[600px] text-left">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-100 bg-white hidden md:flex flex-col p-4 gap-1 h-[600px]">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Main Menu
              </div>
              
              {/* Active Nav Item */}
              <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md cursor-pointer font-medium text-sm">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </div>
              
              {/* Other Nav Items */}
              <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer text-sm">
                <MessageSquare className="w-5 h-5" />
                Reviews
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer text-sm">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer text-sm">
                <Settings className="w-5 h-5" />
                Settings
              </div>

              {/* Usage Meter */}
              <div className="mt-auto p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs font-medium text-slate-500 mb-2">Monthly Usage</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '72%'}}></div>
                </div>
                <div className="text-xs text-slate-400">360 / 500 reviews</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-slate-50 p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Review Dashboard</h2>
                  <p className="text-slate-500 text-sm">Overview of your customer sentiment</p>
                </div>
                <div className="flex gap-3">
                  <button className="hidden sm:flex px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                    <RotateCw className="w-4 h-4" />
                    Analyze New
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">1,248</div>
                  <div className="text-sm text-slate-500">Total Reviews Analyzed</div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Star className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                    </div>
                    <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">4.8/5.0</div>
                  <div className="text-sm text-slate-500">Average Sentiment Score</div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-full">Automated</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">92%</div>
                  <div className="text-sm text-slate-500">Response Rate</div>
                </div>
              </div>

              {/* Recent Analysis Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">Recent AI Analysis</h3>
                  <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</a>
                </div>
                
                {/* Review Item */}
                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                      JD
                    </div>
                  </div>
                  <div className="grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">John Doe</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 ml-auto">2 mins ago</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      "The plugin setup was incredibly easy, and the AI features are a game changer for my workflow. Highly recommended!"
                    </p>
                    
                    {/* AI Insight Box */}
                    <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5" />
                          AI Insight
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                          Positive Sentiment
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic mb-3">
                        "Customer highlights ease of use and efficiency gains. Suggested action: Request a case study participation."
                      </p>
                      
                      {/* Auto-Reply */}
                      <div className="pt-3 border-t border-indigo-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Draft Auto-Reply (GPT-4)
                          </span>
                          <div className="flex gap-2">
                            <button className="text-xs text-slate-500 hover:text-indigo-600">Edit</button>
                            <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-700">Post Reply</button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                          "Thanks John! We're thrilled to hear the plugin is improving your workflow. Let us know if there's anything else we can help with!"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
