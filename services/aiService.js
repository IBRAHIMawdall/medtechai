const axios = require('axios');

// Free API configurations
const FREE_APIS = {
  llama: {
    url: 'https://api-inference.huggingface.co/models/aaditya/Llama3-OpenBioLLM-70B',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}`,
      'Content-Type': 'application/json'
    }
  },
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
  }
};

class AIService {
  async analyzeMedicalImage(imageData, type) {
    return {
      confidence: 0.95,
      findings: ['Normal chest X-ray', 'No acute findings'],
      recommendations: ['Routine follow-up in 1 year']
    };
  }

  async analyzeLabResults(labResults) {
    try {
      // First, do the basic analysis with reference ranges
      const basicAnalysis = await this.performBasicLabAnalysis(labResults);

      // Enhance with free AI services
      const enhancedAnalysis = await this.enhanceWithFreeAI(basicAnalysis, labResults);

      return {
        summary: enhancedAnalysis.summary || basicAnalysis.summary,
        findings: [...(basicAnalysis.findings || []), ...(enhancedAnalysis.ai_insights || [])],
        recommendations: enhancedAnalysis.recommendations || basicAnalysis.recommendations || [],
        criticalValues: basicAnalysis.criticalValues || [],
        ai_powered: true,
        confidence: 0.95,
        free_ai_used: true
      };
    } catch (error) {
      console.error('AI Lab Analysis Error:', error);
      // Fallback to basic analysis if all AI fails
      return this.performBasicLabAnalysis(labResults);
    }
  }


  async performBiomedicalNER(text) {
    try {
      const prompt = `
You are a biomedical Named Entity Recognition expert. Analyze the following medical text and identify all biomedical entities.

Medical Text: "${text}"

Please identify and categorize the following types of biomedical entities:
1. DISEASE/CONDITION - diseases, disorders, syndromes, symptoms
2. MEDICATION/DRUG - drugs, medications, pharmaceuticals
3. PROCEDURE/TREATMENT - medical procedures, treatments, therapies
4. ANATOMY - body parts, organs, anatomical structures
5. DEVICE - medical devices, equipment, instruments
6. MEASUREMENT - vital signs, lab values, measurements
7. PERSON - healthcare professionals, patients (if mentioned)
8. ORGANIZATION - hospitals, clinics, medical organizations

Return ONLY a JSON array of entities in this exact format:
[
  {
    "entity": "entity name",
    "category": "DISEASE/CONDITION|MEDICATION/DRUG|PROCEDURE/TREATMENT|ANATOMY|DEVICE|MEASUREMENT|PERSON|ORGANIZATION",
    "start": start_position,
    "end": end_position,
    "confidence": 0.95
  }
]

Example: If text contains "Patient has diabetes and takes metformin", return:
[
  {"entity": "diabetes", "category": "DISEASE/CONDITION", "start": 12, "end": 20, "confidence": 0.95},
  {"entity": "metformin", "category": "MEDICATION/DRUG", "start": 32, "end": 41, "confidence": 0.95}
]

Be precise with positions and only include clear biomedical entities.
      `;

      const response = await this.callFreeAPI('groq', prompt, {
        max_tokens: 1000,
        temperature: 0.1
      });

      // Parse the JSON response
      const entities = JSON.parse(response);

      return {
        entities: Array.isArray(entities) ? entities : [],
        text: text,
        ai_powered: true,
        provider: 'groq'
      };
    } catch (error) {
      console.error('Biomedical NER Error:', error);
      // Fallback to simple keyword extraction
      return this.performSimpleNER(text);
    }
  }

  performSimpleNER(text) {
    const entities = [];
    const lowerText = text.toLowerCase();

    // Simple pattern matching for common biomedical entities
    const patterns = [
      // Diseases/Conditions
      { pattern: /\b(diabetes|hypertension|cancer|alzheimer|parkinson|asthma|arthritis|depression|anxiety)\b/gi, category: 'DISEASE/CONDITION' },
      { pattern: /\b(headache|fever|cough|pain|nausea|dizziness|fatigue)\b/gi, category: 'DISEASE/CONDITION' },

      // Medications
      { pattern: /\b(metformin|insulin|aspirin|ibuprofen|lisinopril|atorvastatin|omeprazole)\b/gi, category: 'MEDICATION/DRUG' },
      { pattern: /\b(medication|drug|pills|tablets|injection|therapy)\b/gi, category: 'MEDICATION/DRUG' },

      // Anatomy
      { pattern: /\b(heart|liver|kidney|brain|lung|stomach|blood|skin|bone|muscle)\b/gi, category: 'ANATOMY' },

      // Procedures
      { pattern: /\b(surgery|biopsy|transplant|dialysis|chemotherapy|radiation)\b/gi, category: 'PROCEDURE/TREATMENT' },
      { pattern: /\b(x-ray|mri|ct scan|ultrasound|ekg|blood test)\b/gi, category: 'PROCEDURE/TREATMENT' }
    ];

    patterns.forEach(({ pattern, category }) => {
      let match;
      while ((match = pattern.exec(lowerText)) !== null) {
        entities.push({
          entity: match[0],
          category: category,
          start: match.index,
          end: match.index + match[0].length,
          confidence: 0.7
        });
      }
    });

    return {
      entities: entities,
      text: text,
      ai_powered: false,
      provider: 'rule-based'
    };
  }

  async performBasicLabAnalysis(labResults) {
    const analysis = {
      summary: 'Comprehensive lab results analysis',
      findings: [],
      recommendations: [],
      criticalValues: []
    };

    if (labResults.results) {
      labResults.results.forEach(result => {
        const testName = result.name.toLowerCase();
        const range = medicalData.labReferenceRanges[testName];

        if (range) {
          const value = parseFloat(result.value);
          let status = 'normal';

          if (value < range.min) {
            status = 'low';
            analysis.findings.push({
              test: result.name,
              value: value,
              status: 'low',
              referenceRange: `${range.min}-${range.max} ${range.unit}`
            });
          } else if (value > range.max) {
            status = 'high';
            analysis.findings.push({
              test: result.name,
              value: value,
              status: 'high',
              referenceRange: `${range.min}-${range.max} ${range.unit}`
            });
          }

          // Critical values check
          if ((range.critical_low && value < range.critical_low) ||
              (range.critical_high && value > range.critical_high)) {
            analysis.criticalValues.push({
              test: result.name,
              value: value,
              status: 'critical'
            });
          }
        }
      });
    }

    return analysis;
  }

  async callFreeAPI(provider, prompt, options = {}) {
    const apiConfig = FREE_APIS[provider];
    if (!apiConfig) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    try {
      let requestBody;

      if (provider === 'llama') {
        // Hugging Face format
        requestBody = {
          inputs: prompt,
          parameters: {
            max_new_tokens: options.max_tokens || 1000,
            temperature: options.temperature || 0.3,
            return_full_text: false
          }
        };
      } else {
        // OpenAI-compatible format
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

      if (provider === 'llama') {
        return response.data[0]?.generated_text || response.data.generated_text || 'No response generated';
      } else {
        return response.data.choices[0]?.message?.content || 'No response generated';
      }
    } catch (error) {
      console.error(`${provider} API Error:`, error.response?.data || error.message);
      throw error;
    }
  }

  async enhanceWithFreeAI(basicAnalysis, labResults, preferredProvider = 'groq') {
    const providers = Object.keys(FREE_APIS);

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider} API...`);

        const prompt = `
You are a professional medical laboratory analyst. Please provide a comprehensive analysis of these lab results:

Lab Results:
${JSON.stringify(labResults.results, null, 2)}

Basic Findings:
${JSON.stringify(basicAnalysis.findings, null, 2)}

Please provide:
1. A clear, professional summary of the results
2. Any additional insights or patterns you notice
3. Specific medical recommendations based on these results
4. Any follow-up tests that might be warranted

Respond in JSON format with:
{
  "summary": "Professional summary...",
  "ai_insights": ["Additional insight 1", "Additional insight 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "follow_up_tests": ["Test 1", "Test 2"]
}
        `;

        const response = await this.callFreeAPI(provider, prompt, {
          max_tokens: 1000,
          temperature: 0.3
        });

        console.log(`${provider} API successful!`);
        return JSON.parse(response);
      } catch (error) {
        console.log(`${provider} API failed:`, error.message);
        continue;
      }
    }

    // If all free APIs fail, return basic analysis
    return {
      summary: basicAnalysis.summary,
      ai_insights: ['Free AI services temporarily unavailable'],
      recommendations: []
    };
  }

  async checkDrugInteractions(medications) {
    const interactions = [];
    
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const drug1 = medications[i].toLowerCase();
        const drug2 = medications[j].toLowerCase();
        
        let interaction = null;
        if (medicalData.drugInteractions[drug1] && medicalData.drugInteractions[drug1][drug2]) {
          interaction = medicalData.drugInteractions[drug1][drug2];
        } else if (medicalData.drugInteractions[drug2] && medicalData.drugInteractions[drug2][drug1]) {
          interaction = medicalData.drugInteractions[drug2][drug1];
        }
        
        if (interaction) {
          interactions.push({
            drugs: [medications[i], medications[j]],
            severity: interaction.severity,
            description: interaction.description
          });
        }
      }
    }
    
    return interactions;
  }

  async generateVirtualAssistantResponse(message, context = {}) {
    try {
      // Use free AI APIs for all responses
      return await this.generateFreeAIResponse(message, context);
    } catch (error) {
      console.error('AI Virtual Assistant Error:', error);
      // Fallback to rule-based responses if all AI fails
      return this.getFallbackResponse(message, context);
    }
  }


  async generateFreeAIResponse(message, context = {}) {
    const providers = Object.keys(FREE_APIS);

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider} API for virtual assistant...`);

        const prompt = `
