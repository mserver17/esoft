export default function calculateCommission(propertyType, propertyCost) {
    let companyCommission = 0;
    let sellerAgentCommission = 0;
    let buyerAgentCommission = 0;
  
    if (propertyType === 'Квартира') {
      companyCommission = 36000 + (propertyCost * 0.01);
    } else if (propertyType === 'Земля') {
      companyCommission = 30000 + (propertyCost * 0.02);
    } else if (propertyType === 'Дом') {
      companyCommission = 30000 + (propertyCost * 0.01);
    }
  
    const buyerCommission = propertyCost * 0.03;
  
    sellerAgentCommission = companyCommission * 0.45;
    buyerAgentCommission = buyerCommission * 0.45;
  
    return {
      companyCommission,
      buyerCommission,
      sellerAgentCommission,
      buyerAgentCommission,
      companyDeductions: companyCommission - sellerAgentCommission - buyerAgentCommission,
    };
  }