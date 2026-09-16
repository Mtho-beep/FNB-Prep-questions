import type { Question } from '../types/questions'

// 12 AI Ethics & Responsible AI questions.

export const ethicsQuestions: Question[] = [
  {
    id: 'eth-001',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Beginner',
    question: 'What are the risks of AI?',
    answer:
      "AI risks include bias in decision-making, hallucinated or incorrect output being trusted as fact, loss of privacy if systems collect or infer more than they should, reduced explainability making decisions hard to justify, and overreliance on automation in situations that genuinely need human judgement. In a banking context, the stakes are especially high because these risks can directly affect people's money and financial wellbeing.",
    keyPoints: [
      'Bias, hallucination, privacy loss, reduced explainability',
      'Overreliance on automation where human judgement is needed',
      'Stakes are especially high in banking due to direct financial impact',
    ],
    followUps: ['Which of these risks worries you most in a banking context specifically?', 'How would you rank these risks for the FNB project specifically?'],
    tags: ['ai-risk', 'ethics'],
  },
  {
    id: 'eth-002',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Beginner',
    question: 'What is AI bias?',
    answer:
      "AI bias is when a model's outputs systematically favour or disadvantage certain groups, usually because the data it was trained on reflected existing imbalances or historical inequities, rather than the model being deliberately unfair. For example, a credit risk model trained on historical lending data could inherit and perpetuate past discriminatory lending patterns if that history isn't carefully accounted for.",
    keyPoints: [
      'Systematic favouring/disadvantaging of certain groups in model output',
      'Usually stems from biased or unrepresentative training data',
      'Example: a credit model inheriting historical discriminatory lending patterns',
    ],
    followUps: ['How would you check whether a model has this kind of bias?', 'Is removing a protected attribute like race from the data enough to remove bias? Why or why not?'],
    tags: ['bias', 'ethics'],
  },
  {
    id: 'eth-003',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'How can AI become biased?',
    answer:
      "Bias usually creeps in through the training data — if certain groups are underrepresented, or if historical outcomes baked into the data reflect past discrimination, the model learns and reproduces those patterns. It can also come from proxy variables that correlate with a protected attribute even if that attribute isn't used directly, like a postal code correlating with race or income level, or from the way a problem is framed in the first place, like choosing a target variable that itself reflects biased historical decisions.",
    keyPoints: [
      'Underrepresentation or historically biased outcomes in training data',
      'Proxy variables correlating with protected attributes even when excluded directly',
      'Bias can also stem from how the problem/target variable is framed',
    ],
    followUps: ['Can you give an example of a proxy variable relevant to banking?', 'How would you test for proxy-variable bias in a model?'],
    tags: ['bias', 'ethics'],
  },
  {
    id: 'eth-004',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'How can bias be reduced?',
    answer:
      "I'd start with the data — checking for representativeness across relevant groups and being deliberate about what target variable and features are used, since biased framing at that stage is hard to fix later. I'd test model outputs across different demographic groups for disparities before deployment, not just overall performance, and keep humans in the loop for high-impact decisions rather than fully automating them. Ongoing monitoring after deployment matters too, since bias can emerge or shift over time even in a model that looked fair initially.",
    keyPoints: [
      'Check data representativeness and be deliberate about target/feature framing',
      'Test outputs across demographic groups for disparities, not just overall performance',
      'Keep humans in the loop for high-impact decisions and monitor ongoing bias after deployment',
    ],
    followUps: ['What specific metric would you use to measure fairness across groups?', 'What would you do if you found a disparity but could not immediately explain its cause?'],
    tags: ['bias', 'fairness'],
  },
  {
    id: 'eth-005',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'What is explainability?',
    answer:
      "Explainability is the ability to understand and articulate why an AI system produced a particular output or decision, rather than treating it as an opaque black box. In banking, this matters because customers and regulators are entitled to understand why a loan was declined or a transaction was flagged, and it's also just good engineering practice — if you can't explain a model's behaviour, it's much harder to trust or debug it.",
    keyPoints: [
      'Ability to understand and articulate why a model produced a given output',
      'Matters for regulatory and customer-trust reasons in banking',
      'Also aids debugging and engineering trust in the system generally',
    ],
    followUps: ['How does explainability trade off against model complexity/accuracy?', 'How would you explain a decision from a complex model to a customer in plain language?'],
    tags: ['explainability', 'ethics'],
  },
  {
    id: 'eth-006',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Beginner',
    question: 'What is responsible AI?',
    answer:
      "Responsible AI is the practice of designing, building, and deploying AI systems with deliberate attention to fairness, transparency, privacy, safety, and accountability — not just optimising for accuracy or speed. In practice, on the FNB project, that showed up as prioritising verification and read-only access over just making the pipeline fast, because getting it safe mattered more than getting it fast.",
    keyPoints: [
      'Deliberate attention to fairness, transparency, privacy, safety and accountability',
      'Goes beyond just optimising for accuracy or speed',
      'FNB example: prioritising verification/safety over raw speed',
    ],
    followUps: ['What would an irresponsible version of the FNB pipeline have looked like?', 'How do you balance responsible AI principles against tight deadlines?'],
    tags: ['responsible-ai', 'ethics'],
  },
  {
    id: 'eth-007',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Beginner',
    question: 'Why is privacy important?',
    answer:
      "Privacy matters because people have a right to control their own personal information and to trust that it won't be misused, exposed, or used to harm them. In banking specifically, financial data is deeply sensitive — it reveals spending habits, income, and life circumstances — so mishandling it can cause real harm, from identity theft to loss of trust in the institution, well beyond just a compliance checkbox.",
    keyPoints: [
      'People have a right to control their own personal information',
      'Financial data is especially sensitive, revealing habits, income, life circumstances',
      'Mishandling it causes real harm, not just a compliance/legal issue',
    ],
    followUps: ['How does this connect to the privacy concerns you raised about StudyTogether\'s computer vision feature?', 'What is the difference between privacy and security?'],
    tags: ['privacy', 'ethics'],
  },
  {
    id: 'eth-008',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'What is data leakage?',
    answer:
      "In the ethics context, data leakage can also refer to sensitive data being unintentionally exposed — for example, an LLM trained or fine-tuned on private data inadvertently revealing fragments of that data in its output to a different user. It's a genuine concern for any system handling banking data, which is part of why data minimisation and careful control over what an AI system actually has access to matters so much.",
    keyPoints: [
      'Sensitive data unintentionally exposed through a model\'s behaviour',
      'Example: fine-tuning on private data risking exposure in later output to others',
      'Reinforces the case for data minimisation and access control',
    ],
    followUps: ['How is this different from the ML-technical meaning of "data leakage" you covered elsewhere?', 'How would you prevent this specific kind of leakage if fine-tuning on customer data?'],
    tags: ['data-leakage', 'privacy'],
  },
  {
    id: 'eth-009',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Beginner',
    question: 'What is human-in-the-loop?',
    answer:
      "Human-in-the-loop means designing a system so a human reviews, approves, or can override an AI's output before it takes effect, rather than the AI acting fully autonomously. It's a core safeguard for high-stakes decisions — like a compliance officer reviewing an AI-flagged suspicious transaction before any account action is taken — balancing the efficiency AI provides with human judgement and accountability.",
    keyPoints: [
      'Human reviews, approves, or can override AI output before it takes effect',
      'Core safeguard for high-stakes decisions',
      'Balances AI efficiency with human judgement and accountability',
    ],
    followUps: ['How would you decide which decisions need this and which don\'t?', 'What is the risk of human-in-the-loop becoming just a rubber stamp?'],
    tags: ['human-in-the-loop', 'ethics'],
  },
  {
    id: 'eth-010',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'Should AI make high-impact decisions without humans?',
    answer:
      "I don't think it should, at least not yet, for decisions with serious consequences for someone's finances or access to services — like declining a loan or freezing an account. AI can do the heavy lifting of analysis and flagging, but a human should make or at least confirm the final call, both because AI can be wrong in ways that are hard to detect and because people deserve accountability and recourse from another person, not just an algorithm, when something this significant is on the line.",
    keyPoints: [
      'Generally no for decisions with serious consequences for someone\'s life/finances',
      'AI does the analysis/flagging; a human makes or confirms the final call',
      'People deserve accountability and recourse from a person, not just an algorithm',
    ],
    followUps: ['Are there any high-impact decisions where you would be comfortable with full automation?', 'How would you design the handoff between AI analysis and human decision-making?'],
    tags: ['human-in-the-loop', 'ethics'],
  },
  {
    id: 'eth-011',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'How would you handle an AI system making an incorrect decision?',
    answer:
      "First, there needs to be a clear, accessible way for the affected person to flag and dispute the decision, and a human process to actually review it, not just an automated re-check. Second, the incident should be logged and investigated to understand why it happened — was it a data issue, a model limitation, or a genuinely novel case — and that learning should feed back into improving the system. And the person affected should be treated fairly in the meantime, not left worse off while the investigation happens.",
    keyPoints: [
      'Clear, accessible dispute process leading to genuine human review',
      'Log and investigate root cause; feed learnings back into system improvement',
      'Treat the affected person fairly during the investigation, not just after',
    ],
    followUps: ['How would this apply concretely to a false fraud flag on the FNB pipeline?', 'How would you prevent the same mistake from recurring?'],
    tags: ['error-handling', 'ethics'],
  },
  {
    id: 'eth-012',
    category: 'AI Ethics & Responsible AI',
    difficulty: 'Intermediate',
    question: 'How would you design an ethical AI system?',
    answer:
      "I'd start by clearly defining what fairness, safety and privacy mean for the specific use case, not treating them as an afterthought bolted on at the end. Practically, that means representative and carefully considered data, independent verification for anything high-stakes, human review for high-impact decisions, transparency about what the system does and doesn't do, and ongoing monitoring after launch rather than a one-time ethics review before shipping. It's the same instinct that shaped both the FNB verification design and how I approached the privacy questions in StudyTogether — build the safeguards in from the start, not as a patch afterward.",
    keyPoints: [
      'Define fairness/safety/privacy requirements upfront, not as an afterthought',
      'Representative data, independent verification, human review for high-impact cases',
      'Transparency and ongoing monitoring, not a one-time pre-launch review',
    ],
    followUps: ['How did this actually show up in the FNB or StudyTogether project design?', 'What would you do if a deadline pressured you to skip one of these safeguards?'],
    tags: ['responsible-ai', 'design'],
  },
]
