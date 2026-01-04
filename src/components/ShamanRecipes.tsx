'use client';
import { useState } from 'react';
import { X, Leaf, Bug, Droplet, Flame } from 'lucide-react';

export default function ShamanRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const knfRecipes = {
    'imo3': {
      name: 'IMO #3 - Indigenous Microorganisms',
      icon: '🦠',
      time: '7 days',
      difficulty: 'Medium',
      ingredients: [
        '10kg IMO-2 (cultured on rice)',
        '10kg field soil (from your farm)',
        '10kg rice bran or wheat bran',
        '1kg brown sugar or molasses',
        'Water (adjust moisture to 65%)'
      ],
      steps: [
        'Mix IMO-2 with equal parts local soil in shade',
        'Add rice bran and brown sugar, mix thoroughly',
        'Moisture should feel like wrung-out sponge (65%)',
        'Pile mixture 30-50cm high, cover with breathable cloth',
        'Turn pile when temperature reaches 50-60°C (every 2 days)',
        'Ready when sweet fermented smell, no ammonia (5-7 days)',
        'Store in shaded, ventilated area'
      ],
      uses: [
        'Soil amendment: 1kg per 10m²',
        'Compost activator: Mix 5-10% into compost pile',
        'Seed treatment: Dust seeds before planting',
        'Transplant shock reducer: Apply to soil before transplanting'
      ],
      benefits: 'Builds beneficial soil microbiome, improves nutrient cycling, enhances plant immunity'
    },
    'fpj': {
      name: 'FPJ - Fermented Plant Juice (Guava)',
      icon: '🍃',
      time: '7-10 days',
      difficulty: 'Easy',
      ingredients: [
        '1kg young guava shoots (before sunrise)',
        '1kg brown sugar (equal weight to plant material)',
        'Glass or food-grade plastic container',
        'Breathable cloth cover',
        'Rubber band'
      ],
      steps: [
        'Harvest young guava shoots early morning (highest hormone levels)',
        'Chop into small pieces (2-3cm)',
        'Layer plant material and brown sugar in container (alternate layers)',
        'Fill to 2/3 of container, leaving space for expansion',
        'Cover with breathable cloth, secure with rubber band',
        'Store in cool, dark place for 7-10 days',
        'Strain liquid, compost solids',
        'Store in cool place, lasts 6-12 months'
      ],
      uses: [
        'Vegetative growth: Dilute 1:500-1000, spray or drench',
        'Foliar spray: Apply early morning or evening',
        'Soil drench: Water around root zone',
        'Frequency: Weekly during active growth'
      ],
      benefits: 'Promotes vigorous vegetative growth, increases leaf chlorophyll, enhances photosynthesis'
    },
    'ohn': {
      name: 'OHN - Oriental Herbal Nutrients',
      icon: '🌿',
      time: '7 days',
      difficulty: 'Advanced',
      ingredients: [
        '1 part Angelica root (강활)',
        '1 part Cinnamon (계피)',
        '1 part Licorice root (감초)',
        '1 part Garlic (마늘)',
        '1 part Ginger (생강)',
        'Brown sugar (equal weight to herbs)',
        'Alcohol 35% or rice wine',
        'Makgeolli or yogurt (beneficial microbes)'
      ],
      steps: [
        'Chop all herbs finely, mix together',
        'Add equal weight brown sugar, mix thoroughly',
        'Pack into jar, fill 1/2 way',
        'Add alcohol to cover herbs completely',
        'Add 2 tablespoons makgeolli or yogurt',
        'Seal jar, shake daily for 7 days',
        'Strain, store in cool dark place',
        'Lasts indefinitely due to alcohol preservation'
      ],
      uses: [
        'Disease prevention: 1:1000 weekly spray',
        'Plant stress relief: 1:500 when stressed',
        'Root development: Soil drench 1:1000',
        'Companion with other inputs for synergy'
      ],
      benefits: 'Boosts plant immunity, prevents fungal/bacterial diseases, increases stress tolerance'
    }
  };

  const pestControl = {
    'neem': {
      name: 'Neem Oil Spray',
      icon: <Bug className="w-6 h-6" />,
      pests: 'Aphids, mites, whiteflies, thrips',
      recipe: [
        '1 tablespoon pure neem oil',
        '1 teaspoon mild liquid soap',
        '1 quart (1L) warm water'
      ],
      instructions: 'Mix thoroughly, spray all plant surfaces including undersides. Apply weekly or after rain.',
      timing: 'Early morning or evening (avoid hot sun)'
    },
    'garlic': {
      name: 'Garlic & Hot Pepper Spray',
      icon: <Flame className="w-6 h-6" />,
      pests: 'Universal deterrent, caterpillars, beetles',
      recipe: [
        '10 cloves garlic, crushed',
        '3 hot peppers, chopped',
        '1 tablespoon vegetable oil',
        '1 quart water',
        '1 teaspoon dish soap'
      ],
      instructions: 'Steep garlic and peppers in water 24hrs. Strain, add oil and soap. Spray plants thoroughly.',
      timing: 'Reapply after rain, every 5-7 days'
    },
    'soap': {
      name: 'Insecticidal Soap',
      icon: <Droplet className="w-6 h-6" />,
      pests: 'Soft-bodied insects, aphids, mealybugs',
      recipe: [
        '2 tablespoons pure liquid soap (not detergent)',
        '1 quart water'
      ],
      instructions: 'Mix well, spray directly on insects. Rinse plants after 2-3 hours to prevent leaf burn.',
      timing: 'Test on small area first, apply morning'
    },
    'companion': {
      name: 'Companion Planting Guide',
      icon: <Leaf className="w-6 h-6" />,
      pests: 'Prevention through biodiversity',
      recipe: [
        'Marigolds: Repel aphids, whiteflies',
        'Basil: Deters thrips, mosquitoes',
        'Mint: Repels ants, aphids (plant in pots)',
        'Nasturtiums: Trap crop for aphids',
        'Chrysanthemums: Natural pyrethrin source'
      ],
      instructions: 'Interplant throughout farm. Rotate annually. Create biodiversity corridors.',
      timing: 'Plant at start of season, maintain year-round'
    }
  };

  return (
    <div className="bg-white/10 p-3 sm:p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className="text-3xl sm:text-4xl">🧙‍♂️</div>
        <div>
          <h3 className="text-lg sm:text-2xl font-bold text-purple-400">Shaman's Sacred Recipes</h3>
          <p className="text-white/60 text-xs sm:text-sm">Ancient Korean Natural Farming wisdom</p>
        </div>
      </div>

      {/* KNF RECIPES */}
      <div className="mb-6">
        <h4 className="text-white font-bold mb-3 text-sm sm:text-base">🌾 Korean Natural Farming (KNF)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(knfRecipes).map(([key, recipe]) => (
            <button
              key={key}
              onClick={() => setSelectedRecipe(key)}
              className="bg-purple-900/30 p-3 sm:p-4 rounded-lg border border-purple-500/40 hover:bg-purple-900/50 transition-all text-left"
            >
              <div className="text-3xl sm:text-4xl mb-2">{recipe.icon}</div>
              <h5 className="text-white font-bold mb-1 text-sm sm:text-base">{recipe.name}</h5>
              <div className="flex gap-2 text-xs">
                <span className="bg-blue-600/40 px-2 py-1 rounded text-white">⏱️ {recipe.time}</span>
                <span className="bg-orange-600/40 px-2 py-1 rounded text-white">{recipe.difficulty}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PEST CONTROL */}
      <div className="bg-green-900/30 p-3 sm:p-4 rounded-lg border border-green-500/40">
        <h4 className="text-green-400 font-bold mb-3 text-sm sm:text-lg">🛡️ Natural Pest Control</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(pestControl).map(([key, pest]) => (
            <button
              key={key}
              onClick={() => setSelectedRecipe(key)}
              className="bg-white/5 p-3 rounded hover:bg-white/10 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                {pest.icon}
                <p className="text-white font-bold text-sm sm:text-base">{pest.name}</p>
              </div>
              <p className="text-white/60 text-xs sm:text-sm">Targets: {pest.pests}</p>
            </button>
          ))}
        </div>
      </div>

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-green-900 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                {knfRecipes[selectedRecipe as keyof typeof knfRecipes] && (
                  <>
                    <div className="text-4xl mb-2">{knfRecipes[selectedRecipe as keyof typeof knfRecipes].icon}</div>
                    <h3 className="text-2xl font-bold text-white">{knfRecipes[selectedRecipe as keyof typeof knfRecipes].name}</h3>
                  </>
                )}
                {pestControl[selectedRecipe as keyof typeof pestControl] && (
                  <h3 className="text-2xl font-bold text-white">{pestControl[selectedRecipe as keyof typeof pestControl].name}</h3>
                )}
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {knfRecipes[selectedRecipe as keyof typeof knfRecipes] && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-bold mb-2">📦 Ingredients</h4>
                  <ul className="space-y-1">
                    {knfRecipes[selectedRecipe as keyof typeof knfRecipes].ingredients.map((ing, i) => (
                      <li key={i} className="text-white/90 text-sm">• {ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-bold mb-2">📋 Instructions</h4>
                  <ol className="space-y-2">
                    {knfRecipes[selectedRecipe as keyof typeof knfRecipes].steps.map((step, i) => (
                      <li key={i} className="text-white/90 text-sm">{i + 1}. {step}</li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-green-400 font-bold mb-2">🌱 How to Use</h4>
                  <ul className="space-y-1">
                    {knfRecipes[selectedRecipe as keyof typeof knfRecipes].uses.map((use, i) => (
                      <li key={i} className="text-white/90 text-sm">• {use}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-900/40 p-4 rounded-lg border-2 border-green-500/40">
                  <p className="text-green-300 font-bold text-sm">✨ Benefits: {knfRecipes[selectedRecipe as keyof typeof knfRecipes].benefits}</p>
                </div>
              </div>
            )}

            {pestControl[selectedRecipe as keyof typeof pestControl] && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-red-400 font-bold mb-2">🐛 Target Pests</h4>
                  <p className="text-white/90">{pestControl[selectedRecipe as keyof typeof pestControl].pests}</p>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-bold mb-2">📦 Recipe</h4>
                  <ul className="space-y-1">
                    {pestControl[selectedRecipe as keyof typeof pestControl].recipe.map((item, i) => (
                      <li key={i} className="text-white/90 text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-bold mb-2">📋 Instructions</h4>
                  <p className="text-white/90 text-sm">{pestControl[selectedRecipe as keyof typeof pestControl].instructions}</p>
                </div>

                <div className="bg-orange-900/40 p-4 rounded-lg border-2 border-orange-500/40">
                  <p className="text-orange-300 font-bold text-sm">⏰ Timing: {pestControl[selectedRecipe as keyof typeof pestControl].timing}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
