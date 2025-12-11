# Contributing to ABMind Course Portal

Welcome to the ABMind Course Portal! This guide will help you contribute courses, resources, and other content to our community platform.

## Table of Contents

- [Quick Start](#quick-start)
- [Adding New Courses](#adding-new-courses)
- [Adding Resources](#adding-resources)
- [Adding Learning Paths](#adding-learning-paths)
- [Content Structure and Validation](#content-structure-and-validation)
- [Style Guide](#style-guide)
- [Troubleshooting](#troubleshooting)
- [Development Setup](#development-setup)

## Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Add your content** to the appropriate YAML files in the `data/` directory
4. **Test your changes** locally (optional but recommended)
5. **Submit a pull request** with your changes

## Adding New Courses

### Course File Structure

Courses are stored in `data/courses/` as individual YAML files. Each course should have a unique filename that reflects the course content.

### Course YAML Template

Create a new file in `data/courses/` with the following structure:

```yaml
# Course ID - must be unique and match the filename (without .yaml)
id: "your-course-id"

# Course title in Chinese or English
title: "Your Course Title"

# Course type: 'course', 'workshop', or 'reading_group'
type: "course"

# Year the course was conducted
year: 2024

# Difficulty level: 'beginner', 'intermediate', or 'advanced'
difficulty: "beginner"

# Tags for categorization and search
tags:
  - "mesa"
  - "agent-based-modeling"
  - "urban-planning"

# List of instructors
instructors:
  - "Instructor Name 1"
  - "Instructor Name 2"

# Language: 'zh' for Chinese, 'en' for English
language: "zh"

# Brief summary of the course
summary: "A comprehensive introduction to agent-based modeling using Mesa framework, focusing on urban planning applications."

# Course sessions
sessions:
  - id: "session-1"
    title: "Introduction to ABM"
    objectives:
      - "Understand basic concepts of agent-based modeling"
      - "Set up Mesa development environment"
    materials:
      slides: "https://example.com/slides/session1.pdf"
      code_repo: "https://github.com/your-org/session1-code"
      recording: "https://example.com/recording/session1"
      references:
        - title: "Agent-Based Modeling: A Practical Introduction"
          url: "https://example.com/book/abm-intro"
          type: "book"

# External links related to the course
external_links:
  course_page: "https://example.com/course/your-course"
  materials_repo: "https://github.com/your-org/course-materials"

# Last updated date (YYYY-MM-DD format)
last_updated: "2024-12-11"
```

### Required Fields

- `id`: Unique identifier (must match filename without .yaml)
- `title`: Course title
- `type`: One of 'course', 'workshop', 'reading_group'
- `year`: Year conducted (number)
- `difficulty`: One of 'beginner', 'intermediate', 'advanced'
- `tags`: Array of strings for categorization
- `instructors`: Array of instructor names
- `language`: 'zh' or 'en'
- `summary`: Brief description
- `sessions`: Array of session objects
- `last_updated`: Date in YYYY-MM-DD format

### Optional Fields

- `external_links`: Course page and materials repository
- Session materials (slides, code_repo, recording, references)

## Adding Resources

Resources are stored in `data/resources.yaml`. Add new resources to the existing array:

```yaml
resources:
  - id: "your-resource-id"
    title: "Resource Title"
    type: "docs"  # 'docs', 'tutorial', 'paper', 'book', 'dataset', 'tool'
    url: "https://example.com/resource"
    tags:
      - "mesa"
      - "documentation"
    description: "Brief description of the resource"
    language: "zh"  # 'zh' or 'en'
    difficulty: "beginner"  # optional: 'beginner', 'intermediate', 'advanced'
```

## Adding Learning Paths

Learning paths are stored in `data/learning_paths.yaml`. Add new paths to the existing array:

```yaml
learning_paths:
  - id: "your-path-id"
    title: "Learning Path Title"
    description: "Description of what this learning path covers"
    recommended_audience: "Who should follow this path"
    estimated_duration: "4-6 weeks"
    steps:
      - order: 1
        type: "course"  # 'course', 'resource', or 'practice'
        course_id: "existing-course-id"  # reference to course
        note: "Start with basic concepts"
        optional: false
      - order: 2
        type: "resource"
        resource_id: "existing-resource-id"  # reference to resource
        note: "Additional reading"
        optional: true
```

## Content Structure and Validation

### File Naming Conventions

- **Courses**: Use kebab-case, descriptive names: `mesa-workshop-2024.yaml`
- **IDs**: Must match filename (without extension) and be unique
- **URLs**: Always use HTTPS when possible

### Data Validation

The system automatically validates all YAML files against predefined schemas. Common validation rules:

1. **Required fields** must be present
2. **URLs** must be valid format
3. **Dates** must be in YYYY-MM-DD format
4. **Enum values** (type, difficulty, language) must match allowed values
5. **References** between learning paths and courses/resources must be valid

### Testing Your Changes

Before submitting, you can test your changes locally:

```bash
# Install dependencies
npm install

# Validate content
npm run validate:content

# Run all tests
npm test

# Start development server (optional)
npm run dev
```

## Style Guide

### Content Writing

1. **Course Titles**: Use clear, descriptive titles
   - ✅ "Mesa Framework Workshop: Urban Planning Applications"
   - ❌ "Workshop 2024"

2. **Descriptions**: Write concise but informative summaries
   - Include target audience
   - Mention key technologies/frameworks
   - Highlight practical applications

3. **Tags**: Use consistent, searchable tags
   - Prefer lowercase
   - Use hyphens for multi-word tags: `agent-based-modeling`
   - Include framework names: `mesa`, `netlogo`
   - Include application domains: `urban-planning`, `ecology`

### YAML Formatting

1. **Indentation**: Use 2 spaces (no tabs)
2. **Quotes**: Use double quotes for strings containing special characters
3. **Arrays**: Use consistent formatting:
   ```yaml
   tags:
     - "first-tag"
     - "second-tag"
   ```

4. **URLs**: Always include protocol (https://)
5. **Dates**: Use YYYY-MM-DD format consistently

### Chinese Content Guidelines

1. **Mixed Language**: When mixing Chinese and English, ensure proper spacing
2. **Technical Terms**: Use established Chinese translations when available
3. **Encoding**: Ensure UTF-8 encoding for all files

## Troubleshooting

### Common Issues

#### 1. YAML Syntax Errors

**Error**: `YAMLException: can not read a block mapping entry`

**Solution**: Check indentation and ensure proper YAML syntax. Use a YAML validator.

#### 2. Schema Validation Failures

**Error**: `Validation failed: required field missing`

**Solution**: Ensure all required fields are present. Check the template above.

#### 3. Duplicate IDs

**Error**: `Course ID already exists`

**Solution**: Choose a unique ID that doesn't conflict with existing courses.

#### 4. Invalid URLs

**Error**: `Invalid URL format`

**Solution**: Ensure URLs include protocol (https://) and are properly formatted.

#### 5. Reference Errors

**Error**: `Referenced course/resource not found`

**Solution**: Ensure referenced IDs in learning paths exist in the corresponding files.

### Validation Commands

```bash
# Validate all content
npm run validate:all

# Validate only content structure
npm run validate:content

# Check accessibility compliance
npm run validate:accessibility

# Run content quality checks
npm run validate:quality
```

### Getting Help

1. **Check existing examples** in the `data/` directory
2. **Review error messages** carefully - they usually indicate the specific issue
3. **Use YAML validators** online to check syntax
4. **Open an issue** on GitHub if you need help

## Development Setup

If you want to contribute to the codebase or test changes locally:

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/your-org/abmind-course-portal.git
cd abmind-course-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Project Structure

```
abmind-course-portal/
├── data/                    # Content files
│   ├── courses/            # Individual course YAML files
│   ├── learning_paths.yaml # Learning paths configuration
│   ├── resources.yaml      # External resources
│   └── site_config.yaml    # Site configuration
├── src/                    # Source code
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions and data processing
│   └── types/            # TypeScript type definitions
├── scripts/              # Build and validation scripts
└── public/              # Static assets
```

### Making Code Changes

1. **Follow TypeScript best practices**
2. **Write tests** for new functionality
3. **Update documentation** as needed
4. **Run linting**: `npm run lint`
5. **Format code**: `npm run format`

## Submission Guidelines

### Pull Request Process

1. **Create a descriptive branch name**: `add-mesa-workshop-2024`
2. **Write clear commit messages**: "Add Mesa workshop 2024 course content"
3. **Include a detailed PR description**:
   - What content you're adding
   - Any special considerations
   - Links to external resources (if applicable)

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] New course
- [ ] New resource
- [ ] New learning path
- [ ] Documentation update
- [ ] Bug fix

## Content Details
- Course/Resource Title: 
- Instructor(s): 
- Year: 
- Difficulty Level: 

## Checklist
- [ ] YAML syntax is valid
- [ ] All required fields are included
- [ ] Content follows style guide
- [ ] External links are working
- [ ] Local validation passes
```

### Review Process

1. **Automated checks** will run on your PR
2. **Content review** by maintainers
3. **Feedback incorporation** if needed
4. **Merge** once approved

## Community Guidelines

- **Be respectful** and inclusive
- **Provide accurate information** about courses and resources
- **Respect intellectual property** - only link to publicly available materials
- **Help others** by reviewing PRs and answering questions
- **Follow the code of conduct**

Thank you for contributing to the ABMind Course Portal! Your contributions help build a valuable resource for the Chinese ABM community.