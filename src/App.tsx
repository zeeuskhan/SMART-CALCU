import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Table as TableIcon,
  HelpCircle,
  ChevronDown,
  Info,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Share2,
  Download,
  Target,
  ArrowRight,
  ShieldCheck,
  Globe,
  Coins
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { calculateRetirement, CalculationInputs, REGIONAL_PRESETS, YearData } from './lib/calculations';

// --- Constants & Types ---
const PRIMARY_BLUE = '#0F172A';
const SUCCESS_GREEN = '#10B981';
const ACCENT_BLUE = '#3B82F6';
const NEUTRAL_GRAY = '#64748B';

// --- Components ---

const InputField = ({ label, icon: Icon, value, onChange, type = "number", suffix = "", prefix = "", tooltip = "" }: any) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {tooltip && (
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
        className={cn(
          "w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
          prefix && "pl-8",
          suffix && "pr-8"
        )}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{suffix}</span>}
    </div>
  </div>
);

const StatCard = ({ label, value, subtext, icon: Icon, color = "blue", delay = 0 }: any) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={cn("p-2 rounded-xl border", colors[color as keyof typeof colors])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-xs text-slate-400 font-medium">{subtext}</p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    currentAge: 25,
    retirementAge: 60,
    currentBalance: 500000,
    monthlyContribution: 20000,
    annualContributionIncrease: 5,
    expectedReturn: 12,
    inflationRate: 6,
    lifeExpectancy: 85,
    desiredMonthlyIncomeToday: 100000,
    country: 'India'
  });

  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');
  const currencySymbol = useMemo(() => {
    switch(inputs.country) {
      case 'India': return '₹';
      case 'Australia': return 'A$';
      case 'USA': return '$';
      case 'UK': return '£';
      case 'Canada': return 'C$';
      default: return '$';
    }
  }, [inputs.country]);

  const results = useMemo(() => calculateRetirement(inputs), [inputs]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: inputs.country === 'India' ? 'INR' : 
                inputs.country === 'Australia' ? 'AUD' :
                inputs.country === 'USA' ? 'USD' : 
                inputs.country === 'UK' ? 'GBP' : 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData = results.yearlyBreakdown.map(d => ({
    age: d.age,
    balance: Math.round(d.balance),
    adjusted: Math.round(d.inflationAdjustedBalance),
  }));

  const pieData = [
    { name: 'Contributions', value: results.totalContributions, color: '#3B82F6' },
    { name: 'Interest/Growth', value: results.totalGrowth, color: '#10B981' },
    { name: 'Current Balance', value: inputs.currentBalance, color: '#F59E0B' },
  ];

  const handleCountryChange = (country: string) => {
    const preset = REGIONAL_PRESETS[country] || {};
    setInputs(prev => ({
      ...prev,
      country,
      ...preset
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      {/* --- SEO Header / Nav --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight">RetireSmart</span>
              <span className="text-blue-600 font-bold text-xl">.io</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#calculator" className="hover:text-blue-600 transition-colors">Calculator</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQs</a>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all font-semibold flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative overflow-hidden pt-16 pb-24 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            Verified & Secure Projection Engine
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]"
          >
            The Ultimate <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Superannuation Calculator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Calculate your future wealth with our multi-regional retirement engine. Adjust for inflation, 
            salary growth, and tax scenarios in seconds.
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-12 opacity-60">
            {[
              { icon: Globe, label: "Global Coverage" },
              { icon: TrendingUp, label: "Compound Interest" },
              { icon: Coins, label: "Currency Presets" }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 font-medium grayscale hover:grayscale-0 transition-all">
                <f.icon className="w-5 h-5 text-blue-600" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* --- Main Calculator --- */}
      <main id="calculator" className="max-w-7xl mx-auto px-4 -mt-16 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Panel */}
          <section className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Parameters
              </h2>
              <select 
                value={inputs.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="text-xs font-bold bg-slate-100 border-none rounded-lg px-2 py-1.5 focus:ring-0 cursor-pointer"
              >
                {['India', 'Australia', 'USA', 'UK', 'Canada', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Current Age" value={inputs.currentAge} onChange={(v: number) => setInputs(p => ({ ...p, currentAge: v }))} tooltip="Your current age today" />
                <InputField label="Retirement" value={inputs.retirementAge} onChange={(v: number) => setInputs(p => ({ ...p, retirementAge: v }))} tooltip="Age you plan to stop working" />
              </div>

              <InputField 
                label="Current Savings" 
                prefix={currencySymbol} 
                value={inputs.currentBalance} 
                onChange={(v: number) => setInputs(p => ({ ...p, currentBalance: v }))} 
                tooltip="Your total current retirement corpus (EPF, PPF, NPS, 401k, etc)"
              />

              <InputField 
                label="Monthly Contribution" 
                prefix={currencySymbol} 
                value={inputs.monthlyContribution} 
                onChange={(v: number) => setInputs(p => ({ ...p, monthlyContribution: v }))} 
                tooltip="Amount you invest every month towards retirement"
              />

              <div className="pt-4 border-t border-slate-100">
                <button className="w-full flex justify-between items-center text-sm font-semibold text-slate-800 mb-6 group">
                  Advanced Options
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
                
                <div className="space-y-6">
                  <InputField label="Annual Growth in Contribution" suffix="%" value={inputs.annualContributionIncrease} onChange={(v: number) => setInputs(p => ({ ...p, annualContributionIncrease: v }))} tooltip="By what percentage will your contributions increase every year (e.g., salary hikes)" />
                  <InputField label="Expected Annual Return" suffix="%" value={inputs.expectedReturn} onChange={(v: number) => setInputs(p => ({ ...p, expectedReturn: v }))} tooltip="Historical or expected market returns" />
                  <InputField label="Inflation Rate" suffix="%" value={inputs.inflationRate} onChange={(v: number) => setInputs(p => ({ ...p, inflationRate: v }))} tooltip="Average inflation rate to see purchasing power in future" />
                  <InputField label="Desired Monthly Income" prefix={currencySymbol} value={inputs.desiredMonthlyIncomeToday} onChange={(v: number) => setInputs(p => ({ ...p, desiredMonthlyIncomeToday: v }))} tooltip="How much you want to spend monthly in retirement, in today's money" />
                </div>
              </div>
            </div>
          </section>

          {/* Results Panel */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Summary Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard 
                label="Projected Corpus" 
                value={formatCurrency(results.projectedCorpus)} 
                subtext={`At Age ${inputs.retirementAge}`}
                icon={TrendingUp}
                color="blue"
              />
              <StatCard 
                label="Monthly Income" 
                value={formatCurrency(results.monthlyIncomePossibleToday * Math.pow(1 + inputs.inflationRate/100, (inputs.retirementAge - inputs.currentAge)))} 
                subtext="Future Value"
                icon={DollarSign}
                color="green"
                delay={0.1}
              />
              <StatCard 
                label="Shortfall / Surplus" 
                value={formatCurrency(results.shortfallOrSurplus)} 
                subtext="In Today's Purchasing Power"
                icon={results.onTrack ? CheckCircle2 : AlertCircle}
                color={results.onTrack ? "green" : "orange"}
                delay={0.2}
              />
            </div>

            {/* Main Tabs Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setActiveTab('visual')}
                  className={cn(
                    "flex-1 py-5 text-sm font-bold flex items-center justify-center gap-2 transition-all",
                    activeTab === 'visual' ? "text-blue-600 bg-blue-50/50 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <PieChartIcon className="w-4 h-4" /> Visual Analysis
                </button>
                <button 
                  onClick={() => setActiveTab('table')}
                  className={cn(
                    "flex-1 py-5 text-sm font-bold flex items-center justify-center gap-2 transition-all",
                    activeTab === 'table' ? "text-blue-600 bg-blue-50/50 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <TableIcon className="w-4 h-4" /> Year-by-Year Table
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'visual' ? (
                  <div className="space-y-12">
                    {/* Projection Highlight Card */}
                    <div className={cn(
                      "p-6 rounded-2xl flex items-center gap-6",
                      results.onTrack ? "bg-emerald-50 border border-emerald-100" : "bg-orange-50 border border-orange-100"
                    )}>
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0",
                        results.onTrack ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                      )}>
                        {results.onTrack ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">
                          {results.onTrack ? "You are on track!" : "Action required to meet your goal."}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {results.onTrack 
                            ? `Your monthly income at retirement will be approximately ${formatCurrency(results.monthlyIncomePossibleToday)} in today's money.`
                            : `To reach your desired income of ${formatCurrency(inputs.desiredMonthlyIncomeToday)}, you might need to increase your contributions by ${formatCurrency(Math.abs(results.shortfallOrSurplus) * 5)} per month or work 3 years longer.`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="h-[350px] w-full">
                        <h4 className="text-sm font-bold text-slate-500 mb-6 flex items-center justify-between">
                          Corpus Growth over Time
                          <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Nominal vs Real</span>
                        </h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="age" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#94a3b8' }} 
                              label={{ value: 'Age', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tickFormatter={(value) => `${currencySymbol}${Math.round(value/1000000)}M`}
                              tick={{ fontSize: 10, fill: '#94a3b8' }}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                              formatter={(value: any) => [formatCurrency(value), ""]}
                            />
                            <Area type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" name="Future Value" />
                            <Area type="monotone" dataKey="adjusted" stroke="#94a3b8" strokeDasharray="5 5" fill="transparent" name="Inflation Adjusted" />
                            <Legend iconType="circle" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-[350px] w-full">
                        <h4 className="text-sm font-bold text-slate-500 mb-6">Asset Composition</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={90}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Age</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Yearly Contrib.</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Yearly Growth</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">End Balance</th>
                          <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">In Today's Val</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {results.yearlyBreakdown.map((row, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-4 font-bold text-slate-700">{row.age}</td>
                            <td className="py-4 text-slate-500">{formatCurrency(row.contributions)}</td>
                            <td className="py-4 text-emerald-600 font-medium">{formatCurrency(row.growth)}</td>
                            <td className="py-4 font-bold text-slate-900">{formatCurrency(row.balance)}</td>
                            <td className="py-4 text-slate-400 italic">{formatCurrency(row.inflationAdjustedBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                <Download className="w-5 h-5 text-slate-500" />
                Download PDF Report
              </button>
              <button className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                <Share2 className="w-5 h-5 text-slate-500" />
                Share Analysis
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* --- SEO Content Section --- */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Understanding the Math <br /> Behind Your Millionaire Future</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "The Power of Compounding",
                    desc: "It's not about how much you save, but how long you let it grow. A 25-year old saving half as much as a 35-year old often ends up with a larger corpus at 60.",
                    icon: TrendingUp
                  },
                  {
                    title: "Inflation Adjustment (Real Value)",
                    desc: "1 Crore in 20 years won't buy what 1 Crore buys today. Our calculator automatically adjusts your final numbers back to today's purchasing power.",
                    icon: Target
                  },
                  {
                    title: "The 4% Safe Withdrawal Rule",
                    desc: "Traditionally, experts suggest withdrawing 4% of your total corpus in the first year of retirement to ensure your money lasts 30+ years.",
                    icon: Coins
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Expert Tip</h3>
                <blockquote className="text-xl italic text-slate-300 leading-relaxed mb-8">
                  "The best time to start saving for retirement was 10 years ago. The second best time is today."
                </blockquote>
                <div className="flex items-center gap-4 border-t border-slate-800 pt-8">
                  <div className="w-12 h-12 rounded-full bg-slate-700" />
                  <div>
                    <p className="font-bold">Vivek Sharma</p>
                    <p className="text-sm text-slate-500">Certified Financial Planner</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-[2rem] -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Superannuation Specific Context --- */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-6">Australia Superannuation <br/>Guide 2024-2026</h2>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Planning your future in Australia requires understanding the Superannuation Guarantee (SG) and compound growth within your fund.
              </p>
              <div className="p-6 bg-blue-800 rounded-2xl border border-blue-700">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-2">Latest SG Rate</p>
                <p className="text-2xl font-bold uppercase tracking-wider text-white">11.5% → 12%</p>
                <p className="text-[10px] text-blue-300 mt-2">Automatic increase effective from July 1, 2025.</p>
              </div>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Concessional Contributions</h4>
                <p className="text-sm text-blue-100">Maximizing your $30,000 annual concessional cap can significantly boost your final balance due to lower tax rates (usually 15%). Our Superannuation calculator accounts for consistent growth on these extra payments.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-lg">The 'Rule of 72' in Super</h4>
                <p className="text-sm text-blue-100">With an average Super fund return of 7-8%, your money doubles approximately every 9-10 years. Starting just 5 years earlier can result in a 40% larger final superannuation balance at age 67.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Investment Options</h4>
                <p className="text-sm text-blue-100">Switching from 'Balanced' (6-7% returns) to 'High Growth' (8-10% returns) early in your career is one of the most effective ways to influence your super calculator results.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Preservation Age</h4>
                <p className="text-sm text-blue-100">Your preservation age is the age you can access your super. For most born after July 1964, it is 60, though the Age Pension age is currently 67.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-16">Frequently Asked Retirement Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is a good retirement corpus in India for 2026?",
                a: "For a comfortable lifestyle in a Tier-1 city, a corpus of 3Cr to 8Cr is often recommended, depending on your lifestyle and inflation expectations."
              },
              {
                q: "How does Australia's Superannuation Guarantee work?",
                a: "Employers must pay a percentage of your salary (11.5% in 2024-25, rising to 12% in 2025-26) into your Super fund."
              },
              {
                q: "What is the 4% rule?",
                a: "The 4% rule is a guideline that suggests you can safely withdraw 4% of your investment portfolio's value in the first year of retirement and then adjust for inflation every year after."
              },
              {
                q: "Should I include inflation in my calculation?",
                a: "Absolutely. Without adjusting for inflation, your future numbers will look deceptively large but will have significantly lower purchasing power."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300">
                <summary className="list-none px-6 py-5 cursor-pointer flex justify-between items-center font-bold text-slate-800">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEO Keyword Index Section --- */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 text-center">Global Retirement Resources & Related Search Terms</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-8">
            <div>
              <h5 className="font-bold text-slate-900 text-sm mb-4 border-l-2 border-blue-600 pl-2">India Retirement</h5>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>Retirement calculator India</li>
                <li>NPS calculator India</li>
                <li>EPF retirement calculator</li>
                <li>Retirement calculator Zerodha</li>
                <li>NPS vs EPF projection</li>
                <li>Retirement year by year India</li>
                <li>Value Research retirement</li>
                <li>SIP retirement calculator</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm mb-4 border-l-2 border-emerald-600 pl-2">Australia Super</h5>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>Superannuation calculator Australia</li>
                <li>Super calculator gov au</li>
                <li>Retirement age calculator 67</li>
                <li>Superannuation date calculator</li>
                <li>Super contribution calculator 2025</li>
                <li>Superannuation predictor AU</li>
                <li>ATO Superannuation calculator</li>
                <li>Self employed super calculator</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm mb-4 border-l-2 border-purple-600 pl-2">USA & Global</h5>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>401k retirement calculator</li>
                <li>Roth IRA calculator</li>
                <li>Social Security calculator</li>
                <li>Retirement calculator UK</li>
                <li>Retirement calculator Canada</li>
                <li>Retirement calculator UAE</li>
                <li>Retirement calculator Singapore</li>
                <li>CPF retirement calculator</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm mb-4 border-l-2 border-orange-600 pl-2">Rules & Models</h5>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>The 4% rule calculator</li>
                <li>FIRE 25x rule calculator</li>
                <li>Safe withdrawal rate tool</li>
                <li>Life expectancy calculator</li>
                <li>Inflation adjusted returns</li>
                <li>Millitary retirement calculator</li>
                <li>Pension include calculator</li>
                <li>Roth vs Traditional 401k</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm mb-4 border-l-2 border-slate-600 pl-2">Top Comparisons</h5>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>Bankrate vs Nerdwallet</li>
                <li>Vanguard retirement planner</li>
                <li>Kiplinger vs MoneySmart</li>
                <li>Edward Jones calculator</li>
                <li>TD retirement planner</li>
                <li>J.P. Morgan retirement</li>
                <li>Fidelity vs Schwab</li>
                <li>Ramsey Solutions calculator</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-medium leading-loose text-justify uppercase tracking-tighter opacity-40">
              Retirement calculator date, retirement calculator by age, retirement calculator india, superannuation date calculator, retirement calculator online, retirement calculator india with inflation, retirement calculator investment, retirement calculator year by year, retirement calculator bankrate, retirement calculator excel, super juice calculator, superannuation calculator retirement, retirement calculator india excel, retirement calculator military, retirement calculator that includes pension, retirement calculator usa, superannuation fund calculator, retirement calculator 4 rule, retirement calculator how much do i need, retirement calculator nps, retirement calculator yadnya, superannuation calculator india excel, retirement calculator how long will money last, super calculator online, retirement calculator 3 million, retirement calculator 4 percent rule, retirement calculator 4, retirement calculator canada, retirement calculator edward jones, retirement calculator how much will i have, retirement calculator including social security, retirement calculator kiplinger, retirement calculator life expectancy, retirement calculator malaysia, retirement calculator married couple, retirement calculator nerdwallet, retirement calculator net, retirement calculator netherlands, retirement calculator ontario, retirement calculator roth ira, retirement calculator roth 401k, retirement calculator roth, retirement calculator rbc, retirement calculator south africa, retirement calculator singapore, retirement calculator sss, retirement calculator tsp, retirement calculator td, retirement calculator that includes pension and social security, retirement calculator uk, retirement calculator uae, retirement calculator voya, retirement calculator xml, super calculator 2024, super calculator math, how much super will i have at 67, superannuation date calculator in excel, retirement calculator 10x, retirement calculator 1 million, retirement calculator 1.5 million, retirement calculator 25 times rule, retirement calculator 2026, retirement calculator 2 incomes, retirement calculator 2 people, retirement calculator 2 million, retirement calculator 20 years, retirement calculator 2026 update, retirement calculator 30 years, retirement calculator 3 rule, retirement calculator 401k roth, retirement calculator 401k ramsey, retirement calculator 401k with match, retirement calculator 401k and ira, retirement calculator 4 withdrawal, retirement calculator 55, retirement calculator 5, retirement calculator 62 vs 67, retirement calculator 85 factor, super calculator how much should i have, retirement calculator japan, retirement calculator joint, retirement calculator jersey, retirement calculator jp morgan, retirement calculator key bank, retirement calculator karnataka government, retirement calculator kiwisaver, retirement calculator kuwait, retirement calculator kpk, retirement calculator kids, retirement calculator kotak, retirement calculator key, retirement kitty calculator, retirement calculator legal and general, retirement calculator l, retirement calculator lincoln financial, retirement calculator last, retirement calculator lausd, retirement calculator l&g, retirement calculator military high 3, retirement calculator nism, retirement calculator qsuper, retirement calculator quick, retirement calculator questrade, retirement calculator qatar, retirement calculator ramit, retirement calculator ramsey solutions, retirement calculator rebel finance school, retirement calculator unisuper, retirement calculator usps, retirement calculator ultimate, retirement calculator va, retirement calculator variable withdrawals, retirement calculator vertex42, retirement calculator value research, retirement calculator visual, super calculator without age pension, retirement calculator years of service, retirement calculator youtube, retirement calculator yearly contribution, retirement year calculator india, retirement year calculator by age, retirement yield calculator, retirement calculator zerodha, retirement calculator za, superannuation calculator in australia, super 8 calculation formula, superannuation calculator pension, superannuation calculator au, superannuation calculator gov, super calculator plum, super calculator monthly, superannuation calculator predictor, superannuation calculator on salary, super calculator projector, superannuation calculator extra payments, kevin super juice calculator, superannuation calculator tax, super calculator wage, super calculator on wage, super calculator on income, super calculator self employed, super calculator how long will it last, superannuation calculator weekly, superannuation earnings calculator, superannuation target calculator, super calculator in australia, super calculator yearly, superannuation calculator 2026, super calculator how much, super 6 calculator, super calculator drawdown, superannuation loan calculator, superannuation calculator aware, super calculator online australia, superannuation calculator 2025, super calculator game, super juice calculator lime, super yankee calculator free, super calculator predictor, super calculator compound interest, super contribution calculator 2025, super calculator vision, super calculator pension, super calculator projection australia, retirement calculator vanguard uk, superannuation calculator art, superannuation dasp calculator, super calculator with inflation, super calculator extra, superannuation drawdown calculator ato, super calculator compound, super 15 calculator, super juice calculator app, super calculator money, super calculator sa, super calculator triple s, superannuation calculator spreadsheet, super calculator balance, superannuation calculator forecast, superannuation lifestyle calculator, super calculator art, superannuation offset calculator ato, superannuation calculator by age, superannuation calculator hesta, super calculator extra payments, super calculator with salary sacrifice, superannuation calculator mercer, super calculator com, super calculator extra contributions, retirement calculator quebec canada, super calculator government, super calculator 12, super jewellery calculator, super calculator aware, super calculator smart, retirement calculator virginia, super calculator on base salary, superannuation calculator additional contribution, super juice calculator lemon, super calculator with partner, superannuation calculator how much will i have, superannuation calculator unisuper, super calculator with salary increase, superannuation drawdown calculator australia, super calculator 2023, superannuation calculator wage, superannuation calculator couples australia, super calculator to retire, super juice calculator very good drinks, superannuation usage calculator, super calculator with extra contributions, super 24 calculator, super calculator tax, super calculator telstra, superannuation calculator vanguard, super calculator high growth, super calculator by age australia, superannuation calculator per year, superannuation calculator pay, super calculator contributions, super calculator payment, retirement calculator vera, super 35 calculator, super calculator growth, super calculator my gov, super calculator income, super calculator with career break, super calculator weekly pay, super juice calculator steve the bartender, superannuation guarantee calculator australia, retirement calculator value, superannuation calculation online, superannuation calculator finder, super calculator with age pension, superannuation calculator for wage, super calculator when i retire, super calculator brighter, superannuation calculator voluntary contributions, super calculator over time, superannuation calculator smart money, super calculator google, super calculator prediction, superannuation calculator canada, super calculator graph, super calculator partner, superannuation year calculator, super calculator interest, 85 000 including super, super calculator gov au, super calculator australia, super x calculator, super calculator estimator, superannuation calculator government, super calculator based on age, superannuation calculator from salary, superannuation calculator hourly rate, super calculator gov, super calculator lump sum, retirement calculator lincoln, super calculator simple, super calculator based on current balance, super calculator based on income, superannuation calculator on pay, superannuation calculator online free, super calculator seek, superannuation needs calculator, super calculator noel whittaker, superannuation calculator estimate, super calculator best, superannuation drawdown calculator ato australia, superannuation balance calculator australia, super calculator australia qsuper, superannuation growth calculator australia, superannuation calculator for self employed, super calculator year by year, super 8 calculation in t20 world cup, super calculator with contributions
            </p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white tracking-tight">RetireSmart</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed mb-6">
                Empowering global workers to plan their financial freedom with precision tools and educational insights. 
                Our mission is to make complex financial planning accessible to everyone.
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Calculators</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">SIP Calculator</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">NPS Calculator</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Superannuation Tool</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Inflation Calculator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookies Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-800 text-center text-[10px] uppercase tracking-widest leading-loose">
            <p className="mb-4">
              Disclaimer: This calculator is for educational purposes only. Projections are based on mathematical formulas 
              and do not guarantee future results. Please consult with a certified financial advisor before making high-stakes decisions.
            </p>
            <p>© 2026 RetireSmart Global. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
