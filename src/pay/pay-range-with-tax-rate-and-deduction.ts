// interface IPayRangeWithTaxRateAndDeduction {
//   range: {
//     from: number;
//     to: number;
//   };
//   taxRate: number;
//   deduction: number;
// }

export const payRangeWithTaxRateAndDeduction = {
  CLASS_A: {
    range: {
      from: 0,
      to: 600,
    },
    taxRate: 0,
    deduction: 0,
  },

  CLASS_B: {
    range: {
      from: 601,
      to: 1650,
    },
    taxRate: 0.1,
    deduction: 60,
  },

  CLASS_C: {
    range: {
      from: 1651,
      to: 3200,
    },
    taxRate: 0.15,
    deduction: 142.5,
  },

  CLASS_D: {
    range: {
      from: 3201,
      to: 5250,
    },
    taxRate: 0.2,
    deduction: 302.5,
  },

  CLASS_E: {
    range: {
      from: 5251,
      to: 7800,
    },
    taxRate: 0.25,
    deduction: 565,
  },

  CLASS_F: {
    range: {
      from: 7801,
      to: 10900,
    },
    taxRate: 0.3,
    deduction: 955,
  },

  CLASS_G: {
    range: {
      from: 10900,
      to: 100000000,
    },
    taxRate: 0.35,
    deduction: 1500,
  },
};
