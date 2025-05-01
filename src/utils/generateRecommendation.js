import OpenAI from 'openai';

// המלצות גנריות לפי תחום
const genericRecommendations = {
  "חברות תוכנה / SaaS / טכנולוגיה": {
    opening: "כחברה טכנולוגית, חשוב לשלב בין בניית מותג חזק לבין תוצאות מדידות.",
    tips: [
      "השקיעו בתוכן מקצועי שיעזור לבנות סמכות בתחום",
      "השתמשו בפרפורמנס כדי למדוד ולשפר את המרות",
      "בנו קהילה של משתמשים נאמנים"
    ],
    closing: "המשיכו לשלב הבא כדי לקבל המלצות מפורטות יותר."
  },
  "קמעונאות אונליין": {
    opening: "כקמעונאי אונליין, האיזון בין מותג לפרפורמנס הוא קריטי.",
    tips: [
      "השקיעו בבניית חוויית משתמש מעולה",
      "השתמשו בפרפורמנס כדי למדוד ולשפר את המרות",
      "בנו תוכנית נאמנות לקוחות"
    ],
    closing: "המשיכו לשלב הבא כדי לקבל המלצות מפורטות יותר."
  },
  "שירותים פיננסיים": {
    opening: "בתחום הפיננסים, אמון ובניית מותג הם קריטיים.",
    tips: [
      "השקיעו בתוכן מקצועי שיבנה אמון",
      "השתמשו בפרפורמנס כדי למדוד ולשפר את המרות",
      "בנו מערכת יחסים ארוכת טווח עם הלקוחות"
    ],
    closing: "המשיכו לשלב הבא כדי לקבל המלצות מפורטות יותר."
  },
  "אחר": {
    opening: "כעסק, חשוב למצוא את האיזון הנכון בין בניית מותג להשגת תוצאות מיידיות.",
    tips: [
      "השקיעו בבניית זהות מותג ברורה",
      "השתמשו בפרפורמנס כדי למדוד ולשפר את המרות",
      "בנו מערכת יחסים ארוכת טווח עם הלקוחות"
    ],
    closing: "המשיכו לשלב הבא כדי לקבל המלצות מפורטות יותר."
  }
};

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

export const generatePersonalizedRecommendation = async (industry, baseRecommendation) => {
  // אם אין מפתח API או שיש שגיאה בהתחברות, נחזיר המלצה גנרית
  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY) {
    console.log('Using generic recommendation due to missing OpenAI configuration');
    return genericRecommendations[industry] || genericRecommendations["אחר"];
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "אתה מומחה לשיווק דיגיטלי שמסייע לעסקים להחליט על אסטרטגיית שיווק. תן המלצות מקצועיות ומותאמות אישית."
        },
        {
          role: "user",
          content: `אתה מומחה לשיווק דיגיטלי. 
          עסק בתחום ${industry} בחר להשקיע ${baseRecommendation.percentage}% מהמחזור שלו בשיווק.
          ההמלצה הבסיסית היא: ${baseRecommendation.note}
          הטיפים הבסיסיים הם: ${baseRecommendation.tips.join(', ')}
          
          אנא צור המלצה מותאמת אישית לעסק הזה, שתכלול:
          1. משפט פתיחה אישי שמתייחס לתחום העסק
          2. 2-3 טיפים ספציפיים לתחום
          3. משפט סיום שמעודד את המשתמש להמשיך לשלב הבא
          
          החזר את התשובה בפורמט JSON:
          {
            "opening": "משפט הפתיחה",
            "tips": ["טיפ 1", "טיפ 2", "טיפ 3"],
            "closing": "משפט הסיום"
          }`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating recommendation:', error);
    // החזרת המלצה גנרית לפי תחום, או המלצה כללית אם התחום לא נמצא
    return genericRecommendations[industry] || genericRecommendations["אחר"];
  }
}; 