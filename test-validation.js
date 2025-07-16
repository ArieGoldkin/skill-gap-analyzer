// Quick test of the validation service
const { codingChallengeService } = require('./lib/validation-service.ts');

// Test challenge generation
try {
  const challenge = codingChallengeService.generateChallenge(
    'skill-1',
    'JavaScript',
    'programming',
    'beginner',
    'javascript'
  );

  console.log('✅ Challenge generated successfully');
  console.log('Challenge ID:', challenge.id);
  console.log('Title:', challenge.title);
  console.log('Difficulty:', challenge.difficulty);

  // Test challenge validation
  const testCode = `
    function sumEvenNumbers(arr) {
      return arr.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);
    }
  `;

  codingChallengeService
    .validateChallenge(challenge.id, testCode, 300)
    .then(result => {
      console.log('✅ Challenge validation completed');
      console.log('Score:', result.score);
      console.log('Feedback:', result.feedback);
    })
    .catch(err => {
      console.log('❌ Validation error:', err.message);
    });
} catch (error) {
  console.log('❌ Test failed:', error.message);
}
