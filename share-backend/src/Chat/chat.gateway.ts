import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatMessage } from './dto/chat.model';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer() wss: Server;

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected client id : ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`connected client id : ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }
  @SubscribeMessage('toServer')
  async handleMessage(client: Socket, payload: ChatMessage): Promise<void> {
    try {
      // await this.chatService.saveChat({ chatUid: null, payload });
      this.wss.emit('toClient', payload);
    } catch (error) {
      this.wss.emit('onError', error.message);
    }
  }
}
