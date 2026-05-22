## ADDED Requirements

### Requirement: Only model mesh is clickable
The system SHALL only respond to clicks on the character model mesh, not on surrounding transparent areas.

#### Scenario: Click on model
- **WHEN** user clicks directly on the character model
- **THEN** the chat dialog opens (or closes if already open)

#### Scenario: Click on empty area
- **WHEN** user clicks on transparent area around the model
- **THEN** the click passes through to the desktop (no interaction)

### Requirement: Transparent areas are click-through
The system SHALL allow mouse events to pass through transparent parts of the window to the desktop.

#### Scenario: Desktop interaction through window
- **WHEN** user clicks on transparent area of the pet window
- **THEN** the click reaches the application or desktop underneath

### Requirement: Drag still works on model
The system SHALL allow dragging the model to reposition the window.

#### Scenario: Drag model
- **WHEN** user presses and drags on the model
- **THEN** the window moves with the mouse
