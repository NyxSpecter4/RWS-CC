'use client';
import { useState } from 'react';
import { DollarSign, Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function GrantsTracker() {
  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);

  const grants = {
    'usda-beginning': {
      name: 'USDA Beginning Farmer & Rancher Development Program',
      amount: 'Up to $250,000',
      deadline: 'April 15, 2026',
      status: 'open',
      eligibility: [
        'Farming for 10 years or less',
        'Hawaiian Acres qualifies as underserved area',
        'Must attend approved training program'
      ],
      whatItCovers: [
        'Education and training programs',
        'Mentorship and technical assistance',
        'Land access support',
        'Business planning resources'
      ],
      howToApply: [
        'Register on grants.gov',
        'Prepare farm business plan',
        'Document farming experience',
        'Submit application through grants.gov portal'
      ],
      website: 'https://www.nifa.usda.gov/grants/programs/beginning-farmer-rancher-development-program',
      notes: 'Competitive - emphasize regenerative practices and Hawaiian culture'
    },
    
    'nrcs-eqip': {
      name: 'NRCS Environmental Quality Incentives Program (EQIP)',
      amount: 'Up to $450,000 (75% cost-share)',
      deadline: 'Rolling - Apply by February 2026 for consideration',
      status: 'open',
      eligibility: [
        'All farm sizes eligible',
        'Priority for beginning farmers',
        'Must have conservation plan',
        'Hawaiian Acres in high-priority watershed'
      ],
      whatItCovers: [
        'Irrigation systems (drip irrigation for water conservation)',
        'High tunnel construction (vanilla, ginger protection)',
        'Composting facilities',
        'Water management (critical for 150-200 inch rainfall!)',
        'Pest management (IPM for māmaki beetles)'
      ],
      howToApply: [
        'Contact NRCS office in Hilo',
        'Develop conservation plan with NRCS conservationist',
        'Submit application during ranking period',
        'Get approval and implement practices'
      ],
      website: 'https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives',
      notes: 'EXCELLENT for drainage systems and high tunnels - Hawaiian Acres high rainfall is strong justification'
    },
    
    'hdoa-vap': {
      name: 'Hawaii Dept of Ag - Value-Added Producer Grant',
      amount: 'Up to $25,000',
      deadline: 'June 30, 2026',
      status: 'open',
      eligibility: [
        'Hawaii-based agricultural producer',
        'Must add value to raw agricultural product',
        'Priority for products using Hawaii-grown ingredients'
      ],
      whatItCovers: [
        'Processing equipment (vanilla curing, ginger washing)',
        'Packaging and labeling',
        'Marketing materials',
        'Feasibility studies',
        'Working capital for processing'
      ],
      howToApply: [
        'Develop value-added business plan',
        'Show market demand for processed product',
        'Submit application to HDOA',
        'Include financial projections'
      ],
      website: 'https://hdoa.hawaii.gov/add/',
      notes: 'PERFECT for dried māmaki tea, cured vanilla, pickled ginger products'
    },
    
    'sare-farmer': {
      name: 'SARE Farmer/Rancher Grant',
      amount: 'Up to $30,000',
      deadline: 'November 15, 2026',
      status: 'upcoming',
      eligibility: [
        'Must be producer conducting on-farm research',
        'Project must benefit other farmers',
        'Sustainable/organic focus preferred'
      ],
      whatItCovers: [
        'On-farm research and demonstration',
        'Testing KNF techniques vs conventional',
        'Moon-phase planting trials',
        'Soilless ginger/turmeric disease prevention research',
        'Marketing sustainable products'
      ],
      howToApply: [
        'Develop research question',
        'Design on-farm trial with measurements',
        'Plan outreach to share results',
        'Submit proposal online'
      ],
      website: 'https://western.sare.org/grants/farmer-rancher-grants/',
      notes: 'Your moon-phase + KNF approach is PERFECT for this grant!'
    },
    
    'fsa-microloans': {
      name: 'FSA Microloans for Farmers',
      amount: 'Up to $50,000 (low-interest loan)',
      deadline: 'Rolling',
      status: 'open',
      eligibility: [
        'Beginning, small, or underserved farmers',
        'Simplified application process',
        'Lower interest rates than commercial loans'
      ],
      whatItCovers: [
        'Operating expenses (seeds, supplies)',
        'Equipment purchases',
        'Marketing and distribution',
        'Certifications (organic, GAP)',
        'Working capital'
      ],
      howToApply: [
        'Contact FSA office in Hilo',
        'Prepare farm operating plan',
        'Provide financial statements',
        'Attend borrower training'
      ],
      website: 'https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/microloans/',
      notes: 'Easier to get than traditional farm loans - good for startup capital'
    },
    
    'uhctahr-research': {
      name: 'UH CTAHR Hatch Research Collaboration',
      amount: 'Varies - equipment, expertise, analysis',
      deadline: 'Ongoing',
      status: 'open',
      eligibility: [
        'Collaborate with UH researcher on approved project',
        'Share data and results',
        'Allow field visits for research'
      ],
      whatItCovers: [
        'Soil testing and analysis (FREE)',
        'Pest identification',
        'Tissue sampling and nutrient analysis',
        'Research equipment use',
        'Extension agent technical assistance'
      ],
      howToApply: [
        'Contact UH CTAHR Extension in Hilo',
        'Propose research collaboration',
        'Agree to data sharing',
        'Participate in research trials'
      ],
      website: 'https://www.ctahr.hawaii.edu/',
      notes: 'Not cash but FREE expertise and testing - invaluable for bacterial wilt testing!'
    }
  };

  const statusColors = {
    open: 'bg-green-900/40 border-green-500/40 text-green-400',
    upcoming: 'bg-yellow-900/40 border-yellow-500/40 text-yellow-400',
    closed: 'bg-red-900/40 border-red-500/40 text-red-400'
  };

  const statusIcons = {
    open: CheckCircle,
    upcoming: Clock,
    closed: AlertCircle
  };

  return (
    <div className="bg-white/10 p-4 sm:p-6 rounded-xl border-2 border-purple-500/40">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-8 h-8 text-purple-400" />
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-purple-400">💰 Grants & Funding</h3>
          <p className="text-white/60 text-sm">Available funding for Hawaiian Acres farm</p>
        </div>
      </div>

      {/* GRANTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(grants).map(([key, grant]) => {
          const StatusIcon = statusIcons[grant.status as keyof typeof statusIcons];
          return (
            <button
              key={key}
              onClick={() => setSelectedGrant(selectedGrant === key ? null : key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedGrant === key 
                  ? 'bg-purple-900/40 border-purple-500 scale-105' 
                  : 'bg-white/5 border-white/20 hover:border-purple-500/60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-white text-sm sm:text-base flex-1">{grant.name}</h4>
                <div className={`px-2 py-1 rounded text-xs font-bold ${statusColors[grant.status as keyof typeof statusColors]} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {grant.status.toUpperCase()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 font-bold text-sm">{grant.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <p className="text-blue-400 text-sm">{grant.deadline}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* GRANT DETAILS */}
      {selectedGrant && grants[selectedGrant as keyof typeof grants] && (
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-4 sm:p-6 border-2 border-purple-500/40">
          <h3 className="text-2xl font-bold text-white mb-4">
            {grants[selectedGrant as keyof typeof grants].name}
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-bold text-green-400">Funding Amount</h4>
              </div>
              <p className="text-white text-xl font-bold mb-4">{grants[selectedGrant as keyof typeof grants].amount}</p>

              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h4 className="text-lg font-bold text-blue-400">Deadline</h4>
              </div>
              <p className="text-white font-bold mb-4">{grants[selectedGrant as keyof typeof grants].deadline}</p>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="text-yellow-400 font-bold mb-2">✅ Eligibility</h4>
              <ul className="space-y-1">
                {grants[selectedGrant as keyof typeof grants].eligibility.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm">• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="text-green-400 font-bold mb-2">💵 What It Covers</h4>
              <ul className="space-y-1">
                {grants[selectedGrant as keyof typeof grants].whatItCovers.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm">• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="text-blue-400 font-bold mb-2">📋 How to Apply</h4>
              <ol className="space-y-1">
                {grants[selectedGrant as keyof typeof grants].howToApply.map((step, i) => (
                  <li key={i} className="text-white/80 text-sm">{i + 1}. {step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-6 bg-purple-900/40 p-4 rounded-lg border-2 border-purple-500/40">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h4 className="text-purple-400 font-bold">💡 Notes</h4>
            </div>
            <p className="text-white/90 text-sm mb-3">{grants[selectedGrant as keyof typeof grants].notes}</p>
            <a 
              href={grants[selectedGrant as keyof typeof grants].website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-sm"
            >
              🔗 Visit Website
            </a>
          </div>
        </div>
      )}

      {/* TOTAL POTENTIAL */}
      <div className="mt-6 bg-green-900/40 p-4 rounded-lg border-2 border-green-500/40">
        <p className="text-green-400 font-bold text-lg mb-2">💰 Total Potential Funding Available</p>
        <p className="text-white text-3xl font-black">$805,000+</p>
        <p className="text-white/60 text-sm mt-2">Apply for multiple grants - they can be combined!</p>
      </div>
    </div>
  );
}
