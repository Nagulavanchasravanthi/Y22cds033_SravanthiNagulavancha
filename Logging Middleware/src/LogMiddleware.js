// logMiddleware.js

/**
 * Reusable logging function
 * @param {string} stack - Source of log (function, component, etc.)
 * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
 * @param {string} packageName - Package/module/component name
 * @param {string} message - Log message
 */
export async function Log(stack, level, packageName, message) {
  const payload = {
    stack,
    level,
    package: packageName,
    message,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch("https://test-server.example.com/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Optional local confirmation
    console.log("Log sent:", payload);
  } catch (error) {
    console.error("Failed to send log:", error);
  }
}