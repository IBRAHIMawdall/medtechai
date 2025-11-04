const axios = require('axios');

// Free AI API configurations
const FREE_APIS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
      'Content-Type': 'application/json'
    },
    model: 'llama3-70b-8192'
  },
  together: {
    url: 'https://api.together.xyz/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY || ''}`,
      'Content-Type': 'application/json'
    },
    model: 'meta-llama/Llama-3-70b-chat-hf'
  },
  huggingface: {
    url: 'https://api-inference.huggingface.co/models/aaditya/Llama3-OpenBioLLM-70B',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || ''}`,
      'Content-Type': 'application/json'
    }
  }
};

class PersonalizedMedicineService {
  constructor() {
    this.pharmacogenomicsData = require('../data/pharmacogenomics');
  }

  async analyzeGeneticProfile(geneticData, patientDemographics = {}) {
    try {
      const basicAnalysis = this.performBasicGeneticAnalysis(geneticData);
      const aiEnhancedAnalysis = await this.enhanceWithAI(geneticData, basicAnalysis);
      
      return {
        ...basicAnalysis,
        ai_insights: aiEnhancedAnalysis.insights || [],
        recommendations: aiEnhancedAnalysis.recommendations || [],
        risk_factors: this.identifyRiskFactors(geneticData, patientDemographics),
        personalized_treatment_plan: this.generateTreatmentPlan(geneticData, patientDemographics)
      };
    } catch (error) {
      console.error('Genetic Analysis Error:', error);
      return this.performBasicGeneticAnalysis(geneticData);
    }
  }

  performBasicGeneticAnalysis(geneticData) {
    const analysis = {
      genetic_variants: [],
      drug_response_predictions: [],
      risk_assessments: [],
      summary: 'Genetic analysis completed'
    };

    // Analyze genetic variants
    if (geneticData.variants && Array.isArray(geneticData.variants)) {
      geneticData.variants.forEach(variant => {
        const variantInfo = this.pharmacogenomicsData.variants[variant.gene]?.[variant.variant];
        if (variantInfo) {
          analysis.genetic_variants.push({
            gene: variant.gene,
            variant: variant.variant,
            function: variantInfo.function,
            impact: variantInfo.impact,
            frequency: variantInfo.frequency
          });
        }
      });
    }

    // Predict drug responses based on pharmacogenomics
    if (geneticData.medications && Array.isArray(geneticData.medications)) {
      geneticData.medications.forEach(med => {
        const drugResponse = this.predictDrugResponse(med, geneticData.variants);
        if (drugResponse) {
          analysis.drug_response_predictions.push(drugResponse);
        }
      });
    }

    return analysis;
  }

  predictDrugResponse(medication, variants) {
    const pharmacogenomicsLookup = {
      'warfarin': { gene: 'CYP2C9', variant: 'VKORC1', impact: 'Dosage adjustment required' },
      'clopidogrel': { gene: 'CYP2C19', variant: '*2/*2', impact: 'Reduced efficacy, consider alternative' },
      'statins': { gene: 'SLCO1B1', variant: '*5', impact: 'Increased myopathy risk' },
      'codeine': { gene: 'CYP2D6', variant: '*4/*4', impact: 'Poor metabolizer, reduced efficacy' },
      'tamoxifen': { gene: 'CYP2D6', variant: '*4/*4', impact: 'Reduced efficacy' },
      'carbamazepine': { gene: 'HLA-B', variant: '*1502', impact: 'Severe hypersensitivity risk' }
    };

    const medKey = medication.toLowerCase();
    const knownInteraction = pharmacogenomicsLookup[medKey];
    
    if (knownInteraction && variants) {
      const hasVariant = variants.some(v => 
        v.gene === knownInteraction.gene && v.variant === knownInteraction.variant
      );
      
      if (hasVariant) {
        return {
          medication: medication,
          gene: knownInteraction.gene,
          variant: knownInteraction.variant,
          predicted_response: 'variant_detected',
          recommendation: knownInteraction.impact,
          confidence: 0.95,
          action_required: true
        };
      }
    }

    return null;
  }

  identifyRiskFactors(geneticData, demographics) {
    const riskFactors = [];
    
    // Age-related risks
    if (demographics.age > 65) {
      riskFactors.push({
        factor: 'Advanced age',
        risk_level: 'moderate',
        impact: 'Increased susceptibility to adverse drug reactions'
      });
    }

    // Genetic predisposition risks
    if (geneticData.variants) {
      geneticData.variants.forEach(variant => {
        const variantRisk = this.pharmacogenomicsData.riskFactors[variant.gene];
        if (variantRisk) {
          riskFactors.push({
            factor: `${variant.gene} variant`,
            risk_level: variantRisk.level,
            impact: variantRisk.impact,
            prevalence: variantRisk.prevalence
          });
        }
      });
    }

    // Comorbidity risks
    if (demographics.conditions && Array.isArray(demographics.conditions)) {
      demographics.conditions.forEach(condition => {
        const conditionRisk = this.pharmacogenomicsData.diseaseRisks[condition];
        if (conditionRisk) {
          riskFactors.push(conditionRisk);
        }
      });
    }

    return riskFactors;
  }

  generateTreatmentPlan(geneticData, demographics) {
    const plan = {
      phase: 'initial',
      recommended_medications: [],
      dosage_adjustments: [],
      monitoring_requirements: [],
      lifestyle_recommendations: []
    };

    // Generate personalized medication recommendations
    if (geneticData.targetConditions && Array.isArray(geneticData.targetConditions)) {
      geneticData.targetConditions.forEach(condition => {
        const recommendations = this.getMedicationRecommendations(condition, geneticData);
        plan.recommended_medications.push(...recommendations);
      });
    }

    // Add dosage adjustments based on genetics
    if (geneticData.currentMedications) {
      geneticData.currentMedications.forEach(med => {
        const adjustment = this.calculateDosageAdjustment(med, geneticData);
        if (adjustment) {
          plan.dosage_adjustments.push(adjustment);
        }
      });
    }

    // Add monitoring requirements
    plan.monitoring_requirements = this.getMonitoringRequirements(geneticData, demographics);

    // Add lifestyle recommendations
    plan.lifestyle_recommendations = this.getLifestyleRecommendations(geneticData, demographics);

    return plan;
  }

  getMedicationRecommendations(condition, geneticData) {
    const recommendations = [];
    const medicationGuide = {
      'diabetes': ['metformin', 'glipizide'],
      'hypertension': ['lisinopril', 'amlodipine'],
      'hyperlipidemia': ['atorvastatin', 'simvastatin'],
      'depression': ['sertraline', 'escitalopram']
    };

    const meds = medicationGuide[condition.toLowerCase()];
    if (meds) {
      meds.forEach(med => {
        const drugResponse = this.predictDrugResponse(med, geneticData.variants);
        recommendations.push({
          medication: med,
          condition: condition,
          suitability: drugResponse ? 'review_required' : 'recommended',
          drug_response: drugResponse,
          evidence: 'Pharmacogenomics-based recommendation'
        });
      });
    }

    return recommendations;
  }

  calculateDosageAdjustment(medication, geneticData) {
    const dosageAdjustments = {
      'warfarin': { normal: '5mg daily', poor_metabolizer: '2.5mg daily' },
      'codeine': { normal: '30-60mg every 4-6 hours', poor_metabolizer: 'Avoid or use alternative' }
    };

    const medicationKey = medication.toLowerCase();
    const adjustment = dosageAdjustments[medicationKey];

    if (adjustment && geneticData.variants) {
      const isPoorMetabolizer = geneticData.variants.some(v => 
        v.gene === 'CYP2D6' && v.variant.includes('*4')
      );

      if (isPoorMetabolizer) {
        return {
          medication: medication,
          standard_dosage: adjustment.normal,
          recommended_dosage: adjustment.poor_metabolizer,
          reason: 'Poor metabolizer genotype detected',
          confidence: 0.9,
          requires_physician_review: true
        };
      }
    }

    return null;
  }

  getMonitoringRequirements(geneticData, demographics) {
    const requirements = [];

    // Genetic-based monitoring
    if (geneticData.variants) {
      const needsCYP2D6Monitoring = geneticData.variants.some(v => v.gene === 'CYP2D6');
      if (needsCYP2D6Monitoring) {
        requirements.push({
          type: 'Lab monitoring',
          test: 'Drug level testing',
          frequency: 'During initiation and dose adjustments',
          reason: 'CYP2D6 variant requires monitoring'
        });
      }
    }

    // Age-based monitoring
    if (demographics.age > 65) {
      requirements.push({
        type: 'Clinical monitoring',
        test: 'Adverse reaction screening',
        frequency: 'Monthly',
        reason: 'Advanced age increases risk'
      });
    }

    return requirements;
  }

  getLifestyleRecommendations(geneticData, demographics) {
    const recommendations = [];

    // Add genetic-based lifestyle recommendations
    if (geneticData.variants) {
      const needsDietaryAdjustment = geneticData.variants.some(v => 
        v.gene === 'MTHFR' || v.gene === 'APOE'
      );

      if (needsDietaryAdjustment) {
        recommendations.push({
          category: 'Diet',
          recommendation: 'Consider folate-rich diet or supplementation',
          reason: 'MTHFR variant may affect folate metabolism'
        });
      }
    }

    // General recommendations
    recommendations.push(
      {
        category: 'Medication adherence',
        recommendation: 'Maintain strict medication schedule',
        reason: 'Critical for personalized treatment success'
      },
      {
        category: 'Regular monitoring',
        recommendation: 'Schedule regular follow-ups',
        reason: 'Monitor treatment response and adjust as needed'
      }
    );

    return recommendations;
  }

  async enhanceWithAI(geneticData, basicAnalysis) {
    const providers = Object.keys(FREE_APIS);

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider} API for personalized medicine...`);

        const prompt = `
You are a pharmacogenomics expert. Analyze this genetic and medical data to provide personalized medicine insights:

Genetic Variants: ${JSON.stringify(geneticData.variants, null, 2)}

Basic Analysis: ${JSON.stringify(basicAnalysis, null, 2)}

Provide:
1. Key insights about genetic predispositions
2. Personalized treatment recommendations
3. Potential drug-gene interactions
4. Monitoring requirements
5. Risk assessments

Respond in JSON format:
{
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "risk_assessment": "overall risk level",
  "confidence": 0.95
}
        `;

        const response = await this.callFreeAPI(provider, prompt, {
          max_tokens: 1500,
          temperature: 0.2
        });

        console.log(`${provider} API successful for personalized medicine!`);
        
        try {
          return JSON.parse(response);
        } catch {
          return {
            insights: [response],
            recommendations: [],
            confidence: 0.7
          };
        }
      } catch (error) {
        console.log(`${provider} API failed for personalized medicine:`, error.message);
        continue;
      }
    }

    // Fallback if all APIs fail
    return {
      insights: ['AI analysis temporarily unavailable'],
      recommendations: [],
      confidence: 0.5
    };
  }

  async callFreeAPI(provider, prompt, options = {}) {
    const apiConfig = FREE_APIS[provider];
    if (!apiConfig) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    try {
      let requestBody;

      if (provider === 'huggingface') {
        requestBody = {
          inputs: prompt,
          parameters: {
            max_new_tokens: options.max_tokens || 1000,
            temperature: options.temperature || 0.3,
            return_full_text: false
          }
        };
      } else {
        requestBody = {
          model: apiConfig.model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.3
        };
      }

      const response = await axios.post(apiConfig.url, requestBody, {
        headers: apiConfig.headers,
        timeout: 30000
      });

      if (provider === 'huggingface') {
        return response.data[0]?.generated_text || response.data.generated_text || 'No response generated';
      } else {
        return response.data.choices[0]?.message?.content || 'No response generated';
      }
    } catch (error) {
      console.error(`${provider} API Error:`, error.response?.data || error.message);
      throw error;
    }
  }

  generateReport(analysis) {
    const report = {
      title: 'Personalized Medicine Report',
      generated_at: new Date().toISOString(),
      summary: analysis.summary,
      key_findings: [],
      recommendations: [],
      next_steps: []
    };

    // Extract key findings
    if (analysis.genetic_variants && analysis.genetic_variants.length > 0) {
      report.key_findings.push({
        category: 'Genetic Variants',
        findings: analysis.genetic_variants.map(v => v.gene)
      });
    }

    if (analysis.drug_response_predictions && analysis.drug_response_predictions.length > 0) {
      report.key_findings.push({
        category: 'Drug Response Predictions',
        findings: analysis.drug_response_predictions
      });
    }

    // Compile recommendations
    if (analysis.personalized_treatment_plan) {
      const plan = analysis.personalized_treatment_plan;
      
      if (plan.recommended_medications && plan.recommended_medications.length > 0) {
        report.recommendations.push({
          category: 'Medications',
          items: plan.recommended_medications
        });
      }

      if (plan.lifestyle_recommendations && plan.lifestyle_recommendations.length > 0) {
        report.recommendations.push({
          category: 'Lifestyle',
          items: plan.lifestyle_recommendations
        });
      }
    }

    // Generate next steps
    if (analysis.risk_factors && analysis.risk_factors.length > 0) {
      report.next_steps.push({
        action: 'Review risk factors with care team',
        priority: 'high',
        deadline: 'within 1 week'
      });
    }

    if (analysis.drug_response_predictions && analysis.drug_response_predictions.some(p => p.action_required)) {
      report.next_steps.push({
        action: 'Adjust medication dosages based on genetics',
        priority: 'high',
        deadline: 'immediate'
      });
    }

    return report;
  }
}

module.exports = new PersonalizedMedicineService();

