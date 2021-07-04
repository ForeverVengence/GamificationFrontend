function avg(...nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default avg;
