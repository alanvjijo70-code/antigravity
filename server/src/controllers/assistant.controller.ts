import { Request, Response, NextFunction } from 'express';
import { ChatMessageRequestSchema } from '../validators/index.js';
import { ChatService } from '../services/chat.service.js';
import { createUserClient } from '../config/supabase.js';

export class AssistantController {
  public static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;
      const validated = ChatMessageRequestSchema.parse(req.body);

      const result = await ChatService.sendMessage({
        userId,
        userToken,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Chat response generated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Conversations retrieved',
        data: data || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getConversationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { data: messages, error } = await supabaseUser
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', id)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Conversation messages retrieved',
        data: messages || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { error } = await supabaseUser
        .from('chat_conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Conversation deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
