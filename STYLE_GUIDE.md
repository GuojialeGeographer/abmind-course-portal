# ABMind Course Portal Style Guide

This style guide ensures consistency across all content in the ABMind Course Portal. Following these guidelines helps maintain quality and improves the user experience.

## Table of Contents

- [Content Writing Guidelines](#content-writing-guidelines)
- [YAML Formatting Standards](#yaml-formatting-standards)
- [Naming Conventions](#naming-conventions)
- [Chinese Content Guidelines](#chinese-content-guidelines)
- [Technical Content Standards](#technical-content-standards)
- [Examples](#examples)

## Content Writing Guidelines

### Course Titles

**Format**: Use clear, descriptive titles that indicate the content and level.

✅ **Good Examples:**
- "Mesa Framework Workshop: Urban Planning Applications"
- "Agent-Based Modeling Fundamentals with Python"
- "Advanced ABM: Multi-Scale Urban Systems"
- "Reading Group: Complex Adaptive Systems"

❌ **Avoid:**
- "Workshop 2024"
- "ABM Course"
- "Session 1"
- "Introduction"

**Rules:**
- Include the main framework/technology (Mesa, NetLogo, etc.)
- Specify the application domain when relevant
- Indicate level (Fundamentals, Advanced, etc.) when appropriate
- Use title case for English titles
- Keep under 80 characters when possible

### Course Descriptions

**Format**: Write 2-3 sentences that cover:
1. What the course teaches
2. Target audience or prerequisites
3. Key outcomes or applications

✅ **Good Example:**
```
This workshop introduces agent-based modeling using the Mesa framework, focusing on urban planning applications. Designed for researchers and practitioners with basic Python knowledge, participants will learn to build, analyze, and visualize spatial ABM models. By the end, attendees will be able to create their own urban simulation models and understand key validation techniques.
```

❌ **Avoid:**
```
This is a course about ABM. We will learn Mesa. It's good for beginners.
```

**Rules:**
- Start with what the course teaches
- Mention target audience and prerequisites
- Include practical outcomes
- Use active voice
- Keep between 50-200 words

### Session Objectives

**Format**: Use action verbs and specific, measurable outcomes.

✅ **Good Examples:**
- "Build a basic spatial ABM model using Mesa"
- "Implement agent decision-making algorithms"
- "Analyze model sensitivity using parameter sweeps"
- "Visualize simulation results with interactive plots"

❌ **Avoid:**
- "Learn about ABM"
- "Understand concepts"
- "Introduction to Mesa"
- "Overview of modeling"

**Rules:**
- Start with action verbs (Build, Implement, Analyze, Create, etc.)
- Be specific about what will be accomplished
- Focus on practical skills
- Limit to 3-5 objectives per session

### Tags

**Format**: Use lowercase, hyphenated tags for consistency.

✅ **Good Examples:**
- `agent-based-modeling`
- `mesa-framework`
- `urban-planning`
- `spatial-analysis`
- `python-programming`
- `data-visualization`

❌ **Avoid:**
- `Agent Based Modeling`
- `Mesa Framework`
- `urbanplanning`
- `spatial_analysis`

**Categories:**
- **Frameworks**: `mesa`, `netlogo`, `repast`, `sugarscape`
- **Languages**: `python`, `java`, `r`, `javascript`
- **Domains**: `urban-planning`, `ecology`, `economics`, `social-science`
- **Techniques**: `spatial-analysis`, `network-analysis`, `machine-learning`
- **Levels**: `beginner`, `intermediate`, `advanced`

## YAML Formatting Standards

### Indentation and Structure

**Rules:**
- Use exactly 2 spaces for indentation (no tabs)
- Maintain consistent indentation throughout
- Use blank lines to separate major sections

```yaml
# Correct formatting
id: "mesa-workshop-2024"
title: "Mesa Framework Workshop"
type: "workshop"

sessions:
  - id: "session-1"
    title: "Introduction to Mesa"
    objectives:
      - "Set up Mesa development environment"
      - "Create first agent-based model"
```

### String Formatting

**Rules:**
- Use double quotes for strings containing special characters
- Use single quotes for simple strings (optional)
- Always quote strings with colons, brackets, or other YAML special characters

```yaml
# Correct
title: "Agent-Based Modeling: Theory and Practice"
summary: "This course covers ABM fundamentals."
url: "https://example.com/course"

# Avoid (may cause parsing issues)
title: Agent-Based Modeling: Theory and Practice
```

### Array Formatting

**Consistent Style:**
```yaml
# Preferred for short lists
tags: ["mesa", "python", "urban-planning"]

# Preferred for longer lists or complex objects
instructors:
  - "Dr. Jane Smith"
  - "Prof. John Doe"

sessions:
  - id: "session-1"
    title: "Introduction"
    objectives:
      - "Understand ABM concepts"
      - "Set up development environment"
```

### URL Formatting

**Rules:**
- Always include protocol (https:// or http://)
- Use HTTPS when available
- Ensure URLs are properly encoded
- Test URLs before submission

```yaml
# Correct
slides: "https://example.com/slides/session1.pdf"
code_repo: "https://github.com/user/repo"

# Incorrect
slides: "example.com/slides/session1.pdf"
code_repo: "github.com/user/repo"
```

## Naming Conventions

### File Names

**Format**: Use kebab-case with descriptive names.

✅ **Good Examples:**
- `mesa-workshop-2024.yaml`
- `urban-modeling-fundamentals.yaml`
- `advanced-spatial-abm.yaml`
- `netlogo-ecology-models.yaml`

❌ **Avoid:**
- `course1.yaml`
- `Workshop_2024.yaml`
- `Mesa Workshop 2024.yaml`
- `course-file.yaml`

**Rules:**
- Use lowercase letters only
- Separate words with hyphens
- Include year when relevant
- Be descriptive but concise
- Match the course ID

### IDs and Identifiers

**Format**: Use kebab-case, unique identifiers.

```yaml
# Course IDs
id: "mesa-urban-planning-2024"

# Session IDs
sessions:
  - id: "intro-to-mesa"
  - id: "spatial-models"
  - id: "visualization-techniques"

# Resource IDs
resources:
  - id: "mesa-documentation"
  - id: "abm-textbook-wilensky"
```

**Rules:**
- Use kebab-case consistently
- Make IDs descriptive but not too long
- Ensure uniqueness across all content
- Avoid special characters except hyphens
- Don't use spaces or underscores

## Chinese Content Guidelines

### Mixed Language Content

**Spacing Rules:**
- Add spaces between Chinese and English text
- Add spaces between Chinese and numbers
- No spaces between Chinese characters

✅ **Correct:**
```
基于 Agent 的建模方法
使用 Mesa 框架进行 ABM 开发
2024 年城市建模工作坊
```

❌ **Incorrect:**
```
基于Agent的建模方法
使用Mesa框架进行ABM开发
2024年城市建模工作坊
```

### Technical Terms

**Translation Guidelines:**
- Use established Chinese translations when available
- Keep English terms in parentheses for clarity
- Be consistent across all content

**Common Terms:**
- Agent-Based Modeling → 基于智能体的建模 (Agent-Based Modeling, ABM)
- Mesa Framework → Mesa 框架
- Spatial Analysis → 空间分析
- Urban Planning → 城市规划
- Complex Systems → 复杂系统

### Title Formatting

**Chinese Titles:**
```yaml
title: "Mesa 框架工作坊：城市规划应用"
summary: "本工作坊介绍如何使用 Mesa 框架进行基于智能体的建模，重点关注城市规划应用。"
```

**Bilingual Titles:**
```yaml
title: "Agent-Based Modeling Workshop / 基于智能体建模工作坊"
```

## Technical Content Standards

### Code References

**Format**: Use consistent formatting for code-related content.

```yaml
# Programming languages
tags: ["python", "javascript", "r"]

# Frameworks and libraries
tags: ["mesa", "matplotlib", "pandas", "geopandas"]

# Code repository naming
code_repo: "https://github.com/abmind/mesa-workshop-2024"
```

### Version Information

**Include Version Info When Relevant:**
```yaml
summary: "Introduction to Mesa 2.0+ framework for agent-based modeling"
requirements:
  - "Python 3.8+"
  - "Mesa 2.0+"
  - "Jupyter Notebook"
```

### Difficulty Levels

**Clear Level Descriptions:**

**Beginner:**
- No prior ABM experience required
- Basic programming knowledge helpful
- Covers fundamental concepts

**Intermediate:**
- Some ABM experience required
- Comfortable with programming
- Builds on basic concepts

**Advanced:**
- Extensive ABM experience
- Strong programming skills
- Covers complex topics and research methods

## Examples

### Complete Course Example

```yaml
id: "mesa-urban-planning-2024"
title: "Mesa Framework Workshop: Urban Planning Applications"
type: "workshop"
year: 2024
difficulty: "intermediate"
tags:
  - "mesa"
  - "python"
  - "urban-planning"
  - "spatial-analysis"
  - "agent-based-modeling"
instructors:
  - "Dr. Li Wei"
  - "Prof. Zhang Ming"
language: "zh"
summary: "本工作坊介绍如何使用 Mesa 框架构建城市规划相关的智能体模型。参与者将学习空间建模技术、智能体决策算法以及结果可视化方法。适合有基础 Python 编程经验的研究者和实践者。"

sessions:
  - id: "mesa-fundamentals"
    title: "Mesa 框架基础"
    objectives:
      - "安装和配置 Mesa 开发环境"
      - "理解智能体和模型的基本概念"
      - "创建第一个简单的 ABM 模型"
    materials:
      slides: "https://example.com/slides/mesa-fundamentals.pdf"
      code_repo: "https://github.com/abmind/mesa-fundamentals"
      references:
        - title: "Mesa Documentation"
          url: "https://mesa.readthedocs.io/"
          type: "docs"

  - id: "spatial-modeling"
    title: "空间建模技术"
    objectives:
      - "实现基于网格的空间模型"
      - "处理地理信息系统 (GIS) 数据"
      - "创建智能体移动和交互规则"
    materials:
      slides: "https://example.com/slides/spatial-modeling.pdf"
      code_repo: "https://github.com/abmind/spatial-modeling"
      recording: "https://example.com/recording/spatial-modeling"

external_links:
  course_page: "https://abmind.org/courses/mesa-urban-planning-2024"
  materials_repo: "https://github.com/abmind/mesa-urban-planning-2024"

last_updated: "2024-12-11"
```

### Resource Example

```yaml
resources:
  - id: "mesa-documentation"
    title: "Mesa Framework Official Documentation"
    type: "docs"
    url: "https://mesa.readthedocs.io/"
    tags:
      - "mesa"
      - "documentation"
      - "python"
      - "agent-based-modeling"
    description: "Complete documentation for the Mesa agent-based modeling framework, including tutorials, API reference, and examples."
    language: "en"
    difficulty: "beginner"

  - id: "abm-chinese-tutorial"
    title: "智能体建模中文教程"
    type: "tutorial"
    url: "https://example.com/abm-tutorial-zh"
    tags:
      - "agent-based-modeling"
      - "tutorial"
      - "chinese"
      - "beginner"
    description: "面向中文用户的智能体建模入门教程，涵盖基本概念、建模方法和实践案例。"
    language: "zh"
    difficulty: "beginner"
```

## Quality Checklist

Before submitting content, verify:

### Content Quality
- [ ] Title is descriptive and follows naming conventions
- [ ] Summary is informative and well-written
- [ ] Session objectives are specific and actionable
- [ ] Tags are relevant and properly formatted
- [ ] All required fields are present

### Technical Quality
- [ ] YAML syntax is valid
- [ ] All URLs are working and use HTTPS
- [ ] IDs are unique and follow naming conventions
- [ ] Date format is YYYY-MM-DD
- [ ] Enum values are correct (type, difficulty, language)

### Language Quality
- [ ] Chinese text has proper spacing with English/numbers
- [ ] Technical terms are translated consistently
- [ ] Grammar and spelling are correct
- [ ] Content is appropriate for target audience

### Consistency
- [ ] Formatting matches existing content
- [ ] Style follows this guide
- [ ] File naming is consistent
- [ ] References are properly formatted

Following this style guide ensures that all content in the ABMind Course Portal maintains high quality and consistency, providing the best experience for our community members.