import { Routes } from '@angular/router';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { UploadingComponent } from './components/uploading/uploading.component';
import { ShowAndEditComponent } from './components/show-and-edit/show-and-edit.component';

export const routes: Routes = [
{ path: '', component:MediaViewerComponent},
{path:"upload", component: UploadingComponent},
{path:"edit", component: ShowAndEditComponent},
{path:"**", redirectTo:"/"},
];
