import React, { useState } from 'react';

export default function PricingCalculator() {
  // Input states
  const [costOfGoods, setCostOfGoods] = useState<number>(35);
  const [sellingPrice, setSellingPrice] = useState<number>(120);
  const [referralFeePercent, setReferralFeePercent] = useState<number>(12); // Noon standard commission
  const [fbnFee, setFbnFee] = useState<number>(8.5); // FBN logistics flat fee AED
  const [couponDiscount, setCouponDiscount] = useState<number>(10); // in AED
  
  // Computations
  const vatRate = 0.05; // UAE local VAT
  const vatPaid = sellingPrice * vatRate;
  const platformCommission = (sellingPrice - couponDiscount) * (referralFeePercent / 100);
  const totalNoonFees = platformCommission + fbnFee;
  const netRevenue = sellingPrice - couponDiscount - vatPaid - totalNoonFees;
  const netProfit = netRevenue - costOfGoods;
  const marginPercent = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
  
  // Custom styled levels for feedback ring
  const isHealthy = marginPercent >= 25;
  const isAggressive = marginPercent >= 12 && marginPercent < 25;
  
  return (
    <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-white/5 font-sans" id="pricing-calculator-widget">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <h4 className="text-sm font-semibold tracking-wide text-white font-mono uppercase">
          Noon Saudi & UAE Live Simulator
        </h4>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
          isHealthy ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
          isAggressive ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
          'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {isHealthy ? 'HIGH MARGIN' : isAggressive ? 'NORMAL RETAIL' : 'WARNING: LOW PROFILE'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Hand: Controls */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Cost of Goods (AED / SAR)</label>
            <input 
              type="number" 
              value={costOfGoods} 
              onChange={(e) => setCostOfGoods(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono" 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Noon Target Retail Price (AED / SAR)</label>
            <input 
              type="number" 
              value={sellingPrice} 
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono" 
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Noon Comm. %</label>
              <input 
                type="number" 
                value={referralFeePercent} 
                onChange={(e) => setReferralFeePercent(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono" 
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">FBN Logistics (AED)</label>
              <input 
                type="number" 
                value={fbnFee} 
                onChange={(e) => setFbnFee(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono" 
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Coupon/Discount Code Offset (AED)</label>
            <input 
              type="number" 
              value={couponDiscount} 
              onChange={(e) => setCouponDiscount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono" 
            />
          </div>
        </div>

        {/* Right Hand: Interactive Score and Feedback */}
        <div className="flex flex-col justify-between bg-slate-900/50 p-4 rounded-lg border border-white/5 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Projected Net Margin</span>
            <div className={`text-3xl font-bold font-mono ${
              isHealthy ? 'text-emerald-400' : isAggressive ? 'text-amber-400' : 'text-red-400'
            }`}>
              {marginPercent.toFixed(1)}%
            </div>
            <span className="text-[10px] text-gray-500 block">Calculated post-VAT & post-Logistics</span>
          </div>

          {/* Details list */}
          <div className="space-y-1.5 text-[11px] font-mono border-t border-white/5 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-400">VAT (5%):</span>
              <span className="text-white">-{vatPaid.toFixed(2)} AED</span>
            </div>
            <div className="flex justify-between flex-wrap">
              <span className="text-gray-400">Total Noon Fees:</span>
              <span className="text-white">-{totalNoonFees.toFixed(2)} AED</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-white/5 pt-1.5 mt-1.5 text-[12px]">
              <span className="text-gray-200">Net Profit:</span>
              <span className={netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {netProfit.toFixed(2)} AED
              </span>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 leading-relaxed italic bg-black/30 p-2 rounded border border-white/5">
            💡 <strong>Specialist Tip:</strong> FMCG thrives on volume. Dynamic bundling lets you split the AED {fbnFee.toFixed(1)} logistics hurdle across multiple pieces, instantly elevating the net margin to save margins.
          </div>
        </div>
      </div>
    </div>
  );
}
