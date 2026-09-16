import type { CodingQuestion } from '../types/questions'

// 10 Coderbyte-style practice coding questions. These are realistic,
// original practice problems written for this app — they are NOT actual
// confidential Coderbyte questions. Each has a full walkthrough: problem,
// examples, hints, a Python and JavaScript solution, a line-by-line style
// explanation, complexity analysis, common mistakes, and a follow-up.

export const coderbyteQuestions: CodingQuestion[] = [
  {
    id: 'cb-001',
    title: 'Two Sum',
    difficulty: 'Beginner',
    problem:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice. Return the indices in any order.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]' },
    ],
    hints: [
      'A brute-force approach checking every pair works but is O(n^2) — can you do better?',
      'What if, for each number, you already knew whether "target minus this number" had been seen before?',
      'A hash map (dictionary) can store numbers you have already seen, mapped to their index, in a single pass.',
    ],
    approach:
      'Use a hash map to store each number\'s value as a key and its index as the value, as you iterate through the array once. For each number, compute the complement (target - current number) and check if it\'s already in the map. If it is, you\'ve found your pair. If not, add the current number and its index to the map and keep going. This turns an O(n^2) brute-force search into a single O(n) pass.',
    solutionPython: `def two_sum(nums, target):
    """Return indices of the two numbers that add up to target."""
    seen = {}  # maps number -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # no solution found (shouldn't happen per problem constraints)`,
    solutionJavaScript: `function twoSum(nums, target) {
  const seen = new Map(); // number -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return []; // no solution found
}`,
    explanation: [
      'seen = {} creates an empty dictionary/map to remember numbers we have already visited and their index.',
      'We loop through nums once, tracking both the value (num) and its position (i).',
      'For each number, we calculate complement = target - num — the value we would need to have already seen to complete a pair.',
      'If complement is already a key in seen, we immediately know both indices that sum to target, so we return them.',
      'Otherwise, we store the current number and its index in seen so a later number can find it as a complement.',
      'Because both the lookup and insert into a hash map are O(1) on average, the whole pass is O(n).',
    ],
    timeComplexity: 'O(n) — a single pass through the array with O(1) average hash map lookups and inserts.',
    spaceComplexity: 'O(n) — in the worst case, the hash map stores almost every element before finding a match.',
    commonMistakes: [
      'Using nested loops (O(n^2)) when a single-pass hash map solution is expected for the "expected approach" follow-up.',
      'Checking if nums[i] itself equals complement and accidentally reusing the same element twice.',
      'Forgetting to add the current number to the map before moving to the next iteration.',
      'Returning the values that sum to target instead of their indices.',
    ],
    followUp: 'What would you change if the array could contain multiple valid pairs and you needed to return all of them?',
    starterCodePython: `def two_sum(nums, target):
    # Write your solution here
    pass

# Example call:
# print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
`,
    starterCodeJavaScript: `function twoSum(nums, target) {
  // Write your solution here
}

// Example call:
// console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
`,
    testCases: [
      { args: '[2, 7, 11, 15], 9', expected: '[0, 1]' },
      { args: '[3, 2, 4], 6', expected: '[1, 2]' },
      { args: '[3, 3], 6', expected: '[0, 1]' },
    ],
  },
  {
    id: 'cb-002',
    title: 'First Non-Repeating Character',
    difficulty: 'Beginner',
    problem:
      'Given a string `s`, find the first character that does not repeat anywhere else in the string, and return it. If every character repeats, return an underscore `"_"`.',
    examples: [
      { input: 's = "swiss"', output: '"w"', explanation: "'s' repeats, 'w' appears only once and is the first such character" },
      { input: 's = "aabbcc"', output: '"_"', explanation: 'Every character repeats' },
      { input: 's = "teeter"', output: '"r"' },
    ],
    hints: [
      'You need to know how many times each character appears — a frequency count is a natural first step.',
      'A dictionary/hash map mapping character to count lets you check frequency in O(1).',
      'After counting, do a second pass over the original string (to preserve order) and return the first character with a count of 1.',
    ],
    approach:
      'Make two passes over the string. First, build a frequency count of every character using a dictionary. Second, iterate through the string again in its original order and return the first character whose count is exactly 1. Doing two passes keeps the logic simple and still runs in linear time overall.',
    solutionPython: `def first_non_repeating(s):
    """Return the first non-repeating character in s, or '_' if none exists."""
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1

    for ch in s:
        if counts[ch] == 1:
            return ch
    return "_"`,
    solutionJavaScript: `function firstNonRepeating(s) {
  const counts = {};
  for (const ch of s) {
    counts[ch] = (counts[ch] || 0) + 1;
  }

  for (const ch of s) {
    if (counts[ch] === 1) {
      return ch;
    }
  }
  return "_";
}`,
    explanation: [
      'counts = {} starts an empty dictionary that will map each character to how many times it appears.',
      'The first loop iterates over every character in s, incrementing its count in the dictionary (starting from 0 if unseen).',
      'The second loop iterates over s again, in its original order, checking each character\'s count.',
      'The first character found with a count of exactly 1 is returned immediately, since it is guaranteed to be the first non-repeating one.',
      'If the loop finishes without finding any character with count 1, we return "_" as specified.',
    ],
    timeComplexity: 'O(n) — two linear passes over the string, each O(n), giving O(2n) which simplifies to O(n).',
    spaceComplexity: 'O(k) where k is the number of distinct characters (bounded by the alphabet size, so effectively O(1) for typical text).',
    commonMistakes: [
      'Only doing one pass and trying to determine "first" and "repeating" at the same time, which is much harder to get right.',
      'Returning the character with the lowest count instead of specifically checking for count equal to 1.',
      'Forgetting the case where no non-repeating character exists and not returning the specified fallback value.',
      'Being case-sensitive or insensitive inconsistently without checking what the problem actually expects.',
    ],
    followUp: 'How would you solve this if you could only make a single pass through the string?',
    starterCodePython: `def first_non_repeating(s):
    # Write your solution here
    pass

# Example call:
# print(first_non_repeating("swiss"))  # Expected: "w"
`,
    starterCodeJavaScript: `function firstNonRepeating(s) {
  // Write your solution here
}

// Example call:
// console.log(firstNonRepeating("swiss")); // Expected: "w"
`,
    testCases: [
      { args: '"swiss"', expected: '"w"' },
      { args: '"aabbcc"', expected: '"_"' },
      { args: '"teeter"', expected: '"r"' },
    ],
  },
  {
    id: 'cb-003',
    title: 'Reverse a String',
    difficulty: 'Beginner',
    problem:
      'Write a function that takes a string `s` and returns it reversed, without using any built-in reverse function (like `[::-1]` in Python or `.reverse()` in JavaScript).',
    examples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "AI Interview"', output: '"weivretnI IA"' },
      { input: 's = ""', output: '""' },
    ],
    hints: [
      'You can build the reversed string by walking through the original string from the last character to the first.',
      'A two-pointer approach — one at the start, one at the end, swapping and moving inward — is a classic technique here.',
      'If you convert the string to a list of characters first, swapping becomes straightforward.',
    ],
    approach:
      'Use two pointers, one starting at index 0 and one at the last index. Swap the characters at those two positions, then move the left pointer forward and the right pointer backward, repeating until they meet in the middle. Since strings are immutable in both Python and JavaScript, convert to a list/array first, perform the swaps, then join it back into a string.',
    solutionPython: `def reverse_string(s):
    """Reverse a string using a two-pointer swap, without built-in reverse."""
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)`,
    solutionJavaScript: `function reverseString(s) {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;
    left++;
    right--;
  }
  return chars.join("");
}`,
    explanation: [
      'chars = list(s) converts the immutable string into a mutable list of individual characters.',
      'left and right pointers start at the two ends of the list.',
      'While left is still before right, we swap the characters at those two positions.',
      'left moves one step forward and right moves one step backward after every swap, closing in on the middle.',
      'The loop stops once left meets or passes right, meaning every pair has been swapped.',
      '"".join(chars) reassembles the list of characters back into a single reversed string.',
    ],
    timeComplexity: 'O(n) — each character is visited and swapped once, so the work grows linearly with string length.',
    spaceComplexity: 'O(n) — a new list/array of characters the same size as the input is created (strings are immutable).',
    commonMistakes: [
      'Using the built-in reverse feature directly, which defeats the purpose of a practice exercise on manual reversal.',
      'Off-by-one errors when calculating the starting right pointer (forgetting length - 1).',
      'Trying to swap characters directly on the original string, forgetting strings are immutable in Python and JS.',
      'Not handling an empty string or single-character string as valid edge cases.',
    ],
    followUp: 'How would you reverse only the words in a sentence while keeping each word itself in the original order (e.g. "AI is fun" -> "fun is AI")?',
    starterCodePython: `def reverse_string(s):
    # Write your solution here
    pass

# Example call:
# print(reverse_string("hello"))  # Expected: "olleh"
`,
    starterCodeJavaScript: `function reverseString(s) {
  // Write your solution here
}

// Example call:
// console.log(reverseString("hello")); // Expected: "olleh"
`,
    testCases: [
      { args: '"hello"', expected: '"olleh"' },
      { args: '"AI Interview"', expected: '"weivretnI IA"' },
      { args: '""', expected: '""' },
    ],
  },
  {
    id: 'cb-004',
    title: 'Valid Parentheses',
    difficulty: 'Intermediate',
    problem:
      'Given a string `s` containing only the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. A string is valid if every opening bracket is closed by the same type of bracket, and brackets are closed in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false', explanation: 'The opening ( is closed by the wrong bracket type' },
      { input: 's = "([)]"', output: 'false', explanation: 'Brackets are closed out of order' },
      { input: 's = "{[]}"', output: 'true' },
    ],
    hints: [
      'Think about which bracket needs to close next as you read left to right — it is always the most recently opened one.',
      'A stack (last-in, first-out) is a natural fit for "most recently opened" behaviour.',
      'When you see a closing bracket, check whether it matches the bracket on top of the stack.',
    ],
    approach:
      'Use a stack. Walk through the string one character at a time. Whenever you see an opening bracket, push it onto the stack. Whenever you see a closing bracket, check that the stack is not empty and that its top element is the matching opening bracket — if either check fails, the string is invalid. Pop the matched opening bracket off the stack. At the end, the string is valid only if the stack is completely empty (every opening bracket was matched).',
    solutionPython: `def is_valid_parentheses(s):
    """Return True if brackets in s are balanced and correctly nested."""
    pairs = {")": "(", "}": "{", "]": "["}
    stack = []

    for ch in s:
        if ch in "({[":
            stack.append(ch)
        elif ch in ")}]":
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()

    return len(stack) == 0`,
    solutionJavaScript: `function isValidParentheses(s) {
  const pairs = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (const ch of s) {
    if (ch === "(" || ch === "{" || ch === "[") {
      stack.push(ch);
    } else if (ch === ")" || ch === "}" || ch === "]") {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[ch]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}`,
    explanation: [
      'pairs maps each closing bracket to the opening bracket it should match.',
      'stack starts empty and will hold opening brackets that have not yet been closed, in the order they were opened.',
      'When we encounter an opening bracket, we push it onto the stack — it is now "waiting" to be closed.',
      'When we encounter a closing bracket, we first check the stack is not empty and its top matches the expected opening bracket for this closer; if not, the string is already invalid.',
      'If it does match, we pop that opening bracket off, since it has now been correctly closed.',
      'After processing the whole string, an empty stack means every bracket was matched and closed correctly; anything left over means some bracket was never closed.',
    ],
    timeComplexity: 'O(n) — each character is processed once, with O(1) stack push/pop/peek operations.',
    spaceComplexity: 'O(n) — in the worst case (all opening brackets), the stack holds every character.',
    commonMistakes: [
      'Forgetting to check that the stack is non-empty before peeking at its top, causing an error on a string starting with a closing bracket.',
      'Not returning False/false immediately when a mismatch is found, letting the loop continue incorrectly.',
      'Forgetting to check that the stack is empty at the very end — a string like "(()" can otherwise wrongly pass.',
      'Using a list/array purely as a queue (checking the wrong end) instead of a stack (last-in, first-out).',
    ],
    followUp: 'How would you modify this solution to also return the index of the first invalid character, for better error messages?',
    starterCodePython: `def is_valid_parentheses(s):
    # Write your solution here
    pass

# Example call:
# print(is_valid_parentheses("()[]{}"))  # Expected: True
`,
    starterCodeJavaScript: `function isValidParentheses(s) {
  // Write your solution here
}

// Example call:
// console.log(isValidParentheses("()[]{}")); // Expected: true
`,
    testCases: [
      { args: '"()"', expected: 'true' },
      { args: '"()[]{}"', expected: 'true' },
      { args: '"(]"', expected: 'false' },
      { args: '"([)]"', expected: 'false' },
      { args: '"{[]}"', expected: 'true' },
    ],
  },
  {
    id: 'cb-005',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Intermediate',
    problem:
      'Given two arrays of integers `arr1` and `arr2`, each already sorted in ascending order, merge them into a single sorted array and return it.',
    examples: [
      { input: 'arr1 = [1, 3, 5], arr2 = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: 'arr1 = [1, 2, 3], arr2 = []', output: '[1, 2, 3]' },
      { input: 'arr1 = [], arr2 = [4, 5]', output: '[4, 5]' },
    ],
    hints: [
      'Since both arrays are already sorted, you never need to sort the merged result from scratch.',
      'Use two pointers, one for each array, and always take the smaller of the two current elements next.',
      "Don't forget to append any remaining elements once one array runs out before the other.",
    ],
    approach:
      'Use two pointers, i for arr1 and j for arr2, both starting at 0. Compare arr1[i] and arr2[j], append the smaller one to the result, and advance that pointer. Repeat until one array is exhausted, then append the rest of whichever array still has elements left, since they are already sorted. This avoids any need to sort the combined result afterward.',
    solutionPython: `def merge_sorted_arrays(arr1, arr2):
    """Merge two sorted arrays into one sorted array."""
    result = []
    i, j = 0, 0

    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1

    # Append any remaining elements (only one of these will do anything)
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result`,
    solutionJavaScript: `function mergeSortedArrays(arr1, arr2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  // Append any remaining elements
  while (i < arr1.length) result.push(arr1[i++]);
  while (j < arr2.length) result.push(arr2[j++]);

  return result;
}`,
    explanation: [
      'result starts as an empty array that will hold the merged, sorted output.',
      'i and j track our current position in arr1 and arr2 respectively.',
      'While both arrays still have unprocessed elements, we compare the current elements and append the smaller one to result, advancing only that array\'s pointer.',
      'This guarantees result stays sorted, since we always add the next-smallest available element.',
      'Once one array is exhausted, the while loop ends, but the other array may still have leftover elements.',
      'Because both original arrays are sorted, we can just append whatever remains of the other array directly, without any further comparison or sorting.',
    ],
    timeComplexity: 'O(n + m) — where n and m are the lengths of arr1 and arr2; every element is visited exactly once.',
    spaceComplexity: 'O(n + m) — for the new result array holding all elements from both inputs.',
    commonMistakes: [
      'Concatenating both arrays and then sorting the whole thing, which works but is less efficient (O((n+m) log(n+m)) instead of O(n+m)) and misses the point of the exercise.',
      'Forgetting to append the leftover elements once one array is exhausted.',
      'Using strict less-than instead of less-than-or-equal, which can subtly change output order for equal elements (usually harmless here, but worth being deliberate about).',
      'Off-by-one errors on the pointers when using array slicing.',
    ],
    followUp: 'How would you extend this to merge k sorted arrays instead of just two?',
    starterCodePython: `def merge_sorted_arrays(arr1, arr2):
    # Write your solution here
    pass

# Example call:
# print(merge_sorted_arrays([1, 3, 5], [2, 4, 6]))  # Expected: [1, 2, 3, 4, 5, 6]
`,
    starterCodeJavaScript: `function mergeSortedArrays(arr1, arr2) {
  // Write your solution here
}

// Example call:
// console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6])); // Expected: [1, 2, 3, 4, 5, 6]
`,
    testCases: [
      { args: '[1, 3, 5], [2, 4, 6]', expected: '[1, 2, 3, 4, 5, 6]' },
      { args: '[1, 2, 3], []', expected: '[1, 2, 3]' },
      { args: '[], [4, 5]', expected: '[4, 5]' },
    ],
  },
  {
    id: 'cb-006',
    title: 'Find the Missing Number',
    difficulty: 'Beginner',
    problem:
      'Given an array `nums` containing `n` distinct numbers taken from the range `0` to `n` (inclusive), find the one number in that range that is missing from the array.',
    examples: [
      { input: 'nums = [3, 0, 1]', output: '2', explanation: 'n = 3, range is 0..3, and 2 is missing' },
      { input: 'nums = [0, 1]', output: '2', explanation: 'n = 2, range is 0..2, and 2 is missing' },
      { input: 'nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]', output: '8' },
    ],
    hints: [
      'The sum of all numbers from 0 to n has a well-known formula: n * (n + 1) / 2.',
      'If you know what the full sum should be, and you know the actual sum of the array, the difference is your answer.',
      'This avoids needing to sort the array or use extra space for a set.',
    ],
    approach:
      'The array has n elements but represents numbers from the range 0 to n, which has n + 1 possible values — so exactly one is missing. Calculate the expected sum of all numbers from 0 to n using the formula n * (n + 1) / 2, then subtract the actual sum of the array\'s elements. The difference is exactly the missing number, since every other number cancels out.',
    solutionPython: `def find_missing_number(nums):
    """Find the missing number in a range of 0..n using the sum formula."""
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum`,
    solutionJavaScript: `function findMissingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, num) => acc + num, 0);
  return expectedSum - actualSum;
}`,
    explanation: [
      'n = len(nums) gives the count of numbers present, which is one less than the size of the full 0..n range.',
      'expected_sum uses the classic formula for the sum of the first n natural numbers (here, 0 through n) — n * (n + 1) / 2.',
      'actual_sum adds up every number that is actually present in the array.',
      'Because every number except one is present in both the expected range and the actual array, those shared numbers cancel out when we subtract.',
      'What remains, expected_sum - actual_sum, is exactly the one number that is missing from the array.',
    ],
    timeComplexity: 'O(n) — one pass to sum the array; the expected sum formula is O(1).',
    spaceComplexity: 'O(1) — only a couple of numeric variables are used, no extra data structures.',
    commonMistakes: [
      'Using the wrong upper bound in the formula (forgetting the range is 0 to n inclusive, not 0 to n-1).',
      'Sorting the array and scanning for a gap, which works but is O(n log n) instead of the more efficient O(n) sum approach.',
      'Integer overflow concerns in some languages for very large n (not a practical issue in Python or JavaScript for reasonable input sizes, but worth mentioning you are aware of it).',
      'Using a set-based approach that requires O(n) extra space when the sum formula achieves O(1) space.',
    ],
    followUp: 'How would you adapt this approach if there could be exactly two missing numbers instead of one?',
    starterCodePython: `def find_missing_number(nums):
    # Write your solution here
    pass

# Example call:
# print(find_missing_number([3, 0, 1]))  # Expected: 2
`,
    starterCodeJavaScript: `function findMissingNumber(nums) {
  // Write your solution here
}

// Example call:
// console.log(findMissingNumber([3, 0, 1])); // Expected: 2
`,
    testCases: [
      { args: '[3, 0, 1]', expected: '2' },
      { args: '[0, 1]', expected: '2' },
      { args: '[9, 6, 4, 2, 3, 5, 7, 0, 1]', expected: '8' },
    ],
  },
  {
    id: 'cb-007',
    title: 'Maximum Subarray Sum',
    difficulty: 'Intermediate',
    problem:
      'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum, and return that sum.',
    examples: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: 'The subarray [4, -1, 2, 1] has the largest sum, 6' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5, 4, -1, 7, 8]', output: '23', explanation: 'The whole array is the best subarray here' },
    ],
    hints: [
      'At each position, decide: is it better to extend the previous subarray, or start a brand new subarray from here?',
      'If the running sum so far becomes negative, it can only hurt any future subarray you add it to — so starting fresh is better.',
      'This greedy, single-pass idea is known as Kadane\'s Algorithm.',
    ],
    approach:
      "Use Kadane's Algorithm: keep a running current sum as you scan the array left to right. At each element, decide whether to add it to the existing running sum, or to start a new subarray beginning at this element — whichever gives a bigger value. Track the best sum seen across the whole scan. The key insight is that a negative running sum is never worth carrying forward, since adding it to any future number would only make that future sum smaller.",
    solutionPython: `def max_subarray_sum(nums):
    """Return the sum of the contiguous subarray with the largest sum (Kadane's Algorithm)."""
    current_sum = nums[0]
    best_sum = nums[0]

    for num in nums[1:]:
        # Either extend the previous subarray, or start fresh at this element
        current_sum = max(num, current_sum + num)
        best_sum = max(best_sum, current_sum)

    return best_sum`,
    solutionJavaScript: `function maxSubarraySum(nums) {
  let currentSum = nums[0];
  let bestSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend the previous subarray, or start fresh at this element
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    bestSum = Math.max(bestSum, currentSum);
  }

  return bestSum;
}`,
    explanation: [
      'current_sum and best_sum both start at nums[0], since the smallest valid subarray is a single element.',
      'We then loop through the rest of the array starting from index 1.',
      'At each element, current_sum becomes the larger of: just this element on its own, or this element added to the existing current_sum.',
      'That comparison is exactly the decision to "start fresh" versus "extend the previous run", based on whether carrying the previous sum forward still helps or hurts.',
      'best_sum is updated whenever current_sum exceeds the best value seen so far, so it always reflects the best subarray found up to this point.',
      'After the loop finishes, best_sum holds the maximum subarray sum across the entire array.',
    ],
    timeComplexity: 'O(n) — a single pass through the array with constant work per element.',
    spaceComplexity: 'O(1) — only two running variables are used regardless of array size.',
    commonMistakes: [
      'Trying every possible subarray with nested loops, which works but is O(n^2) and misses the expected linear-time approach.',
      'Forgetting to handle an array of all negative numbers correctly (the answer should be the least negative single element, not zero).',
      'Resetting current_sum to zero instead of to the current element when starting fresh, which breaks the all-negative-numbers case.',
      'Not initialising best_sum and current_sum from the first element, and instead starting from 0, which fails when all numbers are negative.',
    ],
    followUp: 'How would you modify this to also return the actual start and end indices of the maximum subarray, not just its sum?',
    starterCodePython: `def max_subarray_sum(nums):
    # Write your solution here
    pass

# Example call:
# print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
`,
    starterCodeJavaScript: `function maxSubarraySum(nums) {
  // Write your solution here
}

// Example call:
// console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // Expected: 6
`,
    testCases: [
      { args: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6' },
      { args: '[1]', expected: '1' },
      { args: '[5, 4, -1, 7, 8]', expected: '23' },
    ],
  },
  {
    id: 'cb-008',
    title: 'Detect Duplicate Values',
    difficulty: 'Beginner',
    problem:
      'Given an array of integers `nums`, return `true` if any value appears at least twice in the array, and `false` if every element is distinct.',
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false' },
      { input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'true' },
    ],
    hints: [
      'A set only stores unique values — comparing the set\'s size to the array\'s length tells you a lot.',
      'Alternatively, you could track which numbers you have already seen as you iterate.',
      'Sorting first and checking neighbours is another valid approach, with a different time/space trade-off.',
    ],
    approach:
      'Convert the array into a set, which automatically removes duplicate values. If the set\'s size is smaller than the original array\'s length, that means at least one value was removed as a duplicate, so return true. Otherwise, every value was unique, so return false. This is a clean, single-line-friendly solution that runs in linear time.',
    solutionPython: `def contains_duplicate(nums):
    """Return True if any value appears more than once in nums."""
    return len(set(nums)) < len(nums)`,
    solutionJavaScript: `function containsDuplicate(nums) {
  return new Set(nums).size < nums.length;
}`,
    explanation: [
      'set(nums) (or new Set(nums) in JavaScript) builds a collection containing only the unique values from nums, automatically discarding repeats.',
      'If any duplicates existed in the original array, the resulting set will have fewer elements than the original array.',
      'Comparing len(set(nums)) to len(nums) directly tells us whether any values were removed as duplicates.',
      'If the set is smaller, we know at least one duplicate existed, so the function returns True/true.',
      'If the set is the same size as the array, every element was already unique, so it returns False/false.',
    ],
    timeComplexity: 'O(n) — building a set from n elements takes linear time with average O(1) insertion per element.',
    spaceComplexity: 'O(n) — the set can grow to hold up to n unique elements.',
    commonMistakes: [
      'Using nested loops to compare every pair of elements, which works but is O(n^2) instead of the more efficient O(n) set-based approach.',
      'Forgetting that a set removes duplicates automatically, and instead trying to manually track counts when it is not needed for this simpler yes/no question.',
      'Confusing this problem with "find the duplicate value" (which needs to return the actual value, not just true/false).',
      'Not considering that an empty array should correctly return false (no duplicates possible).',
    ],
    followUp: 'How would you modify this to return the actual duplicate value(s) instead of just true or false?',
    starterCodePython: `def contains_duplicate(nums):
    # Write your solution here
    pass

# Example call:
# print(contains_duplicate([1, 2, 3, 1]))  # Expected: True
`,
    starterCodeJavaScript: `function containsDuplicate(nums) {
  // Write your solution here
}

// Example call:
// console.log(containsDuplicate([1, 2, 3, 1])); // Expected: true
`,
    testCases: [
      { args: '[1, 2, 3, 1]', expected: 'true' },
      { args: '[1, 2, 3, 4]', expected: 'false' },
      { args: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expected: 'true' },
    ],
  },
  {
    id: 'cb-009',
    title: 'Binary Search',
    difficulty: 'Intermediate',
    problem:
      'Given a sorted array of integers `nums` (ascending order) and a target integer `target`, return the index of `target` if it exists in `nums`, or `-1` if it does not. Your solution should run in O(log n) time.',
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' },
      { input: 'nums = [5], target = 5', output: '0' },
    ],
    hints: [
      'Since the array is sorted, you can eliminate half the remaining possibilities with every comparison.',
      'Keep a low and high pointer representing the current search range, and check the middle element.',
      'If the middle element is too small, the target must be to the right; if too large, it must be to the left.',
    ],
    approach:
      'Maintain two pointers, low and high, representing the current search boundaries, starting at the first and last index. Repeatedly check the middle element: if it equals the target, return its index. If it\'s less than the target, move low past the middle (the target must be to the right). If it\'s greater, move high before the middle (the target must be to the left). Keep narrowing the range until low passes high, at which point the target is not in the array, so return -1.',
    solutionPython: `def binary_search(nums, target):
    """Return the index of target in sorted nums, or -1 if not found."""
    low, high = 0, len(nums) - 1

    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1`,
    solutionJavaScript: `function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}`,
    explanation: [
      'low and high start at the two ends of the array, defining the full range we still need to search.',
      'While low has not passed high, there is still a valid range left to check, so we compute mid, the midpoint of that range.',
      'If nums[mid] equals target, we have found it, so we return mid immediately.',
      'If nums[mid] is less than target, the target (if present) must be somewhere to the right, so we move low to mid + 1, discarding the left half.',
      'If nums[mid] is greater than target, the target must be to the left, so we move high to mid - 1, discarding the right half.',
      'Each iteration roughly halves the remaining search space, which is what gives binary search its O(log n) time complexity.',
      'If low ever passes high, the search range is empty, meaning the target does not exist in the array, so we return -1.',
    ],
    timeComplexity: 'O(log n) — the search range is halved on every iteration.',
    spaceComplexity: 'O(1) — only a few index variables are used, regardless of array size (for the iterative version).',
    commonMistakes: [
      'Using binary search on an unsorted array, where the whole technique breaks down.',
      'Off-by-one errors, like using low < high instead of low <= high, which can miss the target when the range narrows to a single element.',
      'Computing mid as (low + high) / 2 in a language where this could overflow for very large arrays (a non-issue in Python/JS for realistic sizes, but worth knowing as a general concern).',
      'Forgetting to update low or high inside the loop, which causes an infinite loop.',
    ],
    followUp: 'How would you adapt binary search to find the first or last occurrence of a target value that appears multiple times in the array?',
    starterCodePython: `def binary_search(nums, target):
    # Write your solution here
    pass

# Example call:
# print(binary_search([-1, 0, 3, 5, 9, 12], 9))  # Expected: 4
`,
    starterCodeJavaScript: `function binarySearch(nums, target) {
  // Write your solution here
}

// Example call:
// console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9)); // Expected: 4
`,
    testCases: [
      { args: '[-1, 0, 3, 5, 9, 12], 9', expected: '4' },
      { args: '[-1, 0, 3, 5, 9, 12], 2', expected: '-1' },
      { args: '[5], 5', expected: '0' },
    ],
  },
  {
    id: 'cb-010',
    title: 'Anagram Detection',
    difficulty: 'Beginner',
    problem:
      'Given two strings `s1` and `s2`, return `true` if they are anagrams of each other (contain exactly the same characters with the same frequencies, ignoring case), and `false` otherwise.',
    examples: [
      { input: 's1 = "listen", s2 = "silent"', output: 'true' },
      { input: 's1 = "Dormitory", s2 = "DirtyRoom"', output: 'true', explanation: 'Case is ignored, and both contain the same letters with the same frequency' },
      { input: 's1 = "hello", s2 = "world"', output: 'false' },
    ],
    hints: [
      'If two strings are anagrams, sorting both of their characters should produce identical results.',
      'Alternatively, count the frequency of each character in both strings and compare the two counts.',
      'Remember to normalise case (and consider whether spaces should count) before comparing.',
    ],
    approach:
      'Normalise both strings to the same case, then compare a character-frequency count of each. Two straightforward ways to do this: sort the characters of both strings and check if the sorted results are equal, or build a frequency dictionary for each string and compare the dictionaries directly. Both approaches correctly ignore character order while checking that the same letters appear the same number of times.',
    solutionPython: `def is_anagram(s1, s2):
    """Return True if s1 and s2 are anagrams of each other (case-insensitive)."""
    s1_clean = s1.lower().replace(" ", "")
    s2_clean = s2.lower().replace(" ", "")

    if len(s1_clean) != len(s2_clean):
        return False

    return sorted(s1_clean) == sorted(s2_clean)`,
    solutionJavaScript: `function isAnagram(s1, s2) {
  const clean = (s) => s.toLowerCase().split(" ").join("");
  const s1Clean = clean(s1);
  const s2Clean = clean(s2);

  if (s1Clean.length !== s2Clean.length) {
    return false;
  }

  const sort = (s) => s.split("").sort().join("");
  return sort(s1Clean) === sort(s2Clean);
}`,
    explanation: [
      'Both strings are first lower-cased and have spaces removed, so comparisons are case-insensitive and not affected by whitespace differences.',
      'We first check the cleaned lengths are equal — if they are not, the strings cannot possibly be anagrams, and we can return False/false immediately without doing more work.',
      'sorted(s1_clean) rearranges the characters of the first string into a consistent, sorted order — for example "listen" becomes the sorted list of its letters.',
      'The same sorting is applied to the second string.',
      'If the two sorted character sequences are exactly equal, then both strings contain exactly the same letters in the same quantities, which is the definition of an anagram.',
      'If they differ at all, at least one character\'s frequency differs between the two strings, so they are not anagrams.',
    ],
    timeComplexity: 'O(n log n) — dominated by sorting each string\'s characters, where n is the string length.',
    spaceComplexity: 'O(n) — for the cleaned and sorted copies of each string.',
    commonMistakes: [
      'Forgetting to normalise case, so "Listen" and "Silent" are incorrectly marked as not anagrams.',
      'Not checking lengths first, which is a cheap early exit before doing more expensive work.',
      'Using a frequency-count approach but forgetting to check that every count matches, not just that the total character count matches.',
      'Not deciding consistently whether spaces or punctuation should count — being explicit about this matters for a real interview answer.',
    ],
    followUp: 'How would you solve this in O(n) time instead of O(n log n), avoiding the sort entirely?',
    starterCodePython: `def is_anagram(s1, s2):
    # Write your solution here
    pass

# Example call:
# print(is_anagram("listen", "silent"))  # Expected: True
`,
    starterCodeJavaScript: `function isAnagram(s1, s2) {
  // Write your solution here
}

// Example call:
// console.log(isAnagram("listen", "silent")); // Expected: true
`,
    testCases: [
      { args: '"listen", "silent"', expected: 'true' },
      { args: '"Dormitory", "DirtyRoom"', expected: 'true' },
      { args: '"hello", "world"', expected: 'false' },
    ],
  },
]
