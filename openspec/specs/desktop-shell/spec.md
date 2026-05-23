## Requirements

### Requirement: Transparent frameless window
The Electron application SHALL display a transparent, frameless window that floats above all other windows.

#### Scenario: Window appears on desktop
- **WHEN** the application starts
- **THEN** a frameless window appears with a fully transparent background, showing only the 3D pet content

#### Scenario: Window stays on top
- **WHEN** the user switches to other applications
- **THEN** the pet window remains visible on top of all other windows

### Requirement: Draggable window
The system SHALL allow the user to drag the pet to any position on screen.

#### Scenario: User drags the pet
- **WHEN** the user presses and holds the left mouse button on the 3D pet model
- **THEN** the window moves with the mouse cursor until the button is released

#### Scenario: Pet position persists
- **WHEN** the user moves the pet and then restarts the application
- **THEN** the pet appears at the last known position

### Requirement: Click-through in non-interactive areas
The system SHALL allow mouse clicks to pass through the window in areas where no interactive element exists.

#### Scenario: Click passes through transparent area
- **WHEN** the user clicks on a transparent area of the window
- **THEN** the click event is forwarded to the window/application beneath

#### Scenario: Click intercepted on interactive area
- **WHEN** the user clicks on the 3D pet model or the chat dialog
- **THEN** the click is handled by the application, not forwarded

### Requirement: Settings panel for API configuration
The system SHALL provide a settings panel where the user can configure their AI API credentials.

#### Scenario: User opens settings
- **WHEN** the user right-clicks on the pet or presses a keyboard shortcut
- **THEN** a settings panel appears with input fields for API Key and Base URL

#### Scenario: Settings persist across sessions
- **WHEN** the user saves their API configuration
- **THEN** the configuration is stored locally and loaded on next launch

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
