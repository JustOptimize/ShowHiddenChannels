const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const webpack = require("webpack");

function evaluate(url, expression) {
	return new Promise((resolve, reject) => {
		const socket = new WebSocket(url);
		const timer = setTimeout(
			() => finish(new Error("Discord probe timed out")),
			15000,
		);
		function finish(error, value) {
			clearTimeout(timer);
			socket.close();
			if (error) reject(error);
			else resolve(value);
		}
		socket.addEventListener("error", () =>
			finish(new Error("Discord debugger connection failed")),
		);
		socket.addEventListener("open", () => {
			socket.send(
				JSON.stringify({
					id: 1,
					method: "Runtime.evaluate",
					params: { expression, returnByValue: true, awaitPromise: true },
				}),
			);
		});
		socket.addEventListener("message", ({ data }) => {
			const response = JSON.parse(data);
			if (response.id !== 1) return;
			if (response.error) return finish(new Error(response.error.message));
			if (response.result.exceptionDetails) {
				const exception = response.result.exceptionDetails;
				return finish(
					new Error(exception.exception?.description ?? exception.text),
				);
			}
			finish(null, response.result.result.value);
		});
	});
}

test("plugin module contracts hold in actual Discord Stable modules", async () => {
	const port = Number(process.env.DISCORD_DEBUG_PORT || 9222);
	assert.ok(
		Number.isInteger(port) && port > 0 && port <= 65535,
		"Invalid DISCORD_DEBUG_PORT",
	);
	let targets;
	try {
		const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
			signal: AbortSignal.timeout(5000),
		});
		assert.ok(response.ok, `Discord debugger returned HTTP ${response.status}`);
		targets = await response.json();
	} catch (error) {
		throw new Error(
			`Start Discord Stable with --remote-debugging-port=${port} and BetterDiscord loaded, then rerun this test.`,
			{ cause: error },
		);
	}
	const target = targets.find(
		(entry) =>
			entry.type === "page" && /^https:\/\/discord\.com\//.test(entry.url),
	);
	assert.ok(
		target?.webSocketDebuggerUrl,
		"No Discord renderer found on the debugger port",
	);
	const temporary = await fs.mkdtemp(
		path.join(os.tmpdir(), "shc-discord-test-"),
	);
	try {
		await new Promise((resolve, reject) => {
			const compiler = webpack({
				mode: "development",
				target: "node",
				devtool: false,
				entry: path.join(__dirname, "discord-probe.js"),
				output: {
					path: temporary,
					filename: "probe.cjs",
					library: { type: "commonjs2" },
				},
			});
			compiler.run((error, stats) => {
				compiler.close((closeError) => {
					if (error || closeError) return reject(error || closeError);
					if (stats.hasErrors()) return reject(new Error(stats.toString()));
					resolve();
				});
			});
		});
		const source = await fs.readFile(path.join(temporary, "probe.cjs"), "utf8");
		const expression = `(() => {
			const module = { exports: {} };
			new Function("require", "module", "exports", ${JSON.stringify(source)})(window.require, module, module.exports);
			return module.exports();
		})()`;
		const result = await evaluate(target.webSocketDebuggerUrl, expression);
		console.log(`Discord environment: ${JSON.stringify(result.versions)}`);
		assert.equal(result.versions.channel, "stable");
		assert.ok(result.checks.length > 0, "The probe returned no checks");
		const failed = result.checks.filter((check) => !check.passed);
		assert.deepEqual(
			failed,
			[],
			`Failed contracts: ${failed.map((check) => `${check.name}: expected ${check.expected}, got ${check.actual}`).join("; ")}`,
		);
		assert.equal(result.loaded, true, "The plugin's module validation failed");
		console.log(
			`Passed ${result.checks.length} module contract and behavior checks.`,
		);
	} finally {
		await fs.rm(temporary, { recursive: true, force: true });
	}
});
