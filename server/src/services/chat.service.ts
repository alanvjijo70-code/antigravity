import { GeminiService } from './gemini.service.js';
import { buildChatPrompt, CHAT_ASSISTANT_JSON_SCHEMA } from '../prompts/chat.prompt.js';
import { ChatAssistantOutputSchema } from '../validators/index.js';
import { createUserClient } from '../config/supabase.js';

export interface ChatServiceParams {
  userId: string;
  userToken: string;
  conversation_id?: string | null;
  content: string;
  language: string;
  farm_context?: Record<string, any> | null;
}

export class ChatService {
  public static async sendMessage(params: ChatServiceParams) {
    const supabaseUser = createUserClient(params.userToken);
    let convId = params.conversation_id;

    // 1. Ensure conversation exists
    if (!convId) {
      try {
        const { data: newConv } = await supabaseUser
          .from('chat_conversations')
          .insert({
            user_id: params.userId,
            title: params.content.slice(0, 35) + '...',
            language: params.language,
          })
          .select()
          .single();

        if (newConv) {
          convId = newConv.id;
        }
      } catch (err: any) {
        console.warn('Conversation creation warning:', err.message);
      }
    }

    if (!convId) {
      convId = 'temp-conv-' + Date.now();
    }

    // 2. Fetch past conversation history
    let history: Array<{ role: string; content: string }> = [];
    try {
      const { data: pastMessages } = await supabaseUser
        .from('chat_messages')
        .select('role, content')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .limit(10);

      if (pastMessages && pastMessages.length > 0) {
        history = pastMessages;
      }
    } catch (err: any) {
      console.warn('Could not fetch past chat messages:', err.message);
    }

    // 3. Save User Message
    try {
      await supabaseUser.from('chat_messages').insert({
        conversation_id: convId,
        user_id: params.userId,
        role: 'user',
        content: params.content,
      });
    } catch (err: any) {
      console.warn('Could not save user message:', err.message);
    }

    // 4. Call Gemini with System Persona & Agricultural Guidance
    const prompt = buildChatPrompt({
      user_message: params.content,
      conversation_history: history,
      farm_context: params.farm_context,
      language: params.language,
    });

    const rawResult = await GeminiService.generateStructured<any>({
      prompt,
      jsonSchema: CHAT_ASSISTANT_JSON_SCHEMA,
    });

    const validated = ChatAssistantOutputSchema.parse(rawResult);

    // 5. Save Assistant Message
    try {
      await supabaseUser.from('chat_messages').insert({
        conversation_id: convId,
        user_id: params.userId,
        role: 'assistant',
        content: validated.answer,
        metadata: {
          important_points: validated.important_points,
          recommended_actions: validated.recommended_actions,
          warnings: validated.warnings,
          follow_up_question: validated.follow_up_question,
        },
      });
    } catch (err: any) {
      console.warn('Could not save assistant message:', err.message);
    }

    return {
      conversation_id: convId,
      role: 'assistant',
      content: validated.answer,
      important_points: validated.important_points,
      recommended_actions: validated.recommended_actions,
      warnings: validated.warnings,
      follow_up_question: validated.follow_up_question,
      created_at: new Date().toISOString(),
    };
  }
}
