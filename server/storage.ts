import {
  Problem,
  InsertProblem,
  User,
  InsertUser,
  Submission,
  InsertSubmission,
  UserProgress,
  InsertUserProgress,
  DifficultyLevel,
  SubmissionStatus,
  Example,
  TestCase
} from "@shared/schema";

// Define Storage Interface
export interface IStorage {
  // Problem methods
  getProblems(): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  getProblemBySlug(slug: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Submission methods
  getSubmissions(userId: number): Promise<Submission[]>;
  getSubmission(id: number): Promise<Submission | undefined>;
  getSubmissionsByProblem(problemId: number): Promise<Submission[]>;
  getSubmissionsByUser(userId: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;

  // UserProgress methods
  getUserProgress(userId: number, problemId: number): Promise<UserProgress | undefined>;
  getUserProgressByUser(userId: number): Promise<UserProgress[]>;
  createUserProgress(userProgress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, userProgress: Partial<UserProgress>): Promise<UserProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private problems: Map<number, Problem>;
  private submissions: Map<number, Submission>;
  private userProgress: Map<number, UserProgress>;
  private userId: number;
  private problemId: number;
  private submissionId: number;
  private userProgressId: number;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.submissions = new Map();
    this.userProgress = new Map();
    this.userId = 1;
    this.problemId = 1;
    this.submissionId = 1;
    this.userProgressId = 1;

    // Initialize with sample problems
    this.initSampleProblems();
  }

  // Problem methods
  async getProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    return this.problems.get(id);
  }

