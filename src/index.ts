export type DoResult = {
  children: TestResult[];
};
export type TestResult = DoResult & {
  skipped: boolean;
  description?: string;
};
export type Test = {
  skipped: boolean;
  do(test: (param: {}) => Promise<DoResult | void>): Promise<TestResult>;
  skip(): Test;
};
export function test(description?: string): Test {
  return {
    skipped: false,
    async do(test) {
      if (this.skipped)
        return {
          skipped: true,
          children: [],
        };

      const result = await test({});

      return {
        ...(result || { children: [] }),
        skipped: this.skipped,
        description,
      };
    },
    skip() {
      this.skipped = true;
      return this;
    },
  };
}
