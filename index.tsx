import { addChatBarButton, ChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";
import { React, RestAPI, Tooltip } from "@webpack/common";

const settings = definePluginSettings({
    middlemanChannelID: {
        type: OptionType.STRING,
        description: "Channel ID to send messages through before forwarding",
        placeholder: "Enter channel ID",
        default: ""
    },
    enableLogs: {
        type: OptionType.BOOLEAN,
        description: "Enable console logs for debugging",
        default: false
    },
    enabled: {
        type: OptionType.BOOLEAN,
        description: "Enable auto-forwarding",
        default: true,
        hidden: true
    }
});

function log(...args: any[]) {
    if (settings.store.enableLogs) {
        console.log("[AutoForward]", ...args);
    }
}

let isRedirecting = false;
let OriginalSendMessage: any;

const ToggleButton: ChatBarButton = () => {
    const [enabled, setEnabled] = React.useState(settings.store.enabled);

    return (
        <Tooltip text={enabled ? "AutoForward: Enabled" : "AutoForward: Disabled"}>
            {(tooltipProps: any) => (
                <div
                    {...tooltipProps}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "4px"
                    }}
                    onClick={() => {
                        const newState = !enabled;
                        settings.store.enabled = newState;
                        setEnabled(newState);
                        log("Toggled:", newState ? "ON" : "OFF");
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 512 512"
                        style={{
                            opacity: enabled ? 1 : 0.4,
                            transition: "opacity 0.2s"
                        }}
                    >
                        <path
                            fill={enabled ? "rgb(205, 199, 212)" : "currentColor"}
                            d="M0 0 C3.75585079 1.89418449 6.33947964 4.52552697 8.20703125 8.29296875 C9.98465305 13.82568513 9.70269525 18.57645997 7.23828125 23.80078125 C4.89295486 27.6524047 1.91261505 30.28775818 -1.5703125 33.09765625 C-2.18430908 33.6078833 -2.79830566 34.11811035 -3.4309082 34.64379883 C-4.70255097 35.70032325 -5.977556 36.75281368 -7.25585938 37.80126953 C-9.59263045 39.7264917 -11.89650636 41.68842633 -14.19970703 43.65356445 C-19.47398414 48.14996912 -24.81182652 52.56434114 -30.18823242 56.93823242 C-33.29805 59.48286302 -36.38807143 62.04991302 -39.47265625 64.625 C-40.02046753 65.08193237 -40.56827881 65.53886475 -41.13269043 66.00964355 C-42.46627832 67.12205811 -43.7995761 68.23482045 -45.1328125 69.34765625 C-44.15687118 69.35123878 -44.15687118 69.35123878 -43.16121387 69.35489368 C-27.23109185 69.41437812 -11.30113922 69.49013661 4.62881756 69.58337116 C12.33285327 69.62808046 20.0368453 69.66755015 27.7409668 69.6940918 C34.46641072 69.71727573 41.19171347 69.75089451 47.91704494 69.79635781 C51.46851232 69.82001951 55.01984231 69.83892312 58.57138634 69.84527016 C78.21921414 69.88493817 97.81723701 70.28970537 116.7421875 76.16015625 C117.60674561 76.41877441 118.47130371 76.67739258 119.36206055 76.94384766 C146.87033005 85.36282123 171.02091276 99.56463818 191.8671875 119.34765625 C192.3401123 119.79334961 192.81303711 120.23904297 193.30029297 120.69824219 C220.40315731 146.39877804 236.47472423 180.04210833 243.8671875 216.34765625 C244.1146875 217.55679688 244.3621875 218.7659375 244.6171875 220.01171875 C245.85883558 227.23742079 246.11898969 234.4684085 246.2421875 241.78515625 C246.26837158 242.72157959 246.29455566 243.65800293 246.3215332 244.62280273 C246.33640278 250.76063204 245.44578334 254.32713535 241.8671875 259.34765625 C238.08633741 263.03398509 234.98589881 263.65127005 229.8671875 263.84765625 C224.74997756 263.65766083 221.68648922 262.97599288 217.8671875 259.34765625 C214.14255143 254.4150301 212.81400098 250.95335742 212.62841797 244.80322266 C211.38325491 206.50002799 196.26648453 172.77656705 169.8671875 145.34765625 C169.29871094 144.71601563 168.73023438 144.084375 168.14453125 143.43359375 C151.14123835 125.08221369 124.95180146 112.8698884 100.8671875 107.34765625 C99.82888794 107.09773422 98.79058838 106.84781219 97.7208252 106.59031677 C83.98002262 103.71396922 70.27943535 103.95552349 56.29656672 104.04347444 C52.75457843 104.06248179 49.21257891 104.06401031 45.67054749 104.06755066 C38.99159 104.0768016 32.31278331 104.10131904 25.63389164 104.13159913 C18.0181861 104.16536233 10.40247261 104.18168371 2.78671062 104.19668543 C-12.85321715 104.22787657 -28.49299523 104.28049859 -44.1328125 104.34765625 C-42.52691287 105.7977237 -40.92033838 107.24704378 -39.31347656 108.69604492 C-37.97159271 109.90679939 -37.97159271 109.90679939 -36.6026001 111.14201355 C-34.08486084 113.39047946 -31.51904553 115.55204275 -28.8828125 117.66015625 C-23.95505089 121.6483023 -19.13872119 125.75007886 -14.34277344 129.89453125 C-10.66490717 133.063778 -6.92837523 136.13298869 -3.1328125 139.16015625 C1.51598326 142.93130326 6.14580902 146.9048993 8.8671875 152.34765625 C9.42431882 158.3046757 9.38898936 163.29974024 5.8671875 168.34765625 C2.99149001 171.31196066 0.11101112 173.9618541 -4.1328125 174.34765625 C-5.2053125 174.45078125 -6.2778125 174.55390625 -7.3828125 174.66015625 C-15.65244186 173.97102047 -20.62292424 169.26509748 -26.51171875 163.76171875 C-29.06324667 161.41172731 -31.68466156 159.21427963 -34.3828125 157.03515625 C-38.69732135 153.54332917 -42.92990761 149.97189206 -47.1328125 146.34765625 C-51.25736861 142.79298411 -55.40489562 139.27972995 -59.6328125 135.84765625 C-65.03357422 131.46052723 -70.3074895 126.93542213 -75.58203125 122.3984375 C-78.98381349 119.47266305 -82.39727006 116.56102234 -85.8203125 113.66015625 C-86.61659058 112.98436523 -86.61659058 112.98436523 -87.42895508 112.29492188 C-90.01185083 110.11064813 -92.61056304 107.95165022 -95.25 105.8359375 C-96.22195312 105.05605469 -97.19390625 104.27617187 -98.1953125 103.47265625 C-99.05253906 102.79460937 -99.90976563 102.1165625 -100.79296875 101.41796875 C-104.3577652 98.26380829 -107.87574305 94.88885101 -108.37109375 89.9921875 C-108.39558594 89.05761719 -108.42007813 88.12304688 -108.4453125 87.16015625 C-108.48269531 86.23847656 -108.52007812 85.31679687 -108.55859375 84.3671875 C-107.58424414 77.45735038 -103.47073442 73.26313066 -98.1953125 69.09765625 C-97.032281 68.14746712 -95.86952855 67.19693637 -94.70703125 66.24609375 C-94.1145459 65.7675293 -93.52206055 65.28896484 -92.91162109 64.79589844 C-90.07160779 62.48366142 -87.293591 60.09967019 -84.5078125 57.72265625 C-80.60319077 54.41011927 -76.66937217 51.13944339 -72.6953125 47.91015625 C-67.27710671 43.4985257 -61.980104 38.95441983 -56.68359375 34.3984375 C-48.50975401 27.36835451 -40.27468736 20.4189153 -31.90625 13.62109375 C-29.8971137 11.97416794 -27.90397443 10.31552024 -25.921875 8.63671875 C-25.11472046 7.9552478 -25.11472046 7.9552478 -24.29125977 7.26000977 C-22.77896804 5.98091218 -21.27023678 4.69760847 -19.76171875 3.4140625 C-13.807978 -1.26577235 -7.36343905 -2.2521874 0 0 Z"
                            transform="translate(187.1328125,124.65234375)"
                        />
                    </svg>
                </div>
            )}
        </Tooltip>
    );
};

export default definePlugin({
    name: "AutoForward",
    description: "Automatically sends messages through a private channel and forwards them back, making all messages appear as forwarded",
    authors: [{ name: "Aurick", id: 1348025017233047634n }],
    settings,

    start() {
        // Add toggle button to chat bar
        addChatBarButton("AutoForwardToggle", ToggleButton);
        
        // Find the MessageActions module
        const MessageActions = findByProps("sendMessage");
        
        if (MessageActions && MessageActions.sendMessage) {
            log("Found sendMessage, wrapping it");
            
            // Store the original function
            OriginalSendMessage = MessageActions.sendMessage;
            
            // Replace with our wrapper
            MessageActions.sendMessage = (channelId: string, message: any, ...args: any[]) => {
                log("sendMessage called for channel:", channelId);
                log("Message:", message);
                log("Args:", args);
                log("args[0]:", args[0]);
                log("args[1]:", args[1]);
                if (args[1]) {
                    log("args[1].attachmentsToUpload:", args[1].attachmentsToUpload);
                }
                
                // Prevent infinite loops
                if (isRedirecting) {
                    log("Allowing through (redirecting mode)");
                    return OriginalSendMessage(channelId, message, ...args);
                }

                const privateChannelId = settings.store.middlemanChannelId;
                
                // Skip if no private channel is set or plugin is disabled
                if (!privateChannelId || !settings.store.enabled) {
                    return OriginalSendMessage(channelId, message, ...args);
                }
                
                // Skip if this is the private channel
                if (channelId === privateChannelId) {
                    log("Already in private channel");
                    return OriginalSendMessage(channelId, message, ...args);
                }
                
                // Check if message has content, stickers, or attachments
                const hasContent = message.content && message.content.trim();
                const hasStickers = message.stickerIds && message.stickerIds.length > 0;
                
                // Check args[1] for stickers (alternative location)
                const hasStickerInArgs = args[1] && args[1].stickerIds && args[1].stickerIds.length > 0;
                
                // Check args[0] for attachments in various possible locations
                const hasAttachmentsArgs0 = args[0] && (
                    (args[0].uploads && args[0].uploads.length > 0) ||
                    (args[0].attachments && args[0].attachments.length > 0)
                );
                
                // Check args[1] for attachments
                const hasAttachmentsArgs1 = args[1] && args[1].attachmentsToUpload && args[1].attachmentsToUpload.length > 0;
                
                const hasAttachments = hasAttachmentsArgs0 || hasAttachmentsArgs1;
                
                log("Detection - Content:", hasContent, "Stickers:", hasStickers || hasStickerInArgs, "Attachments:", hasAttachments);
                
                // Skip if no content, stickers, or attachments
                if (!hasContent && !hasStickers && !hasAttachments && !hasStickerInArgs) {
                    return OriginalSendMessage(channelId, message, ...args);
                }

                log("Intercepting message!");
                
                // For stickers and attachments, send to private channel first, then forward
                if (hasStickers || hasAttachments || hasStickerInArgs) {
                    log("Has stickers or attachments - using sendAndForward method");
                    this.sendAndForward(channelId, message, args);
                } else {
                    // Text only - use REST API
                    this.redirectAndForward(channelId, message, args[0]);
                }
                
                // Don't call the original function - message is blocked
                return Promise.resolve();
            };
        } else {
            console.error("[AutoForward] Could not find sendMessage!");
        }
    },

    stop() {
        // Remove the chat bar button
        removeChatBarButton("AutoForwardToggle");
        
        // Restore the original function
        if (OriginalSendMessage) {
            const MessageActions = findByProps("sendMessage");
            if (MessageActions) {
                MessageActions.sendMessage = OriginalSendMessage;
            }
        }
    },

    async redirectAndForward(originalChannelId: string, message: any, extra: any) {
        const privateChannelId = settings.store.middlemanChannelId;
        isRedirecting = true;

        try {
            // Step 1: Send to private channel
            log("Step 1: Sending to private channel:", privateChannelId);
            
            const body: any = {};
            
            if (message.content) {
                body.content = message.content;
            }
            
            const response = await RestAPI.post({
                url: `/channels/${privateChannelId}/messages`,
                body: body
            });
            
            log("Message sent to private channel, ID:", response.body.id);
            
            // Step 2: Forward to original channel
            log("Step 2: Forwarding to original channel:", originalChannelId);
            
            const forwardedMessage = await RestAPI.post({
                url: `/channels/${originalChannelId}/messages`,
                body: {
                    message_reference: {
                        type: 1,
                        channel_id: privateChannelId,
                        message_id: response.body.id
                    }
                }
            });
            
            log("Message forwarded successfully, ID:", forwardedMessage.body.id);
        } catch (error) {
            console.error("[AutoForward] Error during redirect/forward:", error);
            console.error("[AutoForward] Error details:", error.body || error);
        } finally {
            isRedirecting = false;
        }
    },

    async sendAndForward(originalChannelId: string, message: any, args: any[]) {
        const privateChannelId = settings.store.middlemanChannelId;
        isRedirecting = true;

        try {
            log("sendAndForward: Sending stickers/attachments to private channel");
            log("Calling OriginalSendMessage with args:", args);
            
            // Use original sendMessage to send to private channel with all args
            await OriginalSendMessage(privateChannelId, message, ...args);
            
            // Wait longer for uploads to complete
            log("Waiting for upload to complete...");
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Fetch the last message from private channel
            log("Fetching last message from private channel...");
            const channelMessages = await RestAPI.get({
                url: `/channels/${privateChannelId}/messages?limit=1`
            });
            
            if (!channelMessages.body || channelMessages.body.length === 0) {
                throw new Error("Could not find sent message in private channel");
            }
            
            const privateMessageId = channelMessages.body[0].id;
            log("Found private message ID:", privateMessageId);
            
            // Forward to original channel
            log("Forwarding to original channel:", originalChannelId);
            
            const forwardedMessage = await RestAPI.post({
                url: `/channels/${originalChannelId}/messages`,
                body: {
                    message_reference: {
                        type: 1,
                        channel_id: privateChannelId,
                        message_id: privateMessageId
                    }
                }
            });
            
            log("Message forwarded successfully, ID:", forwardedMessage.body.id);
        } catch (error) {
            console.error("[AutoForward] Error during sendAndForward:", error);
            console.error("[AutoForward] Error details:", error.body || error);
        } finally {
            isRedirecting = false;
        }
    }
});
