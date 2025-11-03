// Pharmacogenomics Data for Personalized Medicine
// This data supports genetic testing and personalized treatment recommendations

module.exports = {
  variants: {
    CYP2D6: {
      '*4': {
        function: 'Poor metabolizer',
        impact: 'Reduced drug clearance, increased side effects',
        frequency: '10-15% in Caucasians'
      },
      '*10': {
        function: 'Reduced metabolizer',
        impact: 'Moderate reduction in drug clearance',
        frequency: '1-5% in populations'
      },
      'Normal': {
        function: 'Extensive metabolizer',
        impact: 'Normal drug metabolism',
        frequency: 'Most common'
      }
    },
    CYP2C9: {
      '*2': {
        function: 'Reduced metabolizer',
        impact: 'Decreased warfarin clearance',
        frequency: '10-15% in Caucasians'
      },
      '*3': {
        function: 'Poor metabolizer',
        impact: 'Severely decreased warfarin clearance',
        frequency: '5-10% in Caucasians'
      }
    },
    CYP2C19: {
      '*2': {
        function: 'Poor metabolizer',
        impact: 'Reduced clopidogrel efficacy',
        frequency: '15-20% in Asian populations'
      },
      '*17': {
        function: 'Rapid metabolizer',
        impact: 'Increased risk of bleeding',
        frequency: '18-45% in Europeans'
      }
    },
    VKORC1: {
      '-1639G>A': {
        function: 'Reduced enzyme activity',
        impact: 'Lower warfarin dose requirement',
        frequency: 'Common variant'
      }
    },
    SLCO1B1: {
      '*5': {
        function: 'Defective transport',
        impact: 'Increased statin myopathy risk',
        frequency: '15-20% in populations'
      }
    },
    HLA-B: {
      '*1502': {
        function: 'Hypersensitivity risk',
        impact: 'Severe hypersensitivity to carbamazepine',
        frequency: '2-5% in Asian populations'
      }
    },
    MTHFR: {
      'C677T': {
        function: 'Reduced enzyme activity',
        impact: 'Affects folate metabolism',
        frequency: '10-15% homozygous'
      }
    },
    APOE: {
      'ε4': {
        function: 'Risk variant',
        impact: 'Increased Alzheimer\'s disease risk',
        frequency: '15-20% allele frequency'
      }
    }
  },

  riskFactors: {
    CYP2D6: {
      level: 'moderate',
      impact: 'Altered response to codeine, tamoxifen',
      prevalence: '10-15%'
    },
    CYP2C19: {
      level: 'moderate',
      impact: 'Reduced clopidogrel efficacy',
      prevalence: '15-20% in Asians'
    },
    SLCO1B1: {
      level: 'high',
      impact: 'Increased statin side effects',
      prevalence: '15-20%'
    },
    HLA-B: {
      level: 'high',
      impact: 'Severe drug hypersensitivities',
      prevalence: '2-5% in Asians'
    }
  },

  diseaseRisks: {
    'cardiovascular_disease': {
      factor: 'Cardiovascular Disease',
      risk_level: 'high',
      impact: 'Requires careful medication selection',
      recommendations: ['Avoid medications with cardiac side effects', 'Monitor closely']
    },
    'diabetes': {
      factor: 'Diabetes',
      risk_level: 'moderate',
      impact: 'Medication interactions with glucose control',
      recommendations: ['Monitor blood glucose', 'Coordinate with endocrinologist']
    },
    'kidney_disease': {
      factor: 'Renal Impairment',
      risk_level: 'high',
      impact: 'Dose adjustment required for renally-cleared drugs',
      recommendations: ['Calculate creatinine clearance', 'Adjust doses accordingly']
    },
    'liver_disease': {
      factor: 'Hepatic Impairment',
      risk_level: 'high',
      impact: 'Dose adjustment required for hepatically-metabolized drugs',
      recommendations: ['Monitor liver function', 'Avoid hepatotoxic drugs']
    }
  },

  drugInteractions: {
    // Warfarin interactions based on CYP2C9/VKORC1
    warfarin: {
      normal: '5mg daily starting dose',
      CYP2C9_poor: '2.5mg daily starting dose',
      VKORC1_variant: '2.5-3.75mg daily starting dose',
      both: '1.25-2.5mg daily starting dose'
    },
    // Clopidogrel interactions based on CYP2C19
    clopidogrel: {
      normal: '75mg daily',
      CYP2C19_poor: 'Alternative: Prasugrel or Ticagrelor',
      monitoring: 'Platelet function testing recommended'
    },
    // Statin interactions based on SLCO1B1
    statins: {
      atorvastatin_normal: '10-80mg daily',
      atorvastatin_SLCO1B1: 'Start with lower dose, monitor for myopathy',
      simvastatin_normal: '20-40mg daily',
      simvastatin_SLCO1B1: 'Avoid or use very low dose, consider alternative'
    },
    // Codeine interactions based on CYP2D6
    codeine: {
      normal: '30-60mg every 4-6 hours',
      CYP2D6_poor: 'Avoid or use alternative analgesic',
      CYP2D6_ultra_rapid: 'Increased risk of side effects, reduce dose'
    }
  },

  monitoringRequirements: {
    anticoagulants: ['INR monitoring', 'Bleeding risk assessment', 'Diet counseling'],
    antidiabetic: ['HbA1c', 'Blood glucose', 'Renal function'],
    statins: ['Liver function', 'CK levels', 'Muscle symptoms'],
    psychotropics: ['Drug levels', 'Therapeutic drug monitoring', 'Side effect screening'],
    immunosuppressants: ['Drug levels', 'Infection monitoring', 'Renal function']
  },

  referenceRanges: {
    INR: { min: 2.0, max: 3.0, unit: '', critical_low: 1.5, critical_high: 5.0 },
    'Factor V Leiden': { prevalence: '5% in Caucasians', risk: 'Increased thrombosis risk' },
    'Prothrombin Gene Mutation': { prevalence: '2-3%', risk: 'Increased thrombosis risk' }
  },

  ethnicPopulations: {
    caucasian: {
      CYP2D6_poor: '10-15%',
      CYP2C9_poor: '10-15%',
      CYP2C19_poor: '2-3%'
    },
    asian: {
      CYP2D6_poor: '1-2%',
      CYP2C9_poor: '<1%',
      CYP2C19_poor: '15-20%'
    },
    african_american: {
      CYP2D6_poor: '2-5%',
      CYP2C9_poor: '2-3%',
      CYP2C19_poor: '2-3%'
    }
  }
};

