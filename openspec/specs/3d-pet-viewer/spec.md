## Requirements

### Requirement: Load and display 3D pet model
The system SHALL load a glTF/GLB format 3D model and render it in the Electron window using React Three Fiber.

#### Scenario: Model loads successfully
- **WHEN** the application starts
- **THEN** the 3D pet model is rendered in the center of the transparent window with correct scale and position

#### Scenario: Model loading fails
- **WHEN** the model file is missing or corrupted
- **THEN** a fallback placeholder (colored geometric shape) is displayed instead

### Requirement: Idle animation plays by default
The system SHALL play the idle/breathing animation when no user interaction is occurring.

#### Scenario: Application starts with idle state
- **WHEN** the application launches and the emotion state is "idle"
- **THEN** the idle animation loops continuously

#### Scenario: Idle animation resumes after interaction
- **WHEN** the user stops interacting and no AI response is pending
- **THEN** the animation transitions back to idle after a 5-second timeout

### Requirement: Emotion-driven animation switching
The system SHALL switch the 3D model's animation based on the current emotion state.

#### Scenario: Happy emotion triggered
- **WHEN** the emotion state changes to "happy"
- **THEN** the model plays the happy animation with a crossfade transition from the current animation

#### Scenario: Thinking emotion triggered
- **WHEN** the emotion state changes to "thinking"
- **THEN** the model plays the thinking animation

#### Scenario: Sad emotion triggered
- **WHEN** the emotion state changes to "sad"
- **THEN** the model plays the sad animation

### Requirement: Responsive canvas sizing
The R3F canvas SHALL fill the entire Electron window and resize when the window is resized.

#### Scenario: Window resizes
- **WHEN** the Electron window dimensions change
- **THEN** the 3D canvas updates its aspect ratio and re-renders without distortion
