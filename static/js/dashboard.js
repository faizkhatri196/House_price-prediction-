/* ==========================================================================
   EstateMind 3D - Chart.js Investment Dashboard & Price Forecast Engine
   ========================================================================== */

class InvestmentDashboardEngine {
  constructor() {
    this.forecastChart = null;
    this.constructionChart = null;
    this.roiChart = null;
  }

  initForecastChart(canvasId, yearLabels, priceData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.forecastChart) {
      this.forecastChart.destroy();
    }

    const formattedPrices = priceData.map(p => p / 100000); // In Lakhs

    this.forecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: yearLabels,
        datasets: [{
          label: 'Estimated Property Valuation (₹ Lakhs)',
          data: formattedPrices,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#8b5cf6',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f8fafc', font: { family: 'Plus Jakarta Sans', weight: 600 } } },
          tooltip: {
            callbacks: {
              label: (item) => ` Valuation: ₹ ${item.raw.toFixed(2)} Lakhs`
            }
          }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' } }
        }
      }
    });
  }

  initConstructionChart(canvasId, breakdownData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.constructionChart) {
      this.constructionChart.destroy();
    }

    const labels = Object.keys(breakdownData).map(k => k.replace(/_/g, ' ').toUpperCase());
    const values = Object.values(breakdownData).map(v => v / 100000); // Lakhs

    this.constructionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#f8fafc', font: { family: 'Plus Jakarta Sans', size: 11 } } },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ₹ ${item.raw.toFixed(2)} Lakhs`
            }
          }
        }
      }
    });
  }

  calculateMortgage(loanAmount, ratePct, tenureYears) {
    const monthlyRate = (ratePct / 100) / 12;
    const totalMonths = tenureYears * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  }
}

window.InvestmentDashboardEngine = InvestmentDashboardEngine;
