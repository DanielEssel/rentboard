export const FormStorage = {
  key: "tw-list-property-draft",

  save(data: any) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save form", e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Failed to load form", e);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};
