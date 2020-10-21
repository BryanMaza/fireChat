import { Component } from '@angular/core';
 
 
import { ChatService } from './providers/chat.service';
ChatService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   
  constructor(public _chatService: ChatService) {
  }
}
