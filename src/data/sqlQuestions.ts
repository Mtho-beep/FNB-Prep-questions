import type { Question } from '../types/questions'

// 18 SQL & Databases questions, tied to the PostgreSQL / read-only
// design decisions made on the FNB project.

export const sqlQuestions: Question[] = [
  {
    id: 'sql-001',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'What is SQL?',
    answer:
      "SQL, Structured Query Language, is the standard language for interacting with relational databases — defining, querying, and modifying structured data organised in tables. In the FNB project, SQL is exactly what our Code Agent generates and what ultimately gets executed, read-only, against our PostgreSQL database to answer a user's banking request.",
    keyPoints: [
      'Standard language for interacting with relational databases',
      'Used to define, query and modify structured, table-based data',
      'Directly what the FNB Code Agent generates',
    ],
    followUps: ['What are the main categories of SQL statements (DDL, DML, etc.)?', 'What makes a database "relational"?'],
    tags: ['sql', 'fundamentals'],
  },
  {
    id: 'sql-002',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'What is a relational database?',
    answer:
      "A relational database stores data in structured tables made up of rows and columns, where relationships between tables are defined through keys — like a customer table linked to a transactions table via a customer ID. This structure enforces consistency and lets you combine related data across tables efficiently, which is exactly the kind of structure our banking schema relies on for the Verifier Agent to check queries against.",
    keyPoints: [
      'Stores data in structured tables of rows and columns',
      'Relationships between tables defined via keys',
      'Enforces consistency and allows efficient combination of related data',
    ],
    followUps: ['What is the alternative to a relational database, and when would you use one?', 'How does a foreign key enforce a relationship?'],
    tags: ['sql', 'relational-database'],
  },
  {
    id: 'sql-003',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'What is PostgreSQL?',
    answer:
      "PostgreSQL is an open-source, production-grade relational database management system known for strong standards compliance, reliability, and rich support for roles, permissions, and schema introspection. It's the database we used for the FNB project, specifically because its granular permission system let us enforce genuine read-only access at the database level, not just in application code.",
    keyPoints: [
      'Open-source, production-grade relational database system',
      'Known for standards compliance, reliability, and rich permission features',
      'Chosen for the FNB project specifically for its granular role-based permissions',
    ],
    followUps: ['What other databases have you used or considered, and how do they compare?', 'How exactly did you configure the read-only role in PostgreSQL?'],
    tags: ['postgresql', 'fnb'],
  },
  {
    id: 'sql-004',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'What is a primary key?',
    answer:
      "A primary key is a column, or combination of columns, that uniquely identifies each row in a table — no two rows can share the same primary key value, and it can't be null. For example, an account_id column in an accounts table would typically be the primary key, guaranteeing each account record is uniquely identifiable.",
    keyPoints: [
      'Uniquely identifies each row in a table',
      'Must be unique and non-null',
      'Example: account_id in an accounts table',
    ],
    followUps: ['Can a primary key span multiple columns? Give an example.', 'What happens if you try to insert a duplicate primary key value?'],
    tags: ['sql', 'primary-key'],
  },
  {
    id: 'sql-005',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'What is a foreign key?',
    answer:
      "A foreign key is a column in one table that references the primary key of another table, establishing a relationship between them and enforcing that the referenced value actually exists. For example, a transactions table might have an account_id foreign key referencing the accounts table, ensuring you can't record a transaction for an account that doesn't exist.",
    keyPoints: [
      'A column referencing another table\'s primary key',
      'Establishes and enforces a relationship between tables',
      'Example: transactions.account_id referencing accounts.account_id',
    ],
    followUps: ['What happens if you try to delete a row that other rows reference via a foreign key?', 'What does ON DELETE CASCADE do?'],
    tags: ['sql', 'foreign-key'],
  },
  {
    id: 'sql-006',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'What is a JOIN?',
    answer:
      "A JOIN combines rows from two or more tables based on a related column between them, usually a foreign key relationship, so you can query data that spans multiple tables in a single result. For example, joining accounts and transactions on account_id lets you list each transaction alongside the account holder's details, rather than looking them up separately.",
    keyPoints: [
      'Combines rows from multiple tables based on a related column',
      'Usually joins on a foreign key relationship',
      'Lets you query data spanning multiple tables in one result',
    ],
    followUps: ['What are the main types of JOIN you know?', 'What happens if the join column has duplicate values on one side?'],
    tags: ['sql', 'join'],
  },
  {
    id: 'sql-007',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'INNER JOIN vs LEFT JOIN.',
    answer:
      "An INNER JOIN only returns rows where there's a match in both tables — if an account has no transactions, it wouldn't appear at all in an INNER JOIN between accounts and transactions. A LEFT JOIN returns all rows from the left table regardless of whether there's a match in the right table, filling in NULLs for the right table's columns when there's no match — so every account would appear, even ones with zero transactions, with NULLs where transaction data would be.",
    keyPoints: [
      'INNER JOIN: only matching rows from both tables',
      'LEFT JOIN: all rows from the left table, NULLs where no match exists on the right',
      'Choice depends on whether you need unmatched left-side rows included',
    ],
    followUps: ['When would a LEFT JOIN be the wrong choice for a banking query?', 'What is a RIGHT JOIN, and why is it used less often than LEFT JOIN?'],
    tags: ['sql', 'join'],
  },
  {
    id: 'sql-008',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'What is normalization?',
    answer:
      "Normalization is the process of organising a database schema to reduce data redundancy and improve consistency, typically by splitting data into related tables rather than repeating the same information across many rows. For example, instead of storing a customer's full name and address in every transaction row, you'd store customer details once in a customers table and reference it by ID from the transactions table.",
    keyPoints: [
      'Organises schema to reduce redundancy and improve consistency',
      'Splits data into related tables rather than repeating it',
      'Example: customer details stored once, referenced by ID elsewhere',
    ],
    followUps: ['What are normal forms, and can you describe one briefly?', 'When might you deliberately denormalize a schema?'],
    tags: ['sql', 'normalization'],
  },
  {
    id: 'sql-009',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'What is an index?',
    answer:
      "An index is a data structure that speeds up lookups on a table, similar to an index at the back of a book — instead of scanning every row to find what you need, the database can jump straight to relevant rows. Indexes are usually created on columns that are frequently searched or joined on, like account_id, but they come with a trade-off: they speed up reads but slow down writes slightly and take up extra storage.",
    keyPoints: [
      'Speeds up row lookups, similar to a book\'s index',
      'Typically created on frequently searched or joined columns',
      'Trade-off: faster reads, slower writes, extra storage',
    ],
    followUps: ['Why would you not just index every column?', 'What is the difference between a clustered and non-clustered index, if you know?'],
    tags: ['sql', 'index'],
  },
  {
    id: 'sql-010',
    category: 'SQL & Databases',
    difficulty: 'Beginner',
    question: 'Why are indexes useful?',
    answer:
      "They make queries on large tables dramatically faster by letting the database avoid scanning every single row. In a banking context with potentially millions of transaction rows, an index on account_id or transaction date could be the difference between a query returning instantly versus taking a long time, which matters a lot for a system meant to answer requests interactively.",
    keyPoints: [
      'Dramatically speed up queries by avoiding full table scans',
      'Especially valuable on large tables like banking transactions',
      'Directly impacts interactive query responsiveness',
    ],
    followUps: ['How would you decide which columns to index in the FNB schema?', 'What is the risk of over-indexing a table?'],
    tags: ['sql', 'index', 'performance'],
  },
  {
    id: 'sql-011',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'What is a transaction?',
    answer:
      "In database terms, a transaction is a group of one or more operations that are executed as a single unit — either all of them succeed and are committed, or if something fails, all of them are rolled back, leaving the database as if none of them happened. This matters enormously in banking: if you're debiting one account and crediting another, you need both to succeed together, or neither, to avoid money disappearing or duplicating.",
    keyPoints: [
      'A group of operations executed as a single all-or-nothing unit',
      'Either fully committed or fully rolled back on failure',
      'Critical for banking operations like transferring funds between accounts',
    ],
    followUps: ['What would happen without transactions in a funds-transfer scenario?', 'How does this relate to why our FNB pipeline is read-only, avoiding this risk entirely?'],
    tags: ['sql', 'transactions'],
  },
  {
    id: 'sql-012',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'What is ACID?',
    answer:
      "ACID describes the properties that guarantee reliable database transactions: Atomicity (all operations in a transaction succeed or none do), Consistency (a transaction brings the database from one valid state to another, respecting all rules), Isolation (concurrent transactions don't interfere with each other), and Durability (once committed, changes survive even a crash). Banking systems rely heavily on these guarantees since financial data absolutely cannot be left in an inconsistent state.",
    keyPoints: [
      'Atomicity, Consistency, Isolation, Durability',
      'Guarantees reliable behaviour of database transactions',
      'Especially critical in banking, where inconsistent financial data is unacceptable',
    ],
    followUps: ['Can you give a concrete banking example that illustrates Isolation specifically?', 'What could go wrong without Durability?'],
    tags: ['sql', 'acid'],
  },
  {
    id: 'sql-013',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'What is SQL injection?',
    answer:
      "SQL injection is an attack where untrusted input is inserted directly into a SQL query in a way that lets an attacker change the query's meaning — for example, injecting input that closes a string early and appends malicious SQL, potentially exposing or modifying data the attacker shouldn't access. It's especially relevant to our FNB project because the Code Agent generates SQL from user-controlled natural language, so we have to think about SQL injection-style risks even though the mechanism is an LLM rather than raw string concatenation.",
    keyPoints: [
      'Untrusted input inserted into a query changes its intended meaning',
      'Can expose or modify unauthorised data',
      'Relevant to the FNB project since user input flows into generated SQL, even via an LLM',
    ],
    followUps: ['How is the risk different when an LLM generates SQL versus classic string concatenation?', 'What is a parameterised query, and how does it prevent this?'],
    tags: ['sql', 'security', 'sql-injection'],
  },
  {
    id: 'sql-014',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'How do you prevent SQL injection?',
    answer:
      "The standard defence in traditional applications is using parameterised queries or prepared statements, which keep user input separate from the SQL command structure so it can never be interpreted as code. For an AI-generated SQL system like the FNB pipeline, we add extra layers: the Verifier Agent checks that generated SQL only references real schema elements and is a read-only SELECT, and the database connection itself uses a read-only role as a final backstop, so even a successful injection-style attempt couldn't modify data.",
    keyPoints: [
      'Parameterised queries/prepared statements separate input from SQL structure',
      'For AI-generated SQL, add independent verification against schema and statement-type rules',
      'Read-only database role as a final defence-in-depth backstop',
    ],
    followUps: ['Why isn\'t a parameterised query alone sufficient for an LLM-based SQL generation pipeline?', 'What would happen if the Verifier Agent had a bug and let something malicious through?'],
    tags: ['sql', 'security'],
  },
  {
    id: 'sql-015',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'PostgreSQL vs SQLite.',
    answer:
      "SQLite is a lightweight, file-based database that's great for small projects, prototypes, or local development because it needs no separate server. PostgreSQL is a full client-server database designed for production use, with much stronger support for concurrent users, fine-grained roles and permissions, and larger datasets. For the FNB project, PostgreSQL was the right choice because we needed genuine role-based read-only access and a setup that reflects how a real banking system would actually be deployed.",
    keyPoints: [
      'SQLite: lightweight, file-based, good for prototypes/local development',
      'PostgreSQL: full client-server database for production, concurrency, and fine-grained permissions',
      'FNB chose PostgreSQL specifically for realistic role-based access control',
    ],
    followUps: ['What would break if you tried to use SQLite for the FNB project instead?', 'When would SQLite actually be the better choice?'],
    tags: ['postgresql', 'sqlite'],
  },
  {
    id: 'sql-016',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'Why did you move your project from SQLite to PostgreSQL?',
    answer:
      "For early prototyping, SQLite is fast and convenient since there's no setup involved, which is useful when you're just proving out an idea. But once we needed genuine role-based access control — a real read-only database role rather than just an application-level convention — and wanted the project to reflect a realistic banking environment, PostgreSQL was the natural move, since SQLite doesn't really support that kind of fine-grained permission model in the same way.",
    keyPoints: [
      'SQLite convenient for early, fast prototyping without setup',
      'PostgreSQL chosen once genuine role-based access control was needed',
      'Move driven by wanting the project to reflect a realistic banking environment',
    ],
    followUps: ['What specifically had to change in the codebase when you made that move?', 'Did the migration surface any issues you did not expect?'],
    tags: ['postgresql', 'sqlite', 'fnb'],
  },
  {
    id: 'sql-017',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'How would you optimize a slow SQL query?',
    answer:
      "I'd start by looking at the query's execution plan to see where time is actually being spent — often it points to a missing index or an expensive full table scan. From there, I'd consider adding an appropriate index on the columns used in WHERE clauses or JOINs, rewriting the query to avoid unnecessary subqueries or SELECT *, and checking whether the query is pulling more data than it actually needs. For a recurring, expensive query, I might also consider caching results if the underlying data doesn't change often.",
    keyPoints: [
      'Start with the execution plan to find the actual bottleneck',
      'Add appropriate indexes; avoid unnecessary subqueries or SELECT *',
      'Consider caching for expensive, frequently-run, slow-changing queries',
    ],
    followUps: ['How do you read a query execution plan in PostgreSQL?', 'What is the difference between SELECT * and selecting only needed columns, performance-wise?'],
    tags: ['sql', 'performance'],
  },
  {
    id: 'sql-018',
    category: 'SQL & Databases',
    difficulty: 'Intermediate',
    question: 'What happens when an SQL query fails?',
    answer:
      "The database returns an error describing what went wrong — like a syntax error, a reference to a table or column that doesn't exist, or a permission error if the query tries something the connection's role isn't allowed to do. In the FNB pipeline specifically, a failure at the verification stage is treated as expected and handled gracefully through the refinement loop, but a failure at actual execution time — after verification passed — would be more concerning and should be logged clearly for investigation, since it suggests our verification missed something.",
    keyPoints: [
      'Database returns a specific error (syntax, missing reference, permission denial)',
      'FNB\'s verification-stage failures are expected and handled via the refinement loop',
      'A failure at actual execution time, after verification passed, would be a red flag worth investigating',
    ],
    followUps: ['How would you distinguish a permission error from a syntax error programmatically?', 'What would you log to help diagnose an unexpected execution-time failure?'],
    tags: ['sql', 'error-handling'],
  },
]
