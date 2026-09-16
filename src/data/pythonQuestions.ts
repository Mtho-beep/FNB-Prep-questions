import type { Question } from '../types/questions'

// 18 Python questions, at a junior-developer level of depth.

export const pythonQuestions: Question[] = [
  {
    id: 'py-001',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'Why is Python popular in AI?',
    answer:
      "Python has a huge, mature ecosystem of AI and data libraries — things like NumPy, Pandas, scikit-learn, PyTorch and the LangChain/LangGraph ecosystem I used on the FNB project — so you rarely have to build core functionality from scratch. It's also readable and quick to write, which matters a lot when you're experimenting with models or agent designs and want to iterate fast rather than fight the language itself.",
    keyPoints: [
      'Huge, mature ecosystem of AI/data libraries (NumPy, Pandas, PyTorch, LangGraph)',
      'Readable syntax supports fast iteration and experimentation',
      'Widely adopted, so community support and examples are abundant',
    ],
    followUps: ['What are Python\'s downsides compared to other languages for production AI systems?', 'Which specific libraries have you used most?'],
    tags: ['python', 'ai'],
  },
  {
    id: 'py-002',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What Python libraries have you used?',
    answer:
      "On the AI side, I've used LangGraph for orchestrating the FNB multi-agent pipeline, plus standard libraries for working with LLM APIs. For the database layer, I've used libraries for connecting to and querying PostgreSQL. For the web/API side I've used FastAPI to build backend endpoints. And for general data work I've used NumPy and Pandas when I needed to manipulate or analyse structured data for machine learning tasks.",
    keyPoints: [
      'LangGraph for multi-agent orchestration on the FNB project',
      'PostgreSQL client libraries and FastAPI for backend/API work',
      'NumPy and Pandas for general data manipulation',
    ],
    followUps: ['Which library took the longest for you to become comfortable with?', 'What would you reach for to build a REST API quickly in Python?'],
    tags: ['python', 'libraries'],
  },
  {
    id: 'py-003',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'List vs tuple.',
    answer:
      "Both store ordered collections of items, but a list is mutable — you can add, remove or change elements after creating it — while a tuple is immutable, meaning once it's created you can't change its contents. I tend to use lists for collections I expect to modify, like accumulating results in a loop, and tuples for fixed groupings of values, like a coordinate pair or a fixed return value with multiple parts, where I want to signal it shouldn't change.",
    keyPoints: [
      'List: mutable, ordered collection',
      'Tuple: immutable, ordered collection',
      'Choose based on whether the collection should be modifiable',
    ],
    followUps: ['Why might immutability be useful, beyond just preventing accidental changes?', 'Can a tuple contain a mutable object like a list?'],
    tags: ['python', 'data-structures'],
  },
  {
    id: 'py-004',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'Dictionary vs list.',
    answer:
      "A list is an ordered collection you typically access by numeric index (position), while a dictionary stores key-value pairs and you access values by their key rather than position. I'd use a dictionary when I need fast lookups by a meaningful identifier — like storing agent state in the FNB pipeline, where I access fields by name such as 'generated_sql' — and a list when order matters and I'm mostly iterating through items rather than looking one up directly.",
    keyPoints: [
      'List: ordered, accessed by numeric index',
      'Dictionary: key-value pairs, accessed by key',
      'Dictionaries suit fast lookup by meaningful identifier; lists suit ordered iteration',
    ],
    followUps: ['What is the time complexity of a dictionary lookup versus searching a list?', 'When would you use a list of dictionaries?'],
    tags: ['python', 'data-structures'],
  },
  {
    id: 'py-005',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is a function?',
    answer:
      "A function is a named, reusable block of code that performs a specific task, optionally taking inputs (parameters) and returning an output. Functions let you avoid repeating the same logic in multiple places and make code easier to read and test, since you can name a function to describe what it does and test it in isolation, which is exactly how I structured the smaller pieces of logic within each agent in the FNB pipeline.",
    keyPoints: [
      'Named, reusable block of code performing a specific task',
      'Takes optional parameters, can return an output',
      'Improves readability and testability by isolating logic',
    ],
    followUps: ['What is the difference between a parameter and an argument?', 'What does it mean for a function to have side effects?'],
    tags: ['python', 'functions'],
  },
  {
    id: 'py-006',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is a class?',
    answer:
      "A class is a blueprint for creating objects that bundle together data (attributes) and behaviour (methods) related to a concept. For example, I might define a class to represent an agent's configuration, with attributes like its model name and system prompt, and methods for how it processes input, so I can create multiple instances with different configurations while reusing the same structure and logic.",
    keyPoints: [
      'A blueprint for creating objects bundling data and behaviour',
      'Attributes hold data, methods define behaviour',
      'Allows creating multiple instances sharing structure but with different data',
    ],
    followUps: ['What is the difference between a class and an instance (object)?', 'What is __init__ used for in a Python class?'],
    tags: ['python', 'oop'],
  },
  {
    id: 'py-007',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is object-oriented programming?',
    answer:
      "Object-oriented programming is a way of structuring code around objects — instances of classes that bundle data and behaviour together — rather than just a sequence of functions operating on separate data. Key ideas include encapsulation (bundling data with the methods that operate on it), inheritance (building new classes from existing ones), and polymorphism (different classes responding to the same method call in their own way). It helps organise larger codebases, like separating each agent's logic into its own well-defined class.",
    keyPoints: [
      'Structures code around objects bundling data and behaviour',
      'Key concepts: encapsulation, inheritance, polymorphism',
      'Helps organise larger codebases into well-defined, related units',
    ],
    followUps: ['Can you give an example of polymorphism in a project you have built?', 'When would you prefer plain functions over an object-oriented approach?'],
    tags: ['python', 'oop'],
  },
  {
    id: 'py-008',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is inheritance?',
    answer:
      "Inheritance lets a class (the child or subclass) reuse and extend the attributes and methods of another class (the parent or base class), so you don't have to duplicate shared logic. For example, if I had a base Agent class with common setup logic, I could have RequirementAgent, CodeAgent and VerifierAgent each inherit from it and reuse that shared setup, while overriding only the specific behaviour unique to each.",
    keyPoints: [
      'Child class reuses and extends a parent class\'s attributes/methods',
      'Avoids duplicating shared logic across related classes',
      'Example: a shared base Agent class extended by specific agent types',
    ],
    followUps: ['What is the difference between inheritance and composition?', 'What is method overriding?'],
    tags: ['python', 'oop'],
  },
  {
    id: 'py-009',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'What is exception handling?',
    answer:
      "Exception handling lets you catch and respond to errors that occur while a program is running, using try/except blocks, instead of letting the whole program crash. In the FNB pipeline, I'd wrap the database execution step in a try/except so that if a connection error occurs, we can catch it, log it clearly, and return a sensible error to the user, rather than the whole service going down unexpectedly.",
    keyPoints: [
      'Catches and responds to runtime errors using try/except',
      'Prevents the whole program from crashing on an error',
      'Example: catching database connection errors during query execution',
    ],
    followUps: ['What is the difference between except Exception and catching a specific exception type?', 'What does a finally block do?'],
    tags: ['python', 'error-handling'],
  },
  {
    id: 'py-010',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'What are decorators?',
    answer:
      "A decorator is a function that wraps another function to add extra behaviour before or after it runs, without modifying the original function's own code. A common example is a logging decorator that records how long a function took to execute, which would be useful for timing how long each agent step takes in the FNB pipeline without cluttering each agent's core logic with timing code.",
    keyPoints: [
      'A function that wraps another function to add extra behaviour',
      'Doesn\'t modify the original function\'s own code',
      'Example use: logging/timing wrapper around a function',
    ],
    followUps: ['Can you write a simple example of a timing decorator?', 'What is the @ syntax actually doing under the hood?'],
    tags: ['python', 'decorators'],
  },
  {
    id: 'py-011',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'What are list comprehensions?',
    answer:
      "A list comprehension is a compact way to create a new list by applying an expression to each item in an existing iterable, optionally filtering items, all in a single readable line instead of a multi-line for loop. For example, extracting just the table names from a list of schema objects could be written as a single comprehension rather than a separate loop with an append call each time.",
    keyPoints: [
      'Compact syntax for building a list from an iterable in one line',
      'Can include a filtering condition',
      'More concise than an equivalent multi-line for loop with append',
    ],
    followUps: ['Can you write a list comprehension that filters as well as transforms?', 'When would a plain for loop be more readable than a comprehension?'],
    tags: ['python', 'list-comprehension'],
  },
  {
    id: 'py-012',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is a virtual environment?',
    answer:
      "A virtual environment is an isolated Python setup with its own installed packages, separate from your system-wide Python installation. It means different projects can use different, even conflicting, versions of the same library without interfering with each other. I use one for every project, including the FNB pipeline, so its exact dependencies are reproducible and don't clash with what's installed for StudyTogether or anything else on my machine.",
    keyPoints: [
      'Isolated Python setup with its own package installations',
      'Prevents dependency conflicts between different projects',
      'Keeps each project\'s dependencies reproducible and separate',
    ],
    followUps: ['What tools have you used to create virtual environments?', 'How would you share your exact dependencies with a teammate?'],
    tags: ['python', 'virtual-environment'],
  },
  {
    id: 'py-013',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is pip?',
    answer:
      "Pip is Python's standard package manager — it's how you install, upgrade and remove third-party libraries, like installing LangGraph or FastAPI for a project. It reads a requirements file, if you have one, to install a specific, reproducible set of dependencies, which is how I make sure the FNB project's dependencies are consistent across different team members' machines.",
    keyPoints: [
      'Python\'s standard package manager',
      'Installs, upgrades and removes third-party libraries',
      'requirements.txt allows reproducible dependency installation across machines',
    ],
    followUps: ['What is the difference between pip install and pip freeze?', 'What is requirements.txt used for exactly?'],
    tags: ['python', 'pip'],
  },
  {
    id: 'py-014',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is an API?',
    answer:
      "An API, or Application Programming Interface, is a defined way for one piece of software to communicate with another — a set of endpoints, inputs and outputs that lets you request data or trigger actions without needing to know how the other system works internally. In the FNB project, our pipeline could be exposed as an API so another application could send a natural-language request and receive back a structured, verified result.",
    keyPoints: [
      'A defined way for software systems to communicate',
      'Exposes endpoints with defined inputs/outputs, hiding internal implementation',
      'Would be how the FNB pipeline gets exposed to other applications',
    ],
    followUps: ['What is the difference between a REST API and other API styles you have heard of?', 'What would a request to your FNB pipeline\'s API look like?'],
    tags: ['python', 'api'],
  },
  {
    id: 'py-015',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'What is JSON?',
    answer:
      "JSON, or JavaScript Object Notation, is a lightweight, text-based data format for representing structured data using key-value pairs, lists, and nested objects — it's language-independent despite the name, and it's the most common format for exchanging data between APIs. In the FNB pipeline, the structured specification passed between the Requirement Agent and Code Agent could naturally be represented as JSON, since it maps cleanly to nested keys like entities and filters.",
    keyPoints: [
      'Lightweight, text-based format for structured data (key-value pairs, lists, nesting)',
      'Language-independent, widely used for API data exchange',
      'A natural fit for representing the structured spec passed between FNB agents',
    ],
    followUps: ['How would you validate that a JSON structure matches an expected schema?', 'What is the difference between JSON and a Python dictionary?'],
    tags: ['python', 'json'],
  },
  {
    id: 'py-016',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'What is FastAPI?',
    answer:
      "FastAPI is a modern Python web framework for building APIs quickly, with built-in support for data validation using type hints, automatic interactive documentation, and good performance thanks to being built on asynchronous foundations. I'd use it to expose the FNB pipeline as an HTTP service — defining an endpoint that accepts a natural-language request and returns the verified query result, with FastAPI automatically validating the incoming request shape.",
    keyPoints: [
      'Modern Python framework for building APIs quickly',
      'Uses type hints for automatic data validation',
      'Provides automatic interactive documentation and good async performance',
    ],
    followUps: ['How does FastAPI\'s use of type hints actually enable validation?', 'What does "asynchronous" mean in this context, and why does it help performance?'],
    tags: ['python', 'fastapi'],
  },
  {
    id: 'py-017',
    category: 'Python',
    difficulty: 'Beginner',
    question: 'Why use FastAPI?',
    answer:
      "It's fast to develop with, has excellent built-in support for validating request and response data automatically using Python type hints, and generates interactive API documentation for free, which is genuinely useful for teammates integrating with your API. It's also built for asynchronous operations, which suits an AI pipeline well since LLM calls can be slow and you don't want the whole service blocked waiting on one request.",
    keyPoints: [
      'Fast development with automatic request/response validation via type hints',
      'Free interactive API documentation, useful for team collaboration',
      'Async support suits latency-sensitive AI pipelines well',
    ],
    followUps: ['What alternative Python web frameworks have you heard of, and how do they compare?', 'How would async support specifically help the FNB pipeline?'],
    tags: ['python', 'fastapi'],
  },
  {
    id: 'py-018',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'How would you debug Python code?',
    answer:
      "I start by reproducing the issue reliably with the smallest possible example, then read the traceback carefully since it usually points directly at the failing line. I use print statements or logging for quick checks, and a proper debugger with breakpoints when I need to inspect variables at a specific point in execution, which I found especially useful when tracing why an agent's state didn't have a field I expected in the FNB pipeline. I also isolate the failing component and test it on its own rather than debugging within the full pipeline, which makes the problem much easier to pin down.",
    keyPoints: [
      'Reproduce reliably with the smallest example first',
      'Read the traceback carefully; use print/logging or a proper debugger with breakpoints',
      'Isolate the failing component rather than debugging within the full system',
    ],
    followUps: ['Can you walk through a specific bug you debugged this way on the FNB project?', 'What tools do you use for debugging beyond print statements?'],
    tags: ['python', 'debugging'],
  },
]
