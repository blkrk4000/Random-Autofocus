
import { Todo } from '../types';
import { generateId } from '../services/storageService';

export const getDemoData = (): Todo[] => {
    const now = Date.now();
    const hour = 3600000;
    const day = hour * 24;

    return [
        // --- PAGE 1 (Index 0) ---
        // A mix of completed, dismissed and open tasks
        {
            id: generateId(),
            text: "Read Mark Forster's original article on Autofocus",
            notes: "http://markforster.squarespace.com/autofocus-system/",
            isCompleted: true, // DONE
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 0,
            createdAt: now - 5 * day
        },
        {
            id: generateId(),
            text: "Daily Morning Ritual @routine",
            notes: "# Morning Checklist\n- [x] Check emails\n- [x] Review calendar\n- [ ] Drink water\n- [ ] Plan top 3 tasks\n\n# Review\n- [ ] Clear inbox",
            isCompleted: false, // OPEN
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 0,
            createdAt: now - 4 * day
        },
        {
            id: generateId(),
            text: "Buy milk and coffee beans @shopping",
            notes: "",
            isCompleted: false, // OPEN
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 0,
            createdAt: now - 4 * day
        },
        {
            id: generateId(),
            text: "Call the bank regarding #finance update",
            notes: "",
            isCompleted: false,
            isFocused: false,
            isDismissed: true, // DISMISSED (Skipped)
            isCancelled: false,
            pageIndex: 0,
            createdAt: now - 4 * day
        },
        {
            id: generateId(),
            text: "Clean the garage",
            notes: "Need to buy trash bags first",
            isCompleted: false,
            isFocused: false,
            isDismissed: false,
            isCancelled: true, // CANCELLED (Abandoned)
            pageIndex: 0,
            createdAt: now - 3 * day
        },
        {
            id: generateId(),
            text: "Draft the project proposal for #ClientX",
            notes: "# Draft Structure\n- [x] Outline\n- [ ] Budget\n- [ ] Timeline",
            isCompleted: false, // OPEN
            isFocused: true, // FOCUSED
            isDismissed: false,
            isCancelled: false,
            pageIndex: 0,
            createdAt: now - 3 * day
        },

        // --- PAGE 2 (Index 1) ---
        // Mostly open, demonstrating the "Next Page" logic
        {
            id: generateId(),
            text: "Review pull requests #work",
            notes: "",
            isCompleted: false,
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 1,
            createdAt: now - 2 * day
        },
        {
            id: generateId(),
            text: "Book dentist appointment @health",
            notes: "",
            isCompleted: false,
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 1,
            createdAt: now - 2 * day
        },
        {
            id: generateId(),
            text: "Update portfolio website",
            notes: "Check styling on mobile",
            isCompleted: false,
            isFocused: true, // FOCUSED
            isDismissed: false,
            isCancelled: false,
            pageIndex: 1,
            createdAt: now - 1 * day
        },
        {
            id: generateId(),
            text: "Pay electricity bill #finance",
            notes: "",
            isCompleted: false,
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 1,
            createdAt: now - 1 * day
        },
        
        // --- PAGE 3 (Index 2) ---
        // Fresh entry
        {
            id: generateId(),
            text: "Plan birthday party for Sarah",
            notes: "# Guest List\n- [ ] Bob\n- [ ] Alice\n- [ ] Charlie\n\n## Shopping List\n- [ ] Cake\n- [ ] Candles\n- [ ] Drinks\n\n## Logistics\n- [ ] Send invites\n- [ ] Clean house",
            isCompleted: false,
            isFocused: false,
            isDismissed: false,
            isCancelled: false,
            pageIndex: 2,
            createdAt: now
        }
    ];
};
