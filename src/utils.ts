export function output(data: unknown, format: string): void {
  const json =
    format === "compact"
      ? JSON.stringify(data)
      : JSON.stringify(data, null, 2);
  process.stdout.write(json + "\n");
}

export function fatal(message: string): never {
  process.stderr.write(JSON.stringify({ error: message }) + "\n");
  process.exit(1);
}
