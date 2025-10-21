# Learning Insights Dashboard - Visual Mockup

## Student View

### Header Section
- **Title**: "Learning Insights Dashboard"
- **Subtitle**: "Personalized analytics to boost your academic performance"
- **Refresh Button**: Top-right corner for data refresh

### Key Metrics Cards (4 cards in a row)
1. **Overall Performance**
   - Large percentage value (e.g., 81%)
   - Progress bar visualization
   - Award icon

2. **Performance Trend**
   - Trend indicator (Improving/Declining/Stable)
   - Trend icon (Up/Down/Flat arrow)
   - Descriptive text

3. **Study Time**
   - Total weekly hours (e.g., 17.5h)
   - Clock icon
   - Performance feedback

4. **Recommendations**
   - Count of recommendations
   - High priority count
   - Lightbulb icon

### Main Charts Section (2 columns)
#### Left Column - Subject Performance
- **Title**: "Subject Performance"
- **Bar Chart**: Showing current scores for each subject
- **X-axis**: Subject names
- **Y-axis**: Score percentage (0-100)
- **Color-coded bars**: Green (85+), Amber (70-84), Red (<70)

#### Right Column - Study Patterns
- **Title**: "Weekly Study Patterns"
- **Line Chart**: Showing study hours per day
- **X-axis**: Days of the week
- **Y-axis**: Hours studied
- **Purple line** with data points

### Additional Charts Section (2 columns)
#### Left Column - Performance Prediction
- **Title**: "Performance Prediction"
- **Line Chart**: Showing predicted scores over next 4 weeks
- **Two lines**: Predicted score (green) and confidence level (amber dashed)
- **X-axis**: Time periods (Current, Week 1, Week 2, etc.)
- **Y-axis**: Score percentage

#### Right Column - Subject Distribution
- **Title**: "Subject Strength Distribution"
- **Pie Chart**: Showing distribution of subjects by performance level
- **Segments**: Strong (Green), Moderate (Amber), Needs Work (Red)
- **Legend**: With color-coded labels and percentages

### Recommendations & Weak Topics Section (2 columns)
#### Left Column - Personalized Recommendations
- **Title**: "Personalized Recommendations"
- **List of recommendation cards**:
  - Title with priority badge (High/Medium/Low)
  - Description text
  - Subject tag
  - Action button with arrow

#### Right Column - Areas Needing Attention
- **Title**: "Areas Needing Attention"
- **List of weak topics** with warning icons
- **Helpful tip** section at the bottom

### Goal Tracker Section
- **Title**: "Goal Tracker"
- **Three goal cards** in a row:
  - Subject-specific goals
  - Progress bars
  - Target dates
  - Current progress percentages

## Parent View

### Simplified Header
- **Title**: "Your Child's Learning Insights"
- **Child name** and class information

### Key Metrics (Simplified)
1. **Overall Progress**
   - Large percentage with trend indicator
   - Simple progress visualization

2. **Areas to Support**
   - Count of weak areas
   - Priority recommendations

3. **Study Habits**
   - Weekly study time
   - Consistency indicator

### Performance Overview
- **Simple bar chart** of subject performance
- **Color-coded performance levels**

### Actionable Insights
- **Top 3 recommendations** for home support
- **Easy action buttons** (e.g., "Schedule Study Time")

### Communication Section
- **Teacher feedback** snippets
- **Quick contact button** for teachers

## Teacher View

### Class Overview Header
- **Title**: "Class Learning Analytics"
- **Class and section information**
- **Date range selector**

### Class Metrics
1. **Average Class Performance**
   - Overall percentage
   - Comparison to previous period

2. **Students Needing Attention**
   - Count of at-risk students
   - Early warning indicators

3. **Subject Performance Distribution**
   - Class-wide performance by subject

### Detailed Analytics
- **Class performance heatmap** by subject
- **Individual student progress tracking**
- **Curriculum effectiveness indicators**

### Intervention Tools
- **List of students needing support**
- **Recommended interventions**
- **Quick action buttons** for parent communication

### Export Features
- **Report generation** buttons
- **Data export** options
- **Class summary** views

## Color Scheme

### Primary Colors
- **Blue**: #3b82f6 (Main brand color)
- **Green**: #10b981 (Positive/Improvement)
- **Amber**: #f59e0b (Neutral/Attention)
- **Red**: #ef4444 (Warning/Needs Work)

### Background Gradients
- **Main**: Blue to Green to White gradient
- **Cards**: White with subtle shadows
- **Highlights**: Light color variants for each subject

### Icon Colors
- **Performance Icons**: Blue
- **Study Icons**: Purple
- **Recommendation Icons**: Amber
- **Warning Icons**: Red
- **Success Icons**: Green

## Responsive Design

### Desktop (1200px+)
- Full dashboard layout with all sections
- Multi-column arrangements
- Detailed charts and visualizations

### Tablet (768px-1199px)
- Adjusted column layouts (2 columns instead of 4)
- Simplified charts
- Condensed metrics

### Mobile (0-767px)
- Single column layout
- Collapsible sections
- Simplified visualizations
- Touch-friendly controls

## Interactive Elements

### Hover Effects
- Card elevation on hover
- Chart tooltip displays
- Button state changes

### Animations
- Page load transitions (Framer Motion)
- Data loading spinners
- Chart drawing animations
- Card entrance animations

### Data Refresh
- Manual refresh button
- Automatic updates (optional)
- Loading state indicators

## Accessibility Features

### Color Contrast
- WCAG AA compliant color combinations
- Clear visual hierarchy
- Text alternatives for charts

### Keyboard Navigation
- Tab-accessible controls
- Keyboard shortcuts for common actions
- Focus indicators for interactive elements

### Screen Reader Support
- Proper ARIA labels
- Semantic HTML structure
- Descriptive alt text for visual elements