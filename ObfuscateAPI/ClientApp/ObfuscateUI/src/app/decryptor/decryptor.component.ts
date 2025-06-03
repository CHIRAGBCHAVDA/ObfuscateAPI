import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SecureApiClientService } from 'secure-api-client';

@Component({
  selector: 'app-decryptor',
  imports: [CommonModule, FormsModule],
  templateUrl: './decryptor.component.html',
  styleUrl: './decryptor.component.css'
})
export class DecryptorComponent {
  url!:string;
  iv!:string;
  payload!:string;
  path!:string;
  data!: string;
  constructor(private secureApiClientService: SecureApiClientService){}

  decryptAll(){
    this.path = this.secureApiClientService.decryptApiPath(this.url, this.iv);
    console.log(this.path);

    this.data = this.secureApiClientService.decryptPayload(this.payload, this.iv);
    console.log(this.data);
  }
}
