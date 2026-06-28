export const hi = {
  appName: "हिसाब-खाता",
  appTagline: "ऋण ब्याज बही",

  modeTab1: "तिथि सीमा",
  modeTab2: "किस्त / आंशिक भुगतान",

  // ── Shared form fields ──
  principalLabel: "मूल राशि",
  principalPlaceholder: "उदा. 10000",
  rateLabel: "ब्याज दर (प्रति माह)",
  rateDefault: "2.25% (डिफ़ॉल्ट)",
  rateAlt: "1.75%",
  rateManual: "अन्य",
  rateManualPlaceholder: "दर % दर्ज करें",
  startDateLabel: "प्रारंभ तिथि",
  endDateLabel: "अंतिम तिथि",
  asOfDateLabel: "इस तिथि तक गणना करें",
  selected: "चयनित",
  calculateBtn: "गणना करें",
  recalculate: "पुनः गणना करें",

  // ── Mode 2 specific ──
  paymentsHeading: "प्राप्त आंशिक भुगतान",
  paymentDateLabel: "भुगतान तिथि",
  paymentAmountLabel: "भुगतान राशि",
  addPayment: "+ भुगतान जोड़ें",
  removePayment: "हटाएं",
  noPayments: "अभी तक कोई आंशिक भुगतान नहीं जोड़ा गया। नीचे जोड़ें, या केवल ब्याज देखने के लिए खाली छोड़ दें।",

  // ── Results ──
  resultsHeading: "परिणाम",
  totalAmountPayable: "कुल देय राशि",
  outstandingAmount: "बकाया राशि (चयनित तिथि तक)",
  totalInterest: "कुल ब्याज",
  totalDays: "कुल दिन",
  totalPaidSoFar: "अब तक भुगतान की गई राशि",
  originalPrincipal: "मूल राशि (प्रारंभिक)",
  minDaysNote: "न्यूनतम 15-दिन ब्याज नियम लागू",
  daysShort: "दिन",

  breakdownHeading: "पूरा ब्योरा (हर खंड की समीक्षा करें)",
  colPeriod: "अवधि",
  colDays: "दिन",
  colOpeningPrincipal: "प्रारंभिक मूल राशि",
  colDailyInterest: "दैनिक ब्याज",
  colInterest: "ब्याज",
  colEvent: "घटना",
  colClosing: "अंतिम शेष",
  eventFold: "1-वर्ष चक्रवृद्धि",
  eventPayment: "भुगतान प्राप्त हुआ",
  eventFinal: "अंतिम / गणना तिथि",
  yearEndLabel: "वर्ष की समाप्ति",
  foldExplain: "इस अवधि का ब्याज मूल राशि में जोड़ा गया (चक्रवृद्धि)",
  paymentExplain: "भुगतान किया गया — शेष राशि से घटाया गया",

  // ── Info / help ──
  howItWorksTitle: "गणना कैसे की जाती है",
  howItWorksBody:
    "ब्याज = मूल राशि × दर × दिन ÷ 30 (30-दिन का माह मानकर)। 15 दिन से कम की किसी भी अवधि पर भी न्यूनतम 15 दिनों का ब्याज लगाया जाता है। यदि ऋण 365 दिनों से अधिक चलता है, तो हर 365-दिन के खंड में अर्जित ब्याज अगले खंड से पहले मूल राशि में जोड़ दिया जाता है (चक्रवृद्धि ब्याज)। किस्त ट्रैकर में, हर भुगतान पहले तब तक के ब्याज का निपटारा करता है, फिर मूल राशि को घटाता है — और उस भुगतान की तिथि से 365-दिन की चक्रवृद्धि घड़ी फिर से शुरू हो जाती है।",

  errEndBeforeStart: "अंतिम तिथि प्रारंभ तिथि के बाद या उसी दिन होनी चाहिए।",
  errInvalidPrincipal: "कृपया 0 से अधिक मान्य मूल राशि दर्ज करें।",
  errInvalidRate: "कृपया 0 से अधिक मान्य ब्याज दर दर्ज करें।",
  errInvalidDates: "कृपया प्रारंभ और अंतिम दोनों तिथियां चुनें।",
  errPaymentDateRange: "भुगतान तिथियां प्रारंभ तिथि और गणना-तिथि के बीच होनी चाहिए।",

  footerNote: "सभी गणनाएं आपके ब्राउज़र में ही होती हैं — कुछ भी कहीं अपलोड नहीं होता।",
  languageToggle: "English",
};