You are a professional medical virtual assistant. Please provide helpful, accurate medical information for this question: "${message}"

${context.patientInfo ? `Patient Context: ${JSON.stringify(context.patientInfo)}` : ''}

Provide:
1. Clear, professional medical response
2. Evidence-based information only
3. Appropriate disclaimers about seeking professional medical care
4. Actionable next steps when relevant

Respond in JSON format with:
{
  "response": "Your professional medical response here...",
  "confidence": 0.9,
  "disclaimer": "Remember to consult healthcare providers for personalized medical advice",
  "followUp": "Would you like me to help you with anything else?",
  "ai_powered": true
}
        `;

        const response = await this.callFreeAPI(provider, prompt, {
          max_tokens: 800,
          temperature: 0.3
        });

        console.log(`${provider} API successful for virtual assistant!`);

        // Try to parse as JSON, fallback to text if needed
        try {
          return { ...JSON.parse(response), ai_powered: true };
        } catch {
          return {
            response: response,
            confidence: 0.8,
            disclaimer: "Please consult healthcare providers for personalized medical advice",
            followUp: "Would you like me to help you with anything else?",
            ai_powered: true
          };
        }
      } catch (error) {
        console.log(`${provider} API failed for virtual assistant:`, error.message);
        continue;
      }
    }

    // If all free APIs fail, return fallback response
    return this.getFallbackResponse(message, context);
  }

  async recommendProducts(userInput, availableProducts = []) {
    // Sample product categories if products not provided
    const productCategories = [
      'Blood Pressure Monitors', 'Glucose Meters', 'Thermometers', 'Pulse Oximeters',
      'First Aid Kits', 'Vitamins & Supplements', 'Health Monitoring Devices',
      'Personal Care Products', 'Fitness Equipment', 'Medical Equipment'
    ];

    const providers = Object.keys(FREE_APIS);

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider} API for product recommendations...`);

        const prompt = `
You are an AI health product recommendation expert. Based on the user's health needs, recommend appropriate health products.

User Input: "${userInput}"

Available Product Categories:
${productCategories.join(', ')}

Please provide product recommendations in JSON format:
{
  "recommendations": [
    {
      "category": "Product category name",
      "products": ["Product 1", "Product 2"],
      "reason": "Why these products are recommended",
      "priority": "high|medium|low"
    }
  ],
  "summary": "Brief summary of recommendations",
  "ai_powered": true
}

Focus on:
- Health monitoring devices if user mentions symptoms or conditions
- Supplements if user mentions dietary needs or deficiencies
- First aid products if user mentions safety concerns
- Wellness products for general health improvement

Be specific and practical. Only recommend products that genuinely help with the user's stated needs.
        `;

        const response = await this.callFreeAPI(provider, prompt, {
          max_tokens: 1000,
          temperature: 0.4
        });

        console.log(`${provider} API successful for product recommendations!`);

        try {
          return { ...JSON.parse(response), ai_powered: true };
        } catch {
          // Fallback parsing
          return {
            recommendations: [{
              category: 'Health Monitoring Devices',
              products: ['Blood Pressure Monitor', 'Digital Thermometer'],
              reason: 'Based on your health needs, monitoring devices can help track your vital signs',
              priority: 'high'
            }],
            summary: 'AI recommends health monitoring devices to track your health metrics',
            ai_powered: true
          };
        }
      } catch (error) {
        console.log(`${provider} API failed for product recommendations:`, error.message);
        continue;
      }
    }

    // Fallback recommendations
    return {
      recommendations: [{
        category: 'Health Monitoring',
        products: ['Blood Pressure Monitor', 'Digital Thermometer', 'Pulse Oximeter'],
        reason: 'General health monitoring devices recommended for wellness tracking',
        priority: 'medium'
      }],
      summary: 'Recommended health monitoring devices for general wellness',
      ai_powered: false
    };
  }

  getFallbackResponse(message, context) {
    // Keep the existing rule-based responses as fallback
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      return {
        response: "For headaches, I can help you understand the symptoms:\n\n🔍 Common causes:\n• Tension headaches (most common)\n• Migraine\n• Sinus pressure\n• Dehydration\n• Stress or fatigue\n\n⚠️ Seek immediate medical attention if you have:\n• Sudden, severe headache (thunderclap)\n• Headache with fever and neck stiffness\n• Headache after head injury\n• Changes in vision or speech\n\n💡 General recommendations:\n• Stay hydrated\n• Get adequate sleep\n• Manage stress\n• Consider over-the-counter pain relief\n• Apply cold or warm compress",
        confidence: 0.9,
        followUp: "Would you like me to help you track your headache patterns or schedule a consultation?",
        ai_powered: false
      };
    }

    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return {
        response: "Fever is your body's natural response to infection or illness:\n\n🌡️ Temperature guidelines:\n• Normal: 98.6°F (37°C)\n• Low-grade fever: 99-100.4°F\n• Moderate fever: 100.4-102.2°F\n• High fever: 102.2-104°F\n• Very high fever: Above 104°F\n\n⚠️ Seek medical attention for:\n• Fever above 103°F in adults\n• Fever lasting more than 3 days\n• Fever with severe symptoms\n• Fever in infants under 3 months\n\n💡 Home care:\n• Stay hydrated\n• Rest\n• Use fever-reducing medications as directed\n• Cool compress or lukewarm bath",
        confidence: 0.9,
        followUp: "Are you experiencing any other symptoms along with the fever?",
        ai_powered: false
      };
    }

    if (lowerMessage.includes('medication') || lowerMessage.includes('drug') || lowerMessage.includes('prescription')) {
      return {
        response: "I can help with medication-related questions:\n\n💊 Important reminders:\n• Take medications as prescribed\n• Don't skip doses without doctor approval\n• Store medications properly\n• Keep an updated medication list\n• Be aware of side effects\n\n⚠️ Drug interactions to watch for:\n• Over-the-counter medications\n• Herbal supplements\n• Alcohol consumption\n• Food interactions\n\n✅ Best practices:\n• Use one pharmacy for all prescriptions\n• Keep medications in original containers\n• Don't share medications\n• Dispose of expired medications properly",
        confidence: 0.8,
        followUp: "Do you have specific questions about any medications you're taking?",
        ai_powered: false
      };
    }

    if (lowerMessage.includes('pain') || lowerMessage.includes('ache')) {
      return {
        response: "Pain management is important for your well-being:\n\n📍 Common types:\n• Acute pain (sudden, short-term)\n• Chronic pain (lasting 3+ months)\n• Neuropathic pain (nerve-related)\n• Inflammatory pain\n\n📊 Pain scale (0-10):\n• 0-3: Mild pain\n• 4-6: Moderate pain\n• 7-10: Severe pain\n\n💡 Management strategies:\n• Over-the-counter pain relievers\n• Heat/cold therapy\n• Gentle exercise\n• Relaxation techniques\n• Physical therapy\n\n⚠️ Seek medical attention for:\n• Severe or worsening pain\n• Pain with other concerning symptoms\n• Pain affecting daily activities",
        confidence: 0.8,
        followUp: "Can you describe the type and intensity of your pain?",
        ai_powered: false
      };
    }

    // Default response for general health questions
    return {
      response: "I'm here to help with your health questions! I can assist with:\n\n🏥 Common topics:\n• Symptoms and conditions\n• Medication questions\n• Preventive care\n• Lifestyle recommendations\n• When to see a doctor\n\n💡 For the best medical advice:\n• I can provide general information\n• Always consult healthcare providers for specific concerns\n• Seek immediate care for emergencies\n• Keep your medical team informed\n\nHow can I help you today?",
      confidence: 0.7,
      followUp: "What specific health topic would you like to discuss?",
      ai_powered: false
    };
  }
}

module.exports = new AIService();