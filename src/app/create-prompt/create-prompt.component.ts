import { Component, OnInit, output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-prompt',
  templateUrl: './create-prompt.component.html',
  styleUrls: ['./create-prompt.component.scss'],
  imports: [IonButton, ReactiveFormsModule]
})
export class CreatePromptComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  userInputForm = new FormGroup({
    horizontal: new FormControl<number | null>(null),
    vertical: new FormControl<number | null>(null)
  });

  sendDimension = output<{ horizontal: number; vertical: number }>();

  submitForm() {
    const horizontal = this.userInputForm.get('horizontal')?.value ?? 4;
    const vertical = this.userInputForm.get('vertical')?.value  ?? 4;

    if ((horizontal + vertical) < 2 || (horizontal * vertical) % 2 !== 0) {
      this.userInputForm.reset();
      return;
    }

    this.sendDimension.emit({ horizontal, vertical });
  }

}
