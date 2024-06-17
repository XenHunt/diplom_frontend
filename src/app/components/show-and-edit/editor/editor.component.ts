import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MediaType, SearchElement } from '../../../helpers/share';
import { MediaService } from '../../../services/media.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    MatSliderModule,
    MatLabel,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
  //TODO Сделать по-умному обращение за превьюшками и т.д, чтобы система ждала либо не создавала стек вызовов, ddos атаку

  car_id: number = -1;
  frame_number: number = 0;
  car_editing = false;
  graymode = false;
  thresholdmode = false;
  thresholdvalue = 140;
  car_ids: WritableSignal<number[]> = signal([]);
  frames_max: WritableSignal<number> = signal(0);
  previewUrl: string = '';
  carUrl: string = '';
  // settings!: EditConfigs
  // plate_number:string = ""
  type!: MediaType;
  formGroup: FormGroup;

  searchResults: Array<SearchElement> = [];
  search_words: Array<string> = [
    'ABEKMHOPCTYX',
    '0123456789',
    '0123456789',
    '0123456789',
    'ABEKMHOPCTYX',
    'ABEKMHOPCTYX',
    '0123456789',
    '0123456789',
    '0123456789',
  ];

  selected_search_pattern: string = '';

  showedColumns = ['plate_number', 'frame_number', 'car_id'];

  constructor(
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
  ) {
    this.formGroup = this.formBuilder.group({
      plate_number: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(9),
          Validators.pattern(
            '^[ABEKMHOPCTYX][0-9][0-9][0-9][ABEKMHOPCTYX][ABEKMHOPCTYX][0-9][0-9][0-9]?$',
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.mediaService.selectedMedia.subscribe({
      next: (media) => {
        if (media != null) this.type = media.type;
      },
    });
    this.updateIds();
    this.updateFrames();
    this.updatePreview();
  }
  updateIds() {
    this.car_id = -1;
    this.mediaService.getEditIds(this.frame_number)?.subscribe({
      next: (ids) => {
        console.log('Ids');
        console.log(ids);
        this.car_ids.set(ids);
      },
    });
  }

  updateFrames() {
    this.mediaService.getEditFrames()?.subscribe({
      next: (res) => {
        this.frames_max.set(res.max);
      },
    });
  }
  updatePreview() {
    this.previewUrl = this.mediaService.getEditPreview(this.frame_number) || '';
  }
  updateCar() {
    this.mediaService
      .getEditCar(this.frame_number, this.car_id, {
        grayMode: this.graymode,
        thresholdMode: this.thresholdmode,
        thresholdValue: this.thresholdvalue,
      })
      ?.subscribe({
        next: (url) => {
          // console.log(typeof url)
          // console.log(url)
          this.carUrl = url || '';
        },
      });
  }

  changeGrayMode($event: MatCheckboxChange) {
    this.graymode = $event.checked;
    this.updateCar();
  }
  changeThresholdMode($event: MatCheckboxChange) {
    this.thresholdmode = $event.checked;
    this.updateCar();
  }

  changeThresholdValue($event: Event) {
    // this.thresholdvalue.set((<HTMLInputElement>$event.target).valueAsNumber)
    this.updateCar();
  }
  changeFrameNumber() {
    // this.frame_number = (<HTMLInputElement>$event.target).valueAsNumber
    // this.updateCar()
    this.updateIds();
    this.updatePreview();
    // console.log("inside Change")
  }

  stopCarEditing() {
    this.car_editing = false;
  }
  startCarEditing() {
    // this.updateCar()
    if (this.car_id == -1) return;
    const obs = this.mediaService.getPlateNumber(this.car_id);
    if (obs)
      obs.subscribe((res) => {
        console.log(res);
        this.formGroup.get('plate_number')?.setValue(res.number);
      });

    this.thresholdmode = false;
    this.graymode = false;
    this.car_editing = true;
    this.updateCar();
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const obs = this.mediaService.updateMedia(
        this.car_id,
        this.formGroup.get('plate_number')?.value,
      );
      if (obs)
        obs.subscribe((res) => {
          console.log(res);
        });
    }
  }

  getIndexArray() {
    return this.search_words.map((_, index) => index);
  }

  search() {
    // Сложим все значения в selected_search_pattern
    let obs = this.mediaService.getSearchFrames(this.selected_search_pattern);
    if (typeof obs !== 'undefined')
      obs.subscribe({
        next: (res) => {
          this.searchResults = res;
          console.log(res);
        },
      });
  }
}
