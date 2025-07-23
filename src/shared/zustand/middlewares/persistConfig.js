export const basePersistConfig = (name, fields = null) => ({
  name,
  storage: typeof window !== "undefined" ? localStorage : undefined,
  partialize: fields
    ? (state) => {
        const partial = {};
        fields.forEach((field) => {
          if (field in state) partial[field] = state[field];
        });
        return partial;
      }
    : undefined,
});
