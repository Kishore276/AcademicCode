const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class PDFExtractor {
  constructor() {
    this.supportedFormats = ['pdf'];
  }

  /**
   * Extract questions from a PDF file
   * @param {Buffer} pdfBuffer - The PDF file buffer
   * @param {string} filename - Original filename for reference
   * @returns {Promise<Array>} Array of extracted questions
   */
  async extractQuestions(pdfBuffer, filename) {
    try {
      const data = await pdfParse(pdfBuffer);
      const text = data.text;
      
      // Parse the text and extract questions
      const questions = this.parseQuestionsFromText(text, filename);
      
      return {
        success: true,
        questions: questions,
        totalQuestions: questions.length,
        filename: filename
      };
    } catch (error) {
      console.error('Error extracting questions from PDF:', error);
      return {
        success: false,
        error: error.message,
        filename: filename
      };
    }
  }

  /**
   * Parse questions from extracted text
   * @param {string} text - The extracted text from PDF
   * @param {string} filename - Original filename
   * @returns {Array} Array of question objects
   */
  parseQuestionsFromText(text, filename) {
    const questions = [];
    
    // Split text into lines
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion = null;
    let questionNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for question patterns
      if (this.isQuestionStart(line)) {
        // Save previous question if exists
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        // Start new question
        currentQuestion = {
          title: this.extractQuestionTitle(line),
          description: '',
          difficulty: 'medium',
          category: this.extractCategoryFromFilename(filename),
          tags: [],
          testCases: [],
          constraints: {
            timeLimit: 1000,
            memoryLimit: 256,
            inputFormat: '',
            outputFormat: ''
          }
        };
        
        questionNumber++;
      } else if (currentQuestion) {
        // Add content to current question
        if (line) {
          currentQuestion.description += line + '\n';
        }
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    // If no questions found, create a single question from the entire text
    if (questions.length === 0) {
      questions.push({
        title: `Question from ${filename}`,
        description: text,
        difficulty: 'medium',
        category: this.extractCategoryFromFilename(filename),
        tags: ['pdf-import'],
        testCases: [],
        constraints: {
          timeLimit: 1000,
          memoryLimit: 256,
          inputFormat: '',
          outputFormat: ''
        }
      });
    }
    
    return questions;
  }

  /**
   * Check if a line indicates the start of a question
   * @param {string} line - The line to check
   * @returns {boolean} True if line starts a question
   */
  isQuestionStart(line) {
    const questionPatterns = [
      /^\d+\.\s/,           // 1. Question
      /^Q\d+\.\s/i,         // Q1. Question
      /^Question\s+\d+\.\s/i, // Question 1. 
      /^Problem\s+\d+\.\s/i,  // Problem 1.
      /^\d+\)\s/,           // 1) Question
      /^[A-Z]\)\s/,         // A) Question
      /^[a-z]\)\s/          // a) Question
    ];
    
    return questionPatterns.some(pattern => pattern.test(line));
  }

  /**
   * Extract question title from the question line
   * @param {string} line - The question line
   * @returns {string} The question title
   */
  extractQuestionTitle(line) {
    // Remove question number and return the title
    const patterns = [
      /^\d+\.\s+(.+)/,
      /^Q\d+\.\s+(.+)/i,
      /^Question\s+\d+\.\s+(.+)/i,
      /^Problem\s+\d+\.\s+(.+)/i,
      /^\d+\)\s+(.+)/,
      /^[A-Z]\)\s+(.+)/,
      /^[a-z]\)\s+(.+)/
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    return line.trim();
  }

  /**
   * Extract category from filename
   * @param {string} filename - The original filename
   * @returns {string} The category
   */
  extractCategoryFromFilename(filename) {
    const name = path.basename(filename, path.extname(filename)).toLowerCase();
    
    if (name.includes('array') || name.includes('list')) return 'Arrays';
    if (name.includes('string')) return 'Strings';
    if (name.includes('tree') || name.includes('binary')) return 'Trees';
    if (name.includes('graph')) return 'Graphs';
    if (name.includes('dynamic') || name.includes('dp')) return 'Dynamic Programming';
    if (name.includes('sort') || name.includes('search')) return 'Sorting & Searching';
    if (name.includes('math') || name.includes('number')) return 'Mathematics';
    if (name.includes('greedy')) return 'Greedy';
    if (name.includes('backtrack')) return 'Backtracking';
    if (name.includes('recursion')) return 'Recursion';
    
    return 'General';
  }

  /**
   * Validate if the file is a supported format
   * @param {string} filename - The filename to validate
   * @returns {boolean} True if supported
   */
  isSupportedFormat(filename) {
    const ext = path.extname(filename).toLowerCase();
    return this.supportedFormats.includes(ext.substring(1));
  }
}

module.exports = new PDFExtractor(); 