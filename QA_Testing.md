# SkillPath - QA Testing

## Application Testing

| Test Case | Expected Result | Status |
|---|---|---|
| Login with valid credentials | User enters the application | Passed |
| Logout | User is redirected to Login | Passed |
| Home route `/` | User is redirected to Dashboard | Passed |
| Dashboard navigation | Dashboard opens correctly | Passed |
| Career Goals | Career goals are displayed | Passed |
| Career Goals → Roadmap | Selected career opens its roadmap | Passed |
| Roadmap → Skill Details | Selected skill details open | Passed |
| Skill Details → Notes | Notes page opens | Passed |
| Courses | Courses page opens | Passed |
| Resources | Resources page opens | Passed |
| Progress | Progress page opens correctly | Passed |
| Profile | Profile opens correctly | Passed |
| Profile Update | Updated profile information is saved | Passed |
| Quiz | Quiz can be accessed and completed | Passed |
| Navbar | Navigation links work correctly | Passed |
| Protected Routes | Unauthorized users are redirected to Login | Passed |

## Integration Flow

Login
↓
Dashboard
↓
Career Goals
↓
Career Goal
↓
Roadmap
↓
Skill Details
↓
Notes / Quiz / Resources
↓
Progress
↓
Profile
↓
Logout
↓
Login

## QA Result

The major application navigation and integration flows were tested.
All tested modules opened and functioned as expected.