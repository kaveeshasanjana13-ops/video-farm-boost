import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

const ROICalculator = () => {
  const [videoInvestment, setVideoInvestment] = useState(5000);
  const [monthlyCustomers, setMonthlyCustomers] = useState(10);
  const [conversionLift, setConversionLift] = useState(35);
  const [customerLTV, setCustomerLTV] = useState(3000);
  const [timeHorizon, setTimeHorizon] = useState(24);

  // Calculations
  const totalCustomers = monthlyCustomers * timeHorizon;
  const lifetimeCAC = totalCustomers > 0 ? videoInvestment / totalCustomers : 0;
  const baselineCustomers = monthlyCustomers / (1 + conversionLift / 100);
  const additionalCustomers = totalCustomers - (baselineCustomers * timeHorizon);
  const additionalRevenue = additionalCustomers * customerLTV;
  const totalRevenue = totalCustomers * customerLTV;
  const netROI = ((totalRevenue - videoInvestment) / videoInvestment) * 100;
  const breakEvenMonths = videoInvestment / (monthlyCustomers * customerLTV);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-20 cinematic-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Video ROI Calculator
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Discover the powerful economics of video content for your B2B SaaS. 
            See how a one-time investment can dramatically lower your CAC over time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Your Assumptions</h3>
            
            <div className="space-y-6">
              {/* Video Investment */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Video Investment</Label>
                  <span className="text-primary font-semibold">{formatCurrency(videoInvestment)}</span>
                </div>
                <Input
                  type="number"
                  value={videoInvestment}
                  onChange={(e) => setVideoInvestment(Number(e.target.value))}
                  className="bg-black/20 border-white/20 text-white"
                />
              </div>

              {/* Monthly Customers from Video */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Monthly Customers from Video</Label>
                  <span className="text-primary font-semibold">{monthlyCustomers}</span>
                </div>
                <Slider
                  value={[monthlyCustomers]}
                  onValueChange={(value) => setMonthlyCustomers(value[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Conversion Lift */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Conversion Rate Lift</Label>
                  <span className="text-primary font-semibold">{conversionLift}%</span>
                </div>
                <Slider
                  value={[conversionLift]}
                  onValueChange={(value) => setConversionLift(value[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              {/* Customer LTV */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Customer Lifetime Value</Label>
                  <span className="text-primary font-semibold">{formatCurrency(customerLTV)}</span>
                </div>
                <Input
                  type="number"
                  value={customerLTV}
                  onChange={(e) => setCustomerLTV(Number(e.target.value))}
                  className="bg-black/20 border-white/20 text-white"
                />
              </div>

              {/* Time Horizon */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Time Horizon (Months)</Label>
                  <span className="text-primary font-semibold">{timeHorizon}</span>
                </div>
                <Slider
                  value={[timeHorizon]}
                  onValueChange={(value) => setTimeHorizon(value[0])}
                  min={6}
                  max={60}
                  step={6}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Lifetime CAC */}
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-white">Lifetime CAC</h4>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">
                    {formatCurrency(lifetimeCAC)}
                  </p>
                  <p className="text-sm text-gray-300">
                    Cost per customer over {timeHorizon} months
                  </p>
                </div>
              </div>
            </Card>

            {/* Break-even Timeline */}
            <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Break-even Point</h4>
                  <p className="text-3xl font-bold text-white mb-2">
                    {breakEvenMonths.toFixed(1)} months
                  </p>
                  <p className="text-sm text-gray-300">
                    Your video pays for itself in under {Math.ceil(breakEvenMonths)} months
                  </p>
                </div>
              </div>
            </Card>

            {/* Additional Revenue */}
            <Card className="p-6 bg-black/40 backdrop-blur-sm border-white/10">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Additional Revenue</h4>
                  <p className="text-3xl font-bold text-white mb-2">
                    {formatCurrency(additionalRevenue)}
                  </p>
                  <p className="text-sm text-gray-300">
                    From {formatNumber(additionalCustomers)} extra customers due to conversion lift
                  </p>
                </div>
              </div>
            </Card>

            {/* Total ROI */}
            <Card className="p-6 bg-gradient-to-br from-success/20 to-success/5 border-success/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-success mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Total ROI</h4>
                  <p className="text-4xl font-bold text-white mb-2">
                    {netROI > 0 ? '+' : ''}{formatNumber(netROI)}%
                  </p>
                  <p className="text-sm text-gray-300">
                    Total return: {formatCurrency(totalRevenue)} on {formatCurrency(videoInvestment)} investment
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Key Insight */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-lg text-white font-medium">
              💡 <span className="font-semibold">Key Insight:</span> Traditional marketing has recurring costs per customer. 
              Video is created once but generates customers continuously. After {timeHorizon} months, 
              you're looking at just <span className="text-primary font-bold">{formatCurrency(lifetimeCAC)}</span> per 
              customer on a <span className="text-primary font-bold">{formatCurrency(videoInvestment)}</span> investment!
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ROICalculator;
