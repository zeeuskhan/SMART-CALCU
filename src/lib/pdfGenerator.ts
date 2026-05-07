import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationInputs, CalculationResults } from './calculations';

export function generateRetirementPDF(inputs: CalculationInputs, results: CalculationResults) {
  const doc = new jsPDF();
  const currencySymbol = inputs.country === 'India' ? 'Rs.' : '$';

  const format = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: inputs.country === 'India' ? 'INR' : 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Title
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('RetireSmart Global Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Summary Section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Projection Summary', 14, 45);
  
  doc.setFontSize(10);
  doc.text(`Projected Corpus at Age ${inputs.retirementAge}:`, 14, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(format(results.projectedCorpus), 80, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Inflation Adjusted (Today's Value):`, 14, 62);
  doc.setFont('helvetica', 'bold');
  doc.text(format(results.inflationAdjustedCorpus), 80, 62);

  doc.setFont('helvetica', 'normal');
  doc.text(`Estimated Monthly Income:`, 14, 69);
  doc.setFont('helvetica', 'bold');
  doc.text(format(results.monthlyIncomePossibleToday), 80, 69);

  doc.setFont('helvetica', 'normal');
  doc.text(`Status:`, 14, 76);
  doc.setTextColor(results.onTrack ? 16 : 234, results.onTrack ? 185 : 129, results.onTrack ? 129 : 37); // emerald vs orange
  doc.text(results.onTrack ? 'ON TRACK' : 'SHORTFALL', 80, 76);

  // Parameters Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Calculation Parameters', 14, 95);
  
  const paramData = [
    ['Current Age', inputs.currentAge.toString()],
    ['Retirement Age', inputs.retirementAge.toString()],
    ['Current Savings', format(inputs.currentBalance)],
    ['Monthly Contribution', format(inputs.monthlyContribution)],
    ['Expected Returns', `${inputs.expectedReturn}%`],
    ['Inflation Rate', `${inputs.inflationRate}%`],
    ['Contribution Increase', `${inputs.annualContributionIncrease}% / year`],
  ];

  autoTable(doc, {
    startY: 100,
    head: [['Parameter', 'Value']],
    body: paramData,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42] },
  });

  // Yearly Breakdown Table
  doc.setFontSize(14);
  doc.text('Year-by-Year Projection', 14, (doc as any).lastAutoTable.finalY + 15);

  const tableData = results.yearlyBreakdown.map(row => [
    row.age.toString(),
    format(row.contributions),
    format(row.growth),
    format(row.balance),
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Age', 'Yearly Contribution', 'Interest Growth', 'End Balance']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // blue-600
  });

  // Disclaimer
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Disclaimer: This report is for educational purposes only and does not constitute financial advice.', 14, finalY);

  doc.save(`RetireSmart_Report_${inputs.country}.pdf`);
}
