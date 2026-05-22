## ADDED Requirements

### Requirement: Desktop mouse click interaction
The system SHALL show chat dialog when user clicks on the pet in desktop mode.

#### Scenario: Click on pet in desktop mode
- **WHEN** user left-clicks on the pet in desktop mode
- **THEN** chat dialog appears at the bottom of the window

#### Scenario: Click on pet with chat open
- **WHEN** user left-clicks on the pet and chat dialog is already visible
- **THEN** chat dialog remains visible

#### Scenario: Click on pet with settings open
- **WHEN** user left-clicks on the pet and settings panel is visible
- **THEN** chat dialog does not appear

### Requirement: Desktop right-click interaction
The system SHALL show settings panel when user right-clicks on the pet in desktop mode.

#### Scenario: Right-click on pet in desktop mode
- **WHEN** user right-clicks on the pet in desktop mode
- **THEN** settings panel appears with current configuration

#### Scenario: Right-click on pet with settings open
- **WHEN** user right-clicks on the pet and settings panel is already visible
- **THEN** settings panel remains visible

#### Scenario: Right-click on pet with chat open
- **WHEN** user right-clicks on the pet and chat dialog is visible
- **THEN** chat dialog closes and settings panel appears

### Requirement: Window drag functionality
The system SHALL allow window dragging while preserving click and right-click events.

#### Scenario: Drag pet area
- **WHEN** user clicks and drags on the pet area
- **THEN** window moves with the mouse

#### Scenario: Click vs drag distinction
- **WHEN** user clicks on pet without moving mouse
- **THEN** system recognizes as click (not drag) and shows chat dialog

#### Scenario: Right-click vs drag distinction
- **WHEN** user right-clicks on pet without moving mouse
- **THEN** system recognizes as right-click (not drag) and shows settings panel

### Requirement: Event handling without WebkitAppRegion
The system SHALL handle mouse events without using WebkitAppRegion: 'drag'.

#### Scenario: Remove WebkitAppRegion
- **WHEN** rendering pet overlay
- **THEN** system does not use WebkitAppRegion: 'drag' attribute

#### Scenario: JavaScript-based drag implementation
- **WHEN** implementing window drag
- **THEN** system uses JavaScript event handlers (mousedown, mousemove, mouseup)

#### Scenario: IPC-based window movement
- **WHEN** moving window during drag
- **THEN** system uses Electron IPC to update window position
