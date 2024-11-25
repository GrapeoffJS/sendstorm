# Contributing to SendStorm

Thank you for your interest in contributing to **SendStorm**! This document outlines the rules and conventions for
contributing to the project. Please follow these guidelines to ensure a consistent and high-quality codebase.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Commit Message Guidelines](#commit-message-guidelines)
3. [Branching Rules](#branching-rules)
4. [Pull Request Process](#pull-request-process)
5. [Development Setup](#development-setup)
6. [Testing](#testing)
7. [Contact](#contact)

---

## Code of Conduct

By contributing to this project, you agree to adhere to the principles outlined in
our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard to maintain a clean and informative
commit history.

### Commit Format

Use `Commitizen` for writing commits:

```bash
$ npx cz
```

1. **type**: Type of change

- `feat`: Introducing a new feature.
- `fix`: Fixing a bug.
- `docs`: Updating documentation.
- `style`: Code style changes (e.g., formatting).
- `refactor`: Code changes without adding features or fixing bugs.
- `test`: Adding or updating tests.
- `build`: Changes affecting the build system or dependencies.
- `ci`: Changes to CI/CD configurations.
- `chore`: Miscellaneous tasks (e.g., dependency updates).
- `perf`: Performance improvements.

2. **scope**: Area of change

Examples: `cli`, `tcp`, `core`, `docs`.

3. **short description**: Summary of changes

- Use an imperative tone (e.g., “Add interactive mode” instead of “Added”).
- Keep it under 50 characters.

### Example Commits

#### Adding a feature:

`feat(cli): add interactive mode for TCP requests`

#### Fixing a bug:

`fix(tcp): resolve connection timeout issue`

#### Updating documentation:

`docs: improve setup instructions in README`

---

## Branching Rules

We use the following branching strategy to manage our development workflow:

### Main Branches

1. **master**:

- The stable branch with production-ready code.
- Direct pushes are prohibited.

2. **dev**:

- The active development branch.
- New features and fixes are merged here before going to `master`.

### Feature and Fix Branches

For new features, fixes, and experiments, create temporary branches off `dev`:

#### Feature branches:

`feature/<short-description>`

Example: `feature/add-color-support`

#### Fix branches:

`fix/<short-description>`

Example: `fix/cli-output-error`

#### Experimental branches:

`experiment/<short-description>`

Example: `experiment/performance-improvements`

### Release Branches

For release preparation:

`release/<version>`

Example: `release/1.0.0`

---

## Pull Request Process

1. **Create a branch**:

- Ensure your branch name follows the Branching Rules.

2. **Write clean commits**:

- Follow the Commit Message Guidelines.

3. **Run tests locally**:

- Ensure all tests pass before opening a PR.

4. **Submit your pull request**:

- Write a clear title and description.
- Link related issues (if applicable).
- Add test scenarios for reviewers.

---

## Development Setup

To set up the project locally:

1. Clone the repository:

```bash
$ git clone https://github.com/YourUsername/SendStorm.git
$ cd SendStorm
```

2. Install dependencies:

```bash
$ yarn install
```

3. Build the project:

```bash
$ yarn build
```

---

## Testing

1. Run all tests:

```bash
$ yarn test
```

2. Run tests in watch mode:

```bash
$ yarn test --watch
```

3. Lint the code:

```bash
$ yarn lint
```

---

## Contact

If you have questions or need help, feel free to:

- Open an issue on GitHub Issues.
- Reach out via email: grapeoff.official@gmail.com.
