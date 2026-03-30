# Pi Extension: Kimi Provider

This extension adds Kimi Code models to the [pi coding agent](https://github.com/badlogic/pi-mono).

## Features

- Integrates Kimi Code via the documented Coding endpoint
- Uses the `anthropic-messages` transport supported by pi
- Configured for `https://api.kimi.com/coding`
- Supports interactive `/login` auth and environment-variable auth

## Prerequisites

1. Obtain an API key from [Kimi Code](https://www.kimi.com/code?source=docs).
2. Set the API key in your environment:
   ```bash
   export KIMI_API_KEY=sk-kimi-...
   ```

## Installation

### Method 1: Direct from GitHub

You can install this extension directly into your `pi` configuration using the `pi install` command:

```bash
pi install git:github.com/dpolishuk/pi-extension-kimi-provider
```

### Method 2: Manual Installation

If you prefer to install it manually:

1. Clone this repository into your pi extensions directory:
   ```bash
   git clone https://github.com/dpolishuk/pi-extension-kimi-provider ~/.pi/agent/extensions/kimi-provider
   ```
2. Reload pi if it's currently running using the `/reload` command.

## Usage

Once installed, you can list the available models:

```bash
pi --list-models | grep kimi
```

To use a specific Kimi model:

```bash
pi --model kimi-coding/kimi-for-coding
```

In interactive mode, you can switch models with `/model` or `Ctrl+L`.

## Login + auth

You can authenticate this provider via interactive login:

1. In `pi` interactive mode, run `/login`.
2. Select **Kimi Code (API Key)** from the provider list.
3. Paste your API key when prompted.

The stored key is written to `~/.pi/agent/auth.json`.

If you prefer env var auth, set `KIMI_API_KEY` before launching `pi`.

## Configuration

The extension is defined in `extensions/kimi-provider.ts`. You can modify the cost, context window, or add new models there.

| Model | ID | Context Window | Reasoning |
|-------|----|----------------|-----------|
| Kimi for Coding | `kimi-for-coding` | 262144 | Yes |
| Kimi K2.5 | `k2p5` | 262144 | Yes |
| Kimi K2 Thinking | `kimi-k2-thinking` | 262144 | Yes |

These are the models currently registered in this plugin. You can add or remove entries in `extensions/kimi-provider.ts`.

## License

MIT
