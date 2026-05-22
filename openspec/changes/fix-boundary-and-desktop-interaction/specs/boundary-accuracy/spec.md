## ADDED Requirements

### Requirement: Boundary compensation
The system SHALL compensate for Windows invisible resize border to allow window to reach screen edges.

#### Scenario: Window reaches right edge
- **WHEN** user drags window to the right edge of the screen
- **THEN** window stops at the right edge (not 8 pixels before)

#### Scenario: Window reaches left edge
- **WHEN** user drags window to the left edge of the screen
- **THEN** window stops at the left edge (not 8 pixels before)

#### Scenario: Window reaches top edge
- **WHEN** user drags window to the top edge of the screen
- **THEN** window stops at the top edge (not 8 pixels before)

#### Scenario: Window reaches bottom edge
- **WHEN** user drags window to the bottom edge of the screen
- **THEN** window stops at the bottom edge (not 8 pixels before)

### Requirement: Accurate boundary detection
The system SHALL use accurate boundary calculation that accounts for Windows invisible resize border.

#### Scenario: Boundary calculation with compensation
- **WHEN** calculating boundary limits
- **THEN** system adds 8-pixel compensation to allow window to reach screen edge

#### Scenario: Screen bounds detection
- **WHEN** determining screen boundaries
- **THEN** system uses `screen.getPrimaryDisplay().bounds` for accurate screen dimensions

### Requirement: No flickering during boundary enforcement
The system SHALL prevent flickering when window reaches boundary.

#### Scenario: Window stops at boundary
- **WHEN** window reaches boundary during drag
- **THEN** window stops smoothly without flickering or bouncing
