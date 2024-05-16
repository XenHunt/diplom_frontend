import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { environmet } from '../../helpers/environmet';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { single } from 'rxjs';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-uploading',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, NgIf, ReactiveFormsModule, MatCard, MatCardContent],
  templateUrl: './uploading.component.html',
  styleUrl: './uploading.component.css'
})
export class UploadingComponent {
  selectedFile: File|null = null;
  badFormat = signal(false)
  response = signal("")
  formGroup:FormGroup
  constructor(private mediaService:MediaService, private router:Router, private formBuilder: FormBuilder){
    this.formGroup = this.formBuilder.group({      name: ['',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ]
      ]
    });
  }

  private checkFileFormat(filename: string) {
    return  filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.jpeg') || filename.endsWith('.mp4') || filename.endsWith('.avi')
  }
  onFileSelected(event: Event) {
    console.log("File selected")
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.checkFileFormat(file.name)) {
      this.selectedFile = file;
      this.badFormat.set(false)
    } else {
      this.selectedFile = null;
      this.badFormat.set(true)
    }
  }
  
  onSubmit() {
    if (this.selectedFile && this.formGroup.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('name', this.formGroup.get('name')?.value);
      this.mediaService.uploadMedia(this.selectedFile, this.formGroup.get('name')?.value).subscribe({
        next: (res) => {
          this.response.set(res.message)
          console.log(res)
        },
        error: (err) => {
          this.response.set(err.message)
          console.log(err)
        }
      })
      //this.router.navigate(['/']);
    }
}
}
