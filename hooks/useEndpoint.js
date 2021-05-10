const useEndpoint = (categoryID) => {
  return {
    endpoint: `https://cpqserver-e30-cpq1.cloud.sigma-systems.com/api/offers?InstanceTypeNames=Package,Promotion,Bundle&Classifications=[Customer_Demo_Portal;${categoryID};false]&ClassificationElementName=Customer_Demo_Portal&xsltCode=offer_special&at[p1]=ID&el[p2]=Name&at[p3]=BusinessID&el[p4]=Description&el[p5]=Element_Guid&el[p6]=Description`,
  };
};
