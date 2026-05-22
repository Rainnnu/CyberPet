## ADDED Requirements

### Requirement: Pet click interaction
The system SHALL show a chat dialog when the user clicks on the pet.

#### Scenario: Click on pet with chat closed
- **WHEN** user clicks on the pet and chat dialog is not visible
- **THEN** chat dialog appears at the bottom of the window

#### Scenario: Click on pet with chat open
- **WHEN** user clicks on the pet and chat dialog is already visible
- **THEN** chat dialog remains visible (no action taken)

#### Scenario: Click on pet with settings open
- **WHEN** user clicks on the pet and settings panel is visible
- **THEN** chat dialog does not appear (settings panel has priority)

### Requirement: Right-click context menu
The system SHALL show the settings panel when the user right-clicks on the pet.

#### Scenario: Right-click with settings closed
- **WHEN** user right-clicks on the pet and settings panel is not visible
- **THEN** settings panel appears with current configuration

#### Scenario: Right-click with settings open
- **WHEN** user right-clicks on the pet and settings panel is already visible
- **THEN** settings panel remains visible (no action taken)

#### Scenario: Right-click with chat open
- **WHEN** user right-clicks on the pet and chat dialog is visible
- **THEN** chat dialog closes and settings panel appears

### Requirement: Event propagation
The system SHALL ensure that click and right-click events are properly handled without interfering with window drag functionality.

#### Scenario: Click on pet area
- **WHEN** user clicks on the pet area
- **THEN** click event is handled by the pet interaction system, not the window drag system

#### Scenario: Drag on pet area
- **WHEN** user drags on the pet area
- **THEN** drag event is handled by the window drag system, not the pet interaction system

### Requirement: Chat dialog display
The system SHALL display the chat dialog at the bottom of the window when triggered.

#### Scenario: Chat dialog position
- **WHEN** chat dialog is triggered by clicking on pet
- **THEN** chat dialog appears at the bottom of the window, spanning the full width

#### Scenario: Chat dialog interaction
- **WHEN** chat dialog is visible
- **THEN** user can type messages and send them to the AI pet

### Requirement: Settings panel display
The system SHALL display the settings panel as a full-screen overlay when triggered.

#### Scenario: Settings panel position
- **WHEN** settings panel is triggered by right-clicking on pet
- **THEN** settings panel appears as a full-screen overlay covering the entire window

#### Scenario: Settings panel interaction
- **WHEN** settings panel is visible
- **THEN** user can configure API key and other settings
