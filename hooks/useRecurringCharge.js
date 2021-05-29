export default function useRecurringCharge(quote) {
  if (!quote.pricingSummary.TotalPriceSummary.Recurring) return;
  const recurringCharges = [];
  for (const periodicity in quote.pricingSummary.TotalPriceSummary.Recurring) {
    recurringCharges.push({
      periodicity,
      charge:
        quote.pricingSummary.TotalPriceSummary.Recurring[periodicity]
          .ItemCharge || 0,
    });
  }
  return recurringCharges;
}
