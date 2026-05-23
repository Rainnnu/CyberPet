## Requirements

### Requirement: Window boundary detection
The system SHALL detect when the window is being dragged outside the screen boundary and prevent it from leaving the visible area.

#### Scenario: Window dragged to left edge
- **WHEN** user drags the window to the left edge of the screen
- **THEN** window stops at the left boundary and cannot be dragged further left

#### Scenario: Window dragged to right edge
- **WHEN** user drags the window to the right edge of the screen
- **THEN** window stops at the right boundary and cannot be dragged further right

#### Scenario: Window dragged to top edge
- **WHEN** user drags the window to the top edge of the screen
- **THEN** window stops at the top boundary and cannot be dragged further up

#### Scenario: Window dragged to bottom edge
- **WHEN** user drags the window to the bottom edge of the screen
- **THEN** window stops at the bottom boundary and cannot be dragged further down

### Requirement: Window position correction
The system SHALL automatically correct window position if it is found outside the screen boundary.

#### Scenario: Window position saved outside boundary
- **WHEN** application starts and saved window position is outside screen boundary
- **THEN** window is automatically moved to the nearest valid position within screen boundary

#### Scenario: Window moved outside boundary
- **WHEN** window is detected outside screen boundary during operation
- **THEN** window is immediately moved back to the nearest valid position within screen boundary

### Requirement: Multi-display support
The system SHALL consider the primary display's work area for boundary detection.

#### Scenario: Primary display work area
- **WHEN** determining screen boundary
- **THEN** system uses primary display's work area (excluding taskbar and system UI)

#### Scenario: Window near taskbar
- **WHEN** user drags window near the taskbar
- **THEN** window stops at the taskbar boundary, not the screen edge
