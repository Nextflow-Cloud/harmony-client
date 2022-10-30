export interface Preferences {
    theme: "light" | "dark";
    language: "en" | "es" | "fr";
    themeSystem: boolean;
    languageSystem: boolean;
}

export type PreferencesAction = { type: undefined } | { type: "UPDATE_PREFERENCES", preferences: Partial<Preferences> };

export const preferences = (state: Preferences = {
    theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    language: "fr",
    themeSystem: true,
    languageSystem: true,
}, action: PreferencesAction): Preferences => {
    switch (action.type) {
        case "UPDATE_PREFERENCES": {
            return Object.assign({}, state, action.preferences);
        }
        default: {
            return state;
        }
    }
};
