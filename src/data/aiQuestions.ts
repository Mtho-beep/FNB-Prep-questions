import type { Question } from '../types/questions'

// 30 AI Fundamentals questions. Definition -> explanation -> example ->
// project connection structure, written at a junior-friendly level.

export const aiQuestions: Question[] = [
  {
    id: 'ai-001',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is Artificial Intelligence?',
    answer:
      "Artificial Intelligence is the broad field of building systems that can perform tasks that would normally require human intelligence, like understanding language, recognising patterns, or making decisions. It's an umbrella term — machine learning, deep learning, and things like the LLM agents I've worked with on the FNB project all fall under AI, but AI itself isn't one specific technique, it's the overall goal.",
    keyPoints: [
      'AI is the umbrella field/goal, not one specific technique',
      'Covers tasks like language understanding, pattern recognition, decision-making',
      'ML, deep learning and LLMs are subsets of AI',
    ],
    followUps: ['How is AI different from a normal computer program?', 'What is an example of AI you interact with daily?'],
    tags: ['ai', 'fundamentals', 'definition'],
  },
  {
    id: 'ai-002',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is Machine Learning?',
    answer:
      "Machine Learning is a subset of AI where a system learns patterns from data instead of being explicitly programmed with rules for every case. You give it examples — input and, usually, the correct output — and it learns a general pattern it can apply to new, unseen data. It's the foundation underneath most modern AI, including the language models used in agent systems like the one I built for the FNB project.",
    keyPoints: [
      'Learns patterns from data instead of hardcoded rules',
      'Generalises from examples to new, unseen inputs',
      'Foundation for deep learning and LLMs',
    ],
    followUps: ['What is the difference between ML and traditional programming?', 'Give an example of a task better suited to ML than hardcoded rules.'],
    tags: ['ml', 'fundamentals', 'definition'],
  },
  {
    id: 'ai-003',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is Deep Learning?',
    answer:
      "Deep Learning is a subset of machine learning that uses neural networks with many layers to learn increasingly abstract representations of data — for example, in an image, early layers might detect edges, later layers detect shapes, and even later layers detect whole objects. It's called 'deep' because of the number of layers stacked together. Large language models, which power the agents in my FNB project, are built on deep learning architectures.",
    keyPoints: [
      'Subset of ML using multi-layer neural networks',
      'Learns increasingly abstract representations layer by layer',
      'LLMs are a deep learning application',
    ],
    followUps: ['Why does adding more layers help a network learn more complex patterns?', 'What is a neural network layer actually doing mathematically?'],
    tags: ['deep-learning', 'fundamentals'],
  },
  {
    id: 'ai-004',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is the difference between AI, ML and Deep Learning?',
    answer:
      "Think of them as nested circles. AI is the broadest goal — making machines act intelligently, by any method, including hardcoded rules. ML is a subset of AI where the system learns from data rather than fixed rules. Deep Learning is a subset of ML that specifically uses multi-layer neural networks to learn those patterns. So every deep learning system is ML, and every ML system is AI, but not every AI system uses ML, and not every ML system uses deep learning.",
    keyPoints: [
      'AI is the broadest category, includes rule-based systems too',
      'ML is a subset of AI: learning from data',
      'Deep Learning is a subset of ML: specifically neural networks',
    ],
    followUps: ['Can you give an example of AI that is not ML?', 'Can you give an example of ML that is not deep learning?'],
    tags: ['ai', 'ml', 'deep-learning', 'fundamentals'],
  },
  {
    id: 'ai-005',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is supervised learning?',
    answer:
      "Supervised learning is where you train a model on labelled data — each training example has both an input and the correct answer (the label) — and the model learns to map inputs to outputs. For example, training a model on historical transactions labelled as 'fraud' or 'not fraud' so it can classify new transactions. Most classification and regression problems in practice, including a lot of fraud detection use cases relevant to banking, use supervised learning.",
    keyPoints: [
      'Trained on labelled input-output pairs',
      'Learns a mapping from input to known correct output',
      'Common for classification/regression (e.g. fraud labelling)',
    ],
    followUps: ['What if you don\'t have labelled data for your problem?', 'What are common supervised learning algorithms you know?'],
    tags: ['ml', 'supervised-learning'],
  },
  {
    id: 'ai-006',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is unsupervised learning?',
    answer:
      "Unsupervised learning works with data that has no labels — the model looks for structure or patterns on its own, like grouping similar data points together. A common example is customer segmentation, where a bank might cluster customers by spending behaviour without predefining the groups upfront. It's useful when labelling data is expensive or when you genuinely don't know the categories in advance.",
    keyPoints: [
      'Works on unlabelled data, finds structure on its own',
      'Clustering is the classic example',
      'Useful when labelled data is unavailable or categories are unknown upfront',
    ],
    followUps: ['What is a real banking use case for unsupervised learning?', 'How do you evaluate an unsupervised model if there are no correct labels?'],
    tags: ['ml', 'unsupervised-learning'],
  },
  {
    id: 'ai-007',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is reinforcement learning?',
    answer:
      "Reinforcement learning is where an agent learns by interacting with an environment and receiving rewards or penalties for its actions, gradually learning a strategy (a policy) that maximises long-term reward. It's less about a fixed dataset and more about trial and error over time. A classic example is training an agent to play a game, but it also applies to things like optimising a recommendation strategy over many user interactions.",
    keyPoints: [
      'Learns through trial and error via rewards/penalties',
      'Goal is maximising long-term cumulative reward, not just the next best action',
      'Different from supervised learning: no fixed labelled dataset, learns from interaction',
    ],
    followUps: ['How would reinforcement learning differ from supervised learning for the same problem?', 'Can you think of a banking use case for reinforcement learning?'],
    tags: ['reinforcement-learning'],
  },
  {
    id: 'ai-008',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is classification?',
    answer:
      "Classification is a supervised learning task where the model predicts which category or class an input belongs to, from a fixed, discrete set of options. A banking example is predicting whether a transaction is 'fraudulent' or 'not fraudulent' — that's binary classification. If there were more than two categories, like classifying a support ticket into one of five topics, that would be multi-class classification.",
    keyPoints: [
      'Predicts a discrete category/class, not a continuous number',
      'Binary classification: two classes (e.g. fraud/not fraud)',
      'Multi-class classification: more than two possible categories',
    ],
    followUps: ['What algorithms are commonly used for classification?', 'How would you evaluate a classification model?'],
    tags: ['classification', 'ml'],
  },
  {
    id: 'ai-009',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is regression?',
    answer:
      "Regression is a supervised learning task where the model predicts a continuous numeric value rather than a category. A banking example would be predicting a customer's expected credit limit or a loan default risk score as a number rather than a yes/no label. The key difference from classification is the output type: a number on a continuous scale, not a fixed set of categories.",
    keyPoints: [
      'Predicts a continuous numeric value',
      'Example: predicting a credit score or risk score as a number',
      'Contrasts with classification, which predicts discrete categories',
    ],
    followUps: ['What metrics would you use to evaluate a regression model?', 'Can a regression output be turned into a classification decision? How?'],
    tags: ['regression', 'ml'],
  },
  {
    id: 'ai-010',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'Classification vs regression?',
    answer:
      "The core difference is what kind of output you're predicting. Classification predicts a discrete category — like fraud or not fraud. Regression predicts a continuous number — like a predicted transaction amount or a risk score. Sometimes the line blurs; you could turn a regression output like a risk score into a classification decision by applying a threshold, like 'score above 0.8 counts as high risk.'",
    keyPoints: [
      'Classification: discrete categories. Regression: continuous numbers',
      'Same underlying data can sometimes support either framing',
      'Thresholding a regression score can convert it into a classification decision',
    ],
    followUps: ['When would you prefer a regression output with a threshold over direct classification?', 'What is a metric that only makes sense for one of the two, not both?'],
    tags: ['classification', 'regression', 'ml'],
  },
  {
    id: 'ai-011',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is clustering?',
    answer:
      "Clustering is an unsupervised learning technique that groups similar data points together based on their features, without being told in advance what the groups should be. A common banking example is grouping customers by transaction behaviour to find natural segments, like 'frequent small transactions' versus 'infrequent large transactions', which could then inform different product offerings.",
    keyPoints: [
      'Unsupervised: groups data by similarity without predefined labels',
      'Groups (clusters) emerge from the data itself',
      'Used for customer segmentation in banking contexts',
    ],
    followUps: ['What algorithm would you use for clustering, and how does it decide group boundaries?', 'How do you decide how many clusters to use?'],
    tags: ['clustering', 'unsupervised-learning'],
  },
  {
    id: 'ai-012',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is anomaly detection?',
    answer:
      "Anomaly detection is about identifying data points that don't fit the normal pattern of the rest of the data — outliers that could indicate something interesting or wrong. It's directly relevant to fraud detection: a transaction that's wildly different from a customer's usual spending pattern, in amount, location or timing, is an anomaly worth flagging for review. It can be done with statistical methods, or with ML models trained to recognise what 'normal' looks like.",
    keyPoints: [
      'Identifies data points that deviate from the normal pattern',
      'Directly maps to fraud detection use cases',
      'Can use statistical thresholds or ML-based models of "normal" behaviour',
    ],
    followUps: ['How would you define "normal" behaviour for a specific customer versus all customers?', 'What is the risk of an anomaly detection system that is too sensitive?'],
    tags: ['anomaly-detection', 'fraud'],
  },
  {
    id: 'ai-013',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is feature engineering?',
    answer:
      "Feature engineering is the process of transforming raw data into inputs (features) that make it easier for a model to learn useful patterns. For example, instead of feeding a model a raw transaction timestamp, you might engineer features like 'time since last transaction' or 'transaction hour of day', which are much more directly useful for detecting unusual behaviour. Good feature engineering often matters as much as, or more than, the choice of model itself.",
    keyPoints: [
      'Transforms raw data into more useful model inputs',
      'Example: deriving "time since last transaction" from a raw timestamp',
      'Often has more impact on model performance than model choice alone',
    ],
    followUps: ['Can you give another example of a useful engineered feature for fraud detection?', 'How does feature engineering differ from feature selection?'],
    tags: ['feature-engineering', 'ml'],
  },
  {
    id: 'ai-014',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is a neural network?',
    answer:
      "A neural network is a model made up of layers of connected nodes ('neurons'), loosely inspired by how brain neurons connect. Each connection has a weight, and each neuron applies a small calculation (a weighted sum, then an activation function) before passing its output to the next layer. By adjusting those weights during training, the network learns to map inputs to correct outputs. Stacking many of these layers is what makes it a 'deep' neural network.",
    keyPoints: [
      'Made of layers of connected nodes with adjustable weights',
      'Each neuron applies a weighted sum plus an activation function',
      'Training adjusts weights so the network maps inputs to correct outputs',
    ],
    followUps: ['What does an activation function actually do in this process?', 'How are the weights actually adjusted during training?'],
    tags: ['neural-network', 'deep-learning'],
  },
  {
    id: 'ai-015',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is an activation function?',
    answer:
      "An activation function is applied to a neuron's weighted sum of inputs to decide what it outputs to the next layer. Without it, a neural network would just be doing linear combinations no matter how many layers you stack, which severely limits what it can learn. Activation functions like ReLU or sigmoid introduce non-linearity, which is what lets a network learn complex, non-linear patterns in data.",
    keyPoints: [
      'Applied after the weighted sum in each neuron',
      'Introduces non-linearity — without it, stacking layers would not help',
      'ReLU and sigmoid are common examples',
    ],
    followUps: ['What would happen if you removed all activation functions from a network?', 'Why is ReLU more commonly used than sigmoid in hidden layers today?'],
    tags: ['activation-function', 'neural-network'],
  },
  {
    id: 'ai-016',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is ReLU?',
    answer:
      "ReLU, or Rectified Linear Unit, is an activation function that outputs the input directly if it's positive, and zero otherwise — mathematically, max(0, x). It's popular because it's computationally cheap and helps avoid a problem called vanishing gradients that older activation functions like sigmoid suffer from in deep networks, which makes training deep networks faster and more stable.",
    keyPoints: [
      'ReLU(x) = max(0, x)',
      'Computationally cheap and simple',
      'Helps avoid vanishing gradients in deep networks compared to sigmoid',
    ],
    followUps: ['What is the "dying ReLU" problem?', 'What is a variant of ReLU that tries to fix that problem?'],
    tags: ['relu', 'activation-function'],
  },
  {
    id: 'ai-017',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is sigmoid?',
    answer:
      "Sigmoid is an activation function that squashes any input into a range between 0 and 1, making it useful for representing probabilities — for example, the output layer of a binary classifier like a fraud/not-fraud model often uses sigmoid so the output can be interpreted as 'probability of fraud.' Its downside is that for very large or very small inputs, its gradient becomes tiny, which can slow down training in deep networks, which is why ReLU is usually preferred in hidden layers.",
    keyPoints: [
      'Squashes input to a range between 0 and 1',
      'Useful for binary classification output as a probability',
      'Suffers from vanishing gradients for extreme input values',
    ],
    followUps: ['Why is sigmoid still used in output layers even though ReLU is preferred elsewhere?', 'What is the relationship between sigmoid and logistic regression?'],
    tags: ['sigmoid', 'activation-function'],
  },
  {
    id: 'ai-018',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is softmax?',
    answer:
      "Softmax is an activation function typically used in the output layer of a multi-class classification model. It turns a vector of raw scores into a probability distribution across all classes — every output is between 0 and 1, and they all sum to 1. For example, classifying a transaction into one of five fraud-type categories, softmax gives you the probability of each category so you can pick the most likely one.",
    keyPoints: [
      'Converts raw scores into a probability distribution across multiple classes',
      'Outputs sum to 1, unlike independent sigmoid outputs',
      'Used in the output layer for multi-class classification',
    ],
    followUps: ['How is softmax different from just using sigmoid on each class independently?', 'What loss function is typically paired with softmax?'],
    tags: ['softmax', 'classification'],
  },
  {
    id: 'ai-019',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is backpropagation?',
    answer:
      "Backpropagation is the algorithm used to train neural networks by calculating how much each weight contributed to the model's error, then updating weights to reduce that error. It works backward from the output layer to the input layer, using the chain rule from calculus to compute gradients efficiently at each layer. Those gradients are then used by an optimizer, like gradient descent, to actually adjust the weights.",
    keyPoints: [
      'Calculates each weight\'s contribution to the overall error',
      'Works backward from output to input using the chain rule',
      'Produces gradients that an optimizer uses to update weights',
    ],
    followUps: ['How does backpropagation relate to gradient descent?', 'What is the vanishing gradient problem in the context of backpropagation?'],
    tags: ['backpropagation', 'deep-learning'],
  },
  {
    id: 'ai-020',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is gradient descent?',
    answer:
      "Gradient descent is an optimisation algorithm used to minimise a model's loss function by iteratively adjusting its weights in the direction that reduces error the most, based on the gradient (slope) of the loss with respect to each weight. You can think of it like walking downhill step by step toward the lowest point of a valley, where the valley represents the loss landscape and the lowest point represents the best set of weights.",
    keyPoints: [
      'Iteratively adjusts weights to minimise the loss function',
      'Moves in the direction of steepest descent (negative gradient)',
      'Analogy: walking downhill toward the lowest point of a valley',
    ],
    followUps: ['What is the difference between batch, stochastic and mini-batch gradient descent?', 'What happens if the learning rate is too high or too low?'],
    tags: ['gradient-descent', 'optimisation'],
  },
  {
    id: 'ai-021',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is a loss function?',
    answer:
      "A loss function measures how far off a model's predictions are from the actual correct answers — it's the thing gradient descent is trying to minimise. For a classification problem you might use cross-entropy loss, while for regression you might use mean squared error. Choosing the right loss function matters because it directly shapes what the model is being optimised to get right.",
    keyPoints: [
      'Quantifies how wrong the model\'s predictions are',
      'Cross-entropy for classification, mean squared error for regression are common examples',
      'The choice of loss function shapes what the model optimises for',
    ],
    followUps: ['Why would cross-entropy be a poor choice for a regression problem?', 'How would you choose a loss function for an imbalanced fraud dataset?'],
    tags: ['loss-function', 'ml'],
  },
  {
    id: 'ai-022',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is an optimizer?',
    answer:
      "An optimizer is the algorithm that actually updates a model's weights using the gradients computed during backpropagation, in order to minimise the loss function. Plain gradient descent is the simplest form, but in practice people usually use more advanced optimizers like Adam, which adapts the learning rate for each parameter individually and tends to converge faster and more reliably on deep learning problems.",
    keyPoints: [
      'Updates weights using gradients to minimise loss',
      'Plain gradient descent is the base case',
      'Adam is a widely used, adaptive optimizer that often converges faster',
    ],
    followUps: ['What makes Adam different from plain gradient descent specifically?', 'How would you choose between different optimizers for a project?'],
    tags: ['optimizer', 'deep-learning'],
  },
  {
    id: 'ai-023',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is overfitting?',
    answer:
      "Overfitting happens when a model learns the training data too closely — including its noise and quirks — so it performs well on training data but poorly on new, unseen data. It's like memorising answers to specific practice questions instead of actually understanding the underlying concept, so you fail when the real exam asks something slightly different.",
    keyPoints: [
      'Model learns training data too closely, including noise',
      'Performs well on training data, poorly on unseen data',
      'Analogy: memorising practice answers instead of understanding concepts',
    ],
    followUps: ['How can you detect overfitting during training?', 'What are some techniques to prevent it?'],
    tags: ['overfitting', 'ml'],
  },
  {
    id: 'ai-024',
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What is underfitting?',
    answer:
      "Underfitting is the opposite of overfitting — the model is too simple to capture the real patterns in the data, so it performs poorly on both the training data and new data. It often happens when the model doesn't have enough capacity, wasn't trained long enough, or the features given to it just aren't informative enough for the task.",
    keyPoints: [
      'Model too simple to capture real patterns',
      'Performs poorly on both training AND unseen data',
      'Can be caused by insufficient model capacity, training time, or weak features',
    ],
    followUps: ['How would you tell overfitting and underfitting apart just by looking at training vs validation performance?', 'What would you try first to fix underfitting?'],
    tags: ['underfitting', 'ml'],
  },
  {
    id: 'ai-025',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'How do you prevent overfitting?',
    answer:
      "A few approaches work well together: getting more training data if possible, since more diverse examples make it harder to memorise noise; using regularization techniques like L1 or L2 penalties that discourage overly complex weight patterns; using dropout in neural networks to prevent over-reliance on specific neurons; and using cross-validation to catch overfitting early rather than only noticing it once the model is already deployed. Simplifying the model itself, if it's clearly more complex than the problem needs, also helps.",
    keyPoints: [
      'More/diverse training data reduces the chance of memorising noise',
      'Regularization (L1/L2) and dropout limit model complexity',
      'Cross-validation helps detect overfitting during development',
    ],
    followUps: ['How do L1 and L2 regularization actually differ?', 'When would you choose to simplify the model versus add more regularization?'],
    tags: ['overfitting', 'regularization'],
  },
  {
    id: 'ai-026',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is regularization?',
    answer:
      "Regularization is a set of techniques that discourage a model from becoming overly complex, to reduce overfitting. L2 regularization (also called ridge) adds a penalty proportional to the square of the weights, encouraging smaller, more evenly distributed weights. L1 regularization (lasso) adds a penalty proportional to the absolute value of weights, which can push some weights to exactly zero, effectively performing feature selection.",
    keyPoints: [
      'Adds a penalty to the loss function to discourage complexity',
      'L2 (ridge): penalises squared weights, encourages small distributed weights',
      'L1 (lasso): penalises absolute weights, can zero out features entirely',
    ],
    followUps: ['When would you prefer L1 over L2, or vice versa?', 'How does regularization strength (the hyperparameter) affect the model?'],
    tags: ['regularization', 'overfitting'],
  },
  {
    id: 'ai-027',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is dropout?',
    answer:
      "Dropout is a regularization technique for neural networks where, during training, a random subset of neurons is temporarily ignored ('dropped out') on each pass. This forces the network to not over-rely on any single neuron or specific pathway, which makes it generalise better to new data. At inference time, dropout is turned off and all neurons are used, typically with their outputs scaled to account for the difference.",
    keyPoints: [
      'Randomly disables a subset of neurons during training',
      'Prevents over-reliance on specific neurons, improving generalisation',
      'Turned off (all neurons active) at inference time',
    ],
    followUps: ['Why is dropout only applied during training and not inference?', 'What dropout rate would you typically start with?'],
    tags: ['dropout', 'regularization', 'neural-network'],
  },
  {
    id: 'ai-028',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is cross-validation?',
    answer:
      "Cross-validation is a technique for evaluating a model more reliably by splitting the data into multiple folds, training on some folds and validating on the remaining fold, then rotating which fold is used for validation. K-fold cross-validation, for example, does this k times and averages the results. It gives a more robust estimate of how the model will perform on unseen data than a single train/test split, since it isn't dependent on one particular lucky or unlucky split.",
    keyPoints: [
      'Splits data into multiple folds, rotating which fold is used for validation',
      'K-fold cross-validation averages performance across k rotations',
      'More robust than a single train/test split',
    ],
    followUps: ['What is a downside of cross-validation compared to a single train/test split?', 'How would you use cross-validation for hyperparameter tuning?'],
    tags: ['cross-validation', 'evaluation'],
  },
  {
    id: 'ai-029',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is data leakage?',
    answer:
      "Data leakage happens when information that wouldn't actually be available at prediction time accidentally makes it into the training process, making the model look much better during evaluation than it will in real use. A classic example is accidentally including a future outcome, or a feature derived from it, in your training features — like including 'was this transaction reversed as fraud' as a feature when predicting fraud, when that information wouldn't exist yet at the time of the actual prediction.",
    keyPoints: [
      'Information not actually available at prediction time leaks into training',
      'Makes evaluation results misleadingly optimistic',
      'Example: including a future-outcome-derived feature in training data',
    ],
    followUps: ['How would you go about detecting data leakage in a project?', 'How is data leakage different from overfitting?'],
    tags: ['data-leakage', 'ml'],
  },
  {
    id: 'ai-030',
    category: 'AI Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is model drift?',
    answer:
      "Model drift is when a model's performance degrades over time because the real-world data it's seeing in production starts to differ from the data it was trained on. In banking, customer spending patterns can shift due to economic changes or new fraud tactics, so a fraud model trained a year ago might become less accurate without any change to the model itself — the world just moved. That's why monitoring live performance and periodically retraining models matters, not just validating once before deployment.",
    keyPoints: [
      'Model accuracy degrades as real-world data diverges from training data',
      'Banking example: shifting spending patterns or new fraud tactics',
      'Requires ongoing monitoring and periodic retraining, not a one-time validation',
    ],
    followUps: ['How would you detect model drift in production?', 'How often would you consider retraining a fraud detection model?'],
    tags: ['model-drift', 'production-ml'],
  },
]
