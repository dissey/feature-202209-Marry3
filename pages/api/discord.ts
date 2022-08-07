import { NextApiHandler } from "next";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import { verifyMarried } from "../../lib/verify";
import { HasGuildCommands, CHECK_COMMAND } from "../../lib/commands";

HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [CHECK_COMMAND]);

const handler: NextApiHandler = async (req, res) => {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "challenge" guild command
    if (name === "check" && id) {
      const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      const pairInfo = await verifyMarried(objectName);
      if (pairInfo) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: `${pairInfo[0].partner} are married to ${pairInfo[1].partner}`,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: `this address are not married`,
          },
        });
      }
    }
  }
};

export default handler;
