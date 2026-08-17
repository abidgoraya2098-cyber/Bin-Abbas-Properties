import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, Percent, Coins, Building } from 'lucide-react';
import { formatPKR } from '../data';

export default function PropertyCalculator() {
  // Conversion state
  const [marla, setMarla] = useState<number>(5);
  const [marlaStandard, setMarlaStandard] = useState<number>(225); // 225 sqft standard in Gujranwala / 272 sqft

  // Price Calculation
  const [pricePerMarla, setPricePerMarla] = useState<number>(1200000);
  const [calcMarla, setCalcMarla] = useState<number>(5);

  // Commission & Token
  const [dealAmount, setDealAmount] = useState<number>(6000000);
  const [commissionPercent, setCommissionPercent] = useState<number>(1);
  const [tokenPercent, setTokenPercent] = useState<number>(10);

  // Calculated values
  const totalSqft = marla * marlaStandard;
  const totalKanal = marla / 20;
  const totalSqyd = totalSqft / 9;

  const totalCalculatedDemand = pricePerMarla * calcMarla;
  const totalCommission = (dealAmount * commissionPercent) / 100;
  const recommendedToken = (dealAmount * tokenPercent) / 100;
  const remainingAfterToken = dealAmount - recommendedToken;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm text-right">
        <div className="flex items-center gap-2.5 text-emerald-950">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Calculator size={22} className="text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-black font-nastaliq text-slate-900">
              پراپرٹی، رقبہ و کمیشن کیلکولیٹر
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              گوجرانوالہ ریئل اسٹیٹ کے لیے فوری و درست حسابی تخمینہ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Area Converter */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between text-right">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              <ArrowRightLeft size={16} className="text-emerald-700" />
              <span>رقبہ کنورٹر (Area Converter)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مرلہ درج کریں:
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={marla || ''}
                  onChange={(e) => setMarla(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مرلہ کا معیار (اسکوائر فٹ):
                </label>
                <select
                  value={marlaStandard}
                  onChange={(e) => setMarlaStandard(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value={225}>225 اسکوائر فٹ (سوسائٹیز اسٹینڈرڈ)</option>
                  <option value={272}>272.25 اسکوائر فٹ (ریونیو / پٹواری اسٹینڈرڈ)</option>
                </select>
              </div>

              {/* Conversion Results */}
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold text-emerald-950 font-nastaliq text-sm">{totalKanal.toFixed(2)} کنال</span>
                  <span>کل کنال:</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold font-mono text-emerald-950">{totalSqft.toLocaleString()} Sq. Ft</span>
                  <span>اسکوائر فٹ:</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold font-mono text-emerald-950">{totalSqyd.toFixed(1)} Sq. Yds</span>
                  <span>اسکوائر گز:</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Rate & Total Price Calculator */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between text-right">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              <Coins size={16} className="text-amber-600" />
              <span>ریٹ و ٹوٹل ڈیمانڈ کیلکولیٹر</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  قیمت فی مرلہ (پاکستانی روپے):
                </label>
                <input
                  type="number"
                  step="50000"
                  value={pricePerMarla || ''}
                  onChange={(e) => setPricePerMarla(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <span className="text-[11px] text-emerald-700 font-bold font-nastaliq block mt-0.5">
                  {formatPKR(pricePerMarla)} فی مرلہ
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  کل مرلے کی تعداد:
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcMarla || ''}
                  onChange={(e) => setCalcMarla(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Demand Result */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
                <div className="text-xs text-amber-900 font-bold mb-1">کل مجموعی رقم / ڈیمانڈ:</div>
                <div className="text-xl font-black text-amber-950 font-nastaliq">
                  {formatPKR(totalCalculatedDemand)}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  PKR {totalCalculatedDemand.toLocaleString('en-PK')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Deal Commission & Token */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between text-right">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              <Percent size={16} className="text-purple-600" />
              <span>بیعانہ و کمیشن کیلکولیٹر</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ڈیل کی کل طے شدہ رقم:
                </label>
                <input
                  type="number"
                  step="100000"
                  value={dealAmount || ''}
                  onChange={(e) => setDealAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    کمیشن شرح (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    بیعانہ / ٹوکن (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={tokenPercent}
                    onChange={(e) => setTokenPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Commission Breakdown */}
              <div className="mt-3 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold text-purple-950">{formatPKR(totalCommission)}</span>
                  <span>کمیشن رقم ({commissionPercent}%):</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold text-emerald-900">{formatPKR(recommendedToken)}</span>
                  <span>تجویز کردہ بیعانہ ({tokenPercent}%):</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pt-1 border-t border-purple-200">
                  <span className="font-bold text-slate-900">{formatPKR(remainingAfterToken)}</span>
                  <span>بقایا رقم بیعانہ کے بعد:</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
