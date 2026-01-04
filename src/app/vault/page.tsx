'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Leaf, Calendar, Thermometer, Droplets, Search, Filter, ChevronRight } from 'lucide-react';

type CropCycle = {
  id: string;
  crop_name: string;
  variety: string | null;
  growth_stage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest' | 'dormant';
  planting_date: string;
  expected_harvest_date: string | null;
  soil_type: string | null;
  temperature_range: string | null;
  water_needs: string | null;
  personal_wisdom: string | null;
  notes: string | null;
  created_at: string;
  metadata: any;
};

type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest' | 'dormant';

export default function CropVaultPage() {
  const [crops, setCrops] = useState<CropCycle[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<CropCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropCycle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch crop cycles from Supabase
  useEffect(() => {
    fetchCrops();
  }, []);

  // Filter crops based on search and stage filter
  useEffect(() => {
    let result = crops.filter(crop => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!crop.crop_name.toLowerCase().includes(query) && 
            !(crop.variety?.toLowerCase().includes(query) ?? false) &&
            !(crop.personal_wisdom?.toLowerCase().includes(query) ?? false)) {
          return false;
        }
      }

      // Stage filter
      if (stageFilter !== 'all' && crop.growth_stage !== stageFilter) {
        return false;
      }

      return true;
    });

    // Sort by planting date (newest first)
    result.sort((a, b) => new Date(b.planting_date).getTime() - new Date(a.planting_date).getTime());

    setFilteredCrops(result);
  }, [crops, searchQuery, stageFilter]);

  const fetchCrops = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crop_cycles')
        .select('*')
        .order('planting_date', { ascending: false });

      if (error) {
        console.error('Error fetching crop cycles:', error);
        // If table doesn't exist, show sample data
        if (error.message.includes('does not exist')) {
          console.log('Table might not exist yet. Showing sample data.');
          setCrops(getSampleCrops());
        }
      } else {
        setCrops(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCrops(getSampleCrops());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleCrops = (): CropCycle[] => {
    return [
      {
        id: '1',
        crop_name: 'Tomato',
        variety: 'Heirloom Cherokee Purple',
        growth_stage: 'fruiting',
        planting_date: '2026-01-15',
        expected_harvest_date: '2026-03-30',
        soil_type: 'Well-drained loam',
        temperature_range: '65-85°F',
        water_needs: '1 inch per week',
        personal_wisdom: 'Prune lower leaves to prevent blight. Use eggshells for calcium.',
        notes: 'Planted in Greenhouse A, row 3',
        created_at: new Date().toISOString(),
        metadata: { location: 'Greenhouse A' }
      },
      {
        id: '2',
        crop_name: 'Lettuce',
        variety: 'Romaine',
        growth_stage: 'vegetative',
        planting_date: '2026-02-01',
        expected_harvest_date: '2026-03-15',
        soil_type: 'Rich compost',
        temperature_range: '60-70°F',
        water_needs: 'Keep soil consistently moist',
        personal_wisdom: 'Harvest outer leaves first for continuous growth.',
        notes: 'Succession planting every 2 weeks',
        created_at: new Date().toISOString(),
        metadata: { location: 'Greenhouse B' }
      },
      {
        id: '3',
        crop_name: 'Carrots',
        variety: 'Nantes',
        growth_stage: 'seedling',
        planting_date: '2026-02-10',
        expected_harvest_date: '2026-05-01',
        soil_type: 'Sandy, stone-free',
        temperature_range: '55-75°F',
        water_needs: 'Even moisture, avoid drying out',
        personal_wisdom: 'Thin to 2 inches apart for straight roots.',
        notes: 'Direct sown in raised bed 4',
        created_at: new Date().toISOString(),
        metadata: { location: 'Raised Bed 4' }
      },
      {
        id: '4',
        crop_name: 'Basil',
        variety: 'Genovese',
        growth_stage: 'flowering',
        planting_date: '2026-01-20',
        expected_harvest_date: '2026-03-10',
        soil_type: 'Well-drained potting mix',
        temperature_range: '70-90°F',
        water_needs: 'Water when top inch is dry',
        personal_wisdom: 'Pinch flowers to encourage leaf growth.',
        notes: 'Companion planted with tomatoes',
        created_at: new Date().toISOString(),
        metadata: { location: 'Companion bed' }
      },
    ];
  };

  const getGrowthStageColor = (stage: GrowthStage) => {
    switch (stage) {
      case 'seedling': return 'bg-blue-100 text-blue-800';
      case 'vegetative': return 'bg-green-100 text-green-800';
      case 'flowering': return 'bg-purple-100 text-purple-800';
      case 'fruiting': return 'bg-red-100 text-red-800';
      case 'harvest': return 'bg-amber-100 text-amber-800';
      case 'dormant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthStageIcon = (stage: GrowthStage) => {
    switch (stage) {
      case 'seedling': return '🌱';
      case 'vegetative': return '🌿';
      case 'flowering': return '🌸';
      case 'fruiting': return '🍅';
      case 'harvest': return '📦';
      case 'dormant': return '💤';
      default: return '🌱';
    }
  };

  const getDaysSincePlanting = (plantingDate: string) => {
    const planting = new Date(plantingDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - planting.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const growthStages: GrowthStage[] = ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest', 'dormant'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-8 h-8 text-green-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Crop Vault
                </h1>
              </div>
              <p className="text-gray-600">
                Your farm's knowledge base. Track crop cycles, record wisdom, and learn from each season.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Leaf className="w-4 h-4 mr-1" />
                {filteredCrops.length} crops
              </span>
              <button 
                onClick={fetchCrops}
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
              {crops.filter(c => c.growth_stage === 'fruiting' || c.growth_stage === 'harvest').length}
            </div>
            <div className="text-sm text-gray-600">Ready/Harvesting</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {crops.filter(c => c.growth_stage === 'seedling').length}
            </div>
            <div className="text-sm text-gray-600">Seedlings</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {crops.length}
            </div>
            <div className="text-sm text-gray-600">Total Crops</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {crops.filter(c => c.personal_wisdom).length}
            </div>
            <div className="text-sm text-gray-600">Wisdom Entries</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search crops or wisdom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Growth Stage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="inline w-4 h-4 mr-1" />
                Growth Stage
              </label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Stages</option>
                {growthStages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View Mode
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 text-center ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 text-center ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Crop Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredCrops.length} of {crops.length} crop cycles
          </div>
        </div>

        {/* Crop Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading crop knowledge...</p>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No crops found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery || stageFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Start by adding your first crop cycle to build your knowledge base!'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedCrop(crop)}
              >
                {/* Crop Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{getGrowthStageIcon(crop.growth_stage)}</span>
                      <h3 className="text-xl font-bold text-gray-800">{crop.crop_name}</h3>
                    </div>
                    {crop.variety && (
                      <p className="text-sm text-gray-600">{crop.variety}</p>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getGrowthStageColor(crop.growth_stage)}`}>
                    {crop.growth_stage}
                  </span>
                </div>

                {/* Crop Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Planted {getDaysSincePlanting(crop.planting_date)} days ago</span>
                  </div>
                  {crop.temperature_range && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Thermometer className="w-4 h-4 mr-2" />
                      <span>{crop.temperature_range}</span>
                    </div>
                  )}
                  {crop.water_needs && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Droplets className="w-4 h-4 mr-2" />
                      <span>{crop.water_needs}</span>
                    </div>
                  )}
                </div>

                {/* Personal Wisdom */}
                {crop.personal_wisdom && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-1">Personal Wisdom</div>
                    <p className="text-sm text-gray-700 line-clamp-2 italic">
                      "{crop.personal_wisdom}"
                    </p>
                  </div>
                )}

                {/* View Details Button */}
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button className="w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Crop</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Stage</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Planted</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Expected Harvest</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Wisdom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCrops.map((crop) => (
                  <tr
                    key={crop.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCrop(crop)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getGrowthStageIcon(crop.growth_stage)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{crop.crop_name}</div>
                          {crop.variety && (
                            <div className="text-sm text-gray-500">{crop.variety}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${getGrowthStageColor(crop.growth_stage)}`}>
                        {crop.growth_stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(crop.planting_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {crop.expected_harvest_date
                        ? new Date(crop.expected_harvest_date).toLocaleDateString()
                        : 'Not set'}
                    </td>
                    <td className="py-3 px-4">
                      {crop.personal_wisdom ? (
                        <div className="text-sm text-gray-700 line-clamp-1 italic">
                          "{crop.personal_wisdom}"
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No wisdom yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Crop Detail Modal */}
        {selectedCrop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{getGrowthStageIcon(selectedCrop.growth_stage)}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedCrop.crop_name}</h2>
                        {selectedCrop.variety && (
                          <p className="text-gray-600">{selectedCrop.variety}</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${getGrowthStageColor(selectedCrop.growth_stage)}`}>
                      {selectedCrop.growth_stage}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCrop(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Planting Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Planted:</span>
                          <span className="font-medium">{new Date(selectedCrop.planting_date).toLocaleDateString()}</span>
                        </div>
                        {selectedCrop.expected_harvest_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expected Harvest:</span>
                            <span className="font-medium">{new Date(selectedCrop.expected_harvest_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Since Planting:</span>
                          <span className="font-medium">{getDaysSincePlanting(selectedCrop.planting_date)} days</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Growing Conditions</h3>
                      <div className="space-y-2">
                        {selectedCrop.soil_type && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Soil:</span>
                            <span className="font-medium">{selectedCrop.soil_type}</span>
                          </div>
                        )}
                        {selectedCrop.temperature_range && (
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{selectedCrop.temperature_range}</span>
                          </div>
                        )}
                        {selectedCrop.water_needs && (
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{selectedCrop.water_needs}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Wisdom</h3>
                    {selectedCrop.personal_wisdom ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-gray-700 italic">"{selectedCrop.personal_wisdom}"</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-500">No wisdom recorded yet</p>
                      </div>
                    )}

                    {selectedCrop.notes && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-700">{selectedCrop.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedCrop(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                    Edit Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}