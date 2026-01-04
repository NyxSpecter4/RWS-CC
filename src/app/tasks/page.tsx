'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Clock, AlertCircle, Calendar, Filter, Search } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  created_at: string;
  metadata: any;
};

type TabType = 'todo' | 'completed';

export default function TaskBoardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('todo');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<string | null>(null);

  // Fetch tasks from Supabase
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on active tab, search, and filters
  useEffect(() => {
    let result = tasks.filter(task => {
      // Tab filter
      if (activeTab === 'todo') {
        if (task.status === 'completed') return false;
      } else if (activeTab === 'completed') {
        if (task.status !== 'completed') return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(query) && 
            !(task.description?.toLowerCase().includes(query) ?? false) &&
            !task.category.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });

    // Sort by priority (high first), then due date
    result.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    });

    setFilteredTasks(result);
  }, [tasks, activeTab, searchQuery, categoryFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('farm_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        // If table doesn't exist, show sample data
        if (error.message.includes('does not exist')) {
          console.log('Table might not exist yet. Showing sample data.');
          setTasks(getSampleTasks());
        }
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setTasks(getSampleTasks());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleTasks = (): Task[] => {
    return [
      {
        id: '1',
        title: 'Fix leaking irrigation line',
        description: 'Drip line in North Field has a leak at junction box',
        category: 'Build',
        priority: 'high',
        status: 'pending',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        metadata: { location: 'North Field' }
      },
      {
        id: '2',
        title: 'Check tomato plants for blight',
        description: 'Inspect lower leaves for early blight symptoms',
        category: 'Crops',
        priority: 'medium',
        status: 'pending',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        metadata: { location: 'Greenhouse A' }
      },
      {
        id: '3',
        title: 'Soil test for compaction',
        description: 'Test soil density in South Field after heavy rain',
        category: 'Land',
        priority: 'medium',
        status: 'in_progress',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        metadata: { location: 'South Field' }
      },
      {
        id: '4',
        title: 'Harvest lettuce batch',
        description: 'Romaine lettuce ready for harvest in Greenhouse B',
        category: 'Crops',
        priority: 'high',
        status: 'completed',
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        metadata: { location: 'Greenhouse B' }
      },
    ];
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('farm_tasks')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error completing task:', error);
        return;
      }

      // Show success animation
      setShowSuccessAnimation(taskId);
      setTimeout(() => setShowSuccessAnimation(null), 2000);

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      ));

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'land': return '🌱';
      case 'build': return '🏗️';
      case 'crops': return '🌽';
      default: return '📝';
    }
  };

  const categories = ['all', 'Land', 'Build', 'Crops'];
  const priorities = ['all', 'high', 'medium', 'low'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Farm Task Board
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage all farm tasks. Turn logs into action.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                📋 {filteredTasks.length} tasks
              </span>
              <button 
                onClick={fetchTasks}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {tasks.filter(t => t.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6">
            {(['todo', 'completed'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-green-500 text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab === 'todo' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{tab === 'todo' ? 'To-Do' : 'Completed'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tab === 'todo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab === 'todo' 
                      ? tasks.filter(t => t.status !== 'completed').length
                      : tasks.filter(t => t.status === 'completed').length}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="inline w-4 h-4 mr-1" />
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>
                    {pri === 'all' ? 'All Priorities' : `${pri.charAt(0).toUpperCase() + pri.slice(1)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Count */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>

        {/* Task Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : activeTab === 'todo'
                ? 'All tasks are completed! Great work! 🎉'
                : 'No completed tasks yet. Start checking off items!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-2xl shadow-lg p-5 border-l-4 ${
                  task.priority === 'high' ? 'border-l-red-500' :
                  task.priority === 'medium' ? 'border-l-yellow-500' :
                  'border-l-green-500'
                } ${showSuccessAnimation === task.id ? 'animate-pulse ring-2 ring-green-500' : ''}`}
              >
                {/* Task Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">{task.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                  </div>
                </div>

                {/* Task Description */}
                {task.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  {task.metadata?.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{task.metadata.location}</span>
                    </div>
                  )}
                  {task.due_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  )}
                  <button
                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => console.log('View details', task.id)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}