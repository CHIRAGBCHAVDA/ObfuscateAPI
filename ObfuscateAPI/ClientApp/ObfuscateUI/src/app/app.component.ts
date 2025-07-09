import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from './models/users';
import { DecryptorComponent } from './decryptor/decryptor.component';
import { InjectionToken } from '@angular/core';
import { SecureApiClientService } from 'secure-api-client';
import { HttpClient } from '@angular/common/http';
import { KEY_PASSPHRASE } from './consts/keyphrase.const';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecryptorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ObfuscateUI';
  users:Users[] = [];
  usersForm: FormGroup;
  isSubmitted: boolean = false;
  isShowDecryptor: boolean = false;
  constructor(private userService: UserService, private fb: FormBuilder, 
    private secureApiClientService: SecureApiClientService, private http: HttpClient){
    this.usersForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      age: new FormControl('')
    });
  }
  get f() { return this.usersForm.controls; }

  getUsersData(){
    this.userService.getUsers().subscribe((res:any)=>{
      this.users = res;
      console.log(res);
    })
  }

  postUserData(){
    this.isSubmitted = true;
    if(this.usersForm.invalid){
      return;
    }
    const usersData: Users = {
      name : this.usersForm.controls['name'].value,
      email: this.usersForm.controls['email'].value,
      age: this.usersForm.controls['age'].value
    };
    this.userService.postUser(usersData).subscribe((res: Users) => {
      if(res && res.id){
        this.users.push(res);
        this.usersForm.reset();
        alert("User added successfully");
      }
      else{
        alert("something went wrong!!");
      }
    });
  }

  getUserThroughNPM(){
    const iv = this.secureApiClientService.generateIv();
    const ivUrlEncodedBase64 = this.secureApiClientService.getIvUrlEncoded(iv);

    const actualApiPath = 'User/GetUsers';
    const encryptedPath = this.secureApiClientService.encryptApiPath(actualApiPath, iv);

    const requestUrl = `https://obfuscateapi.onrender.com/api/x/${encryptedPath}?iv=${ivUrlEncodedBase64}`;

    this.http.get<Users[]>(requestUrl).subscribe((res: Users[]) => {
      this.users = res;
      console.log(res);
    })
  }

  postUserThroughNPM(){
    const iv = this.secureApiClientService.generateIv();
    const ivUrlEncodedBase64 = this.secureApiClientService.getIvUrlEncoded(iv);

    const actualApiPath = 'User/PostUser';
    const encryptedPath = this.secureApiClientService.encryptApiPath(actualApiPath, iv);

    const requestUrl = `https://obfuscateapi.onrender.com/api/x/${encryptedPath}?iv=${ivUrlEncodedBase64}`;

    const usersData: Users = {
      name : this.usersForm.controls['name'].value,
      email: this.usersForm.controls['email'].value,
      age: this.usersForm.controls['age'].value
    };
    const temp = this.secureApiClientService.encryptPayload(JSON.stringify(usersData), iv);

    this.http.post<Users>(requestUrl, temp, {
      headers:{
        "content-type":"application/json"
      }
    }).subscribe((res)=>{
      console.log(res);
    })
  }

 
  setFormValue(id?:string){
    const user = this.users.find(x => x.id === id);
    this.usersForm.controls["name"].patchValue(user?.name);
    this.usersForm.controls["email"].patchValue(user?.email);
    this.usersForm.controls["age"].patchValue(user?.age);
  }
  toggleIsShowDecryptor(){
    this.isShowDecryptor = !this.isShowDecryptor;
  }
}
