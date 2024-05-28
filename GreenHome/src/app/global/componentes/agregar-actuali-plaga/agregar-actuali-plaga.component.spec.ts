import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarActualiPlagaComponent } from './agregar-actuali-plaga.component';

describe('AgregarActualiPlagaComponent', () => {
  let component: AgregarActualiPlagaComponent;
  let fixture: ComponentFixture<AgregarActualiPlagaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarActualiPlagaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarActualiPlagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
