import { useState } from 'react'

// ===== 2026 세율 =====
// UK IHT
const UK_NRB = 325000      // Nil-Rate Band
const UK_RNRB = 175000     // Residence Nil-Rate Band
const UK_IHT_RATE = 0.40   // 40%
const UK_CHARITY_RATE = 0.36 // 자선단체 10% 이상 기부 시

// US Estate Tax 2026 (OBBBA 이후)
const US_EXEMPTION = 15000000  // $15M per person
const US_ESTATE_RATE = 0.40    // 40%

export default function InheritanceTaxCalc() {
  const [country, setCountry] = useState('uk')

  // UK 상태
  const [estateValue, setEstateValue] = useState('')
  const [debts, setDebts] = useState('')
  const [hasSpouse, setHasSpouse] = useState(false)
  const [spouseUnusedNRB, setSpouseUnusedNRB] = useState(false)
  const [hasProperty, setHasProperty] = useState(false)
  const [propertyToDescendants, setPropertyToDescendants] = useState(false)
  const [charityGift, setCharityGift] = useState('')
  const [gifts7yr, setGifts7yr] = useState('')

  // US 상태
  const [grossEstate, setGrossEstate] = useState('')
  const [usDebts, setUsDebts] = useState('')
  const [maritalDeduction, setMaritalDeduction] = useState('')
  const [charityDeduction, setCharityDeduction] = useState('')
  const [priorGifts, setPriorGifts] = useState('')

  const [result, setResult] = useState(null)

  const fmt = (n, cur = country) => {
    const sym = cur === 'uk' ? '£' : '$'
    return sym + Math.round(n).toLocaleString()
  }

  const calculateUK = () => {
    const estate = parseFloat(estateValue) || 0
    const debt = parseFloat(debts) || 0
    const charity = parseFloat(charityGift) || 0
    const gifts = parseFloat(gifts7yr) || 0

    const netEstate = Math.max(0, estate - debt)

    // NRB 계산
    let totalNRB = UK_NRB
    if (spouseUnusedNRB) totalNRB += UK_NRB // 배우자 미사용 NRB 이전

    // RNRB (주거 부동산을 직계 후손에게 남길 때)
    let rnrb = 0
    if (hasProperty && propertyToDescendants) {
      rnrb = UK_RNRB
      if (spouseUnusedNRB) rnrb += UK_RNRB // 배우자 미사용 RNRB 이전
      // £2M 초과 시 테이퍼링
      if (netEstate > 2000000) {
        const taper = Math.floor((netEstate - 2000000) / 2)
        rnrb = Math.max(0, rnrb - taper)
      }
    }

    // 자선 공제
    const charityDeductible = Math.min(charity, netEstate)
    const taxableEstate = Math.max(0, netEstate - totalNRB - rnrb - charityDeductible - gifts)

    // 자선 10% 이상 기부 시 할인율
    const charityPercent = netEstate > 0 ? charity / netEstate : 0
    const rate = charityPercent >= 0.10 ? UK_CHARITY_RATE : UK_IHT_RATE

    const tax = taxableEstate > 0 ? taxableEstate * rate : 0
    const netToHeirs = netEstate - tax

    setResult({
      country: 'uk',
      netEstate,
      totalNRB,
      rnrb,
      charityDeductible,
      gifts,
      taxableEstate,
      rate,
      tax,
      netToHeirs,
      charityPercent,
    })
  }

  const calculateUS = () => {
    const gross = parseFloat(grossEstate) || 0
    const debt = parseFloat(usDebts) || 0
    const marital = parseFloat(maritalDeduction) || 0
    const charity = parseFloat(charityDeduction) || 0
    const gifts = parseFloat(priorGifts) || 0

    const adjustedEstate = Math.max(0, gross - debt - marital - charity)
    const taxableEstate = Math.max(0, adjustedEstate + gifts - US_EXEMPTION)
    const tax = taxableEstate > 0 ? taxableEstate * US_ESTATE_RATE : 0
    const netToHeirs = Math.max(0, gross - debt - tax)

    setResult({
      country: 'us',
      grossEstate: gross,
      adjustedEstate,
      exemption: US_EXEMPTION,
      taxableEstate,
      tax,
      netToHeirs,
      marital,
      charity,
    })
  }

  const calculate = () => {
    if (country === 'uk') calculateUK()
    else calculateUS()
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Inheritance Tax Calculator 2026</h2>
        <p className="text-sm text-gray-500">
          Estimate UK Inheritance Tax (IHT) or US Estate Tax based on the latest 2026 rates.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          UK rates: updated April 2026 | US rates: updated July 2025 (OBBBA)
        </p>
      </div>

      {/* 국가 선택 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'uk', label: '🇬🇧 United Kingdom (IHT)' },
            { value: 'us', label: '🇺🇸 United States (Estate Tax)' },
          ].map(opt => (
            <button key={opt.value} onClick={() => { setCountry(opt.value); setResult(null) }}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                country === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {country === 'uk' ? (
        <div className="space-y-4">
          {/* 총 자산 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Total Estate Value</label>
            <p className="text-xs text-gray-400 mb-1">Property, savings, investments, personal possessions</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input type="number" value={estateValue} onChange={e => setEstateValue(e.target.value)}
                placeholder="500,000"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {/* 부채 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Debts & Liabilities</label>
            <p className="text-xs text-gray-400 mb-1">Mortgage, loans, credit cards</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input type="number" value={debts} onChange={e => setDebts(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {/* 7년 이내 증여 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gifts Made in Last 7 Years</label>
            <p className="text-xs text-gray-400 mb-1">Gifts above £3,000/year annual exemption</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input type="number" value={gifts7yr} onChange={e => setGifts7yr(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {/* 자선 기부 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Charitable Gifts in Will</label>
            <p className="text-xs text-gray-400 mb-1">Donating 10%+ of estate reduces rate to 36%</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input type="number" value={charityGift} onChange={e => setCharityGift(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {/* 체크박스 옵션들 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Allowances & Reliefs</p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={hasSpouse} onChange={e => setHasSpouse(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-indigo-600" />
              <div>
                <p className="text-sm text-gray-700 font-medium">Married / Civil Partner</p>
                <p className="text-xs text-gray-400">Assets left to spouse/partner are IHT-free</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={spouseUnusedNRB} onChange={e => setSpouseUnusedNRB(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-indigo-600" />
              <div>
                <p className="text-sm text-gray-700 font-medium">Transfer Unused NRB from Late Spouse</p>
                <p className="text-xs text-gray-400">Doubles nil-rate band to £650,000</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={hasProperty} onChange={e => setHasProperty(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-indigo-600" />
              <div>
                <p className="text-sm text-gray-700 font-medium">Estate Includes Main Residence</p>
                <p className="text-xs text-gray-400">Required for Residence Nil-Rate Band (RNRB)</p>
              </div>
            </label>

            {hasProperty && (
              <label className="flex items-start gap-3 cursor-pointer ml-4">
                <input type="checkbox" checked={propertyToDescendants} onChange={e => setPropertyToDescendants(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-indigo-600" />
                <div>
                  <p className="text-sm text-gray-700 font-medium">Leaving Home to Direct Descendants</p>
                  <p className="text-xs text-gray-400">+£175,000 RNRB (children, grandchildren)</p>
                </div>
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            ℹ️ US federal estate tax exemption is <strong>$15,000,000</strong> per person in 2026 (OBBBA). Most estates will owe $0.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gross Estate Value</label>
            <p className="text-xs text-gray-400 mb-1">Total value of all assets at fair market value</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={grossEstate} onChange={e => setGrossEstate(e.target.value)}
                placeholder="5,000,000"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Debts & Expenses</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={usDebts} onChange={e => setUsDebts(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Marital Deduction</label>
            <p className="text-xs text-gray-400 mb-1">Assets left to US citizen spouse (unlimited deduction)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={maritalDeduction} onChange={e => setMaritalDeduction(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Charitable Deduction</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={charityDeduction} onChange={e => setCharityDeduction(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prior Taxable Gifts (Lifetime)</label>
            <p className="text-xs text-gray-400 mb-1">Gifts exceeding annual exclusion ($19,000/person in 2026)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={priorGifts} onChange={e => setPriorGifts(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        </div>
      )}

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Inheritance Tax
      </button>

      {/* 결과 */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* 세금 총액 */}
          <div className={`rounded-xl p-5 border ${result.tax === 0 ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-semibold mb-1 ${result.tax === 0 ? 'text-green-600' : 'text-indigo-600'}`}>
                  {result.tax === 0 ? '✅ No Tax Due' : 'Estimated Tax Due'}
                </p>
                <p className={`text-4xl font-black ${result.tax === 0 ? 'text-green-700' : 'text-indigo-700'}`}>
                  {fmt(result.tax)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Heirs Receive</p>
                <p className="text-2xl font-bold text-gray-700">{fmt(result.netToHeirs)}</p>
              </div>
            </div>
          </div>

          {/* UK 상세 */}
          {result.country === 'uk' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Net Estate (after debts)</span>
                <span className="font-semibold">{fmt(result.netEstate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nil-Rate Band</span>
                <span className="font-semibold text-green-600">- {fmt(result.totalNRB)}</span>
              </div>
              {result.rnrb > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Residence NRB</span>
                  <span className="font-semibold text-green-600">- {fmt(result.rnrb)}</span>
                </div>
              )}
              {result.charityDeductible > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Charitable Gift</span>
                  <span className="font-semibold text-green-600">- {fmt(result.charityDeductible)}</span>
                </div>
              )}
              {result.gifts > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">7-Year Gifts</span>
                  <span className="font-semibold text-green-600">- {fmt(result.gifts)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Taxable Estate</span>
                <span>{fmt(Math.max(0, result.taxableEstate))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IHT Rate</span>
                <span className="font-semibold">{(result.rate * 100).toFixed(0)}%
                  {result.charityPercent >= 0.10 && <span className="text-xs text-green-600 ml-1">(charity discount)</span>}
                </span>
              </div>
              <div className="flex justify-between font-bold text-red-500">
                <span>Tax Due</span>
                <span>{fmt(result.tax)}</span>
              </div>
            </div>
          )}

          {/* US 상세 */}
          {result.country === 'us' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Gross Estate</span>
                <span className="font-semibold">{fmt(result.grossEstate)}</span>
              </div>
              {result.marital > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Marital Deduction</span>
                  <span className="font-semibold text-green-600">- {fmt(result.marital)}</span>
                </div>
              )}
              {result.charity > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Charitable Deduction</span>
                  <span className="font-semibold text-green-600">- {fmt(result.charity)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Adjusted Estate</span>
                <span className="font-semibold">{fmt(result.adjustedEstate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Federal Exemption (2026)</span>
                <span className="font-semibold text-green-600">- {fmt(result.exemption)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Taxable Estate</span>
                <span>{fmt(Math.max(0, result.taxableEstate))}</span>
              </div>
              <div className="flex justify-between font-bold text-red-500">
                <span>Federal Estate Tax (40%)</span>
                <span>{fmt(result.tax)}</span>
              </div>
            </div>
          )}

          {/* 안내 박스 */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            {result.country === 'uk' ? (
              <>
                <p className="font-bold">ℹ️ UK IHT 2026/27 Key Facts</p>
                <p>• Nil-Rate Band: £325,000 per person</p>
                <p>• Residence NRB: +£175,000 (home to direct descendants)</p>
                <p>• Spouse transfer: doubles both allowances</p>
                <p>• Standard rate: 40% | Charity 10%+ rate: 36%</p>
                <p>• Gifts within 7 years may still be taxable (taper relief applies)</p>
              </>
            ) : (
              <>
                <p className="font-bold">ℹ️ US Estate Tax 2026 Key Facts</p>
                <p>• Federal exemption: $15,000,000 per person (OBBBA 2025)</p>
                <p>• Portability: unused exemption transfers to surviving spouse</p>
                <p>• Rate: flat 40% above exemption</p>
                <p>• Annual gift exclusion: $19,000 per recipient in 2026</p>
                <p>• State estate taxes vary — not included in this estimate</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}