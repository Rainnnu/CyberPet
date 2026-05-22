## ADDED Requirements

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
