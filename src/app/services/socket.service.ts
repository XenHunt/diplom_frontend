import { Injectable } from '@angular/core';
import { Socket} from 'ngx-socket-io';
import { environmet } from '../helpers/environmet';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  videoSocket: Socket;
  constructor() {
    this.videoSocket = new Socket({
      url: `${environmet.originalUrl}`,
      options: {
        withCredentials: true
      }
    })
   }

  public connect() {
    this.videoSocket.connect()
  }

  public disconnect() {
    this.videoSocket.disconnect()
  }

  public start(id:number) {
    return  this.videoSocket.emit('video_stream_send', {"id":id})
 }

 public getChunk() {
  return  this.videoSocket.fromEvent<{data:string}>('video_chunk')
 }
}
