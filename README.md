# AutoForward

A Vencord plugin that automatically sends all your messages to another channel before forwarding them back, making every message appear as a forwarded message.

Useful to hide deleted messages from bot message loggers, as deleted forwarded messages does not appear in bot message logger bots (Tested with Dyno).

> [!WARNING]
> This plugin violates Discord's Terms of Service. Using client modifications and automating message actions can result in account termination. Use at your own risk.
## How It Works

1. When you send a message, the plugin intercepts it before it reaches the original channel.
2. The message is sent to your configured predefined channel.
3. After the message loads into your predefined channel, the message is forwarded from said channel to the intended destination.
4. The result: your message appears as a forwarded message in the target channel.

## Installation

1. Install [Node.js](https://nodejs.org/en), [git](https://git-scm.com/install/), and [pnpm](https://pnpm.io/installation) if missing.

2. Clone Vencord's Github repository:
```sh
git clone https://github.com/Vendicated/Vencord
cd Vencord
pnpm install --frozen-lockfile
```

3. Create a folder called `autoForward` in `[Where-You-Cloned-Your-Vencord-Repository]/Vencord/src/plugins`.


4. Download `index.tsx` from the latest [release](https://github.com/aurickk/AutoForward-Vencord/releases) and move it into the newly created `autoForward` folder.

5. Run:
```sh
pnpm build
pnpm inject
```
6. If built and injected successfully, follow the remaining prompt(s) and restart Discord to apply changes.
7. In Discord's Vencord plugins menu, enable the AutoForward Plugin.


## Setup

1. Create a channel (or use an existing one) where messages will be temporarily sent
2. Get the channel ID:
   - Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
   - Right-click on your channel
   - Click "Copy Channel ID"
3. Go to Vencord Settings → Plugins → AutoForward
4. Paste the channel ID into the "Channel ID to send messages through before forwarding" field

## Usage

Make sure you have the AutoForward plugin enabled and set up correctly.

1. Click the forward arrow button next to the chat input to toggle the plugin on/off.

<img width="590" height="103" alt="image" src="https://github.com/user-attachments/assets/905c8062-6fd4-4ebe-845f-4dfd2ccf91be" />

2. Type and send you message.

<img width="588" height="164" alt="image" src="https://github.com/user-attachments/assets/8fc93381-62d5-4480-81d8-98338dfc48b0" />

## Settings

### Middleman Channel ID
The channel where messages are temporarily sent before forwarding.
### Enable Console Logs
Toggle debug logging to console for troubleshooting.

## Supported Message Types

- ✅ Text messages
- ✅ Stickers
- ✅ File attachments
- ✅ GIFs

## Notes

- Messages sent in the private channel itself are not forwarded (to prevent infinite loops).
- If you send messages too fast before your previous autoforward message is processed, they will won't get autoforwarded.
