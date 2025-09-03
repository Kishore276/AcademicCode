const { db } = require('./config/firebase');
const userService = require('./services/userService');
const problemService = require('./services/problemService');
const contestService = require('./services/contestService');

async function seedFirebase() {
  try {
    console.log('🌱 Seeding Firebase database...');

    // Create sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@codingplatform.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        username: 'teacher1',
        email: 'teacher1@codingplatform.com',
        password: 'teacher123',
        name: 'John Smith',
        role: 'teacher'
      },
      {
        username: 'teacher2',
        email: 'teacher2@codingplatform.com',
        password: 'teacher123',
        name: 'Sarah Wilson',
        role: 'teacher'
      },
      {
        username: 'student1',
        email: 'student1@codingplatform.com',
        password: 'student123',
        name: 'Alice Johnson',
        role: 'student'
      },
      {
        username: 'student2',
        email: 'student2@codingplatform.com',
        password: 'student123',
        name: 'Bob Brown',
        role: 'student'
      },
      {
        username: 'student3',
        email: 'student3@codingplatform.com',
        password: 'student123',
        name: 'Charlie Davis',
        role: 'student'
      }
    ];

    console.log('👥 Creating users...');
    for (const userData of users) {
      try {
        await userService.createUser(userData);
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
      } catch (error) {
        console.log(`⚠️  User ${userData.username} already exists or error: ${error.message}`);
      }
    }

    // Create sample problems
    const problems = [
      {
        title: 'Two Sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
        difficulty: 'easy',
        category: 'Arrays',
        tags: ['array', 'hash-table'],
        testCases: [
          {
            input: '[2,7,11,15]\n9',
            expectedOutput: '[0,1]',
            explanation: '2 + 7 = 9'
          },
          {
            input: '[3,2,4]\n6',
            expectedOutput: '[1,2]',
            explanation: '2 + 4 = 6'
          }
        ],
        constraints: {
          timeLimit: 1000,
          memoryLimit: 256
        }
      },
      {
        title: 'Valid Parentheses',
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
        difficulty: 'easy',
        category: 'Strings',
        tags: ['string', 'stack'],
        testCases: [
          {
            input: '"()"',
            expectedOutput: 'true',
            explanation: 'Valid parentheses'
          },
          {
            input: '"(]"',
            expectedOutput: 'false',
            explanation: 'Invalid parentheses'
          }
        ],
        constraints: {
          timeLimit: 1000,
          memoryLimit: 256
        }
      },
      {
        title: 'Reverse String',
        description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

Example 2:
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]`,
        difficulty: 'easy',
        category: 'Strings',
        tags: ['string', 'two-pointers'],
        testCases: [
          {
            input: '["h","e","l","l","o"]',
            expectedOutput: '["o","l","l","e","h"]',
            explanation: 'Reverse the string in-place'
          }
        ],
        constraints: {
          timeLimit: 1000,
          memoryLimit: 256
        }
      },
      {
        title: 'Maximum Subarray',
        description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23`,
        difficulty: 'medium',
        category: 'Dynamic Programming',
        tags: ['array', 'dynamic-programming'],
        testCases: [
          {
            input: '[-2,1,-3,4,-1,2,1,-5,4]',
            expectedOutput: '6',
            explanation: 'Kadane\'s algorithm'
          }
        ],
        constraints: {
          timeLimit: 1000,
          memoryLimit: 256
        }
      },
      {
        title: 'Binary Tree Inorder Traversal',
        description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Example 1:
Input: root = [1,null,2,3]
Output: [1,3,2]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]`,
        difficulty: 'easy',
        category: 'Trees',
        tags: ['tree', 'depth-first-search'],
        testCases: [
          {
            input: '[1,null,2,3]',
            expectedOutput: '[1,3,2]',
            explanation: 'Inorder: left -> root -> right'
          }
        ],
        constraints: {
          timeLimit: 1000,
          memoryLimit: 256
        }
      }
    ];

    console.log('📝 Creating problems...');
    for (const problemData of problems) {
      try {
        await problemService.createProblem({
          ...problemData,
          createdBy: 'default-admin-id'
        });
        console.log(`✅ Created problem: ${problemData.title} (${problemData.difficulty})`);
      } catch (error) {
        console.log(`⚠️  Problem ${problemData.title} already exists or error: ${error.message}`);
      }
    }

    // Create sample contests
    const contests = [
      {
        title: 'Weekly Coding Challenge',
        description: 'A weekly coding challenge featuring problems of varying difficulty levels. Perfect for students to practice their programming skills.',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
        duration: 120, // 2 hours in minutes
        problems: [], // Will be populated with problem IDs
        rules: [
          'No external resources allowed',
          'All submissions must be original',
          'Time limit: 2 hours',
          'Maximum 3 attempts per problem'
        ],
        prizes: [
          '1st Place: $100 gift card',
          '2nd Place: $50 gift card',
          '3rd Place: $25 gift card'
        ],
        createdBy: 'default-admin-id'
      },
      {
        title: 'Beginner Friendly Contest',
        description: 'A contest designed specifically for beginners. Features easy and medium difficulty problems to help new programmers get started.',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
        duration: 180, // 3 hours in minutes
        problems: [], // Will be populated with problem IDs
        rules: [
          'Open to all skill levels',
          'Collaboration allowed',
          'Time limit: 3 hours',
          'Unlimited attempts'
        ],
        prizes: [
          'Participation certificates for all',
          'Top 10 get special recognition'
        ],
        createdBy: 'default-admin-id'
      }
    ];

    console.log('🏆 Creating contests...');
    for (const contestData of contests) {
      try {
        await contestService.createContest(contestData);
        console.log(`✅ Created contest: ${contestData.title}`);
      } catch (error) {
        console.log(`⚠️  Contest ${contestData.title} already exists or error: ${error.message}`);
      }
    }

    console.log('🎉 Database seeding completed!');
    console.log('\n📊 Sample Data Created:');
    console.log('- 6 users (2 admins, 2 teachers, 3 students)');
    console.log('- 5 coding problems (3 easy, 1 medium, 1 easy)');
    console.log('- 2 contests (weekly and beginner-friendly)');
    console.log('\n🔑 Test Credentials:');
    console.log('- Admin: admin@codingplatform.com / admin123');
    console.log('- Teacher: teacher1@codingplatform.com / teacher123');
    console.log('- Student: student1@codingplatform.com / student123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedFirebase(); 