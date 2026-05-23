## Requirements

### Requirement: Add todo via chat
The system SHALL add a todo when the user sends a message matching add patterns.

#### Scenario: Add with prefix
- **WHEN** user sends "添加买牛奶"
- **THEN** todo "买牛奶" is added, system replies "已添加：买牛奶"

#### Scenario: Add without prefix
- **WHEN** user sends a short message (≤15 chars) not matching other patterns
- **THEN** treated as add todo, system replies "已添加：xxx"

### Requirement: Complete todo via chat
The system SHALL mark a todo as done when the user sends a complete pattern.

#### Scenario: Complete by keyword
- **WHEN** user sends "完成买牛奶"
- **THEN** todo "买牛奶" is marked done, system replies "已完成：买牛奶"

#### Scenario: Complete not found
- **WHEN** user sends "完成xxx" but no matching todo
- **THEN** system replies "未找到：xxx"

### Requirement: Delete todo via chat
The system SHALL delete a todo when the user sends a delete pattern.

#### Scenario: Delete by keyword
- **WHEN** user sends "删除买牛奶"
- **THEN** todo "买牛奶" is removed, system replies "已删除：买牛奶"

### Requirement: Pass through non-command messages
The system SHALL forward non-command messages to the AI as before.

#### Scenario: Normal chat
- **WHEN** user sends "你好呀"
- **THEN** message is sent to AI API normally
