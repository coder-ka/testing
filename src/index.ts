export type DoResult = {
  children: TestResult[];
};
export type TestResult = DoResult & {
  skipped: boolean;
};
export type Test = {
  skipped: boolean;
  skip(): Test;
  content: () => Promise<DoResult | void>;
  do(test: (param: {}) => Promise<DoResult | void>): Test;
  description?: string;
};
export function test(description?: string): Test {
  return {
    description,
    skipped: false,
    content: async () => {},
    do(test) {
      this.content = async () => {
        if (this.skipped)
          return {
            skipped: true,
            children: [],
          };

        const result = await test({});

        return {
          ...(result || { children: [] }),
          skipped: this.skipped,
        };
      };

      return this;
    },
    skip() {
      this.skipped = true;
      return this;
    },
  };
}
