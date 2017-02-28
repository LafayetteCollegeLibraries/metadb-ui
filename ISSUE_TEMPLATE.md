# User Stories
User stories should follow the syntax of [Gherkin](https://cucumber.io/docs/reference):
```
Feature: Refund item
Scenario: Jeff returns a faulty microwave
  Given Jeff has bought a microwave for $100
  And he has a receipt
  When he returns the microwave
  Then Jeff should be refunded $100
```

# Bug Reports
Bug reports should include the following:
- [ ] Include a step-by-step description of the behavior which reproduces the bug
- [ ] (If possible) include a screenshot
