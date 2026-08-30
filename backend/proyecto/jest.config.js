module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$', // Ejecutar solo archivos .spec.ts
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    collectCoverage: true, // Opcional: Muestra cobertura de código
    coverageDirectory: './coverage',
    moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  };
  