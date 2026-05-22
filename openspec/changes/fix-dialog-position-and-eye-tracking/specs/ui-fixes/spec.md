## ADDED Requirements

### Requirement: Chat dialog grows downward
The system SHALL position the chat dialog with a fixed top anchor so that new messages extend the dialog downward, not upward toward the pet model.

#### Scenario: Dialog grows down with more messages
- **WHEN** user sends multiple messages and the dialog content grows
- **THEN** the top edge of the dialog stays in place and the bottom edge extends downward

#### Scenario: Pet model stays visible
- **WHEN** chat dialog is open with many messages
- **THEN** the pet model is visible above the dialog

### Requirement: Eye tracking works with any model
The system SHALL find a head bone in any character model regardless of bone naming convention.

#### Scenario: Cat model eye tracking
- **WHEN** the cat model is active and mouse moves near the window
- **THEN** the cat's head tracks the mouse cursor

#### Scenario: Fallback bone selection
- **WHEN** no known head bone name is matched
- **THEN** the system selects the first bone with children as a fallback
