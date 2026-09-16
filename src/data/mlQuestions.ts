import type { Question } from '../types/questions'

// 25 Machine Learning questions covering data splitting, evaluation
// metrics, bias/variance, and practical model-improvement questions.

export const mlQuestions: Question[] = [
  {
    id: 'ml-001',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is a training dataset?',
    answer:
      "The training dataset is the portion of your data that the model actually learns from — it adjusts its internal parameters based on patterns found in this data. It needs to be large and representative enough that the model learns genuine patterns rather than quirks specific to a small sample.",
    keyPoints: [
      'The data the model directly learns/adjusts its parameters from',
      'Needs to be representative of the real problem',
      'Distinct from validation and test data, which are held back',
    ],
    followUps: ['What could go wrong if your training data is not representative?', 'What proportion of data would you typically use for training?'],
    tags: ['training-data', 'ml'],
  },
  {
    id: 'ml-002',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is a validation dataset?',
    answer:
      "The validation dataset is a separate portion of data used during development to tune the model — like choosing hyperparameters or deciding when to stop training — without touching the final test set. It gives you an honest signal of how changes are affecting performance on data the model hasn't directly learned from, while still keeping the test set completely untouched for the final evaluation.",
    keyPoints: [
      'Used during development for tuning decisions, not final evaluation',
      'Kept separate from training data so it reflects unseen-data performance',
      'Different from the test set, which is reserved for the final check',
    ],
    followUps: ['What happens if you tune too aggressively based on the validation set?', 'How is cross-validation related to a validation set?'],
    tags: ['validation-data', 'ml'],
  },
  {
    id: 'ml-003',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is a test dataset?',
    answer:
      "The test dataset is a held-out portion of data that the model never sees during training or tuning, used only once at the end to give an honest, final estimate of how the model will perform on genuinely new data. If you use it to make any decisions during development, it stops being a fair test, because you'd effectively be tuning to it, the same way studying the actual exam questions beforehand would defeat the purpose of the exam.",
    keyPoints: [
      'Held out entirely from training and tuning',
      'Used once, at the end, for a final honest performance estimate',
      'Using it during development invalidates it as a fair test',
    ],
    followUps: ['What would you do if your test set performance was much worse than validation performance?', 'How often should you look at the test set during a project?'],
    tags: ['test-data', 'ml'],
  },
  {
    id: 'ml-004',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'Why do we split data?',
    answer:
      "We split data so we can honestly measure how well a model generalises to data it hasn't seen, rather than just how well it memorised the data it was trained on. Without a proper split, you'd have no way to detect overfitting — the model could look perfect on paper while actually being useless on new, real-world data, which is exactly the kind of failure that matters most in a production setting.",
    keyPoints: [
      'Allows honest measurement of generalisation, not memorisation',
      'Without a split, overfitting would go undetected',
      'Directly protects against deploying a model that looks good but fails in production',
    ],
    followUps: ['What is a common split ratio, and does it depend on dataset size?', 'What is time-based splitting, and when would you need it instead of random splitting?'],
    tags: ['data-splitting', 'ml'],
  },
  {
    id: 'ml-005',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is accuracy?',
    answer:
      "Accuracy is the proportion of predictions a model got correct out of all predictions made — correct predictions divided by total predictions. It's simple and intuitive, but it can be misleading on imbalanced datasets, like fraud detection, where the vast majority of transactions are legitimate, so a model that just predicts 'not fraud' every time can still score a very high accuracy while being completely useless.",
    keyPoints: [
      'Correct predictions divided by total predictions',
      'Simple and intuitive but can be misleading',
      'Especially misleading on imbalanced datasets like fraud detection',
    ],
    followUps: ['What metric would you use instead of accuracy for an imbalanced dataset?', 'What accuracy would a model get by always predicting "not fraud" if 1% of transactions are fraud?'],
    tags: ['accuracy', 'evaluation'],
  },
  {
    id: 'ml-006',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is precision?',
    answer:
      "Precision measures, out of everything the model flagged as positive, how many were actually correct — true positives divided by (true positives plus false positives). In fraud detection, high precision means when the model flags a transaction as fraud, it's usually right, which matters because low precision means you're constantly bothering genuine customers with false fraud alerts.",
    keyPoints: [
      'Precision = true positives / (true positives + false positives)',
      'Answers: of everything flagged positive, how much was actually correct',
      'Low precision in fraud detection means many false alarms on genuine customers',
    ],
    followUps: ['When would you prioritise precision over recall?', 'How does precision relate to false positives specifically?'],
    tags: ['precision', 'evaluation'],
  },
  {
    id: 'ml-007',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is recall?',
    answer:
      "Recall measures, out of all the actual positive cases that exist, how many the model correctly caught — true positives divided by (true positives plus false negatives). In fraud detection, high recall means the model catches most actual fraud, which matters because low recall means real fraud is slipping through undetected, which can be costly and damaging to trust.",
    keyPoints: [
      'Recall = true positives / (true positives + false negatives)',
      'Answers: of all actual positives, how many did the model catch',
      'Low recall in fraud detection means real fraud goes undetected',
    ],
    followUps: ['When would you prioritise recall over precision?', 'Can you have perfect recall trivially? How, and why is that not useful?'],
    tags: ['recall', 'evaluation'],
  },
  {
    id: 'ml-008',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is F1-score?',
    answer:
      "The F1-score is the harmonic mean of precision and recall, giving you a single number that balances both rather than optimising for just one. It's especially useful when you care about both false positives and false negatives and don't want to pick one metric to the exclusion of the other, which is common in fraud detection where both bothering customers and missing fraud have real costs.",
    keyPoints: [
      'Harmonic mean of precision and recall',
      'Balances both metrics into a single number',
      'Useful when both false positives and false negatives carry real costs',
    ],
    followUps: ['Why use a harmonic mean instead of a simple average?', 'What is F-beta, and when would you use it instead of F1?'],
    tags: ['f1-score', 'evaluation'],
  },
  {
    id: 'ml-009',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is a confusion matrix?',
    answer:
      "A confusion matrix is a table that breaks down a classification model's predictions into true positives, true negatives, false positives, and false negatives, so you can see exactly what kinds of mistakes it's making, not just an overall score. For fraud detection, it immediately shows you how many actual frauds were missed (false negatives) versus how many genuine transactions were incorrectly flagged (false positives), which a single accuracy number would hide.",
    keyPoints: [
      'Table of true positives, true negatives, false positives, false negatives',
      'Shows exactly what kind of errors the model makes',
      'More informative than a single accuracy number for imbalanced problems',
    ],
    followUps: ['How would you calculate precision and recall directly from a confusion matrix?', 'How does a confusion matrix extend to more than two classes?'],
    tags: ['confusion-matrix', 'evaluation'],
  },
  {
    id: 'ml-010',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is ROC-AUC?',
    answer:
      "ROC-AUC measures how well a model separates positive and negative classes across all possible classification thresholds, not just one fixed cutoff. The ROC curve plots true positive rate against false positive rate as the threshold changes, and AUC is the area under that curve — closer to 1 means the model separates the classes well, while 0.5 means it's no better than random guessing.",
    keyPoints: [
      'Evaluates performance across all classification thresholds, not just one',
      'ROC curve: true positive rate vs false positive rate',
      'AUC close to 1 is good, 0.5 is equivalent to random guessing',
    ],
    followUps: ['Why might ROC-AUC be misleading on a heavily imbalanced dataset?', 'What is precision-recall AUC, and when would you prefer it over ROC-AUC?'],
    tags: ['roc-auc', 'evaluation'],
  },
  {
    id: 'ml-011',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'When is accuracy misleading?',
    answer:
      "Accuracy is misleading whenever classes are imbalanced — if 99% of transactions are legitimate, a model that always predicts 'not fraud' gets 99% accuracy while catching zero actual fraud, which is completely useless in practice. Accuracy treats every class as equally important and every mistake as equally costly, which usually isn't true in real problems like fraud, where missing fraud is far more costly than a false alarm.",
    keyPoints: [
      'Misleading on imbalanced datasets, like fraud (rare positive class)',
      'A trivial "always predict majority class" model can score high accuracy while being useless',
      'Ignores that different types of errors often have very different real costs',
    ],
    followUps: ['What metrics would you report alongside accuracy for an imbalanced problem?', 'How would you explain this issue to a non-technical stakeholder who is fixated on accuracy?'],
    tags: ['accuracy', 'class-imbalance'],
  },
  {
    id: 'ml-012',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'Explain class imbalance.',
    answer:
      "Class imbalance is when one class in your dataset vastly outnumbers another — in fraud detection, legitimate transactions might outnumber fraudulent ones by a ratio of hundreds or thousands to one. This is a problem because models trained naively on imbalanced data tend to just favour the majority class to minimise overall error, since that's mathematically the path of least resistance, even though the minority class (fraud) is usually what you actually care most about detecting.",
    keyPoints: [
      'One class vastly outnumbers another in the dataset',
      'Fraud detection is a classic real-world example',
      'Naive training favours the majority class, harming detection of the minority class you care about',
    ],
    followUps: ['What ratio of imbalance would concern you enough to take special action?', 'What is the difference between class imbalance in the training data versus in the real world?'],
    tags: ['class-imbalance', 'fraud'],
  },
  {
    id: 'ml-013',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'How would you handle imbalanced data?',
    answer:
      "A few options, often combined: resampling techniques like oversampling the minority class (e.g. SMOTE) or undersampling the majority class to balance the training set; using class weights so the model is penalised more heavily for getting minority-class examples wrong; and choosing evaluation metrics like precision, recall and F1 instead of accuracy, since accuracy alone would hide the actual problem. I'd also make sure any resampling is only applied to the training set, never the test set, so evaluation still reflects real-world class proportions.",
    keyPoints: [
      'Resampling: oversampling minority (e.g. SMOTE) or undersampling majority',
      'Class weighting to penalise minority-class mistakes more heavily',
      'Use precision/recall/F1 instead of accuracy; keep test set proportions realistic',
    ],
    followUps: ['How does SMOTE actually generate synthetic minority examples?', 'Why should resampling never be applied to the test set?'],
    tags: ['class-imbalance', 'fraud'],
  },
  {
    id: 'ml-014',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is bias?',
    answer:
      "In the bias-variance sense, bias refers to error introduced by a model being too simple to capture the real underlying pattern in the data — it makes systematic mistakes regardless of how much data you give it. A model with high bias tends to underfit: it performs similarly poorly on both training and test data because it simply isn't flexible enough to learn the real relationship.",
    keyPoints: [
      'Error from a model being too simple to capture real patterns',
      'Leads to systematic, consistent mistakes',
      'High bias is associated with underfitting',
    ],
    followUps: ['How is this different from "bias" in the fairness/ethics sense of the word?', 'What would you do to reduce a model\'s bias?'],
    tags: ['bias', 'bias-variance'],
  },
  {
    id: 'ml-015',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is variance?',
    answer:
      "In the bias-variance sense, variance refers to how much a model's predictions would change if trained on a different sample of data — a high-variance model is overly sensitive to the specific training data it saw, including its noise. High variance is associated with overfitting: the model does very well on training data but its performance swings a lot, and often drops, on new data.",
    keyPoints: [
      'Measures sensitivity to the specific training data used',
      'High variance means the model reacts strongly to noise in training data',
      'High variance is associated with overfitting',
    ],
    followUps: ['How would you reduce a model\'s variance without increasing its bias too much?', 'What kind of model architecture tends to have naturally higher variance?'],
    tags: ['variance', 'bias-variance'],
  },
  {
    id: 'ml-016',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'Explain the bias-variance tradeoff.',
    answer:
      "As you increase a model's complexity, bias tends to go down (it can capture more nuanced patterns) but variance tends to go up (it becomes more sensitive to noise in the training data), and vice versa for simpler models. The goal is finding the sweet spot where total error — the combination of bias and variance — is minimised, rather than pushing either one to an extreme. Techniques like regularization and cross-validation help find that balance in practice.",
    keyPoints: [
      'Increasing complexity: lower bias, higher variance, and vice versa',
      'Goal is minimising total error, not eliminating either one entirely',
      'Regularization and cross-validation help find the right balance',
    ],
    followUps: ['How would you diagnose whether a model has a bias problem or a variance problem?', 'How does regularization help with this tradeoff specifically?'],
    tags: ['bias-variance', 'ml'],
  },
  {
    id: 'ml-017',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is feature scaling?',
    answer:
      "Feature scaling is the process of adjusting numeric features so they're on a similar scale to each other, since features with very different ranges (like transaction amount in thousands versus a 0-1 ratio) can distort models that are sensitive to magnitude, like distance-based algorithms or gradient descent-based models. It's less critical for tree-based models like random forests, but usually important for things like neural networks, k-nearest neighbours, or logistic regression.",
    keyPoints: [
      'Adjusts numeric features to comparable scales/ranges',
      'Prevents features with larger raw ranges from dominating magnitude-sensitive models',
      'Less critical for tree-based models, important for neural networks, KNN, logistic regression',
    ],
    followUps: ['Why don\'t tree-based models need feature scaling as much?', 'What would happen if you skipped scaling before training a neural network?'],
    tags: ['feature-scaling', 'preprocessing'],
  },
  {
    id: 'ml-018',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is normalization?',
    answer:
      "Normalization typically refers to rescaling features to a fixed range, usually 0 to 1, using the minimum and maximum values in the data. It's useful when you know the bounds of your data and want every feature to contribute on a comparable, bounded scale, though it can be sensitive to outliers since a single extreme value stretches the whole scale.",
    keyPoints: [
      'Rescales values to a fixed range, typically 0 to 1',
      'Uses min and max of the data',
      'Sensitive to outliers, which can distort the scale for everything else',
    ],
    followUps: ['How would an extreme outlier affect min-max normalization?', 'When would you choose normalization over standardization?'],
    tags: ['normalization', 'preprocessing'],
  },
  {
    id: 'ml-019',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    question: 'What is standardization?',
    answer:
      "Standardization rescales a feature so it has a mean of 0 and a standard deviation of 1, by subtracting the mean and dividing by the standard deviation. Unlike normalization, it's not bounded to a fixed range, which makes it less sensitive to a single extreme outlier, and it's generally the more common default choice for algorithms like logistic regression, SVMs, and neural networks.",
    keyPoints: [
      'Rescales to mean 0, standard deviation 1',
      'Not bounded to a fixed range, less distorted by outliers than min-max normalization',
      'Common default for logistic regression, SVMs, neural networks',
    ],
    followUps: ['What is the formula for standardization?', 'Would you standardize a categorical feature? Why or why not?'],
    tags: ['standardization', 'preprocessing'],
  },
  {
    id: 'ml-020',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is hyperparameter tuning?',
    answer:
      "Hyperparameters are settings you choose before training that the model doesn't learn on its own — like the learning rate, number of trees in a random forest, or number of layers in a neural network. Hyperparameter tuning is the process of systematically searching for the combination of these settings that gives the best performance on a validation set, rather than guessing or using defaults blindly.",
    keyPoints: [
      'Hyperparameters are set before training, not learned by the model itself',
      'Examples: learning rate, number of trees, number of layers',
      'Tuning searches for the best combination using validation performance',
    ],
    followUps: ['Give an example of a hyperparameter versus a learned parameter.', 'How do you avoid overfitting to the validation set during tuning?'],
    tags: ['hyperparameter-tuning', 'ml'],
  },
  {
    id: 'ml-021',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is grid search?',
    answer:
      "Grid search is a hyperparameter tuning method where you define a fixed set of values for each hyperparameter and exhaustively try every combination, evaluating each on a validation set to find the best one. It's simple and thorough, but it can get very expensive quickly as you add more hyperparameters or more values per hyperparameter, since the number of combinations grows multiplicatively.",
    keyPoints: [
      'Exhaustively tries every combination of predefined hyperparameter values',
      'Simple and thorough but computationally expensive as the search space grows',
      'Combinations grow multiplicatively with more hyperparameters/values',
    ],
    followUps: ['How would you make grid search more efficient for a large search space?', 'When would grid search actually be a reasonable choice despite the cost?'],
    tags: ['grid-search', 'hyperparameter-tuning'],
  },
  {
    id: 'ml-022',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'What is random search?',
    answer:
      "Random search is a hyperparameter tuning method that samples random combinations from the hyperparameter space instead of trying every possible combination like grid search. Surprisingly, it's often more efficient in practice, because it doesn't waste time exhaustively covering unimportant hyperparameters and instead spreads its budget across the space more broadly, which tends to find good combinations faster for the same computational budget.",
    keyPoints: [
      'Samples random combinations rather than an exhaustive grid',
      'Often more efficient than grid search for the same compute budget',
      'Spreads search more broadly rather than exhaustively covering less important dimensions',
    ],
    followUps: ['Why might random search outperform grid search with the same number of trials?', 'What is Bayesian optimisation, and how does it improve on random search?'],
    tags: ['random-search', 'hyperparameter-tuning'],
  },
  {
    id: 'ml-023',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'How do you select a model?',
    answer:
      "I'd start with the problem type — classification, regression, clustering — and the nature of the data, like whether it's structured/tabular or more like text or images, since that already narrows the reasonable choices a lot. For structured banking-style data, I'd usually start with a simpler, interpretable model like logistic regression or a tree-based model like random forest or gradient boosting as a strong baseline, before considering something more complex like a neural network, since interpretability and simplicity matter a lot in a regulated industry like banking.",
    keyPoints: [
      'Starts from problem type and data structure to narrow options',
      'Prefers a simple, interpretable baseline before complex models',
      'Notes interpretability matters especially in regulated industries like banking',
    ],
    followUps: ['Why does interpretability matter specifically in banking?', 'When would you justify moving to a more complex model like a neural network?'],
    tags: ['model-selection', 'ml'],
  },
  {
    id: 'ml-024',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'How do you evaluate a model?',
    answer:
      "I'd choose metrics that actually match the business problem, not just default to accuracy — for fraud detection, that means precision, recall, F1 and ROC-AUC, evaluated on a proper held-out test set that reflects real class proportions. I'd also look beyond a single number: check the confusion matrix to understand what kind of mistakes it makes, and ideally validate on data from a different time period than training to catch potential drift issues before deployment.",
    keyPoints: [
      'Chooses metrics matched to the actual business problem, not just accuracy',
      'Uses a proper held-out test set reflecting real-world class proportions',
      'Looks at the confusion matrix and considers time-based validation for drift',
    ],
    followUps: ['What would you do if precision and recall pointed you toward conflicting conclusions?', 'How would time-based validation differ from a random train/test split?'],
    tags: ['model-evaluation', 'ml'],
  },
  {
    id: 'ml-025',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'How would you improve a poorly performing model?',
    answer:
      "I'd first diagnose whether the problem is bias or variance by comparing training and validation performance — high error on both suggests underfitting, a big gap suggests overfitting. From there, if it's underfitting, I'd try a more expressive model, better features, or longer training; if it's overfitting, I'd try regularization, more data, or a simpler model. I'd also revisit the data itself — checking for label noise, data leakage, or missing important features — since often the biggest gains come from better data, not a fancier model.",
    keyPoints: [
      'Diagnoses bias vs variance first using training/validation gap',
      'Applies the right fix depending on the diagnosis (more capacity vs more regularization)',
      'Also checks data quality issues like label noise or leakage, which often matter more than model choice',
    ],
    followUps: ['What would you check first if you suspected data leakage?', 'How would you know if the ceiling on performance is actually the data quality, not the model?'],
    tags: ['model-improvement', 'ml'],
  },
]
