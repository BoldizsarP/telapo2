import { Command } from 'commander';

/**
 * Provides a program utility for interactive scripts that manages the command-line interface (CLI) for the script.
 *
 * This module allows you to create and manage a Commander.js command using a static program instance. The program
 * can be initialized with a Command instance, and then additional commands can be added to it using the `add` method.
 * The `parse` method parses the command-line arguments, and the `opts` method returns the parsed options.
 *
 * Having this centralized in a class makes it easier to "lazy load" additional parameters into the program,
 * This is useful for adding setup options dynamically, based on whether the script is running interactively or not.
 */
class Program {
  private static program = new Command();

  static set initialize(command: Command) {
    Program.program = command;
  }

  static add(fn: (program: Command) => Command) {
    Program.program = fn(Program.program);
  }

  static parse() {
    Program.program.parse();
  }

  static get opts() {
    const opts = Program.program.opts();

    return opts;
  }
}
export { Program };
