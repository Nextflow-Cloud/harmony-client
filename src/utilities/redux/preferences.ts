export interface Preferences {
    theme: "light" | "dark";
    language: "en" | "es" | "fr";
    themeAuto: boolean;
    languageAuto: boolean;
}

export type PreferencesAction = { type: undefined } | { type: "UPDATE_PREFERENCES", preferences: Preferences };

export const preferences = (state: Preferences = {
    theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    language: "fr",
    themeAuto: true,
    languageAuto: true,
}, action: PreferencesAction): Preferences => {
    switch (action.type) {
        case "UPDATE_PREFERENCES": {
            state = action.preferences;
            return state;
        }
        default: {
            return state;
        }
    }
};