  async getProblemBySlug(slug: string): Promise<Problem | undefined> {
    return Array.from(this.problems.values()).find(problem => problem.slug === slug);
  }

  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const id = this.problemId++;
    const problem: Problem = { ...insertProblem, id };
    this.problems.set(id, problem);
    return problem;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Submission methods
  async getSubmissions(userId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.userId === userId
    );
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsByProblem(problemId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.problemId === problemId
    );
  }

  async getSubmissionsByUser(userId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.userId === userId
    );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.submissionId++;
    const submission: Submission = { ...insertSubmission, id };
    this.submissions.set(id, submission);
    return submission;
  }

  // UserProgress methods
  async getUserProgress(userId: number, problemId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === userId && progress.problemId === problemId
    );
  }

  async getUserProgressByUser(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createUserProgress(insertUserProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.userProgressId++;
    const userProgress: UserProgress = { ...insertUserProgress, id };
    this.userProgress.set(id, userProgress);
    return userProgress;
  }

  async updateUserProgress(id: number, userProgressUpdate: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...userProgressUpdate };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Initialize sample problems
  private initSampleProblems() {
    const sampleProblems: InsertProblem[] = [
      {
        title: "Two Sum",
        slug: "two-sum",
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
        difficulty: DifficultyLevel.EASY,
        tags: ["Array", "Hash Table"],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]"
          },
          {
            input: "nums = [3,3], target = 6",
            output: "[0,1]"
          }
        ],
        testCases: [
          {
            input: '[2,7,11,15],9',
            output: '[0,1]'
          },
          {
            input: '[3,2,4],6',
            output: '[1,2]'
          },
          {
            input: '[3,3],6',
            output: '[0,1]'
          },
          {
            input: '[1,2,3,4,5],9',
            output: '[3,4]'
          }
        ],
        codeTemplate: {
          javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your solution here
    
};`,
          python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your solution here
        pass`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        
    }
}`
        },
        acceptanceRate: 78
      },
      {
        title: "Add Two Numbers",
        slug: "add-two-numbers",
        description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
        difficulty: DifficultyLevel.MEDIUM,
        tags: ["Linked List", "Math", "Recursion"],
        examples: [
          {
            input: "l1 = [2,4,3], l2 = [5,6,4]",
            output: "[7,0,8]",
            explanation: "342 + 465 = 807."
          },
          {
            input: "l1 = [0], l2 = [0]",
            output: "[0]"
          },
          {
            input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
            output: "[8,9,9,9,0,0,0,1]"
          }
        ],
        testCases: [
          {
            input: '[2,4,3],[5,6,4]',
            output: '[7,0,8]'
          },
          {
            input: '[0],[0]',
            output: '[0]'
          },
          {
            input: '[9,9,9,9,9,9,9],[9,9,9,9]',
            output: '[8,9,9,9,0,0,0,1]'
          }
        ],
        codeTemplate: {
          javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    // Your solution here
    
};`,
          python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        # Your solution here
        pass`,
          java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Your solution here
        
    }
}`
        },
        acceptanceRate: 65
      },
      {
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating-characters",
        description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
        difficulty: DifficultyLevel.MEDIUM,
        tags: ["String", "Sliding Window", "Hash Table"],
        examples: [
          {
            input: 's = "abcabcbb"',
            output: "3",
            explanation: "The answer is 'abc', with the length of 3."
          },
          {
            input: 's = "bbbbb"',
            output: "1",
            explanation: "The answer is 'b', with the length of 1."
          },
          {
            input: 's = "pwwkew"',
            output: "3",
            explanation: "The answer is 'wke', with the length of 3. Notice that the answer must be a substring, 'pwke' is a subsequence and not a substring."
          }
        ],
        testCases: [
          {
            input: '"abcabcbb"',
            output: '3'
          },
          {
            input: '"bbbbb"',
            output: '1'
          },
          {
            input: '"pwwkew"',
            output: '3'
          },
          {
            input: '""',
            output: '0'
          }
        ],
        codeTemplate: {
          javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // Your solution here
    
};`,
          python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Your solution here
        pass`,
          java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your solution here
        
    }
}`
        },
        acceptanceRate: 71
      },
      {
        title: "Valid Palindrome",
        slug: "valid-palindrome",
        description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.`,
        difficulty: DifficultyLevel.EASY,
        tags: ["String", "Two Pointers"],
        examples: [
          {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.'
          },
          {
            input: 's = "race a car"',
            output: "false",
            explanation: '"raceacar" is not a palindrome.'
          },
          {
            input: 's = " "',
            output: "true",
            explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
          }
        ],
        testCases: [
          {
            input: '"A man, a plan, a canal: Panama"',
            output: 'true'
          },
          {
            input: '"race a car"',
            output: 'false'
          },
          {
            input: '" "',
            output: 'true'
          }
        ],
        codeTemplate: {
          javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // Your solution here
    
};`,
          python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Your solution here
        pass`,
          java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your solution here
        
    }
}`
        },
        acceptanceRate: 82
      },
      {
        title: "Longest Valid Parentheses",
        slug: "longest-valid-parentheses",
        description: `Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.`,
        difficulty: DifficultyLevel.HARD,
        tags: ["String", "Dynamic Programming", "Stack"],
        examples: [
          {
            input: 's = "(()"',
            output: "2",
            explanation: 'The longest valid parentheses substring is "()".'
          },
          {
            input: 's = ")()())"',
            output: "4",
            explanation: 'The longest valid parentheses substring is "()()".'
          },
          {
            input: 's = ""',
            output: "0"
          }
        ],
        testCases: [
          {
            input: '"(()"',
            output: '2'
          },
          {
            input: '")()())"',
            output: '4'
          },
          {
            input: '""',
            output: '0'
          },
          {
            input: '"()(()"',
            output: '2'
          }
        ],
        codeTemplate: {
          javascript: `/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    // Your solution here
    
};`,
          python: `class Solution:
    def longestValidParentheses(self, s: str) -> int:
        # Your solution here
        pass`,
          java: `class Solution {
    public int longestValidParentheses(String s) {
        // Your solution here
        
    }
}`
        },
        acceptanceRate: 32
      },
      {
        title: "Binary Tree Maximum Path Sum",
        slug: "binary-tree-maximum-path-sum",
        description: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.

The **path sum** of a path is the sum of the node's values in the path.

Given the \`root\` of a binary tree, return the maximum **path sum** of any **non-empty** path.`,
        difficulty: DifficultyLevel.HARD,
        tags: ["Binary Tree", "Depth-First Search", "Dynamic Programming"],
        examples: [
          {
            input: 'root = [1,2,3]',
            output: "6",
            explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.'
          },
          {
            input: 'root = [-10,9,20,null,null,15,7]',
            output: "42",
            explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.'
          }
        ],
        testCases: [
          {
            input: '[1,2,3]',
            output: '6'
          },
          {
            input: '[-10,9,20,null,null,15,7]',
            output: '42'
          },
          {
            input: '[1]',
            output: '1'
          },
          {
            input: '[-3]',
            output: '-3'
          }
        ],
        codeTemplate: {
          javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function(root) {
    // Your solution here
    
};`,
          python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxPathSum(self, root: TreeNode) -> int:
        # Your solution here
        pass`,
          java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxPathSum(TreeNode root) {
        // Your solution here
        
    }
}`
        },
        acceptanceRate: 36
      }
    ];

    // Add sample problems to storage
    sampleProblems.forEach(problem => {
      const id = this.problemId++;
      const fullProblem: Problem = { ...problem, id };
      this.problems.set(id, fullProblem);
    });

    // Add a sample user
    this.createUser({ username: "user", password: "password" });
  }
}

export const storage = new MemStorage();
