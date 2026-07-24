import next from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next/**", ".open-next/**", ".wrangler/**", ".worktrees/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
  ...next,
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
