## Requirements

### Requirement: Eye/head follows mouse cursor
The 3D pet's head or eyes SHALL track the user's mouse cursor position to create a "looking at you" effect.

#### Scenario: Mouse moves within screen
- **WHEN** the user moves the mouse cursor anywhere on screen
- **THEN** the pet's head/eyes rotate to face the cursor's approximate direction

#### Scenario: Mouse leaves the window area
- **WHEN** the mouse cursor moves far from the pet window
- **THEN** the pet's head/eyes return to a neutral forward-facing position

### Requirement: Head rotation limits
The pet's head rotation SHALL be clamped to natural-looking angles.

#### Scenario: Mouse at extreme angle
- **WHEN** the mouse is at a position that would require more than 30 degrees of head rotation
- **THEN** the head rotation is clamped to 30 degrees maximum in each direction
