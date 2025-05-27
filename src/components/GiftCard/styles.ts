export const colors = {
  background: '#121212',
  cardBackground: '#1e1e1e',
  primary: '#BB86FC',
  accent: '#03DAC6',
  text: '#ddd',
  mutedText: '#bbb',
};

export const animations = {
  fadeIn: `@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }`,
  spin: `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`,
};
