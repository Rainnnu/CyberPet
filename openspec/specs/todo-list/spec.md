## Requirements

### Requirement: Add todo item
The system SHALL allow users to add new todo items.

#### Scenario: Add todo via input
- **WHEN** user types text and presses Enter or clicks Add
- **THEN** new todo item appears in the list with done=false

#### Scenario: Empty input ignored
- **WHEN** user presses Enter with empty input
- **THEN** no todo is added

### Requirement: Toggle todo completion
The system SHALL allow users to mark todo items as complete/incomplete.

#### Scenario: Click checkbox to complete
- **WHEN** user clicks checkbox on a todo item
- **THEN** todo.done toggles, visual strikethrough appears

### Requirement: Delete todo item
The system SHALL allow users to delete todo items.

#### Scenario: Click delete button
- **WHEN** user clicks delete button on a todo item
- **THEN** item is removed from the list

### Requirement: Persist todos
The system SHALL persist todo items across sessions.

#### Scenario: Todos survive refresh
- **WHEN** user adds todos and refreshes the app
- **THEN** todos are restored from localStorage
