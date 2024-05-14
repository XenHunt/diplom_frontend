import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { environmet } from '../../helpers/environmet';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-uploading',
  standalone: true,
  imports: [MatFormField, MatLabel, MatError, NgIf, ReactiveFormsModule, MatCard, MatCardContent],
  templateUrl: './uploading.component.html',
  styleUrl: './uploading.component.css'
})
export class UploadingComponent {
  selectedFile: File|null = null;

  formGroup = new FormGroup({
    file: new FormControl('', [
      Validators.required,
      Validators.pattern(/.(jpg|jpeg|png|mp4|mkv|avi)$/)
    ]),
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]
    )
  });
  constructor(private http:HttpClient, private router:Router){}

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post(`${environmet.apiUrl}/upload`, formData).subscribe();
      this.router.navigate(['/']);
    }
}
}
