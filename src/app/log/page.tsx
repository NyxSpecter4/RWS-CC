import QuickLogForm from '@/components/QuickLogForm';
import { supabase } from '@/lib/supabase';
import { getRecentAlerts } from '@/lib/leila-brain';

export default async function LogPage() {
  // Fetch recent alerts for the sidebar
  const recentAlerts = await getRecentAlerts(5);
  
  // Fetch recent farm tasks
  const { data: recentTasks } = await supabase
    .from('farm_tasks')
    .select('id, title, status, due_date')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Farm Log
          </h1>
          <p className="text-gray-600 mt-2">
            Quick logging for farmers in the field. Document observations, issues, and tasks.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              📍 Mobile-friendly
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              ⚡ Quick entry
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              🤖 AI-assisted
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left 2/3 on desktop, full width on mobile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Quick Log Entry
                </h2>
                <p className="text-gray-600">
                  Log observations, issues, or tasks directly from the field. 
                  AI will help categorize and analyze your entries.
                </p>
              </div>
              
              <QuickLogForm />
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  💡 Tips for effective logging
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Be specific about locations (e.g., "North Field, row 3")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Include photos when possible for AI analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Note weather conditions and time of day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Use the tab most relevant to your observation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Right 1/3 on desktop, full width on mobile */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                Recent Alerts
              </h3>
              {recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                        alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                        alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                        'border-l-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{alert.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{alert.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(alert.detected_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent alerts. Everything looks good! 🎉
                </div>
              )}
              <button className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                View All Alerts
              </button>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-500 mr-2">📋</span>
                Recent Tasks
              </h3>
              {recentTasks && recentTasks.length > 0 ? (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-800">{task.title}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                        {task.due_date && (
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent tasks logged.
                </div>
              )}
              <button className="w-full mt-4 py-2 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-medium transition-colors">
                Create New Task
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">📊 Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recentAlerts.length}</div>
                  <div className="text-sm opacity-90">Active Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {recentTasks?.filter(t => t.status === 'pending').length || 0}
                  </div>
                  <div className="text-sm opacity-90">Pending Tasks</div>
                </div>
              </div>
              <div className="mt-4 text-sm opacity-90">
                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            💚 Logging regularly helps Leila's AI understand your farm better and provide more accurate insights.
          </p>
        </div>
      </div>
    </div>
  );
}