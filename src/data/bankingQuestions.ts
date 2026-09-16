import type { Question } from '../types/questions'

// 17 AI + Banking questions.

export const bankingQuestions: Question[] = [
  {
    id: 'bank-001',
    category: 'AI + Banking',
    difficulty: 'Beginner',
    question: 'How can AI be used in banking?',
    answer:
      "AI shows up across a bank in several areas: fraud and anomaly detection on transactions, credit risk scoring, customer service through chatbots and virtual assistants, personalisation of product recommendations, document processing for things like loan applications, and, as in my FNB project, letting staff query data using natural language instead of writing SQL themselves. The common thread is using AI to either catch things humans would miss at scale, or to make interactions faster and more accessible.",
    keyPoints: [
      'Fraud detection, credit risk, customer service, personalisation, document processing',
      'Natural-language data querying, as in the FNB project',
      'Common goal: catch things at scale humans would miss, or make interactions faster',
    ],
    followUps: ['Which of these areas do you find most interesting, and why?', 'Which is closest to what you have actually built?'],
    tags: ['banking', 'ai'],
  },
  {
    id: 'bank-002',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How can AI detect fraud?',
    answer:
      "AI fraud detection typically works by learning what normal transaction behaviour looks like for a customer or across the whole customer base, then flagging transactions that deviate significantly from that pattern — unusual amounts, locations, timing, or merchant types. This can be done with supervised models trained on historically labelled fraud cases, or with anomaly detection approaches that don't need labelled fraud examples, instead flagging statistically unusual behaviour directly.",
    keyPoints: [
      'Learns normal transaction behaviour, flags significant deviations',
      'Signals: unusual amount, location, timing, merchant type',
      'Can use supervised learning (labelled fraud) or anomaly detection (unlabelled)',
    ],
    followUps: ['What would you do if you had very few labelled fraud examples to train on?', 'How would the model adapt as fraud tactics change over time?'],
    tags: ['fraud-detection', 'banking'],
  },
  {
    id: 'bank-003',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How would you build a fraud detection system?',
    answer:
      "I'd start by clearly defining what counts as fraud and gathering historical labelled examples where available, then engineer features that capture behaviour patterns — like transaction frequency, deviation from a customer's typical spending, and merchant risk profile. I'd train and evaluate a model using metrics suited to imbalanced data, like precision, recall and F1, not just accuracy, and build in a human review step for flagged transactions rather than fully automated blocking, at least initially, to catch false positives before they affect real customers.",
    keyPoints: [
      'Clear fraud definition, historical labelled data, and behaviour-based feature engineering',
      'Evaluation with precision/recall/F1 given severe class imbalance',
      'Human review step for flagged transactions rather than fully automatic blocking',
    ],
    followUps: ['What features would you prioritise engineering first?', 'How would you handle a customer disputing a fraud flag?'],
    tags: ['fraud-detection', 'system-design'],
  },
  {
    id: 'bank-004',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'What features could be used for fraud detection?',
    answer:
      "Useful features often include transaction amount relative to the customer's typical spending, transaction frequency in a short time window, geographic location compared to recent history, time of day, merchant category, and whether the transaction is a new payee or device. Combining several of these into a behaviour profile per customer tends to work much better than looking at any single feature in isolation, since fraud rarely shows up as one obviously wrong value.",
    keyPoints: [
      'Amount relative to typical spending, transaction frequency, location, time of day',
      'Merchant category, new payee/device signals',
      'Combining multiple features into a behaviour profile is more effective than any single feature',
    ],
    followUps: ['How would you build a "typical spending" baseline for each customer?', 'What is the risk of relying too heavily on location as a feature?'],
    tags: ['fraud-detection', 'feature-engineering'],
  },
  {
    id: 'bank-005',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'Why might accuracy be misleading for fraud detection?',
    answer:
      "Because fraud is rare compared to legitimate transactions, a model that just predicts 'not fraud' for everything can score extremely high accuracy while catching zero actual fraud — which is exactly backwards from what you'd want. That's why precision, recall and F1 matter more here: they specifically measure how well the model handles the rare, important class, rather than being dominated by the easy majority class.",
    keyPoints: [
      'Fraud is a rare class, so a trivial "always legitimate" model scores high accuracy',
      'High accuracy would hide that zero actual fraud is being caught',
      'Precision/recall/F1 specifically measure performance on the minority class that matters',
    ],
    followUps: ['What accuracy would a model achieve by always predicting "not fraud" if 0.5% of transactions are fraud?', 'What metric would you report to a non-technical stakeholder instead of accuracy?'],
    tags: ['fraud-detection', 'evaluation'],
  },
  {
    id: 'bank-006',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How would you handle false positives?',
    answer:
      "False positives in fraud detection mean flagging a genuine transaction as fraudulent, which frustrates customers and can damage trust if it happens too often. I'd tune the model's decision threshold based on the real business cost of a false positive versus a false negative, add a human review step for borderline cases rather than auto-blocking every flag, and give customers a fast, easy way to confirm a flagged transaction was actually theirs, so the inconvenience is minimised even when it happens.",
    keyPoints: [
      'Tune the decision threshold based on real business cost trade-offs',
      'Human review for borderline cases rather than fully automatic blocking',
      'Fast, easy customer confirmation flow to minimise inconvenience',
    ],
    followUps: ['How would you decide where to set the decision threshold?', 'What would you do if false positives were concentrated among a specific customer segment?'],
    tags: ['fraud-detection', 'false-positives'],
  },
  {
    id: 'bank-007',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How would you handle false negatives?',
    answer:
      "False negatives mean actual fraud slipped through undetected, which is often more costly than a false positive, so I'd generally accept somewhat more false positives to catch more real fraud, depending on the bank's risk tolerance. I'd also treat every confirmed false negative as valuable data — feeding it back into retraining so the model learns to catch similar patterns in future, and reviewing whether it reveals a whole class of fraud the current features don't capture well.",
    keyPoints: [
      'Often more costly than false positives, so may justify accepting more false positives to reduce them',
      'Feed confirmed false negatives back into retraining',
      'Review whether they reveal a feature gap or a genuinely new fraud pattern',
    ],
    followUps: ['How would you weigh the relative cost of a false negative versus a false positive in practice?', 'How often would you retrain the model based on new confirmed fraud cases?'],
    tags: ['fraud-detection', 'false-negatives'],
  },
  {
    id: 'bank-008',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How can AI help with credit risk?',
    answer:
      "AI models can estimate the likelihood a borrower will default by learning from historical data — income patterns, repayment history, and other financial behaviour — often catching more nuanced patterns than a simple, fixed scoring rule would. It's important that these models remain explainable in banking, since customers and regulators are entitled to understand why a credit decision was made, which is part of why simpler, more interpretable models are often preferred over black-box ones for this specific use case.",
    keyPoints: [
      'Estimates default likelihood from historical financial behaviour patterns',
      'Can capture more nuance than fixed, rule-based scoring',
      'Explainability matters a lot here for regulatory and customer-trust reasons',
    ],
    followUps: ['Why does explainability matter more for credit risk than for, say, fraud detection?', 'What model type would you choose to balance accuracy and explainability?'],
    tags: ['credit-risk', 'banking'],
  },
  {
    id: 'bank-009',
    category: 'AI + Banking',
    difficulty: 'Beginner',
    question: 'How can AI improve customer service?',
    answer:
      "AI chatbots and virtual assistants can handle routine queries instantly, any time of day, freeing human agents to focus on more complex or sensitive issues. AI can also help route queries to the right department faster, summarise a customer's history for an agent before a call, or suggest relevant responses to a support agent in real time. The key is using AI to support and speed up service, not to fully replace human judgement on sensitive or complex issues.",
    keyPoints: [
      'Chatbots handle routine queries instantly, freeing humans for complex issues',
      'Can assist routing, summarisation, and real-time agent suggestions',
      'Best used to support human agents, not fully replace judgement on complex cases',
    ],
    followUps: ['What kind of banking query would you never want a chatbot to handle alone?', 'How would you measure whether an AI customer service feature is actually working well?'],
    tags: ['customer-service', 'banking'],
  },
  {
    id: 'bank-010',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How can AI help detect suspicious transactions?',
    answer:
      "Beyond individual fraud detection, AI can look at patterns across many transactions and accounts to spot suspicious activity that wouldn't be obvious from any single transaction — like a series of small transfers designed to stay under reporting thresholds, or unusual activity linking accounts that don't normally interact. This kind of pattern-level analysis is harder to do manually at scale, which is where AI genuinely adds value beyond simple rule-based alerts.",
    keyPoints: [
      'Looks at patterns across many transactions/accounts, not just one at a time',
      'Example: structuring — many small transfers to avoid reporting thresholds',
      'Adds value where manual, rule-based review would not scale',
    ],
    followUps: ['What is "structuring" and why is it hard to detect with simple rules?', 'How would you validate that a detected pattern is genuinely suspicious and not coincidental?'],
    tags: ['suspicious-activity', 'banking'],
  },
  {
    id: 'bank-011',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How can AI help with AML?',
    answer:
      "For Anti-Money Laundering, AI can help by flagging complex, unusual transaction networks and patterns that suggest layering or structuring, prioritising which alerts a human compliance team should review first, and reducing the huge volume of false alerts that traditional rule-based AML systems tend to generate. It's a good fit here because the volume of transactions is far beyond what humans could review individually, but the final decisions on flagged cases still need human compliance expertise and sign-off.",
    keyPoints: [
      'Flags unusual transaction networks/patterns suggesting layering or structuring',
      'Prioritises alerts for human compliance review, reducing false-alert volume',
      'Final compliance decisions still require human expertise and sign-off',
    ],
    followUps: ['Why can\'t AI make the final AML compliance decision on its own?', 'What would "layering" look like in transaction data?'],
    tags: ['aml', 'banking'],
  },
  {
    id: 'bank-012',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How can AI personalize banking services?',
    answer:
      "AI can analyse a customer's transaction and product usage patterns to suggest genuinely relevant products or advice — like flagging that a customer could benefit from a savings product based on their spending patterns, rather than generic marketing. The key is doing this in a way that respects privacy and doesn't feel invasive; personalisation should feel helpful, based on data the customer has knowingly shared, not surveillance-like.",
    keyPoints: [
      'Analyses transaction/usage patterns for genuinely relevant suggestions',
      'Example: suggesting a savings product based on actual spending behaviour',
      'Must respect privacy and avoid feeling invasive or surveillance-like',
    ],
    followUps: ['How would you decide what counts as "too invasive" personalisation?', 'How would you measure whether a personalised recommendation was actually useful to the customer?'],
    tags: ['personalisation', 'banking'],
  },
  {
    id: 'bank-013',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How can AI process banking documents?',
    answer:
      "AI, particularly using OCR combined with NLP, can extract structured information from documents like ID documents, payslips, or loan application forms, turning unstructured paperwork into structured data that can feed directly into decision systems, dramatically speeding up processes like loan approvals that would otherwise involve manual data entry. It also reduces manual transcription errors, though it still needs a human review step for edge cases like poor scan quality or unusual document formats.",
    keyPoints: [
      'OCR plus NLP extracts structured data from unstructured documents',
      'Speeds up processes like loan approvals versus manual data entry',
      'Still needs human review for edge cases like poor scans or unusual formats',
    ],
    followUps: ['What would you do if the OCR extraction had low confidence on a specific field?', 'How does this connect to concepts like RAG if you wanted to answer questions about a document?'],
    tags: ['document-processing', 'banking'],
  },
  {
    id: 'bank-014',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'What risks does AI introduce into banking?',
    answer:
      "AI introduces risks like biased decision-making if trained on unrepresentative or historically biased data, hallucinated or incorrect outputs being trusted as fact, reduced explainability making it harder to justify decisions to regulators or customers, and new security surfaces like prompt injection for LLM-based systems. That's part of why the FNB project treats verification and read-only access as non-negotiable — the risks of an AI system touching sensitive banking data without those guardrails are simply too high.",
    keyPoints: [
      'Bias from unrepresentative training data',
      'Hallucinated output being trusted as fact, reduced explainability',
      'New security surfaces like prompt injection for LLM-based systems',
    ],
    followUps: ['Which of these risks did the FNB project specifically design around?', 'How would you communicate these risks to a non-technical stakeholder pushing for faster AI adoption?'],
    tags: ['ai-risk', 'banking'],
  },
  {
    id: 'bank-015',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How would you protect customer data?',
    answer:
      "I'd apply data minimisation — only collecting and exposing what's actually needed for a given task — plus encryption both at rest and in transit, strict access controls so only authorised systems and people can reach sensitive data, and masking sensitive fields in logs and non-production environments. For an AI system specifically, I'd also make sure any data sent to an LLM provider, if external, is handled according to the provider's data-handling guarantees, or kept fully in-house if that's not acceptable for regulated data.",
    keyPoints: [
      'Data minimisation, encryption at rest and in transit',
      'Strict access controls and masking sensitive data in logs/non-production environments',
      'Careful handling of any data sent to external LLM providers',
    ],
    followUps: ['What would concern you about sending banking data to a third-party LLM API?', 'How would you handle logging without accidentally exposing sensitive fields?'],
    tags: ['data-privacy', 'banking'],
  },
  {
    id: 'bank-016',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'How would you secure an AI system with access to banking data?',
    answer:
      "I'd apply the same layered approach we used on the FNB project: least-privilege access so the AI system only ever sees the data it strictly needs, read-only access where write access isn't required, independent verification of AI-generated actions before they're executed, strong authentication for anything that can trigger the system, and thorough logging so any incident can be investigated after the fact. None of these alone is sufficient, but together they significantly reduce the blast radius of any single failure.",
    keyPoints: [
      'Least-privilege and read-only access where possible',
      'Independent verification of AI-generated actions before execution',
      'Strong authentication and thorough logging for incident investigation',
    ],
    followUps: ['Which of these layers do you think matters most, and why?', 'How would this change if the AI system needed write access for a legitimate reason?'],
    tags: ['security', 'banking'],
  },
  {
    id: 'bank-017',
    category: 'AI + Banking',
    difficulty: 'Intermediate',
    question: 'When should humans be involved in banking AI decisions?',
    answer:
      "Humans should stay involved whenever a decision has a significant impact on a customer's finances or access to services — like declining a loan, freezing an account for suspected fraud, or any high-value or unusual transaction. Lower-stakes, easily reversible, routine decisions can reasonably be automated. The general principle I'd apply is: the more impactful and harder to reverse a decision is, the more a human needs to be in the loop before it's finalised.",
    keyPoints: [
      'Human involvement scales with the impact and reversibility of the decision',
      'High-stakes examples: loan declines, account freezes, high-value/unusual transactions',
      'Lower-stakes, easily reversible decisions can reasonably be automated',
    ],
    followUps: ['Where would you draw the line for the FNB pipeline specifically?', 'How would you design the human review step to not become a bottleneck?'],
    tags: ['human-in-the-loop', 'banking'],
  },
]
