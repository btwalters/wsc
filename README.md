# Catechism Learning Games

Two interactive web applications designed to help users learn and memorize catechism questions and answers through engaging, modern interfaces.

## Features

### Children's Catechism Game
- **145 Questions**: Complete set of children's catechism questions and answers
- **Interactive Flashcards**: Beautiful card-flip animations for an engaging learning experience
- **Text-to-Speech**: Automatic reading of questions and answers (toggle on/off)
- **Progress Tracking**: Visual progress bar and milestone celebrations
- **Kid-Friendly Design**: Colorful, fun interface designed for young learners
- **Navigation**: Easy navigation with Previous/Next buttons, Random question selection
- **Keyboard Support**: Arrow keys and spacebar for navigation
- **Touch Gestures**: Swipe support for mobile devices
- **Persistent Progress**: Automatically saves your current position

### Westminster Shorter Catechism Application
Two powerful learning modes:

#### Flashcard Mode
- **Question Selection**: Choose all, clear all, or select a specific range
- **107 Questions**: Complete Westminster Shorter Catechism
- **Card Flip Animation**: Smooth 3D card flip transitions
- **Scripture References**: Display of biblical references for each answer
- **Shuffle & Random**: Mix up questions for varied practice
- **Progress Tracking**: Know exactly where you are in your study
- **Optional Audio**: Toggle text-to-speech on or off

#### Learning Mode
- **Split View**: Question list in sidebar, detailed content in main area
- **Search Functionality**: Quickly find questions by keyword
- **Scripture References**: Full display of biblical references
- **Keyboard Navigation**: Arrow keys to move through questions
- **Mobile Responsive**: Sidebar collapses on smaller screens
- **Clean Reading Experience**: Professional typography for extended study

## Project Structure

```
catechism/
├── src/
│   ├── index.html              # Landing page
│   ├── children/
│   │   ├── index.html          # Children's game interface
│   │   ├── app.js              # Children's game logic
│   │   ├── styles.css          # Children's game styling
│   │   └── data.json           # 145 Q&A pairs
│   └── shorter/
│       ├── index.html          # Shorter catechism interface
│       ├── app.js              # Shorter catechism logic
│       ├── styles.css          # Shorter catechism styling
│       └── data.json           # 107 Q&A pairs with references
├── package.json                # NPM configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
└── render.yaml                 # Render.com deployment config
```

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd catechism
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to:
```
http://localhost:8080
```

### Available Scripts

- `npm start` - Start the local development server on port 8080
- `npm run dev` - Start dev server with CORS enabled

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- Mobile Safari and Chrome

## Features & Accessibility

### Keyboard Shortcuts

**Children's Catechism:**
- `→` or `Space` - Next question or flip card
- `←` - Previous question
- `F` - Flip card
- `R` - Random question

**Shorter Catechism (Flashcard Mode):**
- `→` - Next question
- `←` - Previous question
- `Space` or `F` - Flip card
- `R` - Random question

**Shorter Catechism (Learning Mode):**
- `↓` - Next question
- `↑` - Previous question
- `/` - Focus search box

### Accessibility Features
- ARIA labels on all interactive elements
- Keyboard navigation throughout
- High contrast ratios for readability
- Responsive design for all screen sizes
- Touch-friendly interface for mobile devices

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Data Format**: JSON
- **Server**: http-server (for local development)
- **Deployment**: Render.com static site hosting

## Data Sources

The catechism questions and answers were extracted from PDF documents:
- Children's Catechism (145 questions)
- Westminster Shorter Catechism (107 questions with scripture references)

## Deployment

### Deploy to Render.com

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` configuration
4. Your site will be deployed at `https://your-site-name.onrender.com`

### Manual Deployment

The `src/` directory contains all static files needed for deployment. Simply upload this directory to any static hosting service.

## Contributing

This project is designed for personal and educational use. Feel free to fork and customize for your own needs.

## License

MIT License - Feel free to use and modify for personal and educational purposes.

## Acknowledgments

- Westminster Shorter Catechism text
- Children's Catechism questions and answers
- Built with modern web technologies for an optimal learning experience

## Future Enhancements

Potential features for future versions:
- Spaced repetition algorithm for optimized learning
- User accounts and cloud sync
- Study statistics and analytics
- Printable study guides
- Quiz mode with scoring
- Mobile app versions
- Audio recordings of catechism recitation

---

**Built for faithful learning and spiritual growth** 📖
