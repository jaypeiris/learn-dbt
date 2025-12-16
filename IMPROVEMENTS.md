# Future Improvements for dbt Learning Studio

This document tracks potential enhancements and improvements for the learning tool. Items are organized by category and priority.

## Content Enhancements

### Module 2: Project Structure

#### Lesson 1: Why Staging ✅ COMPLETED
- **Enhancement**: Expand the example with more renaming scenarios
- **Context**: Currently shows basic column renaming. Could add examples for:
  - Handling multiple timestamp formats
  - Standardizing boolean values
  - Dealing with inconsistent naming conventions across sources
- **Priority**: Medium
- **Status**: Enhanced with contextual models showing different raw data scenarios and expanded reveal sections explaining common renaming patterns

#### Lesson 2: Staging Boring ✅ COMPLETED
- **Enhancement**: Add a companion example for timestamp handling
- **Context**: The lesson mentions standardizing types but could benefit from a dedicated timestamp example showing:
  - Timezone conversions
  - Date vs timestamp casting
  - Handling null timestamps
- **Priority**: Medium
- **Status**: Added contextual models and expanded reveal sections with timestamp handling patterns

#### Lesson 3: Intermediate ✅ COMPLETED
- **Enhancement**: Extend lesson with window functions
- **Context**: Intermediate layers often use window functions for enrichment. Could add:
  - ROW_NUMBER() for deduplication
  - LAG/LEAD for time-series logic
  - PARTITION BY examples
- **Priority**: High
- **Status**: Added contextual model with window function examples and expanded reveal sections explaining window function usage in intermediate layers

#### Lesson 4: Marts ✅ COMPLETED
- **Enhancement**: Add more examples of business metrics
- **Context**: Expand beyond basic aggregations to show:
  - Cohort analysis metrics
  - Growth rates and percentages
  - Customer lifetime value calculations
  - Revenue recognition patterns
- **Priority**: High
- **Status**: Added contextual model with business metrics examples and expanded reveal sections covering common business metric patterns

#### Lesson 5: Layers Reasoning ✅ COMPLETED
- **Enhancement**: Pair with a change-management scenario
- **Context**: Add a practical example showing:
  - How to refactor a model across layers
  - Impact analysis when changing layer logic
  - Testing strategy for layer changes
- **Priority**: Medium
- **Status**: Added reveal sections explaining refactoring across layers, impact analysis, and testing strategies

### Module 3: Materializations

#### Lesson 2: View vs Table ✅ COMPLETED
- **Enhancement**: Add animation showing the label swap
- **Context**: Visual animation demonstrating how the same SQL produces different warehouse objects
- **Priority**: Low (nice-to-have)
- **Status**: Expanded reveal sections to explain the visual concept of label swapping and how the same SQL produces different objects

#### Lesson 3: Incremental ✅ COMPLETED
- **Enhancement**: Expand with timeline illustration
- **Context**: Visual timeline showing:
  - First build (full table)
  - Subsequent builds (append only)
  - How incremental strategy filters new rows
- **Priority**: Medium
- **Status**: Added comprehensive reveal sections explaining incremental timeline (first build vs subsequent builds) and how incremental strategy filters new rows

#### Lesson 4: Ephemeral ✅ COMPLETED
- **Enhancement**: Add mini animation showing collapse into downstream SQL
- **Context**: Visual demonstration of how ephemeral models are inlined into downstream queries
- **Priority**: Low (nice-to-have)
- **Status**: Expanded reveal sections with detailed explanation of how ephemeral SQL gets inlined, plus contextual example showing the inlining process

#### Lesson 5: Intent ✅ COMPLETED
- **Enhancement**: Add more contextual copy for each layer
- **Context**: Expand explanations for:
  - Why staging uses views (lightweight, always fresh)
  - When intermediate should be ephemeral (complex logic, not reused)
  - Why marts are tables (performance, stability)
- **Priority**: Medium
- **Status**: Added detailed reveal sections explaining materialization reasoning for each layer (staging views, intermediate ephemeral, marts tables)

### Module 4: Tests & Docs

#### Lesson 1: Tests Are Questions ✅ COMPLETED
- **Enhancement**: Add dedicated syntax walkthrough
- **Context**: Create a comprehensive guide covering:
  - Generic test syntax (`-- test:not_null column_name`)
  - Custom test syntax
  - Test configuration options
  - Test severity levels
- **Priority**: High
- **Status**: Added comprehensive reveal sections covering generic test syntax, custom test syntax, test configuration options, and test severity levels. Added contextual model with syntax examples and expanded tasks

## Technical Improvements

### Module Registration System
- **Location**: `src/lib/lessonEngine.ts`
- **Current State**: Lessons are statically imported and registered in a map
- **Enhancement**: Dynamic module registration system
- **Benefits**:
  - Easier extensibility for community-contributed content
  - Plugin-based lesson modules
  - Runtime lesson loading
  - Better separation of concerns
- **Priority**: Low (current system works well, enhancement is for future extensibility)

### Manifest Explorer Filtering
- **Location**: `src/components/manifest/ManifestExplorer.tsx`
- **Enhancement**: Add filtering by resource type (model, snapshot, test, exposure)
- **Benefits**:
  - Help learners focus on specific node types
  - Useful for advanced modules
  - Better exploration of large manifests
- **Priority**: Medium

## UX Enhancements

### Progress Indicators
- **Enhancement**: Enhanced progress visualization
- **Ideas**:
  - Module completion percentages
  - Time spent per lesson
  - Streak tracking
  - Achievement badges
- **Priority**: Low

### Visualizations
- **Enhancement**: Improved lineage and build order animations
- **Ideas**:
  - Interactive lineage graph (zoom, pan, search)
  - Animated build order with timing estimates
  - Visual diff between before/after SQL changes
- **Priority**: Medium

### Search Improvements
- **Enhancement**: Enhanced global search
- **Ideas**:
  - Fuzzy matching
  - Search within lesson content
  - Search by concept tags
  - Recent searches history
- **Priority**: Low

## Content Expansions

### Additional Examples
- **Enhancement**: More real-world scenarios
- **Areas**:
  - Complex joins across multiple layers
  - Handling slowly changing dimensions
  - Incremental strategies (merge, delete+insert)
  - Testing edge cases
- **Priority**: High

### Edge Cases
- **Enhancement**: Lessons on common pitfalls
- **Topics**:
  - Circular dependencies
  - Missing refs in production
  - Materialization conflicts
  - Test failures and debugging
- **Priority**: Medium

### Advanced Topics
- **Enhancement**: Additional modules for advanced users
- **Potential Modules**:
  - Macros and Jinja templating
  - Custom materializations
  - Hooks and operations
  - dbt Cloud vs dbt Core
  - Performance optimization
- **Priority**: Low (future roadmap)

## Code Quality

### Type Safety
- **Enhancement**: Stricter TypeScript types for lesson definitions
- **Priority**: Low

### Testing
- **Enhancement**: Add unit tests for core functionality
- **Areas**:
  - SQL parsing
  - Task evaluation
  - Progress tracking
  - Lineage building
- **Priority**: Medium

### Documentation
- **Enhancement**: Expand inline code documentation
- **Priority**: Low

## Notes

- SQL example TODOs (like `-- TODO: connect this to the project graph`) are intentional teaching prompts and should remain in lesson content
- Priority levels:
  - **High**: Significantly improves learning outcomes
  - **Medium**: Nice enhancement, improves user experience
  - **Low**: Nice-to-have, can be deferred

