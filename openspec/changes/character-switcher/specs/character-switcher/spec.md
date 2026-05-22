## ADDED Requirements

### Requirement: User can select a character from settings
The system SHALL display a character selection dropdown in the Settings panel.

#### Scenario: Select character
- **WHEN** user opens Settings and selects a character from the dropdown
- **THEN** the selected character becomes the active character
- **THEN** the selection is persisted to localStorage

### Requirement: Selected character loads on startup
The system SHALL load the previously selected character on application start.

#### Scenario: Persist across restart
- **WHEN** user selects "Cat" and restarts the application
- **THEN** the Cat character is displayed

### Requirement: Fallback on load failure
The system SHALL fall back to the next available character if the selected one fails to load.

#### Scenario: Selected character fails
- **WHEN** user selects a character that fails to load
- **THEN** the system automatically tries the next character in the list
