import React, { useState } from 'react';

export default function SeoGrader() {
  const [productTitle, setProductTitle] = useState('Anti-Aging Retinol Cream 2.5%');
  const [hasAplusContent, setHasAplusContent] = useState(true);
  const [imagesCount, setImagesCount] = useState(6);
  const [bulletsCount, setBulletsCount] = useState(5);
  const [hasNegativeKeywords, setHasNegativeKeywords] = useState(true);
  const [isGrading, setIsGrading] = useState(false);
  const [gradeScore, setGradeScore] = useState<number>(84);

  const runSampleGrade = () => {
    setIsGrading(true);
    setTimeout(() => {
      // Calculate score based on inputs
      let base = 30;
      if (productTitle.length > 30 && productTitle.length < 150) base += 20;
      if (hasAplusContent) base += 20;
      if (imagesCount >= 6) base += 10;
      else base += imagesCount * 1.5;
      if (bulletsCount >= 5) base += 10;
      else base += bulletsCount * 1.5;
      if (hasNegativeKeywords) base += 10;

      setGradeScore(Math.min(base, 100));
      setIsGrading(false);
    }, 850);
  };

  return (
    <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-white/5 font-sans" id="seo-grader-widget">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <h4 className="text-sm font-semibold tracking-wide text-white font-mono uppercase">
          Skincare Listing Optimizer Tool (Amazon US)
        </h4>
        <button
          onClick={runSampleGrade}
          disabled={isGrading}
          className="px-3 py-1 rounded text-xs font-semibold bg-brand-purple hover:bg-brand-purple/80 text-white transition-all disabled:opacity-50"
        >
          {isGrading ? 'ANALYZING...' : 'RUN AUDIT'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Title input */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1 font-mono">Product Title Track</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
          />
        </div>

        {/* Dynamic Sliders / Selects */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <label className="block text-[11px] text-gray-400 font-mono">Creative Layouts</label>
            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAplusContent}
                onChange={(e) => setHasAplusContent(e.target.checked)}
                className="rounded text-brand-purple bg-slate-900 border border-white/10 focus:ring-brand-purple"
              />
              <span>A+ Enhanced Content</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNegativeKeywords}
                onChange={(e) => setHasNegativeKeywords(e.target.checked)}
                className="rounded text-brand-purple bg-slate-900 border border-white/10 focus:ring-brand-purple"
              />
              <span>Negative Match Funnel</span>
            </label>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Uploaded Images: {imagesCount}</label>
              <input
                type="range"
                min="1"
                max="9"
                value={imagesCount}
                onChange={(e) => setImagesCount(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Bullet Features: {bulletsCount}</label>
              <input
                type="range"
                min="1"
                max="7"
                value={bulletsCount}
                onChange={(e) => setBulletsCount(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
            </div>
          </div>
        </div>

        {/* Results display */}
        <div className="bg-slate-900/50 p-3.5 rounded-lg border border-white/5">
          {isGrading ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-purple border-t-transparent"></div>
              <span className="text-[10px] text-gray-400 font-mono animate-pulse">Scanning skincare density logs...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Listing Health Score</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className={`text-4xl font-bold font-mono ${
                    gradeScore >= 90 ? 'text-emerald-400' : gradeScore >= 70 ? 'text-purple-400' : 'text-amber-400'
                  }`}>
                    {gradeScore}/100
                  </span>
                  <span className="text-xs text-gray-500">Benchmark target: 85+</span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex-1 text-[10px] text-gray-300 font-mono space-y-1 pl-4 border-l border-white/5">
                <div className="flex items-center space-x-1">
                  <span className={productTitle.length > 50 && productTitle.length < 150 ? "text-emerald-400" : "text-amber-400"}>●</span>
                  <span>Title length: {productTitle.length} chars ({productTitle.length > 50 && productTitle.length < 150 ? 'Optimal' : 'Needs tuning'})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={hasAplusContent ? "text-emerald-400" : "text-red-400"}>●</span>
                  <span>A+ Design: {hasAplusContent ? 'Verified (+20pts)' : 'MOCKED - Add A+!'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={imagesCount >= 6 ? "text-emerald-400" : "text-amber-400"}>●</span>
                  <span>Image Count: {imagesCount >= 6 ? 'Perfect Coverage' : 'Upload 2 more'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
