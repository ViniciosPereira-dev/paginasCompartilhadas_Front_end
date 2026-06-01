export const formatPhoneToWhatsApp = (phone: string) => {
  if (!phone) return "";

  return phone
    .replace(/\D/g, "") 
    .replace(/^0/, ""); 
};