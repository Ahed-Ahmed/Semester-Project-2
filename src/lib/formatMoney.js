const formatMoney = (amount = 0, currency) => {
  const options = {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  };

  const formatter = Intl.NumberFormat('en-US', options);

  return formatter.format(amount);
};

export default formatMoney;
