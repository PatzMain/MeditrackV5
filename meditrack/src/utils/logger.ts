import { supabase } from './supabase';

interface LogData {
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class Logger {
  static async log(data: LogData): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const logEntry = {
        user_id: user?.id || null,
        action: data.action,
        entity_type: data.entity_type || null,
        entity_id: data.entity_id || null,
        details: data.details || null,
        ip_address: data.ip_address || null,
        user_agent: data.user_agent || navigator.userAgent,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('system_logs')
        .insert([logEntry]);

      if (error) {
        console.error('Failed to log action:', error);
      }
    } catch (error) {
      console.error('Logger error:', error);
    }
  }

  static async logLogin(userId: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      action: 'user_login',
      entity_type: 'user',
      entity_id: userId,
      details: {
        login_method: 'credentials',
        timestamp: new Date().toISOString(),
        ...details
      }
    });
  }

  static async logLogout(userId?: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      action: 'user_logout',
      entity_type: 'user',
      entity_id: userId || null,
      details: {
        logout_method: 'manual',
        timestamp: new Date().toISOString(),
        ...details
      }
    });
  }

  static async logFailedLogin(username: string, reason: string): Promise<void> {
    await this.log({
      action: 'failed_login_attempt',
      entity_type: 'user',
      details: {
        username,
        failure_reason: reason,
        timestamp: new Date().toISOString()
      }
    });
  }
}