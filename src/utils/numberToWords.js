/**
 * Converts a numerical amount into English words (PKR currency format).
 * e.g., 50000 -> "Fifty Thousand Rupees Only"
 * e.g., 1250500 -> "One Million Two Hundred Fifty Thousand Five Hundred Rupees Only"
 */
export function numberToWords(amount) {
  if (amount === '' || amount === null || amount === undefined) {
    return '—';
  }

  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : Number(amount);

  if (isNaN(num)) return '—';
  if (num === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertChunk(n) {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  const scales = [
    { value: 1e9, unit: 'Billion' },
    { value: 1e6, unit: 'Million' },
    { value: 1e3, unit: 'Thousand' },
    { value: 1, unit: '' }
  ];

  let integerPart = Math.floor(Math.abs(num));
  let result = '';

  for (const scale of scales) {
    if (integerPart >= scale.value) {
      const quotient = Math.floor(integerPart / scale.value);
      integerPart %= scale.value;
      if (quotient > 0) {
        const chunkStr = convertChunk(quotient);
        result += (result ? ' ' : '') + chunkStr + (scale.unit ? ' ' + scale.unit : '');
      }
    }
  }

  return result.trim() + ' Rupees Only';
}
