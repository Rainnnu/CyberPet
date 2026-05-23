## Requirements

### Requirement: Chat dialog UI
The system SHALL display a semi-transparent chat dialog when the user clicks on the 3D pet.

#### Scenario: Dialog opens on pet click
- **WHEN** the user left-clicks on the 3D pet model
- **THEN** a chat dialog appears near the pet with a text input field and a send button

#### Scenario: Dialog closes on outside click
- **WHEN** the user clicks outside the chat dialog and outside the pet
- **THEN** the dialog closes

#### Scenario: Dialog shows chat history
- **WHEN** the dialog opens
- **THEN** previous messages from the current session are displayed in chronological order

### Requirement: Send message to AI
The system SHALL send the user's message to the configured LLM API and display the response.

#### Scenario: Successful AI response
- **WHEN** the user types a message and presses Enter or clicks Send
- **THEN** the message is sent to the AI API, a loading indicator appears, and the AI response is displayed in the dialog

#### Scenario: API request fails
- **WHEN** the API call fails due to network error or invalid credentials
- **THEN** an error message is shown in the dialog and the emotion state returns to "idle"

#### Scenario: API not configured
- **WHEN** the user tries to chat without configuring an API Key
- **THEN** a prompt appears asking the user to configure their API settings first

### Requirement: Emotion tag parsing from AI response
The system SHALL parse the emotion tag from the AI's response and update the emotion state.

#### Scenario: Valid emotion tag received
- **WHEN** the AI response contains a JSON object with an "emotion" field matching one of [happy, thinking, sad, idle]
- **THEN** the emotion state updates to the received value and the corresponding animation plays

#### Scenario: Invalid or missing emotion tag
- **WHEN** the AI response does not contain a valid emotion field
- **THEN** the emotion state defaults to "idle"

#### Scenario: Emotion resets after timeout
- **WHEN** 10 seconds pass after the last AI response
- **THEN** the emotion state returns to "idle"

### Requirement: System prompt enforces structured output
The system SHALL use a system prompt that instructs the AI to return responses in a specific JSON format.

#### Scenario: System prompt is included in API call
- **WHEN** a chat message is sent to the API
- **THEN** the system prompt is prepended, instructing the AI to return `{"emotion": "<emotion>", "text": "<reply>"}`
