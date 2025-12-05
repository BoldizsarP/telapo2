import { confirm, input, number, select } from "@inquirer/prompts";

function validateNumber(answer: string | boolean) {
  if (typeof answer !== "string") {
    throw new Error("Invalid number");
  }
  if (isNaN(Number(answer))) {
    throw new Error("Invalid number");
  }
  return Number(answer);
}

/**
 * Utility functions and Ask class for interactive command-line prompts.
 *
 * This module provides a wrapper around the @inquirer/prompts library, allowing
 * for interactive user input (select, input, confirm, number) with support for
 * pre-filled answers (useful for scripting or testing). The Ask class manages
 * default answers, determines if the script is running interactively, and
 * provides static methods to prompt the user or use pre-supplied answers.
 *
 * The validateNumber function ensures that numeric answers are valid numbers.
 */

class Ask {
  /**
   * Default answers are set via the Commander CLI tool by passing arguments as flags,
   * e.g. --name <value>. This enables CLI parameters to pre-fill answers for prompts.
   * Currently, only string values are supported, so even boolean values must be supplied
   * as --name true or --name false (as strings). When retrieving these values, the Ask
   * class automatically converts "true" and "false" strings to their boolean equivalents.
   * This distinction is important: providing --value false (as a string) is different
   * from omitting the --value flag entirely. If a value is not supplied, the prompt
   * will be shown interactively; if "false" is supplied, it is treated as a boolean false.
   */
  static defaultAnswers: Record<string, string> = {};
  static loadArgs(args: Record<string, string>) {
    console.log("Loading args:", args);
    Ask.defaultAnswers = { ...Ask.defaultAnswers, ...args };
  }

  /**
   * Returns true if no default answers have been supplied via CLI flags,
   * meaning the script should run interactively. If any CLI value is provided,
   * the script will use those answers and assume it is not fully interactive.
   *
   * There are three states the script can be in:
   * 1. Interactive mode: No default answers have been supplied via CLI flags,
   *    meaning the script should run interactively.
   * 2. Non-interactive mode: Default answers have been supplied via CLI flags,
   *    meaning the script will use those answers and assume it is not fully interactive.
   * 3. Semi-interactive mode: Some default answers have been supplied via CLI flags,
   *    but the script will prompt interactively for the rest.
   */
  static get isInteractive() {
    return Object.keys(Ask.defaultAnswers).length === 0;
  }
  static hasAnswer(name: string) {
    return Ask.defaultAnswers[name];
  }
  private static getAnswer(name: string): string | boolean | null {
    const answer = Ask.defaultAnswers[name];
    if (answer) {
      if (answer === "true") {
        return true;
      }
      if (answer === "false") {
        return false;
      }
      return answer;
    }

    return null;
  }
  static async select(name: string, ...args: Parameters<typeof select>) {
    return Ask.getAnswer(name) ?? select(...args);
  }
  static async input(name: string, ...args: Parameters<typeof input>) {
    return Ask.getAnswer(name) ?? input(...args);
  }
  static async confirm(name: string, ...args: Parameters<typeof confirm>) {
    return Ask.getAnswer(name) ?? confirm(...args);
  }

  static async number(
    name: string,
    ...args: Parameters<typeof number>
  ): Promise<number> {
    const answer = Ask.getAnswer(name);
    if (answer !== null) {
      return validateNumber(answer);
    }
    return (await number(...args)) ?? 0;
  }
  static async generic<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T | (string | number | boolean)> {
    return Ask.getAnswer(name) ?? fn();
  }
}
export { Ask };
