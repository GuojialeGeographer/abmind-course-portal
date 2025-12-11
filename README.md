# ABMind Course Portal

A lightweight, scalable official website for the ABMind Chinese Community that serves as a unified entry point for Agent-Based Modeling (ABM) courses and resources.

## Features

- 📚 **Course Catalog**: Structured display of ABM courses and workshops
- 🛤️ **Learning Paths**: Curated sequences for systematic ABM learning
- 🔗 **Resource Index**: External links to educational materials and tools
- 🌐 **Chinese Optimization**: Optimized fonts and rendering for Chinese content
- 📱 **Responsive Design**: Mobile-first design with accessibility features
- ⚡ **Static Generation**: Fast loading with Next.js static site generation
- 🔍 **Search & Filter**: Real-time search and filtering capabilities

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with Chinese font optimization
- **Content**: YAML-based data management with Zod validation
- **Deployment**: Vercel with GitHub Actions CI/CD

## Project Structure

```
abmind-course-portal/
├── data/                    # YAML data files
│   ├── courses/            # Course definitions
│   ├── learning_paths/     # Learning path configurations
│   ├── resources/          # External resource links
│   └── site_config.yaml    # Site configuration
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions and data loading
│   └── types/            # TypeScript type definitions
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd abmind-course-portal
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Content Management

### Adding Courses

Create a new YAML file in `data/courses/`:

```yaml
id: "course-id"
title: "Course Title"
type: "course"
year: 2024
difficulty: "beginner"
tags: ["ABM", "Mesa"]
instructors: ["Instructor Name"]
language: "zh"
summary: "Course description"
sessions:
  - id: "session-1"
    title: "Session Title"
    objectives: ["Learning objective"]
    materials:
      slides: "https://example.com/slides.pdf"
      code_repo: "https://github.com/example/repo"
```

### Configuration

Edit `data/site_config.yaml` to update:
- Site information and metadata
- Navigation structure
- Featured courses
- Social links and announcements

## Deployment

The project is configured for automatic deployment:

1. **Vercel**: Primary deployment platform
2. **GitHub Actions**: CI/CD pipeline for automated builds
3. **GitHub Pages**: Backup deployment option

### Environment Setup

1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `out` (for static export)
3. Set up GitHub Actions for automated deployments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `npm run lint && npm run type-check`
5. Submit a pull request

## License

This project is licensed under the MIT License.
