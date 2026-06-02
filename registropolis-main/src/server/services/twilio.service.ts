
import { Twilio } from 'twilio';
import config from '../config';

class TwilioService {
  private client: Twilio;
  private initialized: boolean = false;

  constructor() {
    if (!config.twilioAccountSid || !config.twilioAuthToken) {
      if (!config.isDevelopment) {
        throw new Error('Twilio credentials not configured');
      }
      this.initialized = false;
      return;
    }

    this.client = new Twilio(
      config.twilioAccountSid,
      config.twilioAuthToken
    );
    this.initialized = true;
  }

  private validateInitialization() {
    if (!this.initialized) {
      throw new Error('Twilio service not properly initialized');
    }
  }

  async sendWhatsAppMessage(to: string, variables: Record<string, string>) {
    this.validateInitialization();

    if (!to || !variables) {
      throw new Error('Invalid parameters for WhatsApp message');
    }

    try {
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      const message = await this.client.messages.create({
        from: config.twilioPhoneNumber,
        to: formattedTo,
        contentSid: config.twilioContentSid,
        contentVariables: JSON.stringify(variables)
      });

      console.log('WhatsApp message sent:', message.sid);
      return message;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw new Error('Failed to send WhatsApp message: ' + (error.message || 'Unknown error'));
    }
  }

  async sendSMS(to: string, body: string) {
    this.validateInitialization();

    if (!to || !body) {
      throw new Error('Invalid parameters for SMS');
    }

    try {
      const message = await this.client.messages.create({
        from: config.twilioPhoneNumber,
        to,
        body
      });

      console.log('SMS sent:', message.sid);
      return message;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS: ' + (error.message || 'Unknown error'));
    }
  }
}

export const twilioService = new TwilioService();

