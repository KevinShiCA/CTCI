# CTCI Data Structures and Algorithms
This repository contains common data structures and algorithms found in CTCI. Implementations are written in TypeScript and Go.

## Setup
This codebase is meant to be used with VS Code.

1. Clone the repository
2. `cd ctci && code .`

## Prerequisites
* yarn 1.7.x
* Jest 22.0.0+
* Go 1.10.x

## Running TypeScript Tests
1. Install dependencies by opening the command palette (Ctrl/Cmd + P) and running `task Install TypeScript dependencies`
2. Run unit tests by opening the command palette and running `task Jest unit tests`
3. See coverage results by opening `ctci/typescript/coverage/lcov-report/index.html` in your browser

## Running Go Tests
Run unit tests by opening the command palette and running `task Go unit tests`

# Assumptions
All algorithms include time and space complexity analysis. These values make the following assumptions:
1. String concatenation time complexity for JavaScript and Go are O(n).
2. JavaScript objects and Go maps are implemented in a way similar to hash tables. That is, they support (key, value) pair storage with average O(1) time complexity for searching, insertion, and deletion. A hashmap implementation is provided for educational purposes but these built in data structures are used for simplicity.
